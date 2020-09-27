import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import twilio from 'twilio';
dotenv.config();

const app = express();

const { PORT = 3000 } = process.env;

app.use(cors());

app.use(
  express.urlencoded({
    extended: false
  })
);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const TwilloAuthToken =  process.env.TWILIO_AUTH_TOKEN;
const googleApiKey = process.env.GOOGLE_API_KEY;
const cx = process.env.SEARCH_ENGINE_ID;
  
twilio(accountSid, TwilloAuthToken);
const { MessagingResponse } = twilio.twiml;
const customsearch = google.customsearch('v1');


app.post('/api/v1/', async (req, res) => {
  const twiml = new MessagingResponse();
  const q = req.body.Body;
  const options = { cx, q, auth: googleApiKey };

  try {
    const result = await customsearch.cse.list(options);
    const firstResult = result.data.items[0];
    const searchData = firstResult.snippet;
    const link = firstResult.link;

    twiml.message(`${searchData} ${link}`);

    res.set('Content-Type', 'text/xml');

    
    // console.log(req.body);
    return res.status(200).send(twiml.toString());
  } catch (error) {
    return next(error);
  }
});

app.listen(PORT, () => console.log(`App Listening on port ${PORT}`));

export default app;