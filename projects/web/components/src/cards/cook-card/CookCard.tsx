import { CookRank, translatedCookRanks } from '@people-eat/web-domain';
import Image from 'next/image';

export interface CookCardProps {
    user: {
        firstName: string;
        profilePictureUrl: string | null;
    };
    rank: CookRank;
    menuCount: number;
    cityName: string;
    travelDistance?: string;
}

export function CookCard({ user, rank, menuCount, cityName, travelDistance }: CookCardProps) {
    return (
        <div className="group relative border-gray-200 p-4 sm:p-6">
            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                {user.profilePictureUrl && (
                    <Image
                        src={user.profilePictureUrl}
                        alt={user.firstName}
                        className="object-cover object-center"
                        width={500}
                        height={500}
                    />
                )}
            </div>
            <div className="pb-4 pt-4">
                <div className="flex justify-between items-center pt-4">
                    <dt className="text-black font-semibold truncate">{user.firstName}</dt>
                    <div className="flex gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500">
                            <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <dt className="text-gray-500">neu</dt>
                    </div>
                </div>
                <dt className="text-gray-500 truncate">{menuCount} Menüs</dt>
                <dt className="text-gray-500 truncate">{translatedCookRanks[rank]}</dt>

                <div className="flex justify-between gap-2">
                    <dt className="text-gray-500 truncate">{cityName}</dt>
                    {travelDistance && <dt className="text-gray-500 truncate">+{travelDistance}km</dt>}
                </div>
            </div>
        </div>
    );
}
