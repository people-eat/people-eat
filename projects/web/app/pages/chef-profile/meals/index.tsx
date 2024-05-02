import { useLazyQuery, useMutation } from '@apollo/client';
import { LoadingDialog, MealCard, PECookProfileNavigation, PEHeader } from '@people-eat/web-components';
import { PEAlert, PELabelMultiSelection, PELink } from '@people-eat/web-core-components';
import {
    DeleteOneCookMealDocument,
    GetCookProfileMealsDocument,
    GetCookProfileMealsPageDataDocument,
    GetCookProfileMealsPageDataQuery,
    GetSignedInUserDocument,
    MealType,
    SignedInUser,
    mealTypeTranslations,
    mealTypes,
} from '@people-eat/web-domain';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { CookProfileMealDialog } from '../../../components/CookProfileMealDialog';
import { PEProfileCard } from '../../../components/PEProfileCard';
import { createApolloClient } from '../../../network/apolloClients';
import { useRouter } from 'next/router';

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
    const router = useRouter();
    const cookId = signedInUser.userId;

    const [meals, setMeals] = useState(initialMeals);
    const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);

    const filteredMeals = selectedMealTypes.length > 0 ? meals.filter(({ type }) => selectedMealTypes.includes(type)) : meals;

    // index instead of copy to be able to propagate changes to opened popup
    const [selectedMealIndex, setSelectedMealIndex] = useState<number | undefined>();

    const [getUpdatedMeals] = useLazyQuery(GetCookProfileMealsDocument, { variables: { cookId } });

    function updateMeals() {
        getUpdatedMeals().then(({ data }) => {
            const meals = data?.cooks.meals.findMany;
            if (!meals) return;
            setMeals(meals);
        });
    }

    const [deleteMeal, { loading }] = useMutation(DeleteOneCookMealDocument);

    const [requiredForMenu, setRequiredForMenu] = useState<{ menuId: string; title: string } | undefined>();

    async function onDelete(mealId: string) {
        const result = await deleteMeal({ variables: { cookId, mealId } });

        if (result.data?.cooks.meals.deleteOne.__typename === 'DeleteMealSuccessResult') {
            setSelectedMealIndex(undefined);
            updateMeals();
        }

        if (result.data?.cooks.meals.deleteOne.__typename === 'DeleteMealRequiredForMenuResult') {
            setRequiredForMenu({ menuId: result.data?.cooks.meals.deleteOne.menuId, title: result.data?.cooks.meals.deleteOne.menuTitle });
        }
    }

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <LoadingDialog active={loading} />

            <PEAlert
                open={Boolean(requiredForMenu)}
                type="INFO"
                title="Gericht wird in Menü verwendet"
                subtitle={`Das zu löschende Gericht ist aktuell noch Teil der Auswahloptionen in mindestens einem deiner Menüs '${requiredForMenu?.title ?? ''}. Entferne es aus den Gerichtsoptionen um mit dem Löschen fortzufahren.'`}
                primaryButton={{
                    title: 'Zu Menü',
                    onClick: () => router.push(`/chef-profile/menus/${requiredForMenu?.menuId ?? ''}?tab=1`),
                }}
                secondaryButton={{
                    title: 'Abbrechen',
                    onClick: () => setRequiredForMenu(undefined),
                }}
            />

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-8">
                <PECookProfileNavigation current="MEALS" />

                <PEProfileCard className="flex gap-8 justify-end items-center">
                    <div>
                        <PELink title="Neues Gericht" href="/chef-profile/meals/create" />
                    </div>
                </PEProfileCard>

                <PELabelMultiSelection
                    options={mealTypes}
                    selectedOptions={selectedMealTypes}
                    selectedOptionsChanged={setSelectedMealTypes}
                    optionTitle={(mealType) => mealTypeTranslations[mealType]}
                    optionIdentifier={(mealType) => mealType}
                />

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
                    {filteredMeals.map(({ mealId, type, title, description, imageUrl, createdAt }, index) => (
                        <MealCard
                            key={mealId}
                            type="SIMPLE"
                            title={title}
                            description={description}
                            imageUrl={imageUrl}
                            onInfoClick={() => setSelectedMealIndex(index)}
                        />
                    ))}
                </ul>

                {selectedMealIndex !== undefined && (
                    <CookProfileMealDialog
                        cookId={cookId}
                        meal={meals[selectedMealIndex]}
                        onClose={() => setSelectedMealIndex(undefined)}
                        onDelete={() => onDelete(meals[selectedMealIndex].mealId)}
                        onChangesApplied={updateMeals}
                    />
                )}
            </div>
        </div>
    );
}
