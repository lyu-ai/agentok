from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File, Depends
from typing import List

from regex import D
from ..services import DatasetService
from ..dependencies import get_dataset_service
from ..models import Dataset, DatasetCreate, Document

router = APIRouter()


@router.get("", summary="Get all datasets", response_model=List[dict])
async def get_datasets(service: DatasetService = Depends(get_dataset_service)):
    return service.get_datasets()


@router.post("", summary="Create a new dataset", response_model=Dataset)
async def create_dataset(
    dataset: DatasetCreate, service: DatasetService = Depends(get_dataset_service)
):
    return service.create_dataset(dataset)


@router.get("/{dataset_id}", summary="Get a dataset", response_model=Dataset)
async def get_dataset(
    dataset_id: str, service: DatasetService = Depends(get_dataset_service)
):
    return service.get_dataset(dataset_id)


@router.delete("/{dataset_id}", summary="Delete a dataset", response_model=dict)
async def delete_dataset(
    dataset_id: str, service: DatasetService = Depends(get_dataset_service)
):
    return service.delete_dataset(dataset_id)


@router.get(
    "/{dataset_id}/documents",
    summary="Get all documents of a dataset",
    response_model=List[Document],
)
async def get_documents(
    dataset_id: str, service: DatasetService = Depends(get_dataset_service)
):
    return service.get_documents(dataset_id)


@router.post(
    "/{dataset_id}/documents",
    summary="Upload a document to a dataset",
    response_model=Document,
)
async def upload_document(
    dataset_id: str,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    service: DatasetService = Depends(get_dataset_service),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Invalid file")
    try:
        file_content = file.file.read()
        file_extension = file.filename.split(".")[-1]
        document = await service.upload_document(
            dataset_id, file.filename, file_content
        )
        background_tasks.add_task(
            service.vectorize_and_chunk_document,
            str(document.id),
            file_content,
            file_extension,
        )
        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/{dataset_id}/documents/{document_id}",
    summary="Get one document",
    response_model=Document,
)
async def get_document(
    dataset_id: str,
    document_id: str,
    service: DatasetService = Depends(get_dataset_service),
):
    return service.get_document(dataset_id, document_id)


@router.post(
    "/{dataset_id}/documents/{document_id}/vectorize",
    summary="Vectorize one document",
    response_model=dict,
)
async def vectorize_document(
    dataset_id: str,
    document_id: str,
    background_tasks: BackgroundTasks,
    service: DatasetService = Depends(get_dataset_service),
):
    background_tasks.add_task(service.vectorize_document, dataset_id, document_id)
    return service.vectorize_document(dataset_id, document_id)


@router.delete(
    "/{dataset_id}/documents/{document_id}",
    summary="Delete a document",
    response_model=dict,
)
async def delete_document(
    dataset_id: str,
    document_id: str,
    service: DatasetService = Depends(get_dataset_service),
):
    return service.delete_document(dataset_id, document_id)


@router.get(
    "/{dataset_id}/documents/{document_id}/status",
    summary="Get document status",
    response_model=dict,
)
async def get_document_status(
    dataset_id: str,
    document_id: str,
    service: DatasetService = Depends(get_dataset_service),
):
    try:
        result = service.get_document_status(document_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get(
    "/{dataset_id}/documents/{document_id}/chunks",
    summary="Get document chunks",
    response_model=List[dict],
)
async def get_document_chunks(
    dataset_id: str,
    document_id: str,
    service: DatasetService = Depends(get_dataset_service),
):
    try:
        result = service.get_document_chunks(document_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/{dataset_id}/documents/{document_id}/chunks/{chunk_id}",
    summary="Get a specific chunk",
    response_model=dict,
)
async def get_chunk(
    dataset_id: str,
    document_id: str,
    chunk_id: str,
    service: DatasetService = Depends(get_dataset_service),
):
    try:
        result = service.get_chunk(chunk_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post(
    "/{dataset_id}/documents/{document_id}/chunks/{chunk_id}",
    summary="Update a specific chunk",
    response_model=dict,
)
async def update_chunk(
    dataset_id: str,
    document_id: str,
    chunk_id: str,
    service: DatasetService = Depends(get_dataset_service),
):
    try:
        result = service.update_chunk(chunk_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete(
    "/{dataset_id}/documents/{document_id}/chunks/{chunk_id}",
    summary="Delete a specific chunk",
    response_model=dict,
)
async def delete_chunk(
    dataset_id: str,
    document_id: str,
    chunk_id: str,
    service: DatasetService = Depends(get_dataset_service),
):
    try:
        result = service.delete_chunk(chunk_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
