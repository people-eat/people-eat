import { MealCard, PECookProfileNavigation, PEHeader } from '@people-eat/web-components';
import { PELabelMultiSelection, PELink } from '@people-eat/web-core-components';
import {
    GetCookProfileMealsPageDataDocument,
    GetCookProfileMealsPageDataQuery,
    GetSignedInUserDocument,
    MealType,
    SignedInUser,
    mealTypeTranslations,
    mealTypes,
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
    initialMeals: GetCookProfileMealsPageDataQuery['cooks']['meals']['findMany'];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isCook) return howToBecomeAChefRedirect;
        const cookId = signedInUser.userId;

        const result = await apolloClient.query({ query: GetCookProfileMealsPageDataDocument, variables: { cookId } });

        return {
            props: {
                signedInUser,
                initialMeals: result.data.cooks.meals.findMany,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function CookProfileMealsPage({ signedInUser, initialMeals }: ServerSideProps) {
    const [meals] = useState(initialMeals);
    const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);

    const filteredMeals = selectedMealTypes.length > 0 ? meals.filter(({ type }) => selectedMealTypes.includes(type)) : meals;

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-8">
                <PECookProfileNavigation current="MEALS" />

                <PEProfileCard className="flex gap-8 justify-between items-center">
                    <PELabelMultiSelection
                        options={mealTypes}
                        selectedOptions={selectedMealTypes}
                        selectedOptionsChanged={setSelectedMealTypes}
                        optionTitle={(mealType) => mealTypeTranslations[mealType]}
                        optionIdentifier={(mealType) => mealType}
                    />
                    <div>
                        <PELink title="Neues Gericht" href="/chef-profile/meals/create" className="hidden lg:inline" />
                        <PELink title="+" href="/chef-profile/meals/create" className="lg:hidden" />
                    </div>
                </PEProfileCard>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
                    {filteredMeals.map(({ mealId, title, description, imageUrl }) => (
                        <Link key={mealId} href={{ pathname: '/chef-profile/meals/' + mealId }}>
                            <MealCard
                                type="SIMPLE"
                                title={title}
                                description={description}
                                imageUrl={imageUrl}
                                onInfoClick={() => undefined}
                            />
                        </Link>
                    ))}
                </ul>
            </div>
        </div>
    );
}
