# Juris Facil WhatsApp Chatbot

Whatsapp chatbot usando Node JS, Dialogflow and Twilio.
Dentro deste manual iremos explicar toda a tecnologia por trás, assim como também recriar a aplicação localmente e mais detalhes interessantes.

### Tecnologias por Trás do Projeto

#### [Dialogflow](https://dialogflow.cloud.google.com/)
De acordo com o seu  [website](https://cloud.google.com/dialogflow/) traduzido, 
> O Dialogflow é um pacote de desenvolvimento completo, desenvolvido uma vez e implantado em todos os lugares, para a criação de interfaces de conversação para sites, aplicativos móveis, plataformas de mensagens populares e dispositivos IoT. Você pode usá-lo para construir interfaces (como chatbots e IVR de conversação) que permitem interações naturais e ricas entre seus usuários e sua empresa. Os usuários do Dialogflow Enterprise Edition têm acesso ao suporte do Google Cloud e a um contrato de nível de serviço (SLA) para implantações de produção.

Nós usamos o Dialogflow para dar poder ao processamento de IA para o Chatbot. Nele, interpreta as intenções de ação do usuário de acordo com a mensagem enviada no Whatsapp, e consegui entender diversas variações de formas de comunicação, e então enviar a resposta adequada para a necessidade do usuário.

#### [Twilio](https://www.twilio.com/)
Twilio é uma plataforma americana de comunicações em nuvem como empresa de serviços, que permite envolver os clientes em todos os canais: SMS, voz, vídeo, e-mail, WhatsApp e muito mais. As APIs de pagamento conforme o uso permitem que as empresas dimensionem as comunicações de maneira confiável. 

Usamos o Twilio para fazer o serviço de mensageria, ou melhor dizendo, a integração do Whatsapp com o DialogFlow dentro do nosso servidor Node.js.

#### [Node.js](https://nodejs.org/)
Node.js é um ambiente de execução Javascript server-side. Tra-se de um software open-source, cross-platform, e de um runtime de JavaScript que execute código de JavaScript a nível backend e frontend.

#### [Ngrok](https://ngrok.com/)
O Ngrok é um pequeno programinha de linha de comando que permite criar um túnel de conexão segura a partir do seu localhost e publicá-lo na internet. Ele é multiplataforma, podendo ser usado no Windows, Linux e Mac OS X.

<br/>
<br/>
<br/>

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
Salve as novas alterações e agora você pode enviar uma mensagem para o número do sandbox do Twilio no seu whatsapp, ele então pedirá para que envie o código de conexão do Sandbox do Twilio Whatsapp.

Enviando esse código como primeira mensagem, o seu serviço já está executável e você já verá a resposta.

