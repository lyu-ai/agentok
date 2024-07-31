from base64 import b64decode
import hashlib
from io import BytesIO
import os
import logging
from dotenv import load_dotenv
from h11 import Data
from supabase import create_client, Client
from gotrue import User
from fastapi import HTTPException, UploadFile, status, Request
from typing import Dict, List, Literal, Optional
from termcolor import colored

logger = logging.getLogger(__name__)

from ..models import (
    ApiKey,
    ApiKeyCreate,
    Chat,
    ChatCreate,
    Dataset,
    DatasetCreate,
    Document,
    DocumentCreate,
    Message,
    MessageCreate,
)

load_dotenv()  # Load environment variables from .env


class SupabaseClient:
    def __init__(self):
        self.supabase_url = os.environ.get("SUPABASE_URL")
        self.supabase_service_key = os.environ.get("SUPABASE_SERVICE_KEY")
        if not self.supabase_url or not self.supabase_service_key:
            raise Exception("Supabase URL or key not found in environment variables")
        self.supabase: Client = create_client(
            self.supabase_url, self.supabase_service_key
        )
        self.user_id = None

    def get_user(self) -> User:
        try:
            # Then, get the user data from the auth.users table
            user_response = self.supabase.rpc(
                "get_user_by_id", {"user_id": self.user_id}
            ).execute()

            if not user_response.data or len(user_response.data) == 0:
                print(colored(f"User not found for user_id {self.user_id}", "red"))
                self.user_id = None
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
                )

            user_data = user_response.data[0]
            user_data["app_metadata"] = user_data.get("app_metadata", {})
            user_data["user_metadata"] = user_data.get("user_metadata", {})

            user = User(**user_data)
            return user
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise

    # Load the user from the cookie. This is for the situation where the user is already logged in on client side.
    # The request should be called with credentials: 'include'
    def authenticate_with_tokens(
        self, access_token: str, refresh_token: Optional[str] = None
    ) -> User:
        try:
            if not self.supabase_url or not self.supabase_service_key:
                raise Exception(
                    "Supabase URL or key not found in environment variables"
                )
            temp_supabase = create_client(self.supabase_url, self.supabase_service_key)
            # Set the session in Supabase
            temp_supabase.auth.set_session(
                access_token=access_token,
                refresh_token=refresh_token or "dummy_refresh_token",
            )
            user_data = temp_supabase.auth.get_user()
            if user_data:
                self.user_id = user_data.user.id
                return user_data.user
            else:
                print(colored(f"Failed to retrieve user", "red"))
                self.user_id = None
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Failed to authenticate with bearer token",
                )
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise

    def authenticate_with_apikey(self, apikey: str) -> User:
        try:
            # First, get the user_id from the api_keys table
            api_key_response = (
                self.supabase.table("api_keys")
                .select("user_id")
                .eq("key", apikey)
                .single()
                .execute()
            )

            if not api_key_response.data:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Failed to authenticate with apikey",
                )

            self.user_id = api_key_response.data["user_id"]

            user = self.get_user()
            return user

        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="An error occurred during authentication",
            )

    def save_apikey(self, key_to_create: ApiKeyCreate) -> ApiKey:
        try:
            # Create a new instance with the user_id
            key_data = key_to_create.model_dump()
            key_data["user_id"] = self.user_id
            response = self.supabase.table("api_keys").insert(key_data).execute()
            if response.data:
                return ApiKey(**response.data[0])
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to create API key",
                )
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create API key",
            )

    def fetch_apikeys(self) -> List[ApiKey]:
        try:
            response = (
                self.supabase.table("api_keys")
                .select("*")
                .eq("user_id", self.user_id)
                .execute()
            )
            if response.data:
                return [ApiKey(**item) for item in response.data]
            else:
                return []
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to retrieve API keys",
            )

    def fetch_apikey(self, apikey_id: str) -> Optional[ApiKey]:
        try:
            response = (
                self.supabase.table("api_keys")
                .select("*")
                .eq("id", apikey_id)
                .eq("user_id", self.user_id)
                .execute()
            )
            if response.data:
                return ApiKey(**response.data[0])
            else:
                return None
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to retrieve API key",
            )

    def delete_apikey(self, apikey_id: str) -> Dict:
        try:
            response = (
                self.supabase.table("api_keys")
                .delete()
                .eq("id", apikey_id)
                .eq("user_id", self.user_id)
                .execute()
            )
            if response.data:
                return {"message": f"Successfully deleted {apikey_id}"}
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to delete API key",
                )
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to delete API key",
            )

    def fetch_settings(self) -> Dict:
        try:
            response = (
                self.supabase.table("users")
                .select("settings")
                .eq("user_id", self.user_id)
                .execute()
            )
            if response.data:
                return response.data[0]
            else:
                return {}
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User settings not found: {exc}",
            )

    def fetch_chats(self) -> List[Chat]:
        try:
            response = (
                self.supabase.table("chats")
                .select("*")
                .eq("user_id", self.user_id)
                .execute()
            )
            if response.data:
                return [Chat(**item) for item in response.data]
            else:
                return []
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to get chats for user {self.user_id}: {exc}",
            )

    def fetch_chat(self, chat_id: str) -> Chat:
        try:
            response = (
                self.supabase.table("chats")
                .select("*")
                .eq("id", chat_id)
                .eq("user_id", self.user_id)
                .execute()
            )
            if response.data:
                return Chat(**response.data[0])
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found"
                )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Chat not found: {exc}",
            )

    def create_chat(self, chat_to_create: ChatCreate) -> Chat:
        try:
            # Create a new instance with the user_id
            chat_data = chat_to_create.model_dump(exclude={"id"})
            chat_data["user_id"] = self.user_id
            response = self.supabase.table("chats").insert(chat_data).execute()

            if response.data:
                return Chat(**response.data[0])
            else:
                print(colored(f"Insertion failed: {response}", "red"))
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to create chat",
                )
        except Exception as exc:
            print(colored(f"Failed to create chat: {exc}", "red"))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to create chat: {exc}",
            )

    def fetch_datasets(self) -> List[Dataset]:
        try:
            response = (
                self.supabase.table("datasets")
                .select("*")
                .eq("user_id", self.user_id)
                .execute()
            )
            if response.data and len(response.data) > 0:
                return response.data
            else:
                return []
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed fetching datasets: {exc}",
            )

    def create_dataset(self, dataset_name: DatasetCreate) -> Dataset:
        dataset_data = dataset_name.model_dump(exclude={"id"})
        dataset_data["user_id"] = self.user_id
        response = self.supabase.table("datasets").insert(dataset_data).execute()
        if not response.data or len(response.data) == 0:
            print(colored(f"Error creating dataset", "red"))
            raise Exception("Error creating dataset")
        return Dataset(**response.data[0])

    def fetch_dataset(self, dataset_id: str) -> Dataset:
        response = (
            self.supabase.table("datasets")
            .select("*")
            .eq("id", dataset_id)
            .eq("user_id", self.user_id)
            .execute()
        )
        if response.data and len(response.data) > 0:
            return Dataset(**response.data[0])
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found"
            )

    def delete_dataset(self, dataset_id: str) -> Dict:
        response = (
            self.supabase.table("datasets")
            .delete()
            .eq("id", dataset_id)
            .eq("user_id", self.user_id)
            .execute()
        )
        if response.data:
            return {"message": "Dataset deleted successfully"}
        else:
            raise Exception("Error deleting dataset")

    def fetch_documents(self, dataset_id: str) -> List[Document]:
        response = (
            self.supabase.table("documents")
            .select("*")
            .eq("dataset_id", dataset_id)
            .eq("user_id", self.user_id)
            .execute()
        )
        if response.data:
            return [Document(**item) for item in response.data]
        else:
            return []

    def create_document(self, document_to_create: DocumentCreate) -> Document:
        try:
            document_data = document_to_create.model_dump(exclude={"id"})
            document_data["user_id"] = self.user_id
            response = self.supabase.table("documents").insert(document_data).execute()
            if response.data:
                return Document(**response.data[0])
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Failed to create document. Response: {response}",
                )
        except Exception as exc:
            logger.error(f"An error occurred: {exc}")
            raise

    def fetch_document(self, dataset_id: str, document_id: str) -> Document:
        response = (
            self.supabase.table("documents")
            .select("*")
            .eq("document_id", document_id)
            .eq("dataset_id", dataset_id)
            .eq("user_id", self.user_id)
            .execute()
        )
        if response.data and len(response.data) > 0:
            return Document(**response.data[0])
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found"
            )

    async def upload_document(
        self, dataset_id: str, filename: str, file_content: bytes
    ) -> Document:
        try:
            if not filename:
                raise HTTPException(status_code=400, detail="Invalid file")
            print(
                colored(
                    f"Uploading document to dataset {dataset_id} {filename}",
                    "light_blue",
                )
            )
            # Read the file content
            md5_hash = hashlib.md5(file_content).hexdigest()
            file_extension = filename.split(".")[-1]
            unique_filename = f"{dataset_id}/{md5_hash}.{file_extension}"
            # Check if the file already exists
            existing_files = self.supabase.storage.from_("documents").list(
                path=unique_filename
            )
            # TODO: This can be optimized to avoid multiple uploads of the same file
            if any(file["name"] == unique_filename for file in existing_files):
                # Delete the existing file
                print(
                    colored(f"Deleting existing document: {unique_filename}", "yellow")
                )
                self.supabase.storage.from_("documents").remove([unique_filename])
            self.supabase.storage.from_("documents").upload(
                unique_filename, file_content
            )
            print(
                colored(f"Uploaded document: {filename} to {unique_filename}", "green")
            )
            return self.create_document(
                DocumentCreate(
                    dataset_id=int(dataset_id), name=filename, path=unique_filename
                )
            )
        except Exception as e:
            logger.error(f"An error occurred during uploading document: {e}")
            raise

    def fetch_document_content(self, document_path: str) -> bytes:
        response = self.supabase.storage.from_("documents").download(document_path)
        if response:
            return response
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found in storage",
            )

    def delete_document(self, dataset_id: str, document_id: str) -> Dict:
        response = (
            self.supabase.table("documents")
            .delete()
            .eq("id", document_id)
            .eq("dataset_id", dataset_id)
            .eq("user_id", self.user_id)
            .execute()
        )
        if response.data:
            return {"message": "Document deleted successfully"}
        else:
            raise Exception("Error deleting document")

    def insert_chunk(self, doc_id, chunk, idx, embedding):
        response = (
            self.supabase.table("chunks")
            .insert(
                [
                    {
                        "document_id": doc_id,
                        "content": chunk,
                        "chunk_index": idx,
                        "embedding": embedding,
                    }
                ]
            )
            .execute()
        )
        if not response.data:
            raise Exception(f"Error inserting chunk: {response}")

    def update_document_status(self, doc_id, status):
        response = (
            self.supabase.table("documents")
            .update({"status": status})
            .eq("id", doc_id)
            .execute()
        )
        if not response.data:
            raise Exception(f"Error updating document status: {response}")

    def fetch_document_status(self, document_id):
        response = (
            self.supabase.table("documents")
            .select("status")
            .eq("id", document_id)
            .execute()
        )
        if response.data:
            return {"status": response.data[0]["status"]}
        else:
            raise Exception("Document not found")

    def fetch_document_chunks(self, document_id):
        response = (
            self.supabase.table("chunks")
            .select("*")
            .eq("document_id", document_id)
            .execute()
        )
        if response.data:
            return response.data
        else:
            raise Exception("Error fetching chunks")

    def fetch_chunk(self, chunk_id):
        response = (
            self.supabase.table("chunks").select("*").eq("id", chunk_id).execute()
        )
        if response.data:
            return response.data[0]
        else:
            raise Exception("Chunk not found")

    def add_message(self, message: MessageCreate, chat_id: str) -> Message:
        try:
            # Convert the message to a dictionary while excluding the 'id' field
            message_dict = message.model_dump(exclude={"id"})
            message_dict["user_id"] = self.user_id
            message_dict["chat_id"] = int(chat_id)
            print(colored(f"Adding message: {message_dict}", "green"))
            response = (
                self.supabase.table("chat_messages").insert(message_dict).execute()
            )
            if response.data:
                return Message(**response.data[0])
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Adding message failed without response data",
                )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to add message: {exc}",
            )

    def fetch_source_metadata(self, chat_id: str) -> Dict:
        try:
            response = (
                self.supabase.table("chats")
                .select("*")
                .eq("id", int(chat_id))
                .eq("user_id", self.user_id)
                .execute()
            )
            if response.data:
                chat = response.data[0]

                if chat["from_type"] == "project":
                    response = (
                        self.supabase.table("projects")
                        .select("*")
                        .eq("id", chat["from_project"])
                        .execute()
                    )
                    if response.data:
                        return response.data[0]
                elif chat["from_type"] == "template":
                    response = (
                        self.supabase.table("templates")
                        .select("*")
                        .eq("id", chat["from_template"])
                        .execute()
                    )
                    if response.data:
                        return response.data[0].get("project", {})
            return {}
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Source metadata not found: {exc}",
            )

    def set_chat_status(
        self,
        chat_id: str,
        chat_status: Literal[
            "ready", "running", "wait_for_human_input", "completed", "aborted", "failed"
        ],
    ):
        try:
            response = (
                self.supabase.table("chats")
                .update({"status": chat_status})
                .eq("id", chat_id)
                .eq("user_id", self.user_id)
                .execute()
            )
            if response.data:
                return response.data
            else:
                return None
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to set chat status: {exc}",
            )

    def upload_image(self, iamge_path, image_data):
        try:
            if not iamge_path:
                raise HTTPException(status_code=400, detail="Invalid iamge_path")
            print(colored(f"Uploading document to dataset {iamge_path}", "light_blue"))
            # Read the file content
            file_extension = iamge_path.split(".")[-1]
            # Check if the file already exists
            existing_files = self.supabase.storage.from_("documents").list(
                path=iamge_path
            )
            # TODO: This can be optimized to avoid multiple uploads of the same file
            if any(file["name"] == iamge_path for file in existing_files):
                # Delete the existing file
                print(colored(f"Deleting existing document: {iamge_path}", "yellow"))
                self.supabase.storage.from_("documents").remove([iamge_path])
            res = self.supabase.storage.from_("assets").upload(iamge_path, image_data)
            print(colored(f"Uploaded document: {iamge_path}", "green"))
            return res
        except Exception as e:
            logger.error(f"An error occurred during uploading document: {e}")
            raise


def create_supabase_client():
    return SupabaseClient()
