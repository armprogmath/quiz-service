# NestJS Quiz

Features:
- NestJS + TypeScript
- PostgreSQL with TypeORM
- JWT auth (register/login)
- Roles: Admin/User
- Admin: create/update/delete quizzes and questions
- User: list quizzes, start quiz, submit answers, view history
- Attempts tracking and time limit per quiz
- Swagger docs
- Docker + docker-compose
- Migrations (TypeORM)

## Quick start

- Create .env.development file for run development mode (see .env.example)
- Create .env.production file for run production mode  (see .env.example)

## Database
```bash 
# Use database url in .env files or see docker section 
$ DATABASE_URL=postgresql://postgres:YOUR-PASSWORD@HOST:PORT/YOUR_DATABASE_NAME
```


## Compile and run the project: 
```bash 
# install dependencies
$ npm install

# Run development mode: 
$ npm run start:dev

# Build development mode: 
$ npm run start:build-dev

# Run production mode:
$ npm run start:prod

# Build production mode:
$ npm run start:build-prod
```

# Docker
```bash
# Run Command to start RabbitMQ 
$ docker run -d --hostname my-rabbit --name some-rabbit rabbitmq:3

# Run command To start Postgres and the app.
docker-compose up --build
```

## Notes
```bash
# Default: TYPEORM_SYNCHRONIZE=true (dev). For production use migrations and set synchronize=false.
```




- Swagger - [API Documentation](http://localhost:3001/docs)

- Author - [Armen Arakelyan ](https://www.linkedin.com/in/armen-arakelyan)

- LinkedIn - [@linkedIn](https://am.linkedin.com/company/primeitwebdevelopment)

- github - [github]()
