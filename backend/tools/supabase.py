import os
import time
from dotenv import load_dotenv
load_dotenv()  # This will load all environment variables from .env

from supabase import create_client, Client

from tools.id import gen_id

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(url, key)

def add_message(message, max_retries=3, delay=1):
    attempt = 0
    while attempt < max_retries:
        try:
            response = supabase.table('messages').insert({
                "from": message.get('from', ''), 
                'to': message.get('to', ''), 
                "type": message.get('type', ''),
                "session": message.get('session', ''),
                'content': message.get('content', ''),
            }).execute()
            print('response', response)
            data = response.data if hasattr(response, "data") else None
            error = response.error if hasattr(response, "error") else None

            if error:  # Assuming a successful insert will have a count > 0
                raise ValueError(f"Failed to insert message: {error}")

            if not data:
                raise ValueError("No rows inserted; potential write failure.")

            return data

        except Exception as e:
            print(f"Attempt {attempt + 1} failed with error: {e}")
            time.sleep(delay)
            attempt += 1  # Increment and try again after a short delay

    # If the loop completes without returning, all retries have failed
    raise Exception("All attempts to add message have failed.")

def upsert_flow(flow, max_retries=3, delay=1):
    attempt = 0
    while attempt < max_retries:
        try:
            records = supabase.table('flows').select('id').eq('name', flow.get('id')).execute()
            if len(records.data) > 0:
              response = supabase.table('flows').update({
                  "id": records.data[0].get('id'),
                  "name": flow.get('id', gen_id()), 
                  'flow': flow.get('flow', ''), 
              }).eq('id', records.data[0].get('id')).execute()
            else:
              response = supabase.table('flows').insert({
                  "name": flow.get('id', gen_id()), 
                  'flow': flow.get('flow', ''), 
              }).execute()
            print('response', response)
            data = response.data if hasattr(response, "data") else None
            error = response.error if hasattr(response, "error") else None

            if error:  # Assuming a successful insert will have a count > 0
                raise ValueError(f"Failed to insert flow: {error}")

            if not data:
                raise ValueError("No rows inserted; potential write failure.")

            return data

        except Exception as e:
            print(f"Attempt {attempt + 1} failed with error: {e}")
            time.sleep(delay)
            attempt += 1  # Increment and try again after a short delay

    # If the loop completes without returning, all retries have failed
    raise Exception("All attempts to add flow have failed.")

def get_flows(max_retries=3, delay=1):
  attempt = 0
  while attempt < max_retries:
    try:
        records = supabase.table('flows').select('*').neq('name', '').execute()
        print('get_flows', len(records.data))
        transformed_data = [{"id": record["name"], "flow": record.get("flow", {})} for record in records.data]
        return transformed_data

    except Exception as e:
        print(f"Failed to get flows: {e}")
        time.sleep(delay)
        attempt += 1  # Increment and try again after a short delay
  # If the loop completes without returning, all retries have failed
  raise Exception("All attempts to get flows have failed.")

def get_flow(id, max_retries=3, delay=1):
  attempt = 0
  while attempt < max_retries:
    try:
        records = supabase.table('flows').select('*').eq('name', id).execute()
        if len(records.data) > 0:
          return {"id": records.data[0]["name"], "flow": records.data[0].get("flow", {})}
        else:
          return None

    except Exception as e:
        print(f"Failed to get flow: {e}")
        time.sleep(delay)
        attempt += 1  # Increment and try again after a short delay
  # If the loop completes without returning, all retries have failed
  raise Exception("All attempts to get flow have failed.")

def delete_flow(id, max_retries=3, delay=1):
  attempt = 0
  while attempt < max_retries:
    try:
        records = supabase.table('flows').delete().eq('name', id).execute()
        print('delete_flow', records.data)
        return records.data

    except Exception as e:
        print(f"Failed to delete flows: {e}")
        time.sleep(delay)
        attempt += 1  # Increment and try again after a short delay
  # If the loop completes without returning, all retries have failed
  raise Exception("All attempts to delete flow have failed.")
