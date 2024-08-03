from ..models import Tool
from .supabase import SupabaseClient

class ToolService:
    def __init__(self,  supabase: SupabaseClient):
        self.supabase = supabase

    def get_all_tools(self):
        return self.tool_repository.get_all_tools()

    def get_tool_by_id(self, tool_id: int):
        return self.tool_repository.get_tool_by_id(tool_id)

    def create_tool(self, tool: Tool):
        return self.tool_repository.create_tool(tool)

    def update_tool(self, tool: Tool):
        return self.tool_repository.update_tool(tool)

    def delete_tool(self, tool_id: int):
        return self.tool_repository.delete_tool(tool_id)