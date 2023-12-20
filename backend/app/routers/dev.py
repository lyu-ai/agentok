from fastapi import APIRouter, Depends, HTTPException, status

from ..schemas import Flow
from ..utils.codegen import flow2py
from ..dependencies import oauth2_scheme

router = APIRouter()

@router.post('/codegen')
async def api_code_gen(flow: Flow, token: str = Depends(oauth2_scheme)):
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
    )

  code = flow2py(flow)
  return { 'code': code }
