<img src="./ui/public/logo.png" width="90" />

# Agentok Studio

**AutoGen Visualized - Build Multi-Agent Apps with Drag-and-Drop Simplicity.**

[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/hughlv/agentok)
[![Open in GitHub Codespaces](https://img.shields.io/badge/Codespaces-Open-blue?style=flat&logo=github)](https://codespaces.new/hughlv/agentok)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![GitHub release](https://img.shields.io/github/v/release/hughlv/agentok)
[![GitHub star](https://img.shields.io/github/stars/hughlv/agentok?style=social)](https://star-history.com/#tiwater/agentok)
[![](https://dcbadge.limes.pink/api/server/xBQxwRSWfm?style=social&timestamp=20240705)](https://discord.gg/xBQxwRSWfm)

## 🌟 What is Agentok Studio

Agentok Studio is a tool built upon [AutoGen](https://microsoft.github.io/autogen/), a powerful agent framework from Microsoft and [a vibrant community of contributors](https://github.com/microsoft/autogen?tab=readme-ov-file#contributors-wall).

We consider AutoGen to be at the forefront of next-generation Multi-Agent Applications technology. Agentok Studio takes this concept to the next level by offering intuitive visual tools that streamline the creation and management of complex agent-based workflows. This simplifies the entire process for creators and developers.

![studio-1](./website/static/img/screenshot-studio-1.png)

We strive to create a user-friendly tool that generates native Python code with minimal dependencies. Simply put, Agentok Studio is a diagram-based code generator for autogen. The generated code is self-contained and can be executed anywhere as a normal Python program, relying solely on the official `pyautogen` library.

![codegen-1](./website/static/img/screenshot-codegen-1.png)

Contributions (Issues, Pull Requests, Documentation, even Typo-corrections) to this project are welcome! All contributors will be added to the Contribution Wall.

## 💡 Quickstart

To quickly explore the features of Agentok Studio, visit [https://studio.agentok.ai](https://studio.agentok.ai). While we offer an online deployment of this project, please note that it is not intended for production use. The service level agreement is not guaranteed, and stored data may be wiped due to breaking changes.

After login as Guest or with your OAuth2 account, you can click the **Create New Project** button to create a new project. The new project comes with a sample workflow. You can click the robot icon flashing on the right bottom to start the conversation.

![studio-2](./website/static/img/screenshot-studio-2.png)

Due to the limitations of GPT-4 and AutoGen, this simple workflow may not work as expected, but it's a good starting point to understand the basic concepts of Agentic App and Agentok Studio.

For a more in-depth look at the project, please refer to [Getting Started](https://agentok.ai/getting-started).

## Migration of Official Notebooks

We made tutorials based on the official notebooks from Autogen repository. You can refer to the original notebook [here](https://github.com/microsoft/autogen/blob/main/notebook/).

🔲 Planned/Working
✅ Completed
🆘 With Issues
⭕ Out of Scope

> [!WARNING]
>
> Due to data format incompatibility, the current results have been wiped and need to be re-migrated.

| Example                                 | Status | Comments                                                                                                                                                             |
| --------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| simple_chat                             | ✅     | [Simple Chat](https://studio.agentok.ai/marketplace/yp0appx814q7na1)                                                                                                 |
| auto_feedback_from_code_execution       | ✅     | [Feedback from Code Execution](https://studio.agentok.ai/flows/)                                                                                                     |
| ~~auto_build~~                          | ⭕     | This is a feature to be considered to add to flow generation. [#40](https://github.com/hughlv/agentok/issues/40)                                                     |
| chess                                   | 🔲     | This depends on the feature of importing custom Agent [#38](https://github.com/hughlv/agentok/issues/38)                                                             |
| compression                             | ✅     |                                                                                                                                                                      |
| dalle_and_gpt4v                         | ✅     | Supported with app.extensions                                                                                                                                        |
| function_call_async                     | ✅     |                                                                                                                                                                      |
| function_call                           | ✅     |                                                                                                                                                                      |
| graph_modelling_language                | ⭕     | This is out of project scope. Open an issue if necessary                                                                                                             |
| group_chat_RAG                          | 🆘     | This notebook does not work                                                                                                                                          |
| groupchat_research                      | ✅     |                                                                                                                                                                      |
| groupchat_vis                           | ✅     |                                                                                                                                                                      |
| groupchat                               | ✅     |                                                                                                                                                                      |
| hierarchy_flow_using_select_speaker     | 🔲     |                                                                                                                                                                      |
| human_feedback                          | ✅     | [Human in the Loop](https://studio.agentok.ai/templates/4pbokrvi7zguv48)                                                                                             |
| inception_function                      | 🔲     |                                                                                                                                                                      |
| ~~langchain~~                           | ⭕     | No plan to support                                                                                                                                                   |
| lmm_gpt-4v                              | ✅     |                                                                                                                                                                      |
| lmm_llava                               | ✅     | Depends on Replicate                                                                                                                                                 |
| MathChat                                | ✅     | [Math Chat](https://studio.agentok.ai/templates/m337e85xr95omtv)                                                                                                     |
| oai_assistant_function_call             | ✅     |                                                                                                                                                                      |
| oai_assistant_groupchat                 | 🆘     | Very slow and not work well, sometimes not returning.                                                                                                                |
| oai_assistant_retrieval                 | ✅     | [Retrieval (OAI)](https://studio.agentok.ai/templates/tgq6dxu32yzwcgg)                                                                                               |
| oai_assistant_twoagents_basic           | ✅     |                                                                                                                                                                      |
| oai_code_interpreter                    | ✅     |                                                                                                                                                                      |
| planning                                | ✅     | This sample works fine, but does not exit gracefully.                                                                                                                |
| qdrant_RetrieveChat                     | 🔲     |                                                                                                                                                                      |
| RetrieveChat                            | 🔲     |                                                                                                                                                                      |
| stream                                  | 🔲     |                                                                                                                                                                      |
| teachability                            | 🔲     |                                                                                                                                                                      |
| teaching                                | 🔲     |                                                                                                                                                                      |
| two_users                               | ✅     | The response will be very long and should set a large max_tokens.                                                                                                    |
| video_transcript_translate_with_whisper | ✅     | Depends on ffmpeg lib, should `brew install ffmpeg` and export IMAGEIO_FFMPEG_EXE. Since ffmpeg occupies too much space, the online version has removed the support. |
| web_info                                | ✅     |                                                                                                                                                                      |
| cq_math                                 | ⭕     | This example is quite irrelevant to autogen, why not just use OpenAI API?                                                                                            |
| Async_human_input                       | ⭕     | Need scenario.                                                                                                                                                       |
| oai_chatgpt_gpt4                        | ⭕     | Fine-tuning, out of project scope                                                                                                                                    |
| oai_completion                          | ⭕     | Fine-tuning, out of project scope                                                                                                                                    |

## 🐳 Run on Local (with Docker)

The project contains Frontend (Built with Next.js) and Backend service (Built with Flask in Python), and have been fully dockerized.

The easiest way to run on local is using docker-compose:

```bash
cp ui/.env.example ui/.env
rm ui/.env.production
docker-compose up -d
```

You can also build and run the ui and service separately with docker:

```bash
docker build -t agentok-api ./api
docker run -d -p 5004:5004 agentok-api

docker build -t agentok-ui ./ui
docker run -d -p 2855:2855 agentok-ui

```

(The default port number 2855 is the address of our first office.)

## 🚀 Deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/templates/NCoZBC?referralCode=5I-BUc)

Railway.app supports the deployment of applications in Dockers. By clicking the "Deploy on Railway" button, you'll streamline the setup and deployment of your application on Railway platform:

1. Click the "Deploy on Railway" button to start the process on Railway.app.
2. Log in to Railway and set the following environment variables:
   - `PORT`: Please set for each services as `2855`, `5004`, `7676` respectively.
3. Confirm the settings and deploy.
4. After deployment, visit the provided URL to access your deployed application.

## 🛠️ Run on Local (Without Docker)

If you're interested in contributing to the development of this project or wish to run it from the source code, you have the option to run the ui and service independently. Here's how you can do that:

1. **UI (Frontend)**

   - Navigate to the ui directory `cd ui`.
   - Rename `.env.sample` to `.env.local` and set the value of variables correctly.
   - Install the necessary dependencies using the appropriate package manager command (e.g., `pnpm install` or `yarn`).
   - Run the ui service using the start-up script provided (e.g., `pnpm dev` or `yarn dev`).

2. **API (Backend Services)**

   - Switch to the api service directory `cd api`.
   - Rename `.env.sample` to `.env`, `OAI_CONFIG_LIST.sample` to `OAI_CONFIG_LIST`, and set the value of variables correctly.
   - Create virtual environment: `python3 -m venv venv`.
   - Activate virtual environment: `source venv/bin/activate`.
   - Install all required dependencies: `pip install -r requirements.txt`.
   - Launch the api service using command `uvicorn app.main:app --reload --port 5004`.

`REPLICATE_API_TOKEN` is needed for LLaVa agent. If you need to use this agent, make sure to include this token in environment variables, such as the Environment Variables on Railway.app.

**IMPORTANT**: For security reasons, the latest version of autogen requires Docker for code execution. So you need to install Docker on your local machine beforehand, or add `AUTOGEN_USE_DOCKER=False` to file `/api/.env`.

3. **Supabase:**

This project relies on Supabase for user authentication and data storage. You need to create a Supabase project on https://supabase.com/ and set the environment variables in the `.env` file. You can of course deploy your own Supabase instance, which is out of the scope of this document.

Once you've started both the ui and api services by following the steps previously outlined, you can access the application by opening your web browser and navigating to:

- ui: http://localhost:2855
- api: http://localhost:5004 (OpenAPI docs served at http://localhost:5004/redoc)

If your services are started successfully and running on the expected ports, you should see the user interface or receive responses from the api services via this URL.

## 👨‍💻 Contributing

[![](https://dcbadge.limes.pink/api/server/xBQxwRSWfm?timestamp=20240705)](https://discord.gg/xBQxwRSWfm)

Contributions are welcome! It's not limited to code, but also includes documentation and other aspects of the project. You can open a [GitHub Issue](https://github.com/hughlv/agentok/issues/new) or leave comments on our [Discord Server](https://discord.gg/xBQxwRSWfm).

This project welcomes contributions and suggestions. Please read our [Contributing Guide](./CONTRIBUTING.md) first.

If you are new to GitHub, [here](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/) is a detailed help source on getting involved with development on GitHub.

Please consider contributing to [AutoGen](https://github.com/microsoft/autogen), as Agentok Studio relies on a robust foundation to deliver its capabilities. Your contributions can help enhance the platform's core functionalities, ensuring a more seamless and efficient development experience for Multi-Agent Applications.

This project uses [📦🚀semantic-release](https://github.com/semantic-release/semantic-release) to manage versioning and releases. To avoid too frequent auto-releases, we make it a manual GitHub Action to trigger the release.

To follow the Semantic Release process, we enforced commit-lint convention on commit messages. Please refer to [Commitlint](https://commitlint.js.org/#/) for more details.

## Contributors Wall

<a href="https://github.com/hughlv/agentok/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=hughlv/agentok" />
</a>

## 📝 License

The project is licensed under [Apache 2.0 with additional terms and conditions](./LICENSE.md).
