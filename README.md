# DEV-5 RecipeSaver

Dev-5 course-project task,

## Table of contents
- [DEV-5 RecipeSaver](#dev-5-recipesaver)
  - [Table of contents](#table-of-contents)
  - [Purpose](#purpose)
    - [Key Features](#key-features)
  - [Quikstart Backend](#quikstart-backend)
    - [Development Environment Quikstart](#development-environment-quikstart)
      - [About](#about)
      - [Prerequisites](#prerequisites)
      - [Steps](#steps)
  - [Status](#status)
  - [License](#license)
  - [Endpoints](#endpoints)
    - [User Authentication](#user-authentication)
      - [Register User](#register-user)
      - [Login User](#login-user)
      - [Get User by ID](#get-user-by-id)
      - [Delete User](#delete-user)
      - [Delete All Users](#delete-all-users)
    - [Recipes](#recipes)
      - [Get All Recipes](#get-all-recipes)
      - [Get Recipe by ID](#get-recipe-by-id)
      - [Create Recipe](#create-recipe)
      - [Update Recipe](#update-recipe)
      - [Delete Recipe](#delete-recipe)
      - [Get Recipe Ingredients](#get-recipe-ingredients)
      - [Get Recipe Instructions](#get-recipe-instructions)
      - [Get All Recipes from specific user](#get-all-recipes-from-specific-user)

## Purpose

This assignment serves as a comprehensive assessment of your proficiency as a developer. The primary focus is not only on the content of the application but also on the implementation of industry-standard practices, conventions, and techniques. The API developed during this semester provides functionalities for user authentication, allowing users to register, log in, and manage recipes with various customizable properties. The API includes essential endpoints for creating, updating, deleting, and retrieving recipes.

### Key Features
- User Authentication: Register and log in functionalities for users.
- Recipe Management: Create, update, delete, and retrieve recipes with customizable properties.

## Quikstart Backend

### Development Environment Quikstart

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

## Status

The project is currently in development.

## License 

This project is licensed under the [MIT License](LICENSE).

## Endpoints

### User Authentication

#### Register User
- **Endpoint:** `POST /api/users/register`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "username": "example_user",
    "email": "example@gmail.com",
    "password": "example_password"
  }
- **Response:** Returns the newly registred user's details

#### Login User
- **Endpoint:** `POST /api/users/login`
- **Description:** Authenticate and log in a user.
- **Request Body:**
    ```json
  {
    "email": "example@gmail.com",
    "password": "example_password"
  }
- **Response:** Returns the user's details on successful login

#### Get User by ID
- **Endpoint:** `GET /api/users/:userId`
- **Description:** Retrieves details of a specific user by their ID.
- **Response:** Returns details of the requested user.

#### Delete User
- **Endpoint:** `DELETE /api/users/:userId`
- **Description:** Deletes a user by their ID.
- **Response:** Returns a confirmation message.

#### Delete All Users
- **Endpoint:** `DELETE /api/users`
- **Description:** Deletes all users from the database.
- **Response:** Returns a confirmation message.

### Recipes

#### Get All Recipes
- **Endpoint:** `GET /api/recipes`
- **Description:** Retrieves a list of all recipes.
- **Response:** Returns an array of recipe objects without the ingredients and instructions.

#### Get Recipe by ID
- **Endpoint:** `GET /api/recipes/:recipeId`
- **Description:** Retrieves details of a specific recipe by its ID.
- **Response:** Returns details of the requested recipe without the ingredients and instructions.

#### Create Recipe
- **Endpoint:** `POST /api/recipes`
- **Description:** Creates a new recipe.
- **Request Body:**
  ```json
   {
   "recipe_name": "Example Recipe",
   "description": "This is an example recipe.",
   "instructions": ["Step 1: Do something", "Step 2: Do something else"],
   "ingredients": [
      {"name": "Ingredient 1", "quantity": "2 cups"},
      {"name": "Ingredient 2", "quantity": "1 tbsp"}
   ]
   }
- **Response:** Returns details of the newly created recipe.

#### Update Recipe
- **Endpoint:** `PUT /api/recipes/:recipeId`
- **Description:** Updates an existing recipe by its ID.
- **Request Body:**
  ```json
   {
   "recipe_name": "Example Recipe",
   "description": "This is an example recipe.",
   "instructions": ["Step 1: Do something", "Step 2: Do something else"],
   "ingredients": [
      {"name": "Ingredient 1", "quantity": "2 cups"},
      {"name": "Ingredient 2", "quantity": "1 tbsp"}
   ]
   }
- **Response:** Returns details of the updated recipe.

#### Delete Recipe
- **Endpoint:** `DELETE /api/recipes/:recipeId`
- **Description:** Deletes a recipe by its ID.
- **Response:** Returns a confirmation message.

#### Get Recipe Ingredients
- **Endpoint:** `GET /api/recipes/:recipeId/ingredients`
- **Description:**  Retrieves ingredients of a recipe by its ID.
- **Response:** Returns a list of ingredients for the specified recipe.

#### Get Recipe Instructions
- **Endpoint:** `GET /api/recipes/:recipeId/instructions`
- **Description:** Retrieves instructions of a recipe by its ID.
- **Response:** Returns a list of instructions for the specified recipe.

#### Get All Recipes from specific user
- **Endpoint:** `GET /api/recipes/user/:userId`
- **Description:** Retrieves all recipes with a specific user ID.
- **Response:** Returns an array of recipe objects without the ingredients and instructions.