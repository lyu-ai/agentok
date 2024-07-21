import useSWR from 'swr';
import { fetcher } from './fetcher';

export type Dataset = {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
};

export type Document = {
  id: string;
  name: string;
  path: string; // Path to the document storage
  description: string;
  status: string;
  dataset_id: number;
  user_id: string;
  created_at: string;
};

export type Chunk = {
  id: string;
  content: string;
  chunk_index: number;
  document_id: number;
  user_id: string;
  created_at: string;
};

export function useDatasets() {
  const { data, error } = useSWR<Dataset[]>(`/api/datasets`, fetcher);

  // TODO: Add publish and delete functions

  return {
    datasets: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useDataset(datasetId: number) {
  const { data, error } = useSWR<Dataset>(`/api/datasets/${datasetId}`, fetcher);

  // TODO: Add publish and delete functions

  return {
    dataset: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useDocuments(datasetId: number) {
  const { data, error } = useSWR<Document[]>(`/api/datasets/${datasetId}/documents`, fetcher);

  // TODO: Add publish and delete functions

  return {
    documents: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useDocument(datasetId: number, documentId: number) {
  const { data, error } = useSWR<Document>(`/api/datasets/${datasetId}/documents/${documentId}`, fetcher);

  // TODO: Add publish and delete functions

  return {
    document: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useChunks(datasetId: number, documentId: number) {
  const { data, error } = useSWR<Chunk[]>(`/api/datasets/${datasetId}/documents/${documentId}/chunks`, fetcher);

  // TODO: Add publish and delete functions

  return {
    chunks: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useChunk(datasetId: number, documentId: number, chunkId: number) {
  const { data, error } = useSWR<Chunk>(`/api/datasets/${datasetId}/documents/${documentId}/chunks/${chunkId}`, fetcher);

  // TODO: Add publish and delete functions

  return {
    chunk: data,
    isLoading: !error && !data,
    isError: error,
  };
}
