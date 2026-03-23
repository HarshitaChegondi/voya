# Voya - Your Travel AI Companion

Voya is a lightweight **AI-powered travel companion** built with **React + Vite**. It helps users plan trips like a smart travel friend by suggesting **cheap flights, hotel options, packing tips, travel advice, live weather updates, and cost estimation**.

The app connects to **Claude API** for travel planning conversations and uses a **Weather API** for live weather insights. It is designed to be responsive, interactive, and easy to use across devices, which is why the name **Companion** fits perfectly.

## Features
Voya includes the following features:

- **Prompt input + submit button** for travel-related questions
- **AI-powered responses** using **Claude API**
- **Dynamic result rendering** with structured response cards for:
  - Flights
  - Hotels
  - Packing suggestions
  - Travel tips
- **Live weather** integration using Weather API
- **Loading states** with a custom loading experience
- **Error handling** for failed API calls or unexpected issues
- **Chat history** with past prompts and responses
- **Delete functionality**
  - Delete selected chats
  - Delete all chats at once
- **Search modal** for searching previous chats
- **Dark / Light theme**
- **Responsive design** for mobile, tablet, and desktop
- **Cost estimator**

---

## Tech Stack

### Frontend
- **React**
- **Vite**

### APIs
- **Claude API**
- **Weather API**

---

## Objective Coverage

This project covers the required objective points clearly:

Required:
- **Prompt input + submit button**:  Yes, users can enter travel-related prompts and submit them
- **Fetching from AI API**: Yes, the app connects to Claude API to send prompts and receive responses
- **Displaying results dynamically**: Yes, results are displayed dynamically using structured response cards
- **Error handling and loading states**: Yes, the project includes custom loading UI and error handling

Bonus
- Yes, the app stores and displays past chats and prompts
- Include a “Clear” button for the user: Yes, users can delete selected chats or clear all chats

---

## System Requirements

To run this project, make sure your system meets the following requirements:

**Supported Operating Systems:**
- Windows 11
- macOS

## Software Installation

Install the following software before running the project:

| Software | Purpose | Notes |
|----------|---------|-------|
| **Node.js** | Required to run the React + Vite project | Installing **Node.js** also installs **npm** automatically |
| **Git** | Required to clone the project repository from GitHub | Needed for `git clone` command |
| **VS Code** | Recommended code editor for opening and managing the project | Provides an easy editor, built-in terminal, and useful extensions for React and JavaScript development |

**Required Accounts / API Access**
1. A valid Claude API key
2. A valid Weather API key

**Install the following software before running the project.**

1. Install Node.js:
- Install Node.js from the official Node.js website.
- Node.js installation also installs npm automatically.

2. Install Git:
- Install Git from the official Git website.
- Git is required to clone the project repository.

3. Install VS Code
- Install Visual Studio Code from the official VS Code website.

VS Code is recommended because it provides:
- an easy code editor
- built-in terminal
- extensions for React and JavaScript development
- How to Check Installed Versions

---

Here’s your updated section with **PowerShell** command formatting:


## Project Setup Guide for Windows 11

Follow these steps carefully to run the project locally on **Windows 11**.

| Step | What to Do | Command / Action | Expected Result |
|------|-------------|------------------|-----------------|
| **1** | **Install Node.js** | Download and install **Node.js** from the official Node.js website | **Node.js** and **npm** will be installed on your system |
| **2** | **Install Git** | Download and install **Git** from the official Git website | You will be able to use `git clone` in Command Prompt, PowerShell, or VS Code terminal |
| **3** | **Install VS Code** | Download and install **Visual Studio Code** from the official VS Code website | You will have a code editor with a built-in terminal |
| **4** | **Open a terminal** | Open **PowerShell**, **Command Prompt**, or **VS Code Terminal** | You will be ready to run setup commands |
| **5** | **Check Node.js version** | `node -v` | A version number such as `v22.0.0` should appear |
| **6** | **Check npm version** | `npm -v` | A version number such as `10.5.1` should appear |
| **7** | **Check Git version** | `git --version` | A version number such as `git version 2.xx.x` should appear |
| **8** | **Check VS Code command support** | `code --version` | If installed in PATH, VS Code version details will appear |
| **9** | **Clone the repository** | `git clone <your-repository-link>` | The project folder will be downloaded to your system |
| **10** | **Move into the project folder** | `cd voya` | Terminal will point to the `voya` folder |
| **11** | **Open the project in VS Code** | `code .` | The project will open in **VS Code** |
| **12** | **Install project dependencies** | `npm install` | All packages from `package.json` will be installed |
| **13** | **Verify installed top-level packages** | `npm list --depth=0` | You will see installed packages like **react**, **react-dom**, and **vite** |
| **14** | **Create a `.env` file** | In the root folder, create a file named `.env` | The project will be ready for API key configuration |
| **15** | **Add your API keys** | Add the required environment variables inside `.env` | The app will be able to connect to the APIs |
| **16** | **Start the development server** | `npm run dev` | Vite will start a local development server |
| **17** | **Open the app in the browser** | Open the URL shown in the terminal, usually `http://localhost:5173` | The Voya app will run locally in your browser |


## Example Commands for Windows 11

### Check installed versions

```powershell
node -v
npm -v
git --version
code --version



