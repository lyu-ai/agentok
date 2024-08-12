import useSWR from 'swr';
import { fetcher } from './fetcher';
import { useState } from 'react';
import useDatasetStore, { Chunk, Document, Dataset } from '@/store/dataset';
import { update } from 'lodash-es';

export function useDatasets() {
  const { data, error, mutate } = useSWR<Dataset[]>(`/api/datasets`, fetcher);
  const deleteDataset = useDatasetStore((state) => state.deleteDataset);

  const [isCreating, setIsCreating] = useState(false);
  const handleCreateDataset = async (dataset: Partial<Dataset>) => {
    setIsCreating(true);
    try {
      const res = await fetch(`/api/datasets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataset),
      });
      if (res.ok) {
        mutate(); // Revalidate the cache to reflect the change
        return await res.json();
      }
    } catch (error) {
      console.error('Failed to create dataset:', error);
      // Rollback or handle the error state as necessary
      mutate();
    } finally {
      setIsCreating(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteDataset = async (id: number) => {
    setIsDeleting(true);
    // Optimistically remove the template from the local state
    deleteDataset(id);
    try {
      await fetch(`/api/datasets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      mutate(); // Revalidate the cache to reflect the change
    } catch (error) {
      console.error('Failed to delete the dataset:', error);
      mutate();
    } finally {
      setIsDeleting(false);
    }
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateDataset = async (id: number, dataset: Partial<Dataset>) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/datasets/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataset),
      });
      if (res.ok) {
        mutate(); // Revalidate the cache to reflect the change
        return await res.json();
      }
    } catch (error) {
      console.error('Failed to update dataset:', error);
      mutate();
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    datasets: data ?? [],
    isLoading: !error && !data,
    isError: error,
    createDataset: handleCreateDataset,
    isCreating,
    updateDataset: handleUpdateDataset,
    isUpdating,
    deleteDataset: handleDeleteDataset,
    isDeleting,
  };
}

export function useDataset(datasetId: number) {
  const { data, error } = useSWR<Dataset>(
    `/api/datasets/${datasetId}`,
    fetcher
  );
  const deleteDataset = useDatasetStore((state) => state.deleteDataset);
  const { updateDataset } = useDatasets();

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteDataset = async () => {
    setIsDeleting(true);
    // Optimistically remove the template from the local state
    deleteDataset(datasetId);
    try {
      await fetch(`/api/datasets/${datasetId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to delete the dataset:', error);
    }
    setIsDeleting(false);
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateDataset = async (dataset: Partial<Dataset>) => {
    setIsUpdating(true);
    try {
      const updatedDataset = await updateDataset(datasetId, dataset);
      return updatedDataset;
    } catch (error) {
      console.error('Failed to update dataset:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    dataset: data,
    isLoading: !error && !data,
    isError: error,
    deleteDataset: handleDeleteDataset,
    isDeleting,
    updateDataset: handleUpdateDataset,
    isUpdating,
  };
}

export function useDocuments(datasetId: number) {
  const { data, error, mutate } = useSWR<Document[]>(
    `/api/datasets/${datasetId}/documents`,
    fetcher
  );
  const deleteDocument = useDatasetStore((state) => state.deleteDocument);

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteDocument = async (id: number) => {
    setIsDeleting(true);
    // Optimistically remove the template from the local state
    deleteDocument(id);
    try {
      await fetch(`/api/datasets/${datasetId}/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      mutate(); // Revalidate the cache to reflect the change
    } catch (error) {
      console.error('Failed to delete the document:', error);
      mutate();
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    documents: data ?? [],
    isLoading: !error && !data,
    isError: error,
    deleteDocument: handleDeleteDocument,
    isDeleting,
  };
}

export function useDocument(datasetId: number, documentId: number) {
  const { data, error } = useSWR<Document>(
    `/api/datasets/${datasetId}/documents/${documentId}`,
    fetcher
  );

  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateDocument = async (document: Partial<Document>) => {
    setIsUpdating(true);
    try {
      const res = await fetch(
        `/api/datasets/${datasetId}/documents/${documentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(document),
        }
      );
      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.error('Failed to update document:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    document: data,
    isLoading: !error && !data,
    isError: error,
    updateDocument: handleUpdateDocument,
    isUpdating,
  };
}

export function useChunks(datasetId: number, documentId: number) {
  const { data, error } = useSWR<Chunk[]>(
    `/api/datasets/${datasetId}/documents/${documentId}/chunks`,
    fetcher
  );

  const deleteChunk = useDatasetStore((state) => state.deleteChunk);
  const updateChunk = useDatasetStore((state) => state.updateChunk);

  const handleDeleteChunk = async (chunkId: number) => {
    // Optimistically remove the template from the local state
    deleteChunk(chunkId);
    try {
      await fetch(
        `/api/datasets/${datasetId}/documents/${documentId}/chunks/${chunkId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
    } catch (error) {
      console.error('Failed to delete the chunk:', error);
    }
  };

  const handleUpdateChunk = async (chunkId: number, chunk: Partial<Chunk>) => {
    updateChunk(chunkId, chunk);
    try {
      const res = await fetch(
        `/api/datasets/${datasetId}/documents/${documentId}/chunks/${chunkId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(chunk),
        }
      );
      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.error('Failed to update chunk:', error);
    }
  };

  return {
    chunks: data ?? [],
    isLoading: !error && !data,
    isError: error,
    deleteChunk: handleDeleteChunk,
    updateChunk: handleUpdateChunk, // Here we don't provide isUpdating because we cannot indicate which chunk is being updated
  };
}

export function useChunk(
  datasetId: number,
  documentId: number,
  chunkId: number
) {
  const { data, error } = useSWR<Chunk>(
    `/api/datasets/${datasetId}/documents/${documentId}/chunks/${chunkId}`,
    fetcher
  );

  const deleteChunk = useDatasetStore((state) => state.deleteChunk);
  const updateChunk = useDatasetStore((state) => state.updateChunk);

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteChunk = async () => {
    setIsDeleting(true);
    // Optimistically remove the template from the local state
    deleteChunk(chunkId);
    try {
      await fetch(
        `/api/datasets/${datasetId}/documents/${documentId}/chunks/${chunkId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
    } catch (error) {
      console.error('Failed to delete the chunk:', error);
    }
    setIsDeleting(false);
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateChunk = async (chunk: Partial<Chunk>) => {
    setIsUpdating(true);
    updateChunk(chunkId, chunk);
    try {
      const res = await fetch(
        `/api/datasets/${datasetId}/documents/${documentId}/chunks/${chunkId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(chunk),
        }
      );
      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.error('Failed to update chunk:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    chunk: data,
    isLoading: !error && !data,
    isError: error,
    deleteChunk: handleDeleteChunk,
    isDeleting,
    updateChunk: handleUpdateChunk,
    isUpdating,
  };
}
