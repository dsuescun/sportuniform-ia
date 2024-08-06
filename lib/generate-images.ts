'use server';

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import OpenAI from "openai";

export const generate = async (colorList: string[], escudoImage: string): Promise<string[]> => {
    try {
        // Generar prompt con Vercel AI SDK
        const prompt = await generatePrompt(colorList, escudoImage);
        console.log("prompt", prompt);

        // Generar imagenes con open AI
        return await generateImages(prompt);
    }
    catch (error: any) {
        console.log(error.toString());
        throw new Error(error.toString());
    }
}

const generatePrompt = async (colorList: string[], escudoImage: string): Promise<string> => {
    const { text: escudoDescription } = await generateText({
        model: google(process.env.MODEL_GEN_PROMPT || 'models/gemini-1.5-pro-latest'),
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `Describe la imagen brevemente. No utilices mas de 50 palabras.`,
                    },
                    {
                        type: 'image',
                        image: escudoImage,
                    },
                ],
            },
        ],
    });

    const { text } = await generateText({
        model: google('models/gemini-1.5-pro-latest'),
        prompt: `Construye un ejemplo de prompt específico para generar la imagen de un uniforme de futbol con dall-e teniendo en cuenta lo siguiente:
- La imagen debe ser realista
- Debe tener camiseta, medias y pantaloneta
- Los colores representativos del uniforme deben ser: ${colorList.join(", ")}
- Debe incluir pequeños detalles del escudo en la parte superior de la camiseta
- El escudo es así: ${escudoDescription}.
El ejemplo del prompt debe estar listo para copiar y pegar en la plataforma de dall-e.`,
    });

    return text;
}

const generateImages = async (promptText: string): Promise<string[]> => {
    const openai = new OpenAI();

    const response = await openai.images.generate({
        model: process.env.MODEL_GEN_IMAGE || 'dall-e-2',
        prompt: promptText,
        size: "512x512",
        n: 2,
    });

    return [
        response.data[0].url || "",
        response.data[1].url || "",
    ];
}