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
        console.log("generate error:", error.toString());
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

    console.log("escudoDescription", escudoDescription);

    const imageModel = process.env.MODEL_GEN_IMAGE || 'dall-e-2';
    const { text } = await generateText({
        model: google('models/gemini-1.5-pro-latest'),
        prompt: `Construye un ejemplo de prompt específico para generar la imagen de un uniforme de futbol con ${imageModel} teniendo en cuenta lo siguiente:
- La imagen debe ser realista
- Debe tener camiseta, medias y pantaloneta
- Los colores representativos del uniforme deben ser: ${colorList.join(", ")}
- Debe incluir pequeños detalles del escudo en la parte superior de la camiseta
- El escudo es así: ${escudoDescription}.
El ejemplo del prompt debe estar listo para copiar y pegar en la plataforma de ${imageModel}.`,
    });

    return text;
}

const generateImages = async (promptText: string): Promise<string[]> => {
    const openai = new OpenAI();
    const imageModel = process.env.MODEL_GEN_IMAGE || 'dall-e-2';
    const size = '1024x1024';
    const n = 1;
    
    // Se generan las imagenes una por una ya que dall-e-3 no soporta n > 1
    const response1 = await openai.images.generate({
        model: imageModel,
        prompt: promptText,
        size: size,
        n: n,
    });
    console.log("image1", response1.data[0].url || "");

    const response2 = await openai.images.generate({
        model: imageModel,
        prompt: promptText,
        size: size,
        n: n,
    });
    console.log("image2", response2.data[0].url || "");

    return [
        response1.data[0].url || "",
        response2.data[0].url || "",
    ];
}