import { useLazyQuery, useMutation } from '@apollo/client';
import { LoadingDialog, PEFooter, PEHeader } from '@people-eat/web-components';
import { PEAlert, PEButton, PEDialog, PETextField } from '@people-eat/web-core-components';
import { ConfirmOneOneTimeAccessTokenDocument, GetSignedInUserDocument, UpdateUserPasswordDocument } from '@people-eat/web-domain';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// todo: rename
interface SignUpFormInputs {
    password: string;
    passwordRepeat: string;
}

export default function ForgotPasswordConfirmPage() {
    // const router = useRouter();
    // const secret = router.query.secret;

    // const [state, setState] = useState<'LOADING' | 'FAILED' | 'SUCCESSFUL'>('LOADING');

    // const [confirmOneEmailAddressUpdate] = useMutation(ConfirmOneEmailAddressUpdateDocument);

    // useEffect(() => {
    //     if (!secret || typeof secret !== 'string') {
    //         setState('FAILED');
    //         return;
    //     }
    //     confirmOneEmailAddressUpdate({ variables: { secret } })
    //         .then(({ data }) => {
    //             if (!data?.users.emailAddressUpdate.success) {
    //                 setState('FAILED');
    //                 return;
    //             }
    //             setState('SUCCESSFUL');
    //         })
    //         .catch(() => setState('FAILED'));
    // }, [confirmOneEmailAddressUpdate, secret]);

    // return (
    //     <>
    //         <Head>
    //             <title>PeopleEat - Email Adresse bestätigen</title>

    //             <meta name="title" content="" />
    //             <meta name="description" content="" />
    //             <meta name="keywords" content="" />

    //             <link rel="icon" href="/favicon.ico" />
    //         </Head>

    //         <div className="w-full min-h-screen flex flex-col gap-16">
    //             <PEHeader signedInUser={null} />

    //             <LoadingDialog active={state === 'LOADING'} />

    //             <PEAlert
    //                 open={state === 'FAILED'}
    //                 type="ERROR"
    //                 title="Da ist etwas schief gelaufen"
    //                 subtitle="Es ist ein unerwarteter Fehler aufgetreten"
    //                 primaryButton={{
    //                     title: 'Zur Anmeldung',
    //                     onClick: () => router.push('/sign-in'),
    //                 }}
    //             />

    //             <PEAlert
    //                 open={state === 'SUCCESSFUL'}
    //                 type="SUCCESS"
    //                 title="Deine Email Adresse wurde erfolgreich bestätigt"
    //                 subtitle={undefined}
    //                 primaryButton={{
    //                     title: 'Zum Benutzerprofil',
    //                     onClick: () => router.push('/profile'),
    //                 }}
    //             />

    //             <PEFooter />
    //         </div>
    //     </>

    const router = useRouter();
    const oneTimeAccessToken = router.query.oneTimeAccessToken;

    const [state, setState] = useState<'LOADING' | 'FAILED' | 'SUCCESSFUL'>('LOADING');

    const [confirmOneTimeAccessToken] = useMutation(ConfirmOneOneTimeAccessTokenDocument, {
        variables: { secret: oneTimeAccessToken as string },
    });

    const [updateUserPassword] = useMutation(UpdateUserPasswordDocument);
    const [getSignedInUser, { data: profileData }] = useLazyQuery(GetSignedInUserDocument);

    useEffect(() => {
        setTimeout(() => {
            confirmOneTimeAccessToken()
                .then(({ data }) => {
                    if (!data?.users.oneTimeAccessToken.success) {
                        setState('FAILED');
                        return;
                    }
                    setState('SUCCESSFUL');
                    void getSignedInUser();
                })
                .catch(() => setState('FAILED'));
        }, 1000);
    }, [confirmOneTimeAccessToken, getSignedInUser]);

    const signedInUserId = profileData?.users.signedInUser?.userId;

    function onSavePassword({ password }: SignUpFormInputs): void {
        if (!signedInUserId) return;
        setState('LOADING');
        updateUserPassword({ variables: { userId: signedInUserId, password } })
            .then(({ data }) => data?.users.success && router.push('/profile'))
            .catch((error) => console.error(error));
    }

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<SignUpFormInputs>();

    return (
        <>
            <Head>
                <title>PeopleEat - forgot password</title>

                <meta name="title" content="" />
                <meta name="description" content="" />
                <meta name="keywords" content="" />

                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col gap-8 w-full min-h-screen">
                <PEHeader signedInUser={null} />

                <LoadingDialog active={state === 'LOADING'} />

                <PEAlert
                    open={state === 'FAILED'}
                    type="ERROR"
                    title="Da ist etwas schief gelaufen"
                    subtitle="Es ist ein unerwarteter Fehler aufgetreten"
                    primaryButton={{
                        title: 'Zurück zur Anmeldung',
                        onClick: () => router.push('/sign-in'),
                    }}
                />

                <PEDialog open={state === 'SUCCESSFUL'} title="Neues Passwort festlegen">
                    <form onSubmit={handleSubmit(onSavePassword)} className="flex flex-col gap-8">
                        <PETextField
                            id="password"
                            labelTitle="Passwort"
                            type="password"
                            autoComplete="new-password"
                            errorMessage={errors.password?.message}
                            {...register('password', {
                                required: 'This field is required',
                                validate: (value) =>
                                    value === getValues('passwordRepeat') || 'Passwörter stimmen nicht miteinander überein',
                            })}
                        />

                        <PETextField
                            id="password-repeat"
                            labelTitle="Passwort wiederholen"
                            type="password"
                            autoComplete=""
                            errorMessage={errors.passwordRepeat?.message}
                            {...register('passwordRepeat', {
                                required: 'This field is required',
                                validate: (value) => value === getValues('password') || 'Passwörter stimmen nicht miteinander überein',
                            })}
                        />

                        <PEButton title="Neues Passwort speichern" type="submit" />
                    </form>
                </PEDialog>

                <PEFooter />
            </div>
        </>
    );
}
