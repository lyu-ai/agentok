
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

class Chat(BaseModel):
  id: str
  from_type: Literal['flow', 'template']
  from_flow: str
  from_template: str
  owner: str

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
