from fastapi import APIRouter, Depends

from ..models import Project, Tool, ToolCode
from ..services import CodegenService
from ..dependencies import get_codegen_service

router = APIRouter()


@router.post("", summary="Generated Python code for a project")
async def api_code_gen(
    project: Project, service: CodegenService = Depends(get_codegen_service)
):
    code = service.generate_project(project)
    return {"code": code}


@router.post("/tool", summary="Generated tool code in Python based on prompts")
async def api_code_gen_tool(
    tool: Tool, service: CodegenService = Depends(get_codegen_service)
):
    generatedFunc = service.generate_tool(tool)
    return generatedFunc


@router.post("/extract", summary="Extract meta data of the tool code")
async def api_code_gen_extract_meta(
    tool: ToolCode, service: CodegenService = Depends(get_codegen_service)
):
    meta = service.extract_tool_meta(tool.code)
    return meta
