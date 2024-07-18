
from pydantic import BaseModel
from typing import Any, Dict, List, Literal, Optional, Union

class Message(BaseModel):
  id: Optional[str] = None # No need to provide for new message
  sender: Optional[str] = None
  receiver: Optional[str] = None
  content: str
  chat: str
  type: Literal['user', 'assistant']
  user_id: str
  created: Optional[str] = None

Node = Dict[str, Any]
Edge = Dict[str, Any]

class Flow(BaseModel):
  nodes: List[Node]
  edges: List[Edge]

class Parameter(BaseModel):
  id: str
  name: str
  description: str
  type: Literal['bool', 'str', 'int', 'float']
  required: Optional[bool] = False

class ToolAssign(BaseModel):
  agent: str
  scene: str

class Tool(BaseModel):
  id: str
  name: str
  description: Optional[str] = None
  parameters: List[Parameter]
  code: Optional[str] = None
  assigned: Optional[List[ToolAssign]] = None

class Project(BaseModel):
  id: str
  name: str
  description: Optional[str] = None
  flow: Flow
  tools: Optional[List[Tool]] = None
  settings: Optional[Dict[str, Any]] = None
  user_id: Optional[str] = None
  created: str
  updated: str

class MessageBase(BaseModel):
    message: str

class MessageCreate(MessageBase):
    pass

class ChatCreate(BaseModel):
    name: str
    from_type: Literal['project', 'template']
    from_project: Optional[str] = None
    from_template: Optional[str] = None
    user_id: str

class Chat(ChatCreate):
    id: str
    status: str
    created: str
    updated: str

class ExtendedAgent(BaseModel):
    id: str
    name: str
    description: str
    type: str
    label: str
    class_type: str

class ApiKeyCreate(BaseModel):
    name: str

class ApiKey(ApiKeyCreate):
    id: str
    key: str
    user_id: str
    created: str
    updated: str

class User(BaseModel):
    id: str
    name: str
    email: str
    emailVisibility: bool
    avatar: str
    created: str
    updated: str
    verified: bool
