## Flowgen - Flow + Autogen

## Run

### Backend Service

```bash
python3 -m api.index
```

### Frontend

```bash
pnpm i
pnpm dev
```

## Deployment

When deploying to Railway.app, need to set these environment variables：`PORT`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Code Generation Test 

```bash
setopt NO_BANG_HIST

python3 ./generated/sample1.py "What's the breed of this dog? ![img](https://th.bing.com/th/id/R.422068ce8af4e15b0634fe2540adea7a?rik=y4OcXBE%2fqutDOw&pid=ImgRaw&r=0)"
```

