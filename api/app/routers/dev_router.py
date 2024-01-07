from fastapi import APIRouter, Depends, HTTPException, status

from ..models import Autoflow, Function
from ..services.dev_service import flow2py, func2py
from ..dependencies import oauth2_scheme

router = APIRouter()

@router.post('/codegen', summary="Generated Python code from a flow")
async def api_code_gen(flow: Autoflow, token: str = Depends(oauth2_scheme)):
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
    )

  code = flow2py(flow)
  return { 'code': code }

@router.post('/codegen/function', summary="Generated Python function based on prompts")
async def api_code_gen_function(func: Function, token: str = Depends(oauth2_scheme)):
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
    )

  generatedFunc = func2py(func)
  return generatedFunc
