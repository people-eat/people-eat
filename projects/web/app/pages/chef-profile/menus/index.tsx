import { MenuCard, PECookProfileNavigation, PEHeader } from '@people-eat/web-components';
import { PELink } from '@people-eat/web-core-components';
import {
    GetCookProfileMenusPageDataDocument,
    GetCookProfileMenusPageDataQuery,
    GetSignedInUserDocument,
    SignedInUser,
    calculateMenuPrice,
    formatPrice,
} from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { PEProfileCard } from '../../../components/PEProfileCard';
import { createApolloClient } from '../../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const howToBecomeAChefRedirect = { redirect: { permanent: false, destination: '/how-to-become-a-chef' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    initialMenus: GetCookProfileMenusPageDataQuery['cooks']['menus']['findMany'];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isCook) return howToBecomeAChefRedirect;
        const cookId = signedInUser.userId;

        const result = await apolloClient.query({ query: GetCookProfileMenusPageDataDocument, variables: { cookId } });

        return {
            props: {
                signedInUser,
                initialMenus: result.data.cooks.menus.findMany,
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

            <div className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-8">
                <PECookProfileNavigation current="MENUS" />

                <PEProfileCard className="flex gap-8 justify-end">
                    <div>
                        <PELink title="Neues Menü" href="/chef-profile/menus/create" />
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
                            <Link key={menuId} href={{ pathname: '/chef-profile/menus/' + menuId }}>
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
