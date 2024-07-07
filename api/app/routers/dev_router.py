from fastapi import APIRouter, Depends, HTTPException, status

from ..models import Project, Skill
from ..services.dev_service import project2py, skill2py
from ..dependencies import oauth2_scheme

router = APIRouter()

@router.post('/codegen', summary="Generated Python code from a project")
async def api_code_gen(project: Project, token: str = Depends(oauth2_scheme)):
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
    )

  code = project2py(project)
  return { 'code': code }

@router.post('/codegen/skill', summary="Generated Python function based on prompts")
async def api_code_gen_skill(skill: Skill, token: str = Depends(oauth2_scheme)):
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
    )

  generatedFunc = skill2py(skill)
  return generatedFunc
