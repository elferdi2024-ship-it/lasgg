import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import rateLimit from '@/lib/rate-limit';
import { z } from 'zod';

// Rate Limiter: 5 requests per minute per IP (Expensive endpoint)
const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

// Zod Schema
const CoachSchema = z.object({
    matchData: z.any(), // Permitimos any para el objeto complejo de match, pero validamos estructura básica si fuera necesario
    champion: z.string(),
    role: z.string(),
    win: z.boolean(),
    kda: z.string(),
});

// Inicializamos Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        // 1. Rate Limiting
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        try {
            await limiter.check(5, ip);
        } catch {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }

        // 2. Input Validation
        const body = await req.json();
        const validation = CoachSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Datos inválidos', details: validation.error.format() }, { status: 400 });
        }

        const { matchData, champion, role, win, kda } = validation.data;

        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json({ advice: "Configura tu GOOGLE_API_KEY para habilitar el Coach IA." });
        }

        // Configuración del modelo (Flash es rápido y gratis)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // EL PROMPT MAESTRO (Aquí está la magia del "Experto")
        const prompt = `
      Actúa como un Coach de League of Legends nivel Challenger (tipo LS o Veigarv2).
      Analiza esta partida brevemente para un jugador de ${champion} en el rol de ${role}.
      
      CONTEXTO:
      - Resultado: ${win ? "VICTORIA" : "DERROTA"}
      - KDA: ${kda}
      - Datos técnicos de la partida: ${JSON.stringify(matchData)}

      TU TAREA:
      1. Dame un análisis CRÍTICO pero constructivo en máximo 3 frases.
      2. Si ganó, dime qué hizo bien para carrear. Si perdió, cuál fue su error fatal.
      3. Sé específico con datos (ej: "Tu farm de 5.2cs/min es bajo para un Zed").
      4. Usa un tono profesional de Esports. No abuses de emojis.
      5. Responde exclusivamente en Español Latino neutro.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ advice: text });

    } catch (error: any) {
        console.error('🔥 AI Coach Error:', error);
        return NextResponse.json({ error: 'El coach está en descanso (Error de API)' }, { status: 500 });
    }
}
