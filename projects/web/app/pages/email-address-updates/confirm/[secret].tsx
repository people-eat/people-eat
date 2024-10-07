import { useMutation } from '@apollo/client';
import { EditPasswordForm, LoadingDialog, PEAlert, PEFooter, PEHeader } from '@people-eat/web-components';
import { ConfirmOneEmailAddressUpdateDocument, UpdateUserPasswordDocument } from '@people-eat/web-domain';
import classNames from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function EmailAddressUpdateConfirmationPage() {
    const router = useRouter();
    const secretQueryParam = router.query.secret;
    const returnTo = router.query.returnTo;
    const secret: string | undefined = Boolean(secretQueryParam) && typeof secretQueryParam === 'string' ? secretQueryParam : undefined;

    const [confirmOneEmailAddressUpdate, { data: confirmEmailAddressUpdateData, loading: confirmEmailAddressUpdateLoading }] = useMutation(
        ConfirmOneEmailAddressUpdateDocument,
    );

    useEffect(() => {
        if (!secret) return;
        confirmOneEmailAddressUpdate({ variables: { secret } });
    }, [confirmOneEmailAddressUpdate, secret]);

    const confirmEmailAddressUpdateSuccessful = confirmEmailAddressUpdateData?.users.emailAddressUpdate.confirm.success ?? false;
    const confirmEmailAddressUpdateFailed = confirmEmailAddressUpdateData
        ? !confirmEmailAddressUpdateData.users.emailAddressUpdate.confirm.success
        : false;

    const signedInUser =
        confirmEmailAddressUpdateData?.users.emailAddressUpdate.confirm.__typename ===
        'UserEmailAddressUpdateMutationConfirmationSuccessResult'
            ? confirmEmailAddressUpdateData.users.emailAddressUpdate.confirm.user
            : null;

    const userRequiresPasswordSetup =
        confirmEmailAddressUpdateData?.users.emailAddressUpdate.confirm.__typename ===
            'UserEmailAddressUpdateMutationConfirmationSuccessResult' &&
        !confirmEmailAddressUpdateData.users.emailAddressUpdate.confirm.user.hasPasswordSetUp;

    const [updateUserPassword, { loading: updatePasswordLoading, data: updatePasswordData }] = useMutation(UpdateUserPasswordDocument);
    const success = updatePasswordData?.users.success ?? false;
    const failed = updatePasswordData ? !updatePasswordData.users.success : false;

    const loading = confirmEmailAddressUpdateLoading || updatePasswordLoading;

    return (
        <>
            <Head>
                <title>PeopleEat - Email Adresse bestätigen</title>

                <meta name="title" content="" />
                <meta name="description" content="" />
                <meta name="keywords" content="" />

                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="w-full min-h-screen flex flex-col gap-16">
                <PEHeader signedInUser={signedInUser} />

                <LoadingDialog active={loading} />

                {/* confirm email address alerts */}
                <PEAlert
                    open={confirmEmailAddressUpdateFailed}
                    type="ERROR"
                    title="Da ist etwas schief gelaufen"
                    subtitle="Es ist ein unerwarteter Fehler aufgetreten"
                    primaryButton={{
                        title: 'Zur Anmeldung',
                        onClick: () => router.push('/sign-in'),
                    }}
                />

                <PEAlert
                    open={confirmEmailAddressUpdateSuccessful && !userRequiresPasswordSetup}
                    type="SUCCESS"
                    title="Deine Email Adresse wurde erfolgreich bestätigt"
                    subtitle={undefined}
                    primaryButton={{
                        title: 'Zum Benutzerprofil',
                        onClick: () => router.push('/profile'),
                    }}
                />

                {/* update password alerts */}
                <PEAlert
                    open={success}
                    title="Passwort erfolgreich geändert"
                    primaryButton={{
                        title: 'Schließen',
                        onClick: () => router.push(typeof returnTo === 'string' ? returnTo : '/profile'),
                    }}
                />

                <PEAlert
                    open={failed}
                    type="ERROR"
                    title="Passwort konnte nicht geändert"
                    primaryButton={{ title: 'Erneut versuchen', onClick: () => undefined }}
                />

                {userRequiresPasswordSetup && (
                    <div
                        className={classNames(
                            'mx-auto max-w-[88rem] items-center justify-between gap-x-6 p-6 lg:px-8 w-full',
                            'flex flex-col items-start justify-start',
                        )}
                    >
                        <div className="w-full flex flex-col gap-8">
                            <h1 className="font-bold text-3xl tracking-tight text-gray-900">Ein Password muss vergeben werden.</h1>
                            <EditPasswordForm
                                onComplete={(password) =>
                                    signedInUser && updateUserPassword({ variables: { userId: signedInUser.userId, password } })
                                }
                            />
                        </div>
                    </div>
                )}

                <PEFooter />
            </div>
        </>
    );
}
