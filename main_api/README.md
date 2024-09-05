<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Description

WIP

## Installation

### Bun Installation

#### For Mac

```bash
# Install
$ curl -fsSL https://bun.sh/install | bash

# If using oh-my-zsh. Make sure bun is included in the ~/.zshrc
$ source ~/.zshrc

#### For Windows

```

$ powershell -c "irm bun.sh/install.ps1|iex"

````

### Project Installation

```bash
$ bun install

# Make sure to setup local redis
$ docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest
````

## Running the app

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```

## Test

```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```

## Errors

> ECONNREFUSED ::1:6379

Happens because Redis server is unreachable

## References

https://medium.com/@uttiyaghosh/strategy-pattern-in-spring-boot-0d6e025eef41
