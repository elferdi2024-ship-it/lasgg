import { NextRequest, NextResponse } from 'next/server';
import { RiotService } from '@/lib/riot-service';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ puuid: string }> }) {
    try {
        const { puuid } = await params;

        if (!puuid) {
            return NextResponse.json({ error: 'PUUID is required' }, { status: 400 });
        }

        // Determinar región (similar a /live)
        const summoner = await prisma.summoner.findUnique({
            where: { puuid },
            select: { region: true }
        });

        const region = summoner?.region || 'la2';

        const riotService = new RiotService(process.env.RIOT_API_KEY || '');
        riotService.setRegion(region);

        // Fetch Top 20 mastery to have enough buffer
        const mastery = await riotService.getChampionMastery(puuid, 20);

        return NextResponse.json(mastery);

    } catch (error: any) {
        console.error("Error in /api/mastery:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
