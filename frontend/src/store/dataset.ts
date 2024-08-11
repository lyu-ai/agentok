import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Dataset = {
  id: number;
  name: string;
  description: string;
  documents: Document[];
  user_id: string;
  created_at: string;
};

export type Document = {
  id: number;
  name: string;
  path: string; // Path to the document storage
  description: string;
  status: string;
  enabled: boolean;
  chunks: Chunk[];
  dataset_id: number;
  user_id: string;
  created_at: string;
};

export type Chunk = {
  id: number;
  content: string;
  enabled: boolean;
  chunk_index: number;
  document_id: number;
  user_id: string;
  created_at: string;
};

interface DatasetState {
  datasets: Dataset[];
  setDatasets: (tools: Dataset[]) => void;
  createDataset: (dataset: Dataset) => void;
  updateDataset: (id: number, tool: Partial<Dataset>) => void;
  deleteDataset: (id: number) => void;
  createDocument: (document: Document) => void;
  updateDocument: (id: number, document: Partial<Document>) => void;
  deleteDocument: (id: number) => void;
  createChunk: (chunk: Chunk) => void;
  updateChunk: (id: number, chunk: Partial<Chunk>) => void;
  deleteChunk: (id: number) => void;
  getDatasetById: (id: number) => Dataset | undefined;
}

const useDatasetStore = create<DatasetState>()(
  persist(
    (set, get) => ({
      datasets: [],
      setDatasets: (datasets) => set({ datasets }),
      createDataset: (dataset) =>
        set((state) => ({
          datasets: [...state.datasets, dataset],
        })),
      updateDataset: (id, newDataset) =>
        set((state) => {
          const datasets = state.datasets.map((dataset) => {
            if (dataset.id === id) {
              return { ...newDataset, ...dataset };
            }
            return dataset;
          });
          return { datasets };
        }),
      deleteDataset: (id) =>
        set((state) => ({
          datasets: state.datasets.filter((d) => d.id !== id),
        })),
      createDocument: (document) =>
        set((state) => ({
          datasets: state.datasets.map((dataset) => {
            if (dataset.id === document.dataset_id) {
              return {
                ...dataset,
                documents: [...dataset.documents, document],
              };
            }
            return dataset;
          }),
        })),
      updateDocument: (id, newDocument) =>
        set((state) => {
          const datasets = state.datasets.map((dataset) => {
            if (dataset.documents) {
              const documents = dataset.documents.map((document) => {
                if (document.id === id) {
                  return { ...newDocument, ...document };
                }
                return document;
              });
              return { ...dataset, documents };
            }
            return dataset;
          });
          return { datasets };
        }),
      deleteDocument: (id) =>
        set((state) => ({
          datasets: state.datasets.map((dataset) => {
            if (dataset.documents) {
              return {
                ...dataset,
                documents: dataset.documents.filter((d) => d.id !== id),
              };
            }
            return dataset;
          }),
        })),
      createChunk: (chunk) =>
        set((state) => ({
          datasets: state.datasets.map((dataset) => {
            if (dataset.documents) {
              return {
                ...dataset,
                documents: dataset.documents.map((document) => {
                  if (document.id === chunk.document_id) {
                    return {
                      ...document,
                      chunks: [...document.chunks, chunk],
                    };
                  }
                  return document;
                }),
              };
            }
            return dataset;
          }),
        })),
      updateChunk: (id, newChunk) =>
        set((state) => {
          const datasets = state.datasets.map((dataset) => {
            if (dataset.documents) {
              const documents = dataset.documents.map((document) => {
                if (document.chunks) {
                  const chunks = document.chunks.map((chunk) => {
                    if (chunk.id === id) {
                      return { ...newChunk, ...chunk };
                    }
                    return chunk;
                  });
                  return { ...document, chunks };
                }
                return document;
              });
              return { ...dataset, documents };
            }
            return dataset;
          });
          return { datasets };
        }),
      deleteChunk: (id) =>
        set((state) => ({
          datasets: state.datasets.map((dataset) => {
            if (dataset.documents) {
              return {
                ...dataset,
                documents: dataset.documents.map((document) => {
                  if (document.chunks) {
                    return {
                      ...document,
                      chunks: document.chunks.filter((c) => c.id !== id),
                    };
                  }
                  return document;
                }),
              };
            }
            return dataset;
          }),
        })),
      getDatasetById: (id) =>
        id ? get().datasets.find((dataset) => dataset.id === id) : undefined,
    }),
    {
      name: "agentok-datasets",
    }
  )
);

export default useDatasetStore;
