'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { LiveGameContainer } from '@/components/LiveGame/LiveGameContainer';

export default function LiveGamePage() {
    const params = useParams();
    const riotId = params?.riotId as string;
    const tagLine = params?.tagLine as string;

    // We need PUUID. In a real app, we might check local storage or existing context, 
    // or just fetch it again safely. 
    // For standalone page, fetching profile basics is safest.
    const [puuid, setPuuid] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPuuid = async () => {
            if (!riotId || !tagLine) return;
            try {
                const res = await fetch(`/api/profile/${riotId}/${tagLine}`);
                if (res.ok) {
                    const data = await res.json();
                    setPuuid(data.profile.puuid);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchPuuid();
    }, [riotId, tagLine]);

    if (loading) return (
        <div className="min-h-screen bg-[var(--bg-root)] flex items-center justify-center">
            <Loader2 className="animate-spin text-[var(--accent-primary)]" />
        </div>
    );

    if (!puuid) return <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)]">Summoner not found</div>;

    return (
        <div className="min-h-screen bg-[var(--bg-root)] text-[var(--text-primary)] p-4 md:p-8">
            <LiveGameContainer puuid={puuid} riotId={riotId} tagLine={tagLine} />
        </div>
    );
}
