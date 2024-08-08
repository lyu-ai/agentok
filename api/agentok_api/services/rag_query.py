import os
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_service_key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_service_key)

# Initialize the sentence transformer model
model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")


def query_vectordb(query: str, dataset_id: int, top_k: int = 5) -> str:
    # Encode the query into a vector
    query_vector = model.encode(query).tolist()

    # Call the stored procedure
    result = supabase.rpc(
        "search_chunks_by_dataset",
        {"p_dataset_id": dataset_id, "p_query_vector": query_vector, "p_limit": top_k},
    ).execute()

    chunks = result.data

    # Format the context string
    context = "\n".join(
        [
            f"Document {chunk['document_id']} (Similarity: {chunk['similarity']:.4f}): {chunk['content']}"
            for chunk in chunks
        ]
    )

    return context


if __name__ == "__main__":
    result = query_vectordb("How to create a chatbot?", 2)
    print(result)
