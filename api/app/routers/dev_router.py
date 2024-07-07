from fastapi import APIRouter, Depends, HTTPException, status

from ..models import Project, Tool
from ..services.dev_service import project2py, tool2py
from ..dependencies import oauth2_scheme

router = APIRouter()

@router.post('/codegen', summary="Generated Python code for a project")
async def api_code_gen(project: Project, token: str = Depends(oauth2_scheme)):
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
    )

  code = project2py(project)
  return { 'code': code }

@router.post('/codegen/tool', summary="Generated tool code in Python based on prompts")
async def api_code_gen_tool(tool: Tool, token: str = Depends(oauth2_scheme)):
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
    )

  generatedFunc = tool2py(tool)
  return generatedFunc
