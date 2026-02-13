import { Metadata } from 'next';
import ProfileClient from './ProfileClient';

type Props = {
    params: Promise<{ riotId: string; tagLine: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { riotId, tagLine } = await params;
    const name = decodeURIComponent(riotId);
    return {
        title: `${name} #${tagLine} (LAS) - Summoner Stats | LASGG`,
        description: `View League of Legends stats for ${name} #${tagLine} on LASGG. Check winrate, match history, and performance tags.`,
    };
}

export default function ProfilePage() {
    return <ProfileClient />;
}
