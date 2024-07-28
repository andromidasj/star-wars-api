# Star Wars API

Built for Russ Nelson & friends.

## Getting Started

To get started:

1. Clone the repo
2. Create a `.env` file with the following environment variables:

   - `DB_HOST` — defaults to `localhost`
   - `DB_PORT` — defaults to `5432`
   - `DB_NAME` — defaults to `postgres`
   - `DB_USER`
   - `DB_PASSWORD`

   (If your database is running locally and not behind authentication, you can leave the `DB_USER` and `DB_PASSWORD` out of the `.env` file.)

3. Install the dependencies. In my case, I'm using `bun`:
   ```bash
   bun i
   ```
4. Run the development server:
   ```bash
   bun run dev
   ```

## API

This API is written in Typescript using NextJS and DrizzleORM connected to a Postgres database. I chose NextJS because of its easy file-based routing, and I'm familiar with it. I've been hearing amazing things about DrizzleORM, so I decided to give it a try as well.

### Routes

#### GET

`GET /api/{entity}/{entityId}`

The API is modeled after the [SWAPI API](https://swapi.dev/documentation) and uses the same naming conventions and GET URL structure.

For example:

| SWAPI URL                 | API Route                 |
| ------------------------- | ------------------------- |
| GET: `/api/people`        | GET: `/api/people`        |
| GET: `/api/people/1`      | GET: `/api/people/1`      |
| GET: `/api/people?page=2` | GET: `/api/people?page=2` |

> Note: I didn't add support for the [Wookie formatter](https://swapi.dev/documentation#wookiee). 🐻

#### CREATE

`POST /api/{entity}`

To create a new entity, you can use the POST method. The request body should be a JSON object with the properties you want in the entity. For example:

```json
// POST: /api/people

// Request body:
{
  "name": "josh andromidas",
  "hair_color": "purple"
}

// Response:
{
  "id": 20,
  "entityType": "people",
  "data": {
    "name": "josh andromidas",
    "hair_color": "purple"
  }
}
```

#### UPDATE

`PUT /api/{entity}/{entityId}`

To update an entity, you can use the PUT method. The request body should be a JSON object with the properties you want to update, just like when creating a new entity.

This supports updating both entities stored in the local database and entities fetched from the SWAPI API.

For example:

```json
// PUT: /api/people/20

// Request body:
{
  "name": "josh andromidas",
  "hair_color": "purple",
  "homeworld": "https://swapi.dev/api/planets/1"
}

// Response:
{
  "id": 20,
  "entityType": "people",
  "data": {
    "name": "josh andromidas",
    "hair_color": "purple",
    "homeworld": "https://swapi.dev/api/planets/1"
  }
}
```

#### DELETE

`DELETE /api/{entity}/{entityId}/delete`

To delete an entity, you can use the DELETE method. If the entity is stored in the local database, it will be deleted from the database. If the entity is fetched from the SWAPI API, it will be added to the `deleted_entities` table.

For example:

```json
// DELETE: /api/people/20/delete

// Response:
{
  "message": "Entity with ID 20 has been deleted."
}
```
