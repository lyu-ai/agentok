from fastapi import APIRouter, Depends, HTTPException, status

from ..schemas import Autoflow, Function
from ..core.codegen import flow2py, func2py
from ..dependencies import oauth2_scheme

router = APIRouter()

@router.post('/codegen', tags=["Codegen"])
async def api_code_gen(flow: Autoflow, token: str = Depends(oauth2_scheme)):
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
    )

  code = flow2py(flow)
  return { 'code': code }

@router.post('/codegen/function', tags=["Codegen"])
async def api_code_gen_function(func: Function, token: str = Depends(oauth2_scheme)):
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
    )

  generatedFunc = func2py(func)
  return generatedFunc
