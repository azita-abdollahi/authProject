## Project Setup

Create a new project folder with the following command

```shell
mkdir node_auth  
cd node_auth
```

The JWT Authentication Architecture is built with:

- [Node.js](https://nodejs.org/) – a JavaScript run-time scripting language
- [Expressjs](https://expressjs.com/) – serves as a Node.js framework
- [Mongoose](https://mongoosejs.com/) – an ODM (Object Document Mapping) for accessing and mutating the database
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs) – for hashing the passwords
- [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken) – generating JWTs
- [Redis](https://www.npmjs.com/package/redis) – as caching storage for storing the user’s session
- [MongoDB](https://www.mongodb.com/) – as NoSQL database
- [Zod](https://github.com/colinhacks/zod) – for validating user inputs
- [cors](https://www.npmjs.com/package/cors) – To allow Cross-Origin Resource Sharing between the backend and frontend

### Prerequisites

- Node.js
- Docker 
- Docker-compose 
- Typescript
- MongoDB
- Mongo-express
- Nginx
- redis

### These are the API endpoints we need for this Rest API

| RESOURCE | HTTP METHOD | ROUTE                  | DESCRIPTION                                 |
|:--------:|:-----------:|:----------------------:|:-------------------------------------------:|
| users    | GET         | /api/users             | returns all the users and their information |
| users    | GET         | /api/users/me          | return the logged-in user’s information     |
| users    | GET         | /api/users/getUser     | return user information by userId           |
| users    | POST        | /api/users/update/user | update user information                     |
| users    | POST        | /api/users/delete/user | delete user                                 |
| auth     | POST        | /api/auth/register     | Create a new user                           |
| auth     | POST        | /api/auth/login        | Logs the user in                            |

### Initialize a Node.js Project with TypeScript

The first thing we always do before coding a Node.js project that will require external libraries is to initialize a new project with the following command.

```shell
npm init
```

You will be prompted to provide some answers. If you don’t want to answer questions then use the `-y`flag.

Run the command below to install TypeScript as a global dependency. This will allow us compile the TypeScript code into pure JavaScript using the TypeScript compiler.

```shell
npm init -y  
npm install -g typescript
```

Run the following command to initialize a TypeScript project. A tsconfig.json file will be created in your root directory.

```shell
tsc --init
```

#### TypeScript tsconfig.json file configurations

Add the following configuration options to your **tsconfig.json** file to allow us use decorators and more in our code.

```json
{
  "compilerOptions": {
    "target": "es2016",
    "removeComments": true,  
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

#### Install the Dependencies

```shell
npm i bcryptjs config cookie-parser dotenv express jsonwebtoken lodash mongoose redis zod cors
```

#### Install the devDependencies

```shell
npm i -D morgan typescript ts-node nodemon 
```

#### Install the Type Definition files

These type definition files are needed for TypeScript to function properly.

```shell
npm i -D @types/bcryptjs @types/config @types/cookie-parser @types/express @types/cors @types/jsonwebtoken @types/lodash @types/morgan @types/node
```

Now add the dev script to the package.json file

```json
"scripts": {
    "dev": "nodemon ./src/index.ts"
  }
```

### docker-compose.yml

​    to see docker-compose file click [`here`](https://github.com/azita-abdollahi/authProject/blob/master/docker-compose.yml).

## How to Generate Private and Public keys for JWT Authentication

​    create gen.js 

```js
const crypto = require('crypto');
const fs = require('fs');

// Generate a new key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 512,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  }
});

// Save the private key to a file
fs.writeFileSync('private.key', privateKey);

// Save the public key to a file
fs.writeFileSync('public.key', publicKey);

console.log('Key pair generated successfully.');
```

### how to use public and private key in project?

​    in jwt.ts file(./src/utils/jwt.ts):

```tsx
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from "dotenv";
config();
import fs from 'fs'

export const signJwt = (payload: Object, options: SignOptions = {}) => {
  const privateKey = fs.readFileSync('./private.key', 'utf-8');
  const token = jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256'
  });
  return `Bearer ${token}`
};

export const verifyJwt = <T>(token: string): T | null => {
  try {
    const publicKey = fs.readFileSync('./public.key', 'utf-8');
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};
```

#### Run the App

​	start the docker containers

```sh
#up docker containers and build
docker compose up -d --build  
#see the docker containers  
docker compose ps  
#stop the docker containers  
docker compose down  
#following logs of docker containers  
docker compose logs -f
```

**Note:** By default backend service listens on `TCP/8080` port and mongo-express is available on `TCP/8082`.
