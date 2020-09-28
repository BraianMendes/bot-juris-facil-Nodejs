## Juris Facil WhatsApp Chatbot

Whatsapp chatbot usando Node JS, Dialogflow and Twilio.
Dentro deste manual iremos explicar toda a tecnologia por trás, assim como também recriar a aplicação localmente e mais detalhes interessantes.

### Tecnologias por Trás do Projeto

#### [Node.js](https://nodejs.org/)
Node.js é um ambiente de execução Javascript server-side. Tra-se de um software open-source, cross-platform, e de um runtime de JavaScript que execute código de JavaScript a nível backend e frontend.

#### Como funciona nosso Backend em Node.js

I will be using typescript in this project. You shouldn't feel intimidated even if you haven't used it before. You can check out  [this guide](https://levelup.gitconnected.com/setup-express-with-typescript-in-3-easy-steps-484772062e01)  on how to get started with typescript and express.

Open your terminal and create a new project.

```bash
mkdir wa-chatbot && cd wa-chatbot
```

Initialize a new node js project inside the folder we just created and changed directory into

```bash
npm init -y
```

Install the following dev dependencies
1. nodemon
2. typescript
3. ts-node
4. ts-lint

```bash
npm i -D nodemon typescript ts-node ts-lint
```

Install the following dependencies
1. express
2. dotenv
3. twilio
4. dialogflow
5. @overnightjs/core
6. @overnightjs/logger
7. body-parser
8. cors

We're using Overnight to stay closer to the MVC pattern and utilize Object Oriented style of programming. Read more about Overnight  [here](https://github.com/seanpmaxwell/overnight) . 

```bash
npm i -S express dotenv twilio dialogflow @overnightjs/core @overnightjs/logger body-parser cors
```

We also need to install types for these modules

```bash
npm i -D @types/node @types/express @types/twilio @types/dialogflow @types/body-parser @types/cors
```

Next, we'll create a `tsconfig.json` file. In the root of your project make a new file.

```bash
touch tsconfig.json
```

Copy and paste the following content inside the new file

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "strict": true,
    "baseUrl": "./",
    "outDir": "build",
    "removeComments": true,
    "experimentalDecorators": true,
    "target": "es6",
    "emitDecoratorMetadata": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "types": ["node"],
    "typeRoots": ["node_modules/@types"]
  },
  "include": ["./src/**/*.ts"],
  "exclude": ["./src/public/"]
}
```
I will not go into the specifics for now but you can read typescript documentation for more information.
Next, create a `tslint.json` file at the root of your project and paste the following content inside.

```json
{
  "defaultSeverity": "warning",
  "extends": ["tslint:recommended"],
  "jsRules": {},
  "rules": {
    "trailing-comma": [false],
    "no-bitwise": false,
    "jsdoc-format": true,
    "deprecation": true,
    "interface-name": true,
    "no-duplicate-imports": true,
    "no-redundant-jsdoc": true,
    "no-use-before-declare": true,
    "variable-name": false,
    "object-literal-sort-keys": false,
    "member-ordering": true,
    "await-promise": true,
    "curly": true,
    "no-async-without-await": true,
    "no-duplicate-variable": true,
    "no-invalid-template-strings": true,
    "no-misused-new": true,
    "no-invalid-this": true,
    "prefer-const": true
  },
  "rulesDirectory": []
}
```

Let's set up our backend structure.
Open your terminal and run the following commands inside the root of your project.

```bash
mkdir src && touch src/AppServer.ts && touch src/start.ts
```

`AppServer.ts` is where we will set up our express app.
Paste the following inside `src/AppServer.ts`

```typescript
import * as bodyParser from "body-parser";
import * as controllers from "./controllers";
import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import * as cors from "cors";
export class AppServer extends Server {
  private readonly SERVER_STARTED = "Server started on port: ";

  constructor() {
    super(true);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.setupControllers();
  }

