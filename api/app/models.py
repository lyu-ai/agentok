
from pydantic import BaseModel
from typing import Any, Dict, List, Literal, Optional, Union

class Message(BaseModel):
  id: Optional[str] = None # No need to provide for new message
  sender: Optional[str] = None
  receiver: Optional[str] = None
  content: str
  chat: str
  type: Literal['user', 'assistant']
  owner: str
  created: Optional[str] = None

Node = Dict[str, Any]
Edge = Dict[str, Any]
class FlowData(BaseModel):
  nodes: List[Node]
  edges: List[Edge]

class Autoflow(BaseModel):
  id: str
  flow: FlowData
  owner: Optional[str] = None
  created: str
  updated: str

class Parameter(BaseModel):
  id: str
  name: str
  description: str
  type: Literal['boolean', 'string', 'number']
  required: Optional[bool] = False

class Function(BaseModel):
  id: str
  name: str
  description: Optional[str] = None
  parameters: List[Parameter]

from pydantic import BaseModel
from typing import List, Optional

class MessageBase(BaseModel):
    message: str

class MessageCreate(MessageBase):
    pass

class ChatCreate(BaseModel):
    name: str
    from_type: Literal['flow', 'template']
    from_flow: Optional[str] = None
    from_template: Optional[str] = None
    owner: str

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
    owner: str
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
