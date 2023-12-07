<img src="./frontend/public/logo-full.png" width="320" />

# FlowGen - AutoGen Visualized

[![Railway](https://img.shields.io/badge/Railway-FlowGen-blue.svg)](https://railway.app/project/ce1fca93-8fa5-4537-b647-20e1636102c3)
[![GitHub star chart](https://img.shields.io/github/stars/tiwater/flowgen?style=social)](https://star-history.com/#tiwater/flowgen)
[![GitHub fork](https://img.shields.io/github/forks/tiwater/flowgen?style=social)](https://github.com/tiwater/flowgen/fork)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## 🤖 What is FlowGen

FlowGen is a tool built for [AutoGen](https://microsoft.github.io/autogen/), a great agent framework from Microsoft Research.

AutoGen streamlines the process of creating multi-agent applications with its clear and user-friendly approach. FlowGen takes this accessibility a step further by offering visual tools that simplify the building and management of agent workflows with AutoGen.

## 💡 Quickstart

To quickly explore what FlowGen has to offer, simply visit it [online](https://flowgen.app). Each new commit to the main branch triggers an automatic deployment on [Railway.app](https://railway.app), ensuring you experience the latest version of the service.

## 🐳 Run on Local (with Docker)

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

When deploying online or running locally, ensure you configure the following environment variables: `PORT`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Both the frontend and backend services rely on Supabase for data storage and require these variables to be set for proper operation.

To obtain the necessary Supabase URL and Anon Key, visit [Supabase Dashboard](https://supabase.com/dashboard/projects). By default, the service runs on port 2855. While you have the option to download and set up your own instance of Supabase, detailed guidance for such a deployment falls beyond the scope of this document.

## 🚀 Deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/NCoZBC?referralCode=5I-BUc)

Railway.app supports the deployment of applications in Dockers. By clicking the "Deploy on Railway" button, you'll streamline the setup and deployment of your application on Railway platform:

1. Click the "Deploy on Railway" button to start the process on Railway.app.
2. Log in to Railway and set the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key.
3. Confirm the settings and deploy.
4. After deployment, visit the provided URL to access your deployed application.

## 🛠️ Run on Local (Without Docker)

If you're interested in contributing to the development of this project or wish to run it from the source code, you have the option to run the frontend and backend services independently. Here's how you can do that: 

1. **Frontend Service:**
   - Navigate to the frontend service directory.
   - Install the necessary dependencies using the appropriate package manager command (e.g., `pnpm install` or `yarn`).
   - Before starting the service, make sure the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables are set accordingly in file `.env.development`.
   - Run the frontend service using the start-up script provided (e.g., `pnpm dev` or `yarn dev`).

2. **Backend Service:**
   - Switch to the backend service directory.
   - Install all required dependencies: `pip install -r requirements.txt`.
   - Confirm that the environment variables for Supabase (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are correctly set in `.env` as well.
   - Launch the backend service using command `python3 -m api.index`.

Once you've started both the frontend and backend services by following the steps previously outlined, you can access the application by opening your web browser and navigating to:

* Frontend: http://localhost:2855
* Backend: http://localhost:5004 (Here I should provide a Swagger API doc, maybe later.)

If your services are started successfully and running on the expected ports, you should see the user interface or receive responses from the backend via this URL.

## 👨‍💻 Contributing

This project welcomes contributions and suggestions. Please read our [Contributing Guide](./CONTRIBUTING.md) first.

If you are new to GitHub [here](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/) is a detailed help source on getting involved with development on GitHub.

## Contributors Wall
<a href="https://github.com/tiwater/flowgen/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=tiwater/flowgen" />
</a>

## 📝 License

The project is licensed under [Apache 2.0 with additional terms and conditions](./LICENSE.md).