  private setupControllers(): void {
    const ctlrInstances = [];
    for (const name in controllers) {
      if (controllers.hasOwnProperty(name)) {
        const controller = (controllers as any)[name];
        ctlrInstances.push(new controller());
      }
    }
    super.addControllers(ctlrInstances);
  }

  public start(port: number): void {
    this.app.get("*", (req, res) => {
      res.send(this.SERVER_STARTED + port);
    });
    this.app.listen(port, () => {
      Logger.Imp(this.SERVER_STARTED + port);
    });
  }
}

```
In this file, we set up our AppServer class which extends the Server class from Overnight. In the constructor we initialise the Server class passing true as a parameter. We then head on to configure some middlewares for our app. We might be receiving JSON data in our requests so we use `body-parser` to ensure it's handled properly.

We then set up our controllers which we will create in a short while. After this, we define the `start` method which will start up the app on the port passed to it as a parameter

Paste this into `src/start.ts`. This is the starting point for our application.

```typescript
import { config } from "dotenv";
config();
import { AppServer } from "./AppServer";

const appServer = new AppServer();
appServer.start(3000);
```

At the top, we import `config` from `dotenv` and call it. We use this to configure our environment variables and load them into `process.env`. We also initiate a new instance of the server and call the `start` method passing in a port to use. 

At this point, we need to set up our controllers. Create a folder inside `src` and call it `controllers`. Inside `src/controllers` create two files: `BotController.ts` and `index.ts`

Inside `BotController.ts` paste the following code

```typescript
import { Request, Response } from "express";
import { Controller, Post } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";

@Controller("api/bot")
export class BotController {
  
}
```
You'll notice some weird syntax just before our controller class. That's a decorator. We use it to tell the compiler that our class is a controller. We also pass an argument which is our URL path. With this, we can now make restful requests to `[SERVER]:[PORT]/api/bot`. 

We don't have any routes defined yet. For Twilio, we will only need a POST route. Inside the BotController class add the following code.

```typescript
@Post()
  private postMessage(request: Request, response: Response) {
    Logger.Info("A post request has been received");
    return response.status(200).json({
      message: "A post request has been received"
    });
  }
```
You'll notice another decorator which tells our compiler that the method handles POST requests.

In `src/controllers/index.ts` add the following code. This exports our controllers so that it will be easy to export any future controllers.

```typescript
export * from "./BotController";
```

## The fun stuff

It's time to get to the fun stuff. Let's set up our app to communicate with Twilio and Dialogflow.
Create a folder called `utils` under `src`. Inside utils create two files: `dialogflow.ts` and `twilio.ts`

Inside Dialogflow.ts:

```typescript
// dialogflow.ts

const dialogflow = require("dialogflow");
const credentials = require("../../credentials.json");

const sessionClient = new dialogflow.SessionsClient({
  credentials: credentials
});
const projectId: string = process.env.DIALOGFLOW_PROJECT_ID!;

export const runQuery = (query: string, number: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // A unique identifier for the given session
      //const sessionId = uuid.v4();
      const sessionId = number;
      // Create a new session

      const sessionPath = sessionClient.sessionPath(projectId, sessionId);

      // The text query request.
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            // The query to send to the dialogflow agent
            text: query,
            // The language used by the client (en-US)
            languageCode: "en-US"
          }
        }
      };

      // Send request and log result
      const responses = await sessionClient.detectIntent(request);

      const result = responses[0].queryResult;

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
```
Here we're importing Dialogflow and also the credentials.json file we downloaded when setting up our chatbot on Dialogflow. Remember that file? Move it to your project's root folder. We're the setting up a new SessionsClient using the credentials file. In our `runQuery` function we're taking in a query to send to Dialogflow and also the user's Whatsapp number which we will use to set up a Dialogflow session unique to that user. We then send the query to Dialogflow and return the response.

In `twilio.ts` add the following code :
```typescript
import { Twilio } from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;

const client = new Twilio(accountSid, authToken);

