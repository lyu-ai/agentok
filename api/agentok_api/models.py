from pydantic import BaseModel
from typing import Any, Dict, List, Literal, Optional

Node = Dict[str, Any]
Edge = Dict[str, Any]


class AgentMetadata(BaseModel):
    name: str
    description: str
    type: str
    label: str
    class_name: str


class Flow(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


class ToolAssign(BaseModel):
    agent: str
    scene: str


class ToolVariable(BaseModel):
    name: str
    description: Optional[str] = None
    value: Any
    default: Optional[Any] = None


class Tool(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    variables: List[ToolVariable]
    code: Optional[str] = None
    user_id: Optional[str] = None


class ToolCode(BaseModel):
    code: str


class ToolCreate(BaseModel):
    name: str
    description: Optional[str] = None
    variables: List[ToolVariable]
    code: Optional[str] = None


class Project(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    flow: Flow
    settings: Optional[Dict[str, Any]] = None
    user_id: Optional[str] = None
    created_at: str
    updated_at: str


class MessageCreate(BaseModel):
    type: Literal["user", "assistant"]
    content: str
    meta: Optional[Dict[str, Any]] = None
    sender: Optional[str] = None
    receiver: Optional[str] = None


class Message(MessageCreate):
    id: Optional[int] = None  # No need to provide for new message
    chat_id: int
    user_id: str
    created_at: Optional[str] = None


class ChatCreate(BaseModel):
    name: str
    from_type: Literal["project", "template"]
    from_project: Optional[int] = None
    from_template: Optional[int] = None
    user_id: str


class Chat(ChatCreate):
    id: int
    status: Optional[str] = None
    created_at: str
    updated_at: str


class ApiKeyCreate(BaseModel):
    name: str
    key: str


class ApiKey(ApiKeyCreate):
    id: int
    user_id: str
    created_at: str


class DatasetCreate(BaseModel):
    name: str


class Dataset(BaseModel):
    id: int
    name: str
    user_id: str


class Query(BaseModel):
    query: str


class DocumentCreate(BaseModel):
    dataset_id: int
    name: str
    path: str


class Document(BaseModel):
    id: int
    name: str
    user_id: str
    created_at: str
    updated_at: Optional[str] = None


class ChunkCreate(BaseModel):
    document_id: int
    content: str


class Chunk(ChunkCreate):
    id: int
    user_id: str
    created_at: str
    updated_at: str
