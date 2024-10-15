import { PEFooter, PEHeader } from '@people-eat/web-components';
import { GetPageDataDocument, SignedInUser } from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { AnalyticsClarity } from '../../components/analytics/AnalyticsClarity';
import { AnalyticsGoogle } from '../../components/analytics/AnalyticsGoogle';
import { CookieSettings } from '../../components/analytics/CookieSettings';
import { createApolloClient } from '../../network/apolloClients';

const posts = [
    {
        id: 1,
        title: 'Warum sollte ich einen Privatkoch buchen?',
        href: '/blogs/warum-sollte-ich-einen-privatekoch-buchen',
        description:
            'Dass Essen ist weit mehr als nur eine Notwendigkeit. Es ist ein Erlebnis, das unsere Sinne anspricht, uns verbindet und Erinnerungen schafft. Ein Privatkoch ist der Schlüssel zu diesem besonderen kulinarischen Erlebnis, das weit über den gewöhnlichen Restaurantbesuch hinausgeht. In diesem Blogbeitrag erfährst du, warum du einen Privatkoch buchen solltest, um einzigartige Genussmomente in deinen eigenen vier Wänden zu erleben.',
        imageUrl: '/blogs/privatkoch-koeln.jpg',
        date: '6. März 2024',
        datetime: '2024-03-6',
        category: { title: 'Gastgeber' },
        author: {
            name: 'Daniel',
            role: 'Co-Founder',
        },
    },
    {
        id: 2,
        title: 'Top 10 einzigartige Geschenkideen für den Vatertag: Mache diesen Tag unvergesslich',
        href: '/blogs/geschenkideen-fuer-den-vatertag',
        description:
            'Ein unvergessliches Dinner-Party-Erlebnis zu schaffen, das deine Gäste beeindruckt und begeistert, erfordert mehr als nur gutes Essen. Mit einem Privatkoch sorgst du dafür, dass dein besonderer Anlass perfekt wird. Von der Zubereitung der Gerichte, bis hin zum Verlassen einer sauberen Küche sorgt der Koch dafür, dass du und deine Gäste einen unvergesslichen Abend habt.',
        imageUrl: '/blogs/vatertag.jpeg',
        date: '1. Mai 2024',
        datetime: '2024-05-1',
        category: { title: 'Gastgeber' },
        author: {
            name: 'Daniel',
            role: 'Co-Founder',
        },
    },
    {
        id: 3,
        title: 'Wie man ein unvergessliches Dinner-Party-Erlebnis mit einem Privatkoch schafft',
        href: '/blogs/kuechen-party',
        description:
            'Ein unvergessliches Dinner-Party-Erlebnis zu schaffen, das deine Gäste beeindruckt und begeistert, erfordert mehr als nur gutes Essen. Mit einem Privatkoch sorgst du dafür, dass dein besonderer Anlass perfekt wird. Von der Zubereitung der Gerichte, bis hin zum Verlassen einer sauberen Küche sorgt der Koch dafür, dass du und deine Gäste einen unvergesslichen Abend habt.',
        imageUrl: '/blogs/kuechen-party.jpeg',
        date: '9. Mai 2024',
        datetime: '2024-05-9',
        category: { title: 'Gastgeber' },
        author: {
            name: 'Daniel',
            role: 'Co-Founder',
        },
    },
];

interface ServerSideProps {
    signedInUser: SignedInUser | null;
    cookieSettings: CookieSettings | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetPageDataDocument });

        return {
            props: {
                signedInUser: data.sessions.current.user ?? null,
                cookieSettings: data.sessions.current.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function BlogsPage({ signedInUser, cookieSettings }: ServerSideProps) {
    return (
        <>
            <AnalyticsGoogle enabled={cookieSettings?.googleAnalytics} />
            <AnalyticsClarity enabled={cookieSettings?.clarity} />

            <PEHeader signedInUser={signedInUser} />

            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-[88rem] px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">PeopleEat Newsroom</h2>
                        <p className="mt-2 text-lg leading-8 text-gray-600">
                            Begleite uns bei unserer Startup Story und erhalte Einblicke über Gastgeber und Privatköche
                        </p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {posts.map((post) => (
                            <article key={post.id} className="flex flex-col items-start justify-between">
                                <div className="relative w-full">
                                    <Image
                                        src={post.imageUrl}
                                        alt=""
                                        className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                                        width={400}
                                        height={300}
                                    />
                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                                </div>
                                <div className="max-w-xl">
                                    <div className="mt-8 flex items-center gap-x-4 text-xs">
                                        <time dateTime={post.datetime} className="text-gray-500">
                                            {post.date}
                                        </time>
                                        <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                                            {post.category.title}
                                        </span>
                                    </div>
                                    <div className="group relative">
                                        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                            <a href={post.href}>
                                                <span className="absolute inset-0" />
                                                {post.title}
                                            </a>
                                        </h3>
                                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.description}</p>
                                    </div>
                                    <div className="relative mt-8 flex items-center gap-x-4">
                                        <div className="text-sm leading-6">
                                            <p className="font-semibold text-gray-900">
                                                <span className="absolute inset-0" />
                                                {post.author.name}
                                            </p>
                                            <p className="text-gray-600">{post.author.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            {/* <div className="mx-auto max-w-[88rem] py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="relative isolate overflow-hidden bg-violet-950 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
                    <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Boost your productivity today.
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                        Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do
                        ea.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="#"
                            className="rounded-md bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Get started
                        </a>
                        <a href="#" className="text-sm font-semibold leading-6 text-white">
                            Learn more <span aria-hidden="true">→</span>
                        </a>
                    </div>
                    <svg
                        viewBox="0 0 1024 1024"
                        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
                        aria-hidden="true"
                    >
                        <circle cx={512} cy={512} r={512} fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)" />
                        <defs>
                            <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                                <stop stopColor="#f97316" />
                                <stop offset={1} stopColor="#f97316" />
                            </radialGradient>
                        </defs>
                    </svg>
                </div>
            </div> */}

            <PEFooter />
        </>
    );
}