export const sendMessage = (to: string, from: string, body: string) => {
  return new Promise((resolve, reject) => {
    client.messages
      .create({
        to,
        from,
        body
      })
      .then(message => {
        resolve(message.sid);
      })
      .catch(error => {
        reject(error);
      });
  });
};
```
Here we create a new Twilio client and instantiate using our Twilio Account SID and Auth Token. We then call the `client.messages.create` function which takes in the number of the user, the number sending the message(in this case, the Twilio sandbox number) and also a body. We then return the message Id.

You've probably noticed we've used a few environment variables that we haven't defined yet. In the root of your project create a `.env` file. Inside paste the following code and make sure to replace placeholders with appropriate values. I asked you to take note of the values required at some point in this tutorial.

```
TWILIO_ACCOUNT_SID=PLACEHOLDER
TWILIO_AUTH_TOKEN=PLACEHOLDER
DIALOGFLOW_PROJECT_ID=PLACEHOLDER
```

Go back to `BotController.ts` and replace the `postMessage` method with the following code.

```typescript
@Post()
  private postMessage(request: Request, response: Response) {
    // Here we get the message body, the number to which we're sending the message, and the number sending the message.
    const { Body, To, From } = request.body;

    // Here we're sending the received message to Dialogflow so that it can be identified against an Intent.
    runQuery(Body, From)
      .then((result: any) => {
        // We send the fulfilment text received back to our user via Twilio
        sendMessage(From, To, result.fulfillmentText)
          .then(res => {
            console.log(res);
          })
          .catch(error => {
            console.error("error is ", error);
            Logger.Err(error);
          });
      })
      .catch(error => {
        console.error("error is ", error);
        Logger.Err(error);
      });
    return response.status(200).send("SUCCESS");
  }
```

Twilio hits this method when it receives a message from Whatsapp. We extract the message body, the sender, and the recipient(in this case, Twilio sandbox number). We then send the received body to Dialogflow and get a fulfilment text. We use the Twilio client we set up earlier to send back the fulfilment text to the user.

Now there's only one more thing left to do. Open up your `package.json` and replace the scripts with the following

```json
"scripts": {
    "tsc": "tsc",
    "prestart": "npm run build",
    "dev": "ts-node src/start.ts",
    "dev:watch": "nodemon",
    "build": "rm -rf ./build/ && tsc",
    "start": "node build/start.js"
  },
