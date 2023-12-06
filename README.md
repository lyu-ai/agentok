<img src="./frontend/public/logo-full.png" width="320" />

# Flowgen

## What is Flowgen

Flowgen is a visual tool built on [Autogen](https://microsoft.github.io/autogen/) from Microsoft Research.

Comparing to LangChain, Autogen provides a more clear and convenient framework of building multi-agent apps in a visual and rapid way.

Flowgen is designed as a complementary tool to Autogen, engineered to enhance the efficiency of building and maintaining multi-agent applications. Its primary objective is to lower the barrier for developers.

## Quickstart

The easiest way to experiment Flowgen is visit [online](https://flowpen.app). It deploys automatically on [Railway.app](https://railway.app) when there is a new commit to main branch.

## Run on Local

The project contains Frontend (Built with Next.js) and Backend service (Built with Flask in Python), and have been fully dockerized.

The easiest way to run on local is using docker-compose:

```bash
docker-compose up -d
```

You can also build and run the frontend and backend services separately with docker:

```bash
docker build -t flowgen-svc ./backend
docker run -d -p 5004:5004 flowgen-svc

docker build -t flowgen-ui ./frontend
docker run -d -p 2855:2855 flowgen-ui
```

(The default port number 2855 is the address of our first office.)

When deploying online or run on local, please pay attention to these environment variables：`PORT`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Both of the frontend and backend services depend on Supabase for data persistence.

You can get the Supabase URL and Anon Key from [Supabase](https://supabase.io/). The default port is 2855. You can also download and deploy your own Supabase instance, which is out of the scope of this document.

## Run on Local (Without Docker)

If you want to participate in the development of this project, or run from source code, you can run the frontend and backend services separately:

### Frontend

```bash
pnpm i
pnpm dev
```

Then access it on http://localhost:2855.

All in all, the frontend is a simple Next.js project, so you can of course also use `npm` or `yarn` as you like.

### Backend

The backend is based on Flask framework, so you can run it with Python:

```bash
pip install -r requirements.txt
python3 -m api.index
```

Then access it on http://localhost:5004 with API tools like Postman. (Here I should provide a Swagger API doc, maybe later.)

## Deployment

So far, Railway.app should be the best way to deploy Flowgen. You can deploy it with one click:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/NCoZBC?referralCode=5I-BUc)

Also, please take care of the Supabase related environment variables mentioned above.

## Contributing

We welcome all contributions. Please read our [Contributing Guide](./CONTRIBUTING.md) first.

## License

The project is licensed under [Apache 2.0 with additional terms and conditions](./LICENSE.md).