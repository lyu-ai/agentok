# Backend for FlowGen

## Note

Please pay attention to how this service is launched:

When executing `python3 -m api.index`, the following code in `api/index.py` is executed:

```bash
if __name__ == '__main__':
    # This disables the Flask reloader so updating ./data and ./generated will not restart the server
    # The side effect is that we need to manually restart the server when we update the code
    app.run(debug=True, use_reloader=False, host='localhost', port=5004)
```

> [!WARNING]
> Because Flask lacks an elegant way to exclude certain directories from the reloader, if we don't want the work_dir interrupt the execution, we have to disable the reloader entirely. This means that the server will not restart when you update the code. You will have to manually restart the server when you update the code.
