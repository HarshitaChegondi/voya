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

## Project Setup Guide

Follow these steps carefully to run the project locally.

| Step | Action | Command / Details |
|------|--------|-------------------|
| **1** | **Clone the repository** | ```bash\ngit clone <your-repository-link>\n``` Example: ```bash\ngit clone https://github.com/your-username/voya.git\n``` |
| **2** | **Move into the project folder** | ```bash\ncd voya\n``` |
| **3** | **Open the project in VS Code** | If VS Code is added to PATH, run: ```bash\ncode .\n``` If `code .` does not work, open **VS Code** manually and go to **File → Open Folder → choose the `voya` folder** |
| **4** | **Install dependencies** | ```bash\nnpm install\n``` This installs all dependencies listed in `package.json` |
| **5** | **Verify installed top-level packages** | ```bash\nnpm list --depth=0\n``` You should see packages similar to: `@eslint/js`, `@types/react-dom`, `@types/react`, `@vitejs/plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint`, `globals`, `react-dom`, `react`, `vite` |
| **6** | **Create the `.env` file** | Create a file named `.env` in the **root folder** of the project, where `package.json` and `vite.config.js` are located |

---

## Example Project Structure

```bash
voya/
├── node_modules/
├── public/
├── src/
├── .env
├── package.json
├── vite.config.js


