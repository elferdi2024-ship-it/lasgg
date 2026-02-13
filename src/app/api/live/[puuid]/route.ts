import { NextRequest, NextResponse } from 'next/server';
import { RiotService } from '@/lib/riot-service';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ puuid: string }> }) {
    try {
        const { puuid } = await params;

        if (!puuid) {
            return NextResponse.json({ error: 'PUUID is required' }, { status: 400 });
        }

        // 1. Determinar región (podríamos guardarla en la DB o pasarla como query param)
        // Por ahora, buscamos al summoner en la DB para saber su región, o asumimos LAS por defecto si no está.
        const summoner = await prisma.summoner.findUnique({
            where: { puuid },
            select: { region: true }
        });

        const region = summoner?.region || 'la2';

        const riotService = new RiotService(process.env.RIOT_API_KEY || '');
        riotService.setRegion(region);

        const activeGame = await riotService.getActiveGame(puuid);

        if (!activeGame) {
            return NextResponse.json({ inGame: false });
        }

        return NextResponse.json({ inGame: true, game: activeGame });

    } catch (error: any) {
        console.error("Error in /api/live:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
