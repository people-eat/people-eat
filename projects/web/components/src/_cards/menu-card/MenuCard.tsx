import Image from 'next/image';

export interface MenuCardProps {
    title: string;
    imageUrls: string[];

    kitchenTitle?: string;
    cook: {
        firstName: string;
        profilePictureUrl: string | null;
    };
    courseCount: number;
    pricePerPerson: string;

    categoryTitles: string[];
}

export function MenuCard({ title, imageUrls, cook, kitchenTitle, courseCount, pricePerPerson, categoryTitles }: MenuCardProps) {
    return (
        <li className="block">
            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                {imageUrls.length > 0 && (
                    <Image
                        src={imageUrls[0] + '?el=512'}
                        alt={title}
                        className="pointer-events-none object-cover group-hover:opacity-75"
                        width={500}
                        height={400}
                    />
                )}
                {imageUrls.length < 1 && (
                    <Image src="/placeholders/menu.png" alt={title} className="pointer-events-none object-cover" width={500} height={400} />
                )}
                <button type="button" className="absolute inset-0 focus:outline-none">
                    <span className="sr-only">View details for {title}</span>
                </button>
            </div>

            {/* <div>
                <Carousel
                    className="overflow-hidden"
                    navigation={({ setActiveIndex, activeIndex, length }) => (
                        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                            {new Array(length).fill('').map((_, i) => (
                                <span
                                    key={i}
                                    className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? 'w-8 bg-white' : 'w-4 bg-white/50'}`}
                                    onClick={(e) => {
                                        setActiveIndex(i);
                                        e.preventDefault();
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    placeholder={undefined}
                >
                    {imageUrls.map((imageUrl) => (
                        <Image
                            key={imageUrl}
                            src={imageUrl}
                            alt="image 1"
                            className="h-full w-full object-center rounded-xl "
                            width={500}
                            height={400}
                        />
                    ))}
                    {imageUrls.length < 1 && (
                        <Image
                            src="/placeholders/menu.png"
                            alt="image 1"
                            className="h-full w-full object-center rounded-xl "
                            width={500}
                            height={400}
                        />
                    )}
                </Carousel>
            </div> */}

            <dt className="text-black font-semibold truncate pt-4">{title}</dt>
            {kitchenTitle && (
                <dt className="text-gray-500 truncate">
                    {courseCount} Gänge Menü - {kitchenTitle}
                </dt>
            )}
            {!kitchenTitle && <dt className="text-gray-500 truncate">{courseCount} Gänge Menü</dt>}
            <dt className="text-gray-500 truncate">{categoryTitles.length > 0 ? categoryTitles.join(', ') : 'Keine Kategorien'}</dt>
            <dt className="text-gray-500 truncate">Koch {cook.firstName}</dt>
            <dt className="text-black truncate flex justify-end">{pricePerPerson} pro Person</dt>
        </li>
    );
}
