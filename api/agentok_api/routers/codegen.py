import logging
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any

from ..models import Project, Tool, ToolCode
from ..services import CodegenService
from ..dependencies import get_codegen_service

router = APIRouter()

logger = logging.getLogger(__name__)

@router.post("", summary="Generated Python code for a project")
async def api_code_gen(
    project: Project, service: CodegenService = Depends(get_codegen_service)
) -> Dict[str, Any]:
    try:
        code = service.generate_project(project)
        return {"code": code}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Invalid Project Data",
                "details": str(e)
            }
        )
    except Exception as e:
        logger.exception("Code generation failed")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Code Generation Failed",
                "details": str(e),
                "type": type(e).__name__
            }
        )


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
