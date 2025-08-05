# Quiz Builder

## Development

### Installing dependencies
To install dependencies, run the command inside backend and frontend directories:
```sh
$ npm ci
```

### Launching the Development server

#### Before starting, make sure that you have correctly configured .env files!

Specify the port and URL of third-party APIs for the server:
```sh
PORT=7000
DATABASE_URL="postgresql://postgres:admin@localhost:5433/quiz?schema=public"
```

For the client, specify the server URL:
```sh
NEXT_PUBLIC_API_URL=http://localhost:7000/api
```

Before running the server, you need to setup database inside docker container
```sh
docker-compose up -d
```

To start the server for development, run the commands:
```sh
npx prisma migrate deploy
npx prisma generate
npm run seed
npm run dev
```

To start the client for development, run the command:
```sh
npm run dev
```