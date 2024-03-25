import { useMutation } from '@apollo/client';
import { LoadingDialog, PECookProfileNavigation, PEHeader } from '@people-eat/web-components';
import { PEAlert, PEDialog, PELabelButton } from '@people-eat/web-core-components';
import {
    GetCookProfileMealPageDataDocument,
    GetSignedInUserDocument,
    MealType,
    SignedInUser,
    UpdateCookMealDescriptionDocument,
    UpdateCookMealImageDocument,
    UpdateCookMealTitleDocument,
    UpdateCookMealTypeDocument,
    mealTypeTranslations,
} from '@people-eat/web-domain';
import { Edit, Trash, Upload } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import { createApolloClient } from '../../../network/apolloClients';

const signInPageRedirect = { redirect: { permanent: false, destination: '/sign-in' } };
const howToBecomeAChefRedirect = { redirect: { permanent: false, destination: '/how-to-become-a-chef' } };

interface ServerSideProps {
    signedInUser: SignedInUser;
    meal: {
        mealId: string;
        title: string;
        description: string;
        imageUrl?: string | null;
        type: MealType;
        createdAt: Date;
    } | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req, query }) => {
    const apolloClient = createApolloClient(req.headers.cookie);

    const { mealId } = query;

    if (typeof mealId !== 'string') throw new Error();

    try {
        const userData = await apolloClient.query({ query: GetSignedInUserDocument });
        const signedInUser = userData.data.users.signedInUser;
        if (!signedInUser) return signInPageRedirect;
        if (!signedInUser.isCook) return howToBecomeAChefRedirect;
        const cookId = signedInUser.userId;

        const result = await apolloClient.query({ query: GetCookProfileMealPageDataDocument, variables: { cookId, mealId } });
        const meal = result.data.cooks.meals.findOne;

        return {
            props: {
                signedInUser,
                meal: meal ?? null,
            },
        };
    } catch (error) {
        throw new Error();
    }
};

export default function CookProfileMealPage({ signedInUser, meal }: ServerSideProps) {
    const cookId = signedInUser.userId;
    const mealId = meal?.mealId ?? '';
    const loading = false;

    const [showDeleteMealAlert, setShowDeleteMealAlert] = useState(false);
    const [showUpdateImageDialog, setShowUpdateImageDialog] = useState(false);

    const [title, setTitle] = useState(meal?.title ?? '');
    const [description, setDescription] = useState(meal?.description ?? '');
    const [type, setType] = useState<MealType>(meal?.type ?? 'VEGETARIAN');
    const [image, setImage] = useState<File | undefined | null>(null);
    const [imageUrl, setImageUrl] = useState(meal?.imageUrl ?? '');

    const [updateMealDescription] = useMutation(UpdateCookMealDescriptionDocument, { variables: { cookId, mealId, description } });
    const [updateMealImage] = useMutation(UpdateCookMealImageDocument, { variables: { cookId, mealId, image: image ?? undefined } });
    const [updateMealTitle] = useMutation(UpdateCookMealTitleDocument, { variables: { cookId, mealId, title } });
    const [updateMealType] = useMutation(UpdateCookMealTypeDocument, { variables: { cookId, mealId, type } });

    function onTypeButtonClick() {}

    return (
        <div>
            <PEHeader signedInUser={signedInUser} />

            <LoadingDialog active={loading} />

            <PEAlert
                open={showDeleteMealAlert}
                title="Bild löschen?"
                subtitle="Die Aktion kann nicht rückgängig gemacht werden."
                primaryButton={{ title: 'Löschen', onClick: () => undefined }}
            />

            <PEDialog open={showUpdateImageDialog}></PEDialog>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-16">
                <PECookProfileNavigation current="MEALS" />

                {meal && (
                    <>
                        <div className="flex gap-8 flex-col md:flex-row items-stretch">
                            <div className="flex flex-col gap-4">
                                <Image
                                    unoptimized
                                    src={meal.imageUrl ?? '/placeholders/meal.png'}
                                    alt=""
                                    width={400}
                                    height={400}
                                    className="rounded-2xl shadow-xl object-cover w-full md:w-[400px]"
                                />
                                <div className="flex gap-8 justify-center">
                                    <button onClick={() => setShowDeleteMealAlert(true)}>
                                        <Trash color="red" />
                                    </button>
                                    <button onClick={() => setShowUpdateImageDialog(true)}>
                                        <Upload />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 flex-1">
                                <div className="flex justify-between items-start gap-4">
                                    <h1 className="font-bold text-3xl tracking-tight text-gray-900">{meal.title}</h1>
                                    <button>
                                        <Edit />
                                    </button>
                                </div>
                                <div>
                                    <PELabelButton
                                        title={mealTypeTranslations[meal.type]}
                                        selected
                                        onSelect={onTypeButtonClick}
                                        onDeselect={onTypeButtonClick}
                                    />
                                </div>

                                <p>{meal.description}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
