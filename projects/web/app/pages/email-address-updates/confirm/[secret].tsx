import { useMutation } from '@apollo/client';
import { LoadingDialog, PEFooter, PEHeader } from '@people-eat/web-components';
import { PEButton, PEDialog } from '@people-eat/web-core-components';
import { ConfirmOneEmailAddressUpdateDocument } from '@people-eat/web-domain';
import Head from 'next/head';
import Image from 'next/image';
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

                <PEDialog open={state === 'FAILED'} onClose={() => undefined}>
                    <h2>Da ist etwas schief gelaufen</h2>
                    <p>Es ist ein unerwarteter Fehler aufgetreten</p>
                </PEDialog>

                <PEDialog open={state === 'SUCCESSFUL'} onClose={() => undefined}>
                    <div className="bg-white">
                        <h2>Deine Email Adresse wurde erfolgreich bestätigt</h2>

                        <div className="flex flex-col gap-4">
                            <Image
                                unoptimized
                                src="/email-confirmation.png"
                                alt=""
                                width={200}
                                height={100}
                                style={{ objectPosition: 'center', objectFit: 'scale-down' }}
                            />
                            <PEButton title="Zum Benutzerprofil" onClick={(): void => void router.push('/profile')} />
                        </div>
                    </div>
                </PEDialog>

                <PEFooter />
            </div>
        </>
    );
}
