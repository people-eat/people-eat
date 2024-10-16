import { MenuCard, PEHeader, PELink, PEProfileNavigation } from '@people-eat/web-components';
import {
    GetCookProfileMenusPageDataDocument,
    GetCookProfileMenusPageDataQuery,
    SignedInUser,
    calculateMenuPrice,
    formatPrice,
} from '@people-eat/web-domain';
import { GetServerSideProps, Redirect } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { CookieSettings } from '../../../components/analytics/CookieSettings';
import { PEProfileCard } from '../../../components/PEProfileCard';
import { redirectTo } from '../../../components/redirectTo';
import { createApolloClient } from '../../../network/apolloClients';

const howToBecomeAChefRedirect: { redirect: Redirect } = { redirect: { permanent: false, destination: '/how-to-become-a-chef' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    cookieSettings: CookieSettings | null;
    initialMenus: NonNullable<NonNullable<GetCookProfileMenusPageDataQuery['sessions']['current']['user']>['cook']>['menus'];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const { data } = await apolloClient.query({ query: GetCookProfileMenusPageDataDocument });
        const user = data.sessions.current.user;
        if (!user) return redirectTo.signIn({ returnTo: req.url });
        if (!user.cook) return howToBecomeAChefRedirect;

        return {
            props: {
                signedInUser: user,
                initialMenus: user.cook.menus,
                cookieSettings: data.sessions.current.cookieSettings
                    ? {
                          googleAnalytics: data.sessions.current.cookieSettings.googleAnalytics ?? null,
                          clarity: data.sessions.current.cookieSettings.clarity ?? null,
                      }
                    : null,
            },
        };
    } catch (error) {
        console.error(error);
        throw new Error();
    }
};

export default function CookProfileMenusPage({ signedInUser, initialMenus }: ServerSideProps) {
    const [menus] = useState(initialMenus);

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-[88rem] px-4 pb-16 pt-8 sm:px-6 lg:px-8 flex flex-col gap-8">
                <PEProfileNavigation current="MENUS" isCook />

                <PEProfileCard className="flex gap-8 justify-end">
                    <div>
                        <PELink title="Neues Menü" href="/profile/menus/create" />
                    </div>
                </PEProfileCard>

                <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8 m-4">
                    {menus.map(
                        ({
                            menuId,
                            title,
                            imageUrl,
                            kitchen,
                            categories,
                            basePrice,
                            basePriceCustomers,
                            pricePerAdult,
                            pricePerChild,
                            courseCount,
                        }) => (
                            <Link key={menuId} href={{ pathname: '/profile/menus/' + menuId }}>
                                <MenuCard
                                    title={title}
                                    imageUrls={imageUrl ? [imageUrl] : []}
                                    kitchenTitle={kitchen?.title}
                                    cook={{
                                        firstName: signedInUser.firstName,
                                        profilePictureUrl: null,
                                    }}
                                    courseCount={courseCount}
                                    pricePerPerson={formatPrice({
                                        amount:
                                            calculateMenuPrice(
                                                basePriceCustomers,
                                                0,
                                                basePrice,
                                                basePriceCustomers,
                                                pricePerAdult,
                                                pricePerChild,
                                            ) /
                                            (basePriceCustomers + 0),
                                        currencyCode: '€',
                                    })}
                                    categoryTitles={categories.map(({ title }) => title)}
                                />
                            </Link>
                        ),
                    )}
                </ul>
            </div>
        </div>
    );
}
