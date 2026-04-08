import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

console.log('AI properties:', Object.keys(ai));
if ((ai as any).live) {
    console.log('AI.live properties:', Object.keys((ai as any).live));
}
