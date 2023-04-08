## NodeJS File Service

## Clone project

```
git clone https://github.com/pyonic/nodejs_file_service.git
cd nodejs_file_service/
```

> ! Important: Rename .env.example to .env

## If you have MySQL running somewhere (or else docker section is in the bottom)
SQL - create database
```
CREATE DATABASE erp_aero;
```

Install dependencies

`npm install`

# Commands

- `npm run start`: Runs the application by running `node src/server.js`.
- `npm run start:dev`: Runs the application with watching changes on it `nodemon src/server.js`.
- `npm run migrate:make migration_name`: Generates a new migration.
- `npm run migrate:up (optional_migration_name)`: Runs all pending migrations.
- `npm run migrate:down (optional_migration_name)`: Rolls back the last batch of migrations.

# If you are using docker
```
sudo docker compose up -d
```

You can see which port listening the app by command

```
sudo docker ps
```
