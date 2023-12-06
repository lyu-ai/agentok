import json

def transform_functions(functions) -> str:
    new_functions = []
    func_sources = []
    func_map = {}
    for func in functions:
      properties = {param["name"]: {"type": param["type"], "description": param["description"]}
                      for param in func['parameters']}
      print('properties', properties)
      new_functions.append({
        "name": func['name'],
        "description": func['description'],
        "parameters": {
          "type": "object",
          "properties": properties,
        },
      })
      func_sources.append(f"""
def __func_{func['name']}({', '.join([param['name'] for param in func['parameters']])}):
  {func['code']}
""")
      func_map[func['name']] = f"__func_{func['name']}"
    return new_functions, func_map, func_sources

if __name__ == '__main__':
  # Source data structure
  source = {
      "functions": [
          {
              "id": "function-wmy6q599w4f",
              "name": "hello",
              "description": "Print hello world message.",
              "code": "print(f\"hello {message}\")",
              "parameters": [
                  {
                      "id": "param-ylnvvdksr7e",
                      "name": "message",
                      "type": "string",
                      "description": "The message to be printed."
                  }
              ]
          }
      ]
  }

  func_meta, func_map, func_sources = transform_functions(source['functions'])
  print(json.dumps(func_meta, indent=2))
  print(json.dumps(func_map, indent=2))
  print(func_sources)