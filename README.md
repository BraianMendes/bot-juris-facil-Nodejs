Let’s get started
The first step is to create our custom Google search engine.
The Custom Search JSON API requires the use of an API key, so let’s get our key. Click here
https://developers.google.com/custom-search/v1/overview

Click on GET A KEY — create your project and copy your API key because you will need it later

The next step is to setup your custom search engine Click here
https://cse.google.com/cse/all

Click on add

Enter the website you want to search and a name for it and click on create

Click on the control panel
Note the Search engine ID, you will need it later

Switch the ‘search the entire web’ button to on, This will make your search more in-depth.

Setting up Twilio sandbox environment
The next step is to setup a sandbox environment on Twilio, follow the steps below.
Create a Twilio account if you don’t already have one
After creating and verifying your account, log into your account and click on console on the navbar
Click on create a new project, select products > Programmable SMS and click on continue.

Take note of your ACCOUNT SID and AUTH TOKEN

The final step is to setup your WhatsApp Sandbox environment. Click here
https://www.twilio.com/console/sms/whatsapp/sandbox


Connect to your sandbox by sending a WhatsApp message to the Twilio number on the page.
Trust me this was the hardest part, now let’s get down to business.
Let's create a directory for our project.
On your terminal run mkdir whatsapp-bot or create a directory manually for the project.
Create a .env file inside your project directory and put the following:
ACCOUNT SID and AUTH TOKEN from Twilio
Add your Google API key
Your Search engine ID

.env file
Create your package.json with the following dependencies

create a .babelrc file and add this code.

Run npm install to install all your dependencies
Copy and paste this code inside server/server.js file

Here we are just creating an express server that runs on port 3000.
Your folder structure should look something like this

Run npm start to start the server, your app should start running on port 3000
Next let’s download ngrok. We need ngrok to make our local server publicly accessible on the internet.
Unzip ngrok inside your directory
Run ./ngrok http 3000 on another terminal
You should see ngrok started with status online.

Copy the new ngrok server URL, Let’s go back to the WhatsApp Sandbox, and add it as our webhook URL.

Note the api/v1/incoming that is how our route will be structured
Next, create a WhatsappBot.js file inside the controllers folder
Your folder structure should be like this

Next, let’s import the Google API and Twilio libraries into our WhatsappBot.js

Let’s load our environment variables and also initial our Twilio account by passing in our account id and auth token.

From the image below, we initialize the MessgingResponse object, we get the query the user is sending from req.body.Body, call the Google customsearch method and passing it our options parameter.
Then, get the first content from the search result and send back to the user.

See the complete code below

Setup the route
Create search.js file inside the route folder
Here we import the WhatsAppbot controller and set our post route

Create an index.js inside the route folder and import your search route

Restart your server and try sending a message via WhatsApp to your endpoint.
If everything goes well you should get a response back