import { CircleUser } from 'lucide-react';

export interface RatingCardProps {
    authorName: string;
    body: string;
}

export function RatingCard({ authorName, body }: RatingCardProps) {
    return (
        <div key={authorName} className="pt-8 sm:inline-block sm:w-full sm:px-4">
            <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                <blockquote className="text-gray-900">
                    <p>{`“${body}”`}</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4">
                    <CircleUser strokeWidth={1} className="text-orange-500" />
                    <div className="font-semibold text-gray-900">{authorName}</div>
                </figcaption>
            </figure>
        </div>
    );
}