```
The full file looks this 
```json
{
  "name": "wa-chatbot",
  "version": "1.0.0",
  "description": "",
  "main": "build/start",
  "scripts": {
    "tsc": "tsc",
    "prestart": "npm run build",
    "dev": "ts-node src/start.ts",
    "dev:watch": "nodemon",
    "build": "rm -rf ./build/ && tsc",
    "start": "node build/start.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/body-parser": "^1.17.1",
    "@types/cors": "^2.8.6",
    "@types/dialogflow": "^4.0.4",
    "@types/express": "^4.17.2",
    "@types/node": "^13.1.2",
    "@types/twilio": "^2.11.0",
    "nodemon": "^2.0.2",
    "ts-lint": "^4.5.1",
    "ts-node": "^8.5.4",
    "typescript": "^3.7.4"
  },
  "dependencies": {
    "@overnightjs/core": "^1.6.11",
    "@overnightjs/logger": "^1.1.9",
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "dialogflow": "^1.0.0",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "twilio": "^3.39.1"
  }
}
```
You can run `npm install` again in case I missed any dependencies. We also need to set up nodemon. Create a `nodemon.json` in your project's root folder and paste the following inside.

```json
{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/public"],
  "exec": "NODE_ENV=development ts-node src/start.ts"
}
```


#### Dialogflow
De acordo com o seu  [website](https://cloud.google.com/dialogflow/) traduzido, 
> O Dialogflow é um pacote de desenvolvimento completo, desenvolvido uma vez e implantado em todos os lugares, para a criação de interfaces de conversação para sites, aplicativos móveis, plataformas de mensagens populares e dispositivos IoT. Você pode usá-lo para construir interfaces (como chatbots e IVR de conversação) que permitem interações naturais e ricas entre seus usuários e sua empresa. Os usuários do Dialogflow Enterprise Edition têm acesso ao suporte do Google Cloud e a um contrato de nível de serviço (SLA) para implantações de produção.

Nós usamos o Dialogflow para dar poder ao processamento de IA para o Chatbot. Nele, interpreta as intenções de ação do usuário de acordo com a mensagem enviada no Whatsapp, e consegui entender diversas variações de formas de comunicação, e então enviar a resposta adequada para a necessidade do usuário.


### Como Rodar Localmente

#### Prerequisitos

1. [Twilio](www.twilio.com/referral/KqKLx8), uma conta de usuário
2. [Node Js](https://nodejs.org/) instalado na versão mais recente 
3. NPM ou Yarn, ou um outro gerenciador de pacotes de sua preferência
4. Um pouco de conhecimento em Javascript

#### Iniciando

Instale a versão estável mais recente do Node Js, caso ainda não tenha. Junto com ele deverá ser instalado o NPM.

E execute o comando para instalar as dependências do projeto:

```
npm install
```
ou
```
yarn install
```


#### Twilio
Visite  [twilio](www.twilio.com/referral/KqKLx8) e inscreva-se para uma nova conta, se ainda não tiver uma. Você receberá alguns créditos para começar. Depois que eles terminarem, você precisará pagar para conseguir mais, então use-os com sabedoria.

No dashboard, anote o seu `Account SID` e `Auth Token`.
Vá para [https://www.twilio.com/console/sms/whatsapp/learn](https://www.twilio.com/console/sms/whatsapp/learn) 
e siga as instruções para conectar sua conta do Whatsapp à sua sandbox. Isso é necessário para o ambiente de sandbox. Por enquanto, isso é tudo de que você precisa. 

#### Dialogflow
O Dialogflow já está configurado para uso neste projeto.
Para acessar a nossa IA treinado usaremos o código de projeto de Dialogflow:

```
hackajuridico-ro9a
```

#### Configurando Variáveis

Crie um arquivo .env, caso já não tenha esse arquivo na raiz do repositório do projeto, com as seguintes variáveis. E onde está TWILIO_ACCOUNT_SID= e TWILIO_ACCOUNT_SID= adicione valores, correspondetes, de acordo com o já anotado em sua conta Twilio.

```
TWILIO_ACCOUNT_SID=
TWILIO_ACCOUNT_SID=
DIALOGFLOW_PROJECT_ID=hackajuridico-ro9a
```


Agora você pode executar `npm run dev: watch` e ver seu projeto sendo executado com sucesso.


Em seguida, precisamos expor nosso servidor local.  [Ngrok](https://ngrok.com/)  é uma das melhores soluções de código aberto, mas você pode usar o que preferir.
Para este Chatbot Juris Facil o Ngrok já foi instalado no projeto e, em um novo terminal, execute o comando:

```
./ngrok http 3000
```

O servidor será exposto localmente. Copie o URL do servidor exposto e abra [Twilio Whatsapp Sandbox](https://www.twilio.com/console/sms/whatsapp/sandbox). RSubstitua o URL em **WHEN A MESSAGE COMES IN** pelo seu URL exposto. Não se esqueça de adicionar a rota no final dessa mesma url nesse mesmo campo de input no Twilio, ou seja, `/api/bot`

![Screenshot from 2020-01-03 11-42-28.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1578040961273/FQIcqbgcE.png)
Salve as novas alterações e agora você pode enviar uma mensagem para o número do sandbox do Twilio no seu whatsapp e você já verá a resposta.


![Screenshot_20200103-113203_WhatsApp.jpg](https://cdn.hashnode.com/res/hashnode/image/upload/v1578041040285/slhCjt7wV.jpeg)
