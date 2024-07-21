from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ..services.extension_service import ExtensionService
from ..dependencies import get_extension_service
from ..models import AgentMetadata

router = APIRouter()

@router.get('/agent',
            status_code=status.HTTP_200_OK,
            response_model=List[AgentMetadata],
            responses={
                status.HTTP_200_OK: {
                    "description": "Successfully retrieved the list of extensions.",
                    "content": {
                        "application/json": {
                            "example": {
                                "extensions": [
                                    {
                                        "id": "dalle_agent",
                                        "name": "DALLEAgent",
                                        "description": "An agent that uses OpenAI's DALL-E model to generate images.",
                                        "type": "custom_conversable",
                                        "label": "DALLE",
                                        "class": "DALLEAgent"
                                    },
                                ]
                            }
                        }
                    },
                },
                status.HTTP_500_INTERNAL_SERVER_ERROR: {
                    "description": "Internal server error",
                },
            },
            summary="Retrieve extended agents",  # Short summary for the operation
            description="""Fetch the list of extended agents currently loaded by the service, usually subclass of ConversableAgent.""",
            )
async def api_get_agents(service: ExtensionService = Depends(get_extension_service)):
    return service.load_extensions()