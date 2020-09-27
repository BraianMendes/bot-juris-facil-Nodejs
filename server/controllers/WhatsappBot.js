import { google } from 'googleapis';
import dotenv from 'dotenv';
import twilio from 'twilio';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const TwilloAuthToken =  process.env.TWILIO_AUTH_TOKEN;
const googleApiKey = process.env.GOOGLE_API_KEY;
const cx = process.env.SEARCH_ENGINE_ID;
  
twilio(accountSid, TwilloAuthToken);
const { MessagingResponse } = twilio.twiml;
const customsearch = google.customsearch('v1');

/**
 * @class WhatsappBot
 * @description class will implement bot functionality
 */
class WhatsappBot {
  /**
   * @memberof WhatsappBot
   * @param {object} req - Request sent to the route
   * @param {object} res - Response sent from the controller
   * @param {object} next - Error handler
   * @returns {object} - object representing response message
   */
  static async googleSearch(req, res, next) {
    const twiml = new MessagingResponse();
    // const q = req.body.Body;
    // const options = { cx, q, auth: googleApiKey };
    console.log(req)
    console.log("hello")

    // try {
    //   const result = await customsearch.cse.list(options);
    //   const firstResult = result.data.items[0];
    //   const searchData = firstResult.snippet;
    //   const link = firstResult.link;

    //   twiml.message(`${searchData} ${link}`);

    //   res.set('Content-Type', 'text/xml');

      
    //   // console.log(req.body);
    //   return res.status(200).send(twiml.toString());
    // } catch (error) {
    //   return next(error);
    // }
  }
}

export default WhatsappBot;