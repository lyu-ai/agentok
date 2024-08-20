# Prepare Database

We use Supabase as the backend database service. Please follow these steps to initialize a full database structure for this project:

1. Create Supabase project at https://supabase.io
1. Enable PGVector by executing: `CREATE EXTENSION IF NOT EXISTS vector;` in SQL Editor;
1. Copy the whole content of [schema.sql](./sql/schema.sql) and execute;
1. Copy the content of [create_user.sql](./sql/create_user.sql) and execute;
1. Copy the content of [sample_data.sql](./sql/create_user.sql) and execute;
1. Go to Table Editor and verify the tables under schema: public;

If tables such as `api_keys`, `chat_message` etc appear correctly, please go back to [README](../README.md) and follow the instructions to set the environment variables correctly for Supabase, both api and frontend projects depend on Supabase.

## Backup

This is a reference about how to backup the table schema and data of current Supabase project:

Dump the schema to file:

```bash
pg_dump \
  --dbname="postgresql://<project-url>:<pwd>@aws-0-us-west-1.pooler.supabase.com:6543/postgres" \
  --schema=public \
  --data-only \
  --file=schema.sql
```

Dump the table data as INSERT statements:

```bash
pg_dump \
  --data-only \
  --table=public.tools \
  --column-inserts \
  --no-owner \
  --no-privileges \
  --file=tools.sql \
  --no-comments \
  "postgresql://<project-url>:<pwd>@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```
