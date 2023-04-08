## NodeJS File Service

## Clone project

```
git clone https://github.com/pyonic/node_file_service.git
cd node_file_service/
```
## If you have MySQL running somewhere (or else docker section is in the bottom)
SQL - create database
```
CREATE DATABASE erp_aero;
```

Install dependencies

`npm install`

# Commands

- `npm run start`: Runs the application by running `src/server.js`.
- `npm run start:dev`: Runs the application in development mode by running `nodemon src/server.js`.
- `migrate:make`: Generates a new migration file using the knexfile configuration.
- `migrate:up`: Runs all pending migrations using the knexfile configuration.
- `migrate:down`: Rolls back the last batch of migrations using the knexfile configuration.

# If you are using docker

This will automatically run all necessary scripts and commands inside

```
sudo docker compose up -d
```

You can see which port listening the app by command

```
sudo docker ps
```
