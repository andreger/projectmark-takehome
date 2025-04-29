# ProjectMark API

A REST API for managing **topics** (with versioning and hierarchy), **resources**, and **users** (with role-based access control).

## About me

My name is André Gervásio.

Thank you for this opportunity. Over the past few days, I have dedicated time and effort to developing this task. I sincerely hope it meets your expectations. I would appreciate the chance to discuss the decisions I made, explore areas for improvement, and receive any feedback you may have.

https://www.linkedin.com/in/andregervasio/

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/andreger/projectmark-takehome
   ```

2. Navigate to the `projectmark-takehome` folder:

   ```bash
   cd projectmark-takehome
   ```

3. Start Docker Compose:

   ```bash
   docker compose up -d
   ```

   The application will run on port `3000`.

4. seed the database:

   ```bash
   docker exec projectmark_api npm run seed
   ```

5. Access the API on `http://localhost:3000`.

## Database

The project uses **SQLite** for local development:

- The database is stored in a file:  
  **`database.sqlite`** (located in the project root).
- The file is automatically created **if it does not exist** when you run:
  ```bash
  docker compose up -d
  ```
- You can **delete** the `database.sqlite` file at any time to reset the database.
- After deleting or recreating the database, **remember to seed it again** using the command below.

## Database Seeding

To insert default users and sample topics:

```bash
docker exec projectmark_api npm run seed
```

## Default Users

| Email                | Password    | Role   |
| :------------------- | :---------- | :----- |
| `admin@example.com`  | `admin123`  | Admin  |
| `editor@example.com` | `editor123` | Editor |
| `viewer@example.com` | `viewer123` | Viewer |

## Authentication

### 1. Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "access_token": "<jwt-token>"
}
```

### 2. Using the Token

For all protected endpoints, set the token in the **Authorization** header:

```
Authorization: Bearer <access_token>
```

## API Endpoints

`ProjectMark.postman_collection.json` file, located in the project's root folder, is a Postman-exported collection containing all API endpoints.

### Authentication

| Method | Endpoint          | Description                     |
| :----: | :---------------- | :------------------------------ |
|  POST  | `/api/auth/login` | Log in and retrieve a JWT token |

### Topics

| Method | Endpoint                           | Description                                    |
| :----: | :--------------------------------- | :--------------------------------------------- |
|  GET   | `/api/topics`                      | List all topics                                |
|  POST  | `/api/topics`                      | Create a new topic (optionally with parent ID) |
|  GET   | `/api/topics/:id`                  | Get a topic by ID                              |
|  GET   | `/api/topics/:id/tree`             | Get a topic and its descendants as a tree      |
|  GET   | `/api/topics/:id/version/:version` | Get a specific version of a topic              |
| PATCH  | `/api/topics/:id`                  | Update a topic                                 |
| DELETE | `/api/topics/:id`                  | Delete a topic                                 |
|  GET   | `/api/topics/:fromId/path/:toId`   | Find the shortest path between two topics      |

### Resources

| Method | Endpoint             | Description           |
| :----: | :------------------- | :-------------------- |
|  GET   | `/api/resources`     | List all resources    |
|  GET   | `/api/resources/:id` | Get a resource by ID  |
|  POST  | `/api/resources`     | Create a new resource |
| PATCH  | `/api/resources/:id` | Update a resource     |
| DELETE | `/api/resources/:id` | Delete a resource     |

### Users

| Method | Endpoint         | Description       |
| :----: | :--------------- | :---------------- |
|  GET   | `/api/users`     | List all users    |
|  GET   | `/api/users/:id` | Get a user by ID  |
|  POST  | `/api/users`     | Create a new user |
| PATCH  | `/api/users/:id` | Update a user     |
| DELETE | `/api/users/:id` | Delete a user     |

## Notes

- **Authentication Required**:  
  All `/api/*` endpoints (except `/api/auth/login`) require a valid **Bearer token**.
- **RBAC (Role-Based Access Control)**:  
  Actions like creating, updating, or deleting require appropriate permissions based on the user's role (Admin, Editor, Viewer).
- **Validation**:  
  All incoming requests are validated using DTOs (`class-validator`).
- **Good Practices (Disclaimer)**:
  Due to time constraints, some architectural and engineering best practices — such as more granular service/repository/factory abstractions, unit and integration testing, and advanced modularization — were not fully implemented. These would be prioritized in a production-ready version of this project.
