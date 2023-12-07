## pengen - Penless + AutoGen

## 运行

```bash
python3 -m api.index
```

## 部署

部署到 Railway 等环境时，记得设置三个环境变量：`PORT`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

目前项目部署在 [Railway](https://railway.app) 上，可以通过 [https://pengen.railway.app](https://pengen.railway.app) 访问.

## 测试生成的代码

```bash
setopt NO_BANG_HIST

python3 ./generated/sample1.py "What's the breed of this dog? ![img](https://th.bing.com/th/id/R.422068ce8af4e15b0634fe2540adea7a?rik=y4OcXBE%2fqutDOw&pid=ImgRaw&r=0)"
```

