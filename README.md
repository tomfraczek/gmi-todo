# Tasks API

The Tasks API allows you to manage tasks by creating, reading, updating, and deleting tasks.

## API Reference

#### Get all tasks

```http
  GET /api/tasks
```

#### Get a Single Task

```http
  GET /api/tasks/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Create a New Task

```http
  POST /api/tasks
```

#### Update a Task

```http
  GET /api/tasks/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Update a Task

```http
  DELETE /api/tasks/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

## Setup

Install dependencies:

```bash
  npm install
```

Set up Prisma:

```bash
  npx prisma migrate dev --name init
```

Environment Variables: Create a .env file in the root of your project with the following content:

```bash
  DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
```

Create a docker container:

```bash
  docker compose up
```

Start the application:

```bash
  npm run start
```

Start the application (watch mode):

```bash
  npm run start:dev
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```
