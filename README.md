# DevConnector: A Social Network for Developers

## Description

**DevConnector** is a full-stack social networking application built for developers. 👨‍💻 It allows users to create profiles, showcase their experience and education, and connect with other developers. Users can create posts, comment on them, and like them, fostering a collaborative community. The application is built using the **MERN** stack (MongoDB, Express.js, React, Node.js) and features a RESTful API on the back end and a responsive, component-based user interface on the front end.



***

## Key Features

* ✅ **User Authentication**: Secure user registration and login functionality using JSON Web Tokens (JWT).
* 👤 **Developer Profiles**: Create and manage personal developer profiles with a bio, social media links, and professional experience.
* 🎓 **Experience & Education**: Add and display career experience and educational background on user profiles.
* 🌐 **Social Feed**: A central feed where users can create, view, like, and comment on posts.
* 🐙 **GitHub Integration**: Automatically fetch and display a user's latest public GitHub repositories on their profile.

***

## Prerequisites

Before you begin, ensure you have the following software installed on your machine:

* **Node.js and npm**: [Download Node.js](https://nodejs.org/en/download/) (npm comes bundled with it).
* **Git**: [Download Git](https://git-scm.com/downloads).
* **MongoDB Atlas Account**: You will need a cloud-hosted MongoDB database. You can get one for free from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).

***

## Setup Instructions (From Scratch)

Follow these steps carefully to get the required credentials and database connection string.

### 1. Set Up MongoDB Atlas Database ☁️

1.  **Create a Free Cluster**: After registering on MongoDB Atlas, create a new project and build a database. Choose the **M0 (Free)** cluster tier on your preferred cloud provider.
2.  **Create a Database User**: In your cluster dashboard, go to **Database Access** under the "Security" tab. Click **Add New Database User**, enter a username and password, and grant the user **Read and write to any database** privileges. **Save this username and password**.
3.  **Whitelist Your IP Address**: Go to **Network Access**. Click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`). This allows your application to connect to the database.
4.  **Get Your Connection String**: Go back to your **Databases** view, click the **Connect** button for your cluster, select **Connect your application**, and copy the connection string. It will look like this:
    `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

### 2. Set Up GitHub Personal Access Token 🔑

To allow the application to fetch your public repositories from the GitHub API, you'll need a Personal Access Token (PAT).

1.  **Navigate to GitHub Settings**: Log in to your GitHub account, go to **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
2.  **Generate a New Token**:
    * Click **Generate new token** and then **Generate new token (classic)**.
    * **Note**: Give your token a descriptive name, like `DevConnector App`.
    * **Expiration**: Set an expiration date for your token (e.g., 90 days).
    * **Select scopes**: Check the **`public_repo`** scope. This is the only permission needed for the app to read your public repositories.
3.  **Copy Your Token**:
    * Click **Generate token**.
    * **Important**: Copy your new token immediately and save it somewhere secure. **You will not be able to see it again after you leave this page.**

***

## Configuration

Now, you will use the credentials you just generated to configure the application.

1.  **Create the Config File**: In the root of the project folder, navigate into the `config/` directory. Create a new file named `default.json`.
2.  **Add Your Credentials**: Paste the following JSON structure into `default.json` and fill in the values you obtained from the steps above.

```json
{
  "mongoURI": "YOUR_MONGODB_CONNECTION_STRING",
  "jwtSecret": "a_secret_key_of_your_choice",
  "githubToken": "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"
}
```
* Replace `"YOUR_MONGODB_CONNECTION_STRING"` with the URI from MongoDB Atlas. **Remember to insert your database user's username and password** into the string.
* The `jwtSecret` can be any string of your choice.
* Paste your **Personal Access Token** you just generated from GitHub.

***

## Installation & Running the App

With the setup and configuration complete, you can now install and run the application.

1.  **Clone the Repository**
    Open your terminal and clone the repository:
    ```bash
    git clone [https://github.com/wnossair/dev-connector.git](https://github.com/wnossair/dev-connector.git)
    cd dev-connector
    ```

2.  **Install Server Dependencies**
    In the root project directory, run:
    ```bash
    npm install
    ```

3.  **Install Client Dependencies**
    Navigate to the `client` directory and install its dependencies:
    ```bash
    cd client
    npm install
    ```

4.  **Run the Application**
    Go back to the root project directory (`cd ..`) and run the `dev` script, which concurrently starts both the back-end and front-end:
    ```bash
    npm run dev
    ```
    The application is now running! 🚀
    * Front-end client: `http://localhost:5173`
    * Back-end server API: `http://localhost:5000`
