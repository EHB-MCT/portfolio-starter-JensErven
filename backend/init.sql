-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create recipes table
CREATE TABLE recipes (
    id UUID PRIMARY KEY,
    recipe_name VARCHAR(255) NOT NULL,
    description TEXT,
    instructions JSONB,
    ingredients JSONB
);