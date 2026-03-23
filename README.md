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

## Setup Guide

Follow these steps carefully to run this project on your system.

Prerequisites

Before setting up the project, make sure you have the following installed:
- Node.js (recommended: latest LTS version)
- npm (comes with Node.js)
- A code editor like VS Code
- A valid Claude API key
- A valid Weather API key

To check whether Node.js and npm are installed, run:
- node -v
- npm -v




