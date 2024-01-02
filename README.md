> [!IMPORTANT]
>
> This project is still under heavy development and functions might not work well yet. Please don't hestitate to [Open an Issue](https://github.com/tiwater/flowgen/issues/new").

<img src="./ui/public/logo-full.png" width="320" />

# FlowGen - AutoGen Visualized

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GitHub star chart](https://img.shields.io/github/stars/tiwater/flowgen?style=social)](https://star-history.com/#tiwater/flowgen)
[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/tiwater/flowgen)

![flow-1](./website/static/img/screenshot-flow-1.png)

## 🤖 What is FlowGen

FlowGen is a tool built for [AutoGen](https://microsoft.github.io/autogen/), a great agent framework from Microsoft and [a lot of contributors](https://github.com/microsoft/autogen?tab=readme-ov-file#contributors-wall).

We regard AutoGen as one of the best frontier technology for next-generation Multi-Agent Applications. FlowGen elevates this concept, providing intuitive visual tools that streamline the construction and oversight of complex agent-based workflows, thereby simplifying the entire process for creators and developers.

### Autoflow Visual Editing

You can create a autoflow from scratch, or fork from a template. The autoflow is visualized as a graph, and you can drag and drop nodes to build agents in flow style.

![flow-1](./website/static/img/screenshot-flow-1.png)

### Chat

You can launch an autoflow or a template in a chat window, and chat with the agents.

![chat-1](./website/static/img/screenshot-chat-1.png)

![chat-2](./website/static/img/screenshot-chat-dalle3.png)

### Gallery

Place to share and discover flow templates.

![gallery-1](./website/static/img/screenshot-gallery-1.png)

## 💡 Quickstart

To quickly explore what FlowGen has to offer, simply visit it [https://flowgen.app](https://flowgen.app).

For a more in-depth look at the platform, please refer to our [Getting Started](https://docs.flowgen.app/getting-started) and [other documents](https://docs.flowgen.app).

## Migration of Official Notebooks

We made tutorials based on the official notebooks from Autogen repository. You can refer to the original notebook [here](https://github.com/microsoft/autogen/blob/main/notebook/).

🔲 Planned/Working
✅ Completed
🆘 With Issues
⭕ Out of Scope

| Example                                 | Status | Comments                                                                                                          |
| --------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| simple_chat                             | ✅     | [Simple Chat](https://flowgen.app/gallery/yp0appx814q7na1)                                                        |
| auto_feedback_from_code_execution       | ✅     | [Feedback from Code Execution](https://flowgen.app/flow/)                                                         |
| ~~auto_build~~                          | ⭕     | This is a feature to be considered to add to flow generation. [#40](https://github.com/tiwater/flowgen/issues/40) |
| chess                                   | 🔲     | This depends on the feature of importing custom Agent [#38](https://github.com/tiwater/flowgen/issues/38)         |
| compression                             | ✅     |                                                                                                                   |
| dalle_and_gpt4v                         | ✅     | Supported with app.extensions                                                                                     |
| function_call_async                     | ✅     |                                                                                                                   |
| function_call                           | ✅     |                                                                                                                   |
| graph_modelling_language                | ⭕     | This is out of project scope. Open an issue if necessary                                                          |
| group_chat_RAG                          | 🆘     | This notebook does not work                                                                                       |
| groupchat_research                      | ✅     |                                                                                                                   |
| groupchat_vis                           | ✅     |                                                                                                                   |
| groupchat                               | ✅     |                                                                                                                   |
| hierarchy_flow_using_select_speaker     | 🔲     |                                                                                                                   |
| human_feedback                          | ✅     | [Human in the Loop](https://flowgen.app/gallery/4pbokrvi7zguv48)                                                  |
| inception_function                      | 🔲     |                                                                                                                   |
| ~~langchain~~                           | ⭕     | No plan to support                                                                                                |
| lmm_gpt-4v                              | ✅     |                                                                                                                   |
| lmm_llava                               | ✅     | Depends on Replicate                                                                                              |
| MathChat                                | 🔲     |                                                                                                                   |
| oai_assistant_function_call             | ✅     |                                                                                                                   |
| oai_assistant_groupchat                 | 🆘     | Very slow and not work well, sometimes not returning.                                                             |
| oai_assistant_retrieval                 | ✅     | [Retrieval (OAI)](https://flowgen.app/gallery/tgq6dxu32yzwcgg)                                                    |
| oai_assistant_twoagents_basic           | ✅     |                                                                                                                   |
| oai_code_interpreter                    | ✅     |                                                                                                                   |
| planning                                | ✅     | This sample works fine, but does not exit gracefully.                                                             |
| qdrant_RetrieveChat                     | 🔲     |                                                                                                                   |
| RetrieveChat                            | 🔲     |                                                                                                                   |
| stream                                  | 🔲     |                                                                                                                   |
| teachability                            | 🔲     |                                                                                                                   |
| teaching                                | 🔲     |                                                                                                                   |
| two_users                               | ✅     | The response will be very long and should set a large max_tokens.                                                 |
| video_transcript_translate_with_whisper | ✅     | Depends on ffmpeg lib, should `brew install ffmpeg` and export IMAGEIO_FFMPEG_EXE                                 |
| web_info                                | ✅     |                                                                                                                   |
| cq_math                                 | ⭕     | This example is quite irrelevant to autogen, why not just use OpenAI API?                                         |
| Async_human_input                       | 🔲     |                                                                                                                   |
| oai_chatgpt_gpt4                        | ⭕     | Fine-tuning, out of project scope                                                                                 |
| oai_completion                          | ⭕     | Fine-tuning, out of project scope                                                                                 |

## 🐳 Run on Local (with Docker)

The project contains Frontend (Built with Next.js) and Backend service (Built with Flask in Python), and have been fully dockerized.

The easiest way to run on local is using docker-compose:

```bash
docker-compose up -d
```

You can also build and run the ui and service separately with docker:

```bash
docker build -t flowgen-api ./api
docker run -d -p 5004:5004 flowgen-api

docker build -t flowgen-ui ./ui
docker run -d -p 2855:2855 flowgen-ui

docker build -t flowgen-db ./pocketbase
docker run -d -p 7676:7676 flowgen-db
```

(The default port number 2855 is the address of our first office.)

## 🚀 Deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/NCoZBC?referralCode=5I-BUc)

Railway.app supports the deployment of applications in Dockers. By clicking the "Deploy on Railway" button, you'll streamline the setup and deployment of your application on Railway platform:

1. Click the "Deploy on Railway" button to start the process on Railway.app.
2. Log in to Railway and set the following environment variables:
   - `PORT`: Please set for each services as `2855`, `5004`, `7676` respectively.
3. Confirm the settings and deploy.
4. After deployment, visit the provided URL to access your deployed application.

## 🛠️ Run on Local (Without Docker)

If you're interested in contributing to the development of this project or wish to run it from the source code, you have the option to run the ui and service independently. Here's how you can do that:

1. **Frontend Service:**

   - Navigate to the ui directory.
   - Rename `.env.sample` to `.env.local` and set the value of variables correctly.
   - Install the necessary dependencies using the appropriate package manager command (e.g., `pnpm install` or `yarn`).
   - Run the ui service using the start-up script provided (e.g., `pnpm dev` or `yarn dev`).

2. **Backend Service:**

   - Switch to the api service directory `cd api`.
   - Create virtual environment: `python3 -m venv venv`.
   - Activate virtual environment: `source venv/bin/activate`.
   - Install all required dependencies: `pip install -r requirements.txt`.
   - Launch the api service using command `uvicorn app.main:app --reload --port 5004`.

`REPLICATE_API_TOKEN` is needed for LLaVa agent. If you need to use this agent, make sure to include this token in environment variables, such as the Environment Variables on Railway.app.

3. **PocketBase:**

   - Switch to the PocketBase directory `cd pocketbase`.
   - Build the container: `docker build -t flowgen-db .`
   - Run the container: `docker run -it --rm -p 7676:7676 flowgen-db`

Each new commit to the main branch triggers an automatic deployment on [Railway.app](https://railway.app), ensuring you experience the latest version of the service.

> [!WARNING]
>
> Changes to Pocketbase project will cause the rebuild and redeployment of all instances, which will swipe all the data.
>
> Please do not use it for production purpose, and make sure you export flows in time.

Once you've started both the ui and api services by following the steps previously outlined, you can access the application by opening your web browser and navigating to:

- Frontend: http://localhost:2855
- Backend: http://localhost:5004 (OpenAPI docs served at http://localhost:5004/redoc)
- PocketBase: http://localhost:7676

If your services are started successfully and running on the expected ports, you should see the user interface or receive responses from the api services via this URL.

## 👨‍💻 Contributing

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/tiwater/flowgen)

This project welcomes contributions and suggestions. Please read our [Contributing Guide](./CONTRIBUTING.md) first.

If you are new to GitHub, [here](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/) is a detailed help source on getting involved with development on GitHub.

Please consider contributing to [AutoGen](https://github.com/microsoft/autogen), as FlowGen relies on a robust foundation to deliver its capabilities. Your contributions can help enhance the platform's core functionalities, ensuring a more seamless and efficient development experience for Multi-Agent Applications.

## Contributors Wall

<a href="https://github.com/tiwater/flowgen/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=tiwater/flowgen" />
</a>

## 📝 License

The project is licensed under [Apache 2.0 with additional terms and conditions](./LICENSE.md).
