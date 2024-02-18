import { Carousel } from '@material-tailwind/react';
import Image from 'next/image';

export interface MenuCardProps {
    id: string;
    title: string;
    imageUrl: string;

    kitchenTitle?: string;
    cook: {
        firstName: string;
        profilePictureUrl: string | null;
    };
    courseCount: number;
    pricePerPerson: string;

    categoryTitles: string[];
}

export function MenuCard({ title, imageUrl, cook, kitchenTitle, courseCount, pricePerPerson, categoryTitles }: MenuCardProps) {
    return (
        <li className="">
            {/* <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                <img src={imageUrl} alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                <button type="button" className="absolute inset-0 focus:outline-none">
                    <span className="sr-only">View details for {title}</span>
                </button>
            </div> */}

            <div>
                <Carousel
                    className="overflow-hidden"
                    navigation={({ setActiveIndex, activeIndex, length }) => (
                        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                            {new Array(length).fill('').map((_, i) => (
                                <span
                                    key={i}
                                    className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? 'w-8 bg-white' : 'w-4 bg-white/50'}`}
                                    onClick={() => setActiveIndex(i)}
                                />
                            ))}
                        </div>
                    )}
                    placeholder={undefined}
                >
                    <Image
                        src={
                            imageUrl ??
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/The_Fat_Duck_%288197181654%29.jpg/640px-The_Fat_Duck_%288197181654%29.jpg'
                        }
                        alt="image 1"
                        className="h-full w-full object-center rounded-xl "
                        width={500}
                        height={400}
                    />
                    <Image
                        src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"
                        alt="image 2"
                        className="h-full w-full object-cover rounded-xl "
                        width={500}
                        height={400}
                    />
                    <Image
                        src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80"
                        alt="image 3"
                        className="h-full w-full object-cover rounded-xl "
                        width={500}
                        height={400}
                    />
                </Carousel>
            </div>

            <dt className="text-black font-semibold truncate pt-4">{title}</dt>
            {kitchenTitle && (
                <dt className="text-gray-500 truncate">
                    {courseCount} Gänge Menü - {kitchenTitle}
                </dt>
            )}
            {!kitchenTitle && <dt className="text-gray-500 truncate">{courseCount} Gänge Menü</dt>}
            <dt className="text-gray-500 truncate">{categoryTitles.join(', ')}</dt>
            <dt className="text-gray-500 truncate">Koch {cook.firstName}</dt>
            <dt className="text-black truncate flex justify-end">{pricePerPerson} pro Person</dt>
        </li>
    );
}
