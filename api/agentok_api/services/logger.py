import sys
import logging
from typing import Optional
from contextlib import contextmanager
from io import StringIO
from .supabase import create_supabase_client, Client

class SupabaseLogHandler(logging.Handler):
    def __init__(self, supabase: Client, chat_id: int):
        super().__init__()
        self.supabase = supabase
        self.chat_id = chat_id
        
    def emit(self, record: logging.LogRecord):
        try:
            log_entry = {
                "chat_id": self.chat_id,
                "level": record.levelname.lower(),
                "message": self.format(record),
                "metadata": {
                    "filename": record.filename,
                    "lineno": record.lineno,
                    "funcName": record.funcName
                }
            }
            self.supabase.table("chat_logs").insert(log_entry).execute()
        except Exception as e:
            print(f"Failed to write to Supabase: {e}", file=sys.__stderr__)

class StreamToLogger:
    def __init__(self, supabase: Client, chat_id: int, level: str):
        self.supabase = supabase
        self.chat_id = chat_id
        self.level = level
        self.buffer = StringIO()

    def write(self, buf):
        for line in buf.rstrip().splitlines():
            log_entry = {
                "chat_id": self.chat_id,
                "level": self.level,
                "message": line
            }
            self.supabase.table("chat_logs").insert(log_entry).execute()
            
    def flush(self):
        pass

@contextmanager
def capture_output(chat_id: int):
    """Captures stdout and stderr, sending them to Supabase logs table."""
    supabase = create_supabase_client()
    
    # Redirect stdout and stderr to our custom handlers
    stdout_logger = StreamToLogger(supabase, chat_id, "stdout")
    stderr_logger = StreamToLogger(supabase, chat_id, "stderr")
    
    old_stdout, old_stderr = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = stdout_logger, stderr_logger
    
    try:
        yield
    finally:
        sys.stdout, sys.stderr = old_stdout, old_stderr 