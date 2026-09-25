# Code Snippet Backend

The core logic and database management layer for the Code Snippet. Built with Node.js, Express, PostgreSQL on AWS, this isolated RESTful service securely processes user authentication, manages encrypted session states, and handles complex SQL relationships for snippet data storage.

![Dashboard Preview](./Docs/code-snippet.gif)


---

### Prerequisites
Make sure you have Node.js and npm installed. You will also need a local PostgreSQL database running, and ensure the frontend is running locally to test client integrations.

## Getting Started

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/saharshbhatnagar/code-snippet-backend.git
    ```

2. Navigate to the project directory:

    ```Bash
    cd code-snippet-backend
    ```

3. Install dependencies:

    ```Bash
    npm install
    ```

4. Create your environment file:
    
    Create a `.env` file in the root directory and configure your database and authentication settings:


    This are variable you need to create `PORT`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_APP_PASSWORD` and `DATABASE_URL`.

>    Note: In a production AWS environment, the DATABASE_URL should point to your `AWS RDS` instance.


5. Initialize the Database schema:

   Create a new PostgreSQL database and set up the following three relational tables to match the application models:

   * **`users`**: Requires columns for `id` (Primary Key), `username`, `email` (Unique), `password`, `reset_token`, `reset_token_expires`, and `created_at`.

   * **`snippets`**: Requires columns for `id` (Primary Key), `title`, `description`, `code`, `category`, `language`, `author`, `is_public`, and `created_at`. Ensure a unique constraint is applied to the combination of `title` and `author`.

   * **`user_favorites`**: Requires columns for `id` (Primary Key), `user_id` (Foreign Key referencing `users`), `snippet_id` (Foreign Key referencing `snippets`), and `created_at`. Ensure cascading deletes are enabled for both foreign keys.
   

6. Start the development server:

    ```Bash
    npm run dev
    ```

7. Docker Deployment

    This backend service is fully containerized. To build and run the isolated Docker image locally:

    ```Bash
    docker build -t code-snippet-backend .
    docker run -d -p 5000:5000 --env-file .env code-snippet-backend
    ```

### Directory Structure

```Plaintext
code-snippet-backend/
├── .github/workflows/
│   └── deploy.yml
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── snippetController.js
│   ├── middleware/
│   │   └── authmiddleware.js
│   ├── models/
│   │   ├── snippetModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── snippetRoutes.js
│   └── server.js
├── .env
├── Dockerfile
└── package.json
```

### CI/CD Pipeline

> This repository includes a `GitHub Actions` workflow (deploy.yml) that automatically builds the Docker image and pushes it to `Amazon Elastic Container Registry (ECR)`.Ensure your `AWS IAM` credentials (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) are stored safely in GitHub Repository Secrets.


## Additional Documentation

### Architecture Details

This service acts as the origin server. It utilizes a centralized db.js configuration to maintain a persistent connection pool with PostgreSQL. Password reset functionality is automated via `Nodemailer`, utilizing secure token generation and validation logic.

**Tech Stack:** Node.js, Express, JavaScript, PostgreSQL, Docker, AWS (ECR, RDS, EC2)


### Full Architecture Stack

This backend service is one component of a complete cloud-native ecosystem. You can explore the frontend microservice here:

Frontend UI: [Code Snippet Frontend](https://github.com/saharshbhatnagar/code-snippet-frontend.git)