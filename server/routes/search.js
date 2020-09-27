import { Router } from 'express';
import WhatsappBot from '../controllers/WhatsappBot';

const botRouter = Router();

botRouter.post('/', (req, res) => WhatsappBot.googleSearch());

export default botRouter;