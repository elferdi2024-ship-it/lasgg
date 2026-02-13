// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando siembra de datos (Benchmarks)...');

    const benchmarks = [
        // 1. LEE SIN (Jungla - Emerald)
        {
            championId: 64, // Lee Sin
            tier: 'EMERALD',
            role: 'JUNGLE',
            avgKda: 2.85, stdDevKda: 1.4,
            avgDpm: 580.5, stdDevDpm: 150.2,
            avgVision: 0.95, stdDevVision: 0.4,
            avgCsMin: 6.1, stdDevCs: 0.9,
            avgTurretDmg: 900, stdDevTurretDmg: 800
        },
        // 2. YASUO (Mid - Emerald)
        {
            championId: 157, // Yasuo
            tier: 'EMERALD',
            role: 'MID',
            avgKda: 2.1, stdDevKda: 1.8, // Yasuo muere mucho (high variance)
            avgDpm: 750.0, stdDevDpm: 200.0,
            avgVision: 0.6, stdDevVision: 0.25,
            avgCsMin: 7.5, stdDevCs: 1.1,
            avgTurretDmg: 3500, stdDevTurretDmg: 1500
        },
        // 3. JINX (ADC - Emerald)
        {
            championId: 222, // Jinx
            tier: 'EMERALD',
            role: 'BOTTOM',
            avgKda: 3.2, stdDevKda: 1.1,
            avgDpm: 800.0, stdDevDpm: 250.0,
            avgVision: 0.4, stdDevVision: 0.15,
            avgCsMin: 7.8, stdDevCs: 1.0,
            avgTurretDmg: 4500, stdDevTurretDmg: 1200
        }
    ];

    for (const b of benchmarks) {
        await prisma.championBenchmark.upsert({
            where: {
                championId_tier_role: {
                    championId: b.championId,
                    tier: b.tier,
                    role: b.role
                }
            },
            update: b,
            create: b,
        });
    }

    console.log('✅ Benchmarks insertados correctamente.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
