from fastapi import APIRouter, Depends, HTTPException, status

from ..models import Project, Tool
from ..services import CodegenService
from ..dependencies import get_codegen_service

router = APIRouter()

@router.post('', summary="Generated Python code for a project")
async def api_code_gen(project: Project, service: CodegenService = Depends(get_codegen_service)):
  code = service.project2py(project)
  return { 'code': code }

@router.post('/tool', summary="Generated tool code in Python based on prompts")
async def api_code_gen_tool(tool: Tool, service: CodegenService = Depends(get_codegen_service)):
  generatedFunc = service.tool2py(tool)
  return generatedFunc
