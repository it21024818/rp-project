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
```

#### For Windows

```bash
$ powershell -c "irm bun.sh/install.ps1|iex"

```

### Project Installation

```bash
$ bun install

# Make sure to setup local redis
$ docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest
```

## Running the app

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```

### Testing Payments

#### Stripe

For this purpose you need to get the stripe CLI properly running to handle webhook events. The easiest way to do this is using a docker container. To get this docker container running you will need a **Stripe Secret Key** and and your machines **IPV4 address**. The **Stripe Secret Key** will be shared with you as part of the .env file. This will be under the name `STRIPE_PRIVATE_KEY`

You will have to acquire your **IPV4 address** by checking your config. This can be done by using the the `ipconfig` command in your local terminal. Search through the output until you find the address as given below or otherwise. (Sensitive information has been removed)

```
Ethernet adapter vEthernet (WSL (Hyper-V firewall)):

   Connection-specific DNS Suffix  . :
   Link-local IPv6 Address . . . . . : xxxx::xxxx:xxxx:xxxx:xxxx%xx
   IPv4 Address. . . . . . . . . . . : xxx.xxx.xxx.xxx <- You want this
   Subnet Mask . . . . . . . . . . . : xxx.xxx.xxx.xxx
   Default Gateway . . . . . . . . . :
```

After you have gathered the above, run the below command while substituting those values with the placeholders

```bash
# Get a local stripe-cli instance running
docker run --rm -it stripe/stripe-cli listen
  --api-key <stripe_secret_key>
  --forward-to http://<your_ipv4_address>:3000/v1/payments/stripe/webhook
```

When this command runs you will get your **webhook signing secret**. It will appear in the output as follows.

```bash
A newer version of the Stripe CLI is available, please update to: v1.21.3
> Ready! You are using Stripe API Version [2024-06-20]. Your webhook signing secret is <secret_here> (^C to quit)
```

Copy this secret and substitute its value with the value of `STRIPE_WEBHOOK_ENDPOINT_SECRET` in the .env file. Once all this is done **make sure to restart the server manually** so that environment value changes may take effect.

You should now be able to make calls to the `/v1/payments/stripe/checkout` and have them redirect to appropriate pages while also having proper database updates for subscriptions

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
