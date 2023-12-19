# PocketBase

Build the container:

```bash
docker build -t pocketbase:latest .
```

Run the container:

```bash
docker run -d --name pocketbase -v ./data:/data -p 7676:7676 pocketbase:latest
```
