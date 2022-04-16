# Blog API in AdonisJS

This repo contains the source code of an in-complete demo blog built using AdonisJS. I did a live stream showcasing how testing works in AdonisJS and created this project as a part of it.

During the live stream, we covered

- The basic flow of testing in AdonisJS
- Authenticating users during tests
- File uploads
- And using the OpenAPI schema for testing the endpoints

## Setup
Make sure you have Node.js >= 14.15.4 installed on your computer. I used PostgreSQL for the database, however you can switch the db config and use any database of your choice.

- Clone the repo `git clone https://github.com/thetutlage/tdd-blog.git`.
- Run `npm install` to install dependencies.
- Run `cp .env.example .env` to create `.env` file.
- Update database settings inside the `.env` file.
- Run `node ace test` to run the tests.

## Links

- Stream - https://youtu.be/PE0Jmu8Qqjo
- API Spec - https://github.com/thetutlage/tdd-blog/blob/main/api-spec.yml
