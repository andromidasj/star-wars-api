# Star Wars API

Built for Russ Nelson & friends.

## Getting Started

To get started:

1. Clone the repo
   ```bash
   git clone https://github.com/andromidasj/star-wars-api.git
   ```
2. Rename the .env.example file to `.env`, (or create a new `.env` file) with the appropriate environment variables:
   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=postgres
   # DB_USER=postgres     # only if you have auth enabled in the db
   # DB_PASSWORD=postgres # only if you have auth enabled in the db
   ```
3. Install the dependencies. In my case, I'm using `bun`:
   ```bash
   bun i
   ```
4. Start the server:
   ```bash
   bun run start
   ```

## API

This API is written in Typescript using NextJS and DrizzleORM connected to a Postgres database. I chose NextJS because of its easy file-based routing, and I'm familiar with it. I've been hearing amazing things about DrizzleORM, so I decided to give it a try as well.

### Limitations

- **Errors**
  Errors are generally handled as to not completely break the API, but it could be improved to provide more detailed error messages for certain cases. I could solve this by using lots of if-checks on possible database errors and returning more specific error messages. For now, if there's an error I just respond with a 500 status code and I pass along the original error object that was thrown. My goal was to show that I know _how_ to handle errors, but I won't dig around for every edge case.

- **Pagination**
  Pagination passthrough is supported, but all of the manually added entities will be returned in the response no matter what page number is provided. I could improve this by compiling the list of custom + SWAPI entities, and then handle custom pagination in the server. For now, I'm just returning all of the custom entities and using the SWAPI API for pagination.

- **Modifiying deletions**
  Curently, there's no support for modifying the `deleted_entities` table. If you delete an entity and want it back, it can be added manually with a POST request. I could improve this by adding another endpoint which would allow you to "undelete" an entity.

### Routes

#### READ

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
// PUT: /api/people/3

// Request body:
{
  "name": "R2 the bestest droid"
}

// Response:
{
  "created": "2014-12-10T15:11:50.376000Z",
  "edited": "2014-12-20T21:17:50.311000Z",
  "url": "https://swapi.dev/api/people/3/",
  "name": "R2 the bestest droid",
  "height": "96",
  "mass": "32",
  "hair_color": "n/a",
  "skin_color": "white, blue",
  "eye_color": "red",
  "birth_year": "33BBY",
  "gender": "n/a",
  "homeworld": "https://swapi.dev/api/planets/8/",
  "films": [
    "https://swapi.dev/api/films/1/",
    "https://swapi.dev/api/films/2/",
    "https://swapi.dev/api/films/3/",
    "https://swapi.dev/api/films/4/",
    "https://swapi.dev/api/films/5/",
    "https://swapi.dev/api/films/6/"
  ],
  "species": [
    "https://swapi.dev/api/species/2/"
  ],
  "vehicles": [],
  "starships": []
}
```

#### DELETE

`DELETE /api/{entity}/{entityId}/delete`

To delete an entity, you can use the DELETE method. If the entity is stored in the local database, it will be deleted from the database. If the entity is fetched from the SWAPI API, it will be added to the `deleted_entities` table, and the entity will be filtered out of GET responses.

For example:

```json
// DELETE: /api/people/20/delete

// Response:
{
  "message": "Entity with ID 20 has been deleted."
}
```

TODO: don't return deleted entity by id in GET responses
