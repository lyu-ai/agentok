import os
import re
from autogen import ConversableAgent
from openai import OpenAI
from typing import Dict, Literal, Union, Optional, List

from ..extended_agent import ExtendedConversableAgent
from ...services.supabase import create_supabase_client
from ...utils.img_utils import get_image_data, _to_pil
from termcolor import colored

from diskcache import Cache


def dalle_call(
    client: OpenAI,
    model: str,
    prompt: str,
    size: Literal["256x256", "512x512", "1024x1024", "1792x1024", "1024x1792"] | None,
    quality: Literal["standard", "hd"],
    n: int,
) -> Optional[bytes]:
    """
    Generate an image using OpenAI's DALL-E model and cache the result.

    This function takes a prompt and other parameters to generate an image using OpenAI's DALL-E model.
    It checks if the result is already cached; if so, it returns the cached image data. Otherwise,
    it calls the DALL-E API to generate the image, stores the result in the cache, and then returns it.

    Args:
        client (OpenAI): The OpenAI client instance for making API calls.
        model (str): The specific DALL-E model to use for image generation.
        prompt (str): The text prompt based on which the image is generated.
        size (str): The size specification of the image. TODO: This should allow specifying landscape, square, or portrait modes.
        quality (str): The quality setting for the image generation.
        n (int): The number of images to generate.

    Returns:
    str: The image data as a string, either retrieved from the cache or newly generated.

    Note:
    - The cache is stored in a directory named '.cache/'.
    - The function uses a tuple of (model, prompt, size, quality, n) as the key for caching.
    - The image data is obtained by making a secondary request to the URL provided by the DALL-E API response.
    """
    # Create a cache directory
    cache = Cache(".cache/")
    key = (model, prompt, size, quality, n)

    # Check if the result is in cache
    if key in cache:
        cached_data = cache[key]
        if isinstance(cached_data, bytes):
            return cached_data

    # If not in cache, compute and store the result
    response = client.images.generate(
        model=model,
        prompt=prompt,
        size=size,
        quality=quality,
        n=n,
    )

    # Assuming the response contains URLs to the generated images
    if len(response.data) == 0:
        return None
    image_url = response.data[0].url
    if image_url is None:
        return None

    # Fetch the image data from the URL
    img_data = get_image_data(image_url)

    # Store the result in the cache
    cache[key] = img_data

    return img_data


def extract_img(agent: ConversableAgent):
    """
    Extracts an image from the last message of an agent and converts it to a PIL image.

    This function searches the last message sent by the given agent for an image tag,
    extracts the image data, and then converts this data into a PIL (Python Imaging Library) image object.

    Parameters:
        agent (Agent): An instance of an agent from which the last message will be retrieved.

    Returns:
        PIL.Image: A PIL image object created from the extracted image data.

    Note:
    - The function assumes that the last message contains an <img> tag with image data.
    - The image data is extracted using a regular expression that searches for <img> tags.
    - It's important that the agent's last message contains properly formatted image data for successful extraction.
    - The `_to_pil` function is used to convert the extracted image data into a PIL image.
    - If no <img> tag is found, or if the image data is not correctly formatted, the function may raise an error.
    """
    # Function implementation...
    message = agent.last_message()
    if message is None:
        return None
    img_data = re.findall("<img (.*)>", message["content"])[0]
    pil_img = _to_pil(img_data)
    return pil_img


class DALLEAgent(ExtendedConversableAgent):
    metadata = {
        "name": "DALLEAgent",
        "description": "An agent that uses OpenAI's DALL-E model to generate images.",
        "type": "custom_conversable",
        "label": "dalle",
        "class_name": "DALLEAgent",  # Assumed the path is always "agentok_api.extensions.*"
    }

    def __init__(self, name, llm_config: dict, **kwargs):
        super().__init__(name, llm_config=llm_config, **kwargs)

        try:
            config_list = llm_config["config_list"]
            api_key = config_list[0]["api_key"]
        except Exception as e:
            print("Unable to fetch API Key, because", e)
            api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key)
        self.register_reply([ConversableAgent, None], DALLEAgent.generate_dalle_reply)

    def send(
        self,
        message: Union[Dict, str],
        recipient: ConversableAgent,
        request_reply: Optional[bool] = None,
        silent: Optional[bool] = False,
    ):
        super().send(message, recipient, request_reply, silent)

    def generate_dalle_reply(
        self, messages: Optional[List[Dict]], sender: "ConversableAgent", config
    ):
        """Generate a reply using OpenAI DALLE call."""
        client = self.client if config is None else config
        if client is None:
            return False, "Client configuration is missing"
        if messages is None:
            messages = self._oai_messages[sender]

        prompt = messages[-1]["content"]

        # Generate image using DALL-E
        img_data = dalle_call(
            client=client,
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",  # TODO: the size should be flexible, deciding landscape, square, or portrait mode.
            quality="standard",
            n=1,
        )

        if img_data is None:
            return False, "Failed to generate image with DALL-E"

        # Generate a unique filename for the image
        filename = f"{prompt.replace(' ', '_')}.png"

        # Upload the image data to Supabase or another storage service
        supabase = create_supabase_client()
        if supabase is None:
            return False, "Supabase client is not available"
        upload_response = supabase.upload_image(filename, img_data)

        if upload_response.status_code != 200:
            print(
                colored(
                    f"Failed to upload image to Supabase: {upload_response.reason_phrase}",
                    "red",
                )
            )
            return False, "Failed to upload image"

        upload_result = upload_response.json()

        # Generate the response message with the URL of the uploaded image
        out_message = f"![img]({upload_result['Location']})"
        return True, out_message
