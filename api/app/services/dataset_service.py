from io import BytesIO
from typing import Dict, List
import numpy as np
import pymupdf  # PyMuPDF
from docx import Document as DocxDocument
from unstructured.partition.auto import partition
from sentence_transformers import SentenceTransformer

from .supabase_client import SupabaseClient
from ..models import Dataset, DatasetCreate, Document


class DatasetService:
    def __init__(self, supabase: SupabaseClient):
        self.supabase = supabase
        self.model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")

    def get_datasets(self) -> List[Dataset]:
        return self.supabase.fetch_datasets()

    def create_dataset(self, dataset_to_create: DatasetCreate) -> Dataset:
        return self.supabase.create_dataset(dataset_to_create)

    def get_dataset(self, dataset_id: str) -> Dataset:
        return self.supabase.fetch_dataset(dataset_id)

    def delete_dataset(self, dataset_id: str) -> Dict:
        return self.supabase.delete_dataset(dataset_id)

    def get_documents(self, dataset_id: str) -> List[Document]:
        return self.supabase.fetch_documents(dataset_id)

    def get_document(self, dataset_id: str, document_id: str) -> Document:
        return self.supabase.fetch_document(dataset_id, document_id)

    async def upload_document(
        self, dataset_id: str, filename: str, file_content: bytes
    ) -> Document:
        doc = await self.supabase.upload_document(dataset_id, filename, file_content)
        return doc

    def delete_document(self, dataset_id: str, document_id: str) -> Dict:
        return self.supabase.delete_document(dataset_id, document_id)

    def extract_text_from_file(self, file_content: bytes, file_extension: str) -> str:
        if file_extension == "pdf":
            return self.extract_text_from_pdf(file_content)
        elif file_extension == "docx":
            return self.extract_text_from_docx(file_content)
        else:
            return self.extract_text_from_unstructured(file_content, file_extension)

    def extract_text_from_pdf(self, file_content: bytes) -> str:
        # Open the PDF file
        doc = pymupdf.open(stream=file_content, filetype="pdf")
        text = ""

        # Iterate through each page in the document
        for page in doc:
            text += page.get_textpage().extractTEXT(sort=True) + "\n"

        return text

    def extract_text_from_docx(self, file_content: bytes) -> str:
        doc = DocxDocument(BytesIO(file_content))
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text

    def extract_text_from_unstructured(
        self, file_content: bytes, file_extension: str
    ) -> str:
        file_like_object = BytesIO(file_content)
        elements = partition(file=file_like_object, file_extension=file_extension)
        return "\n".join([str(e) for e in elements])

    async def vectorize_and_chunk_document(
        self, document_id: str, file_content: bytes, file_extension: str
    ):
        if not file_extension:
            raise Exception("Invalid file")

        # Extract document content
        content = self.extract_text_from_file(file_content, file_extension)

        # Chunk the document content
        chunk_size = 200  # Define your chunk size
        chunks = [
            content[i : i + chunk_size] for i in range(0, len(content), chunk_size)
        ]

        for idx, chunk in enumerate(chunks):
            embedding = self.model.encode(chunk)
            embedding_list = np.array(embedding).tolist()
            self.supabase.insert_chunk(document_id, chunk, idx, embedding_list)

        # Update document status to 'completed'
        self.supabase.update_document_status(document_id, "completed")

    async def vectorize_document(self, dataset_id: str, document_id: str):
        document = self.supabase.fetch_document(dataset_id, document_id)
        file_content = self.supabase.fetch_document_content(document_id)
        file_extension = document.name.split(".")[-1]
        await self.vectorize_and_chunk_document(
            document_id, file_content, file_extension
        )

    def get_document_status(self, document_id: str) -> dict:
        return self.supabase.fetch_document_status(document_id)

    def get_document_chunks(self, document_id: str) -> list:
        return self.supabase.fetch_document_chunks(document_id)

    def get_chunk(self, chunk_id: str) -> dict:
        return self.supabase.fetch_chunk(chunk_id)

    def update_chunk(self, chunk_id: str) -> dict:
        return self.supabase.update_chunk(chunk_id)

    def delete_chunk(self, chunk_id: str) -> dict:
        return self.supabase.delete_chunk(chunk_id)
