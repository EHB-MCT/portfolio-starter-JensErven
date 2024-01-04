# DEV-5 Portfolio

## Table of contents
- [DEV-5 Portfolio](#dev-5-portfolio)
  - [Table of contents](#table-of-contents)
  - [Task description](#task-description)
  - [Startup Backend](#startup-backend)
    - [Development Environment Setup](#development-environment-setup)
      - [About](#about)
      - [Prerequisites](#prerequisites)
      - [Steps](#steps)

## Task description

This assignment serves to evaluate your quality as a developer. The conventions you follow,
practices you employ or techniques you use are more important than the content of your
application. The API you will write during this semester is allowed to have any subject you
can think of*, as long as the documentation, conventions, tests, CI/CD and git match the
desired standard. 

## Startup Backend

### Development Environment Setup

#### About

This setup guide helps configure the development environment for the backend application using Docker and environment-specific configuration files. Verify each step to ensure a smooth setup and operational backend environment for development purposes.

#### Prerequisites

- Ensure Docker and Docker Compose are installed on your system.
- Have access to the backend application codebase.

#### Steps

1. **Docker and Backend Folder Setup**
   - Check if Docker and Docker Compose are installed on your system.
   - Open Docker Hub to confirm your Docker setup is operational.
   - Navigate to the root folder of the backend application.

2. **Configuring Database Credentials**
   - Create a `config` folder within the backend root directory.
   - Inside the `config` folder, add an `.env.dev` file.
   - Populate the `.env.dev` file with credentials required for connecting to the PostgreSQL database as shown in the following example.
     ```
        POSTGRES_USER=your_username
        POSTGRES_DB=your_database_name
        POSTGRES_PASSWORD=your_password
        POSTGRES_PORT=5432
        POSTGRES_HOST=postgres
     ```

3. **Launching Development Environment**
   - In the terminal, navigate to the backend directory using `cd ./backend`.
   - Execute `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build` to start the development environment.

4. **Verifying Setup**
   - Check if the containers (PostgreSQL and API) are running using the `docker ps` command.
   - Use a tool like TablePlus to connect to the hosted PostgreSQL database container.
   - Ensure the database contains the expected tables (`recipes` and `users`).
   - Test an API endpoint (e.g., liking) using Postman or any other REST client extension.

