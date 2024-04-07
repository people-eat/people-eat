import { useMutation } from '@apollo/client';
import { LoadingDialog, PEFooter, PEHeader } from '@people-eat/web-components';
import { PEAlert } from '@people-eat/web-core-components';
import { ConfirmOneEmailAddressUpdateDocument } from '@people-eat/web-domain';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EmailAddressUpdateConfirmationPage() {
    const router = useRouter();
    const secret = router.query.secret;

    const [state, setState] = useState<'LOADING' | 'FAILED' | 'SUCCESSFUL'>('LOADING');

    const [confirmOneEmailAddressUpdate] = useMutation(ConfirmOneEmailAddressUpdateDocument);

    useEffect(() => {
        if (!secret || typeof secret !== 'string') {
            setState('FAILED');
            return;
        }
        confirmOneEmailAddressUpdate({ variables: { secret } })
            .then(({ data }) => {
                if (!data?.users.emailAddressUpdate.success) {
                    setState('FAILED');
                    return;
                }
                setState('SUCCESSFUL');
            })
            .catch(() => setState('FAILED'));
    }, [confirmOneEmailAddressUpdate, secret]);

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
                <PEHeader signedInUser={null} />

                <LoadingDialog active={state === 'LOADING'} />

                <PEAlert
                    open={state === 'FAILED'}
                    type="ERROR"
                    title="Da ist etwas schief gelaufen"
                    subtitle="Es ist ein unerwarteter Fehler aufgetreten"
                    primaryButton={{
                        title: 'Zur Anmeldung',
                        onClick: () => router.push('/sign-in'),
                    }}
                />

                <PEAlert
                    open={state === 'SUCCESSFUL'}
                    type="SUCCESS"
                    title="Deine Email Adresse wurde erfolgreich bestätigt"
                    subtitle={undefined}
                    primaryButton={{
                        title: 'Zum Benutzerprofil',
                        onClick: () => router.push('/profile'),
                    }}
                />

                <PEFooter />
            </div>
        </>
    );
}
