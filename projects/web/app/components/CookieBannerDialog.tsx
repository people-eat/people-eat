import { useMutation, useQuery } from '@apollo/client';
import { PEButton, PECheckbox, PEDialog } from '@people-eat/web-core-components';
import { FindCurrentSessionDocument, UpdateSessionCookieSettingsDocument } from '@people-eat/web-domain';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export interface CookieBannerFormInputs {
    acceptedSessionCookies: boolean;
    acceptedThirdPartyCookies: boolean;
}

export function CookieBannerDialog() {
    const [showCookieBanner, setShowCookieBanner] = useState(false);

    const { data, loading, refetch } = useQuery(FindCurrentSessionDocument);
    const [updateCookieSettings] = useMutation(UpdateSessionCookieSettingsDocument);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CookieBannerFormInputs>();

    const { acceptedSessionCookies, acceptedThirdPartyCookies } = watch();

    useEffect(() => {
        console.log('called');
        if (!data?.sessions.current?.cookieSettings && !loading) setShowCookieBanner(true);

        if (data?.sessions.current?.cookieSettings) {
            setShowCookieBanner(false);
            setValue('acceptedSessionCookies', Boolean(data.sessions.current.cookieSettings.sessionCookie));
            setValue('acceptedThirdPartyCookies', Boolean(data.sessions.current.cookieSettings.googleAnalytics));
        }
    }, [data, loading, setValue]);

    return (
        <PEDialog title="Privatsphäre-Einstellungen" open={showCookieBanner}>
            <div className="flex flex-col gap-8 pl-4 pr-4">
                <p>
                    Wir verwenden Cookies und ähnliche Technologien auf unserer Website und verarbeiten personenbezogene Daten von dir, um
                    Inhalte und Anzeigen zu personalisieren, Medien von Drittanbietern einzubinden oder Zugriffe auf unsere Website zu
                    analysieren. Die Datenverarbeitung kann auch erst in Folge gesetzter Cookies stattfinden. Wir teilen diese Daten mit
                    Dritten, die wir in den{' '}
                    <Link
                        href="privacy-policy"
                        className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 text-orange-500"
                        target="_blank"
                    >
                        Datenschutzrichtlinien
                    </Link>{' '}
                    benennen.
                </p>

                <form onSubmit={handleSubmit(() => undefined)}>
                    <fieldset className="space-y-5">
                        <PECheckbox
                            id="accepted-session-cookies"
                            label={{ title: 'Sitzungs-Cookies / Session-Cookies' }}
                            errorMessage={errors.acceptedSessionCookies?.message}
                            {...register('acceptedSessionCookies')}
                        />
                        <PECheckbox
                            id="third-party-cookies-accepted"
                            label={{ title: 'Drittanbieter-Cookies' }}
                            errorMessage={errors.acceptedThirdPartyCookies?.message}
                            {...register('acceptedThirdPartyCookies')}
                        />
                    </fieldset>
                </form>

                {/* Start of action */}

                <div className="flex gap-2 self-end">
                    <PEButton
                        title="Ablehnen"
                        type="secondary"
                        onClick={(): void => {
                            void updateCookieSettings({
                                variables: {
                                    request: {
                                        sessionCookie: false,
                                        googleAnalytics: false,
                                    },
                                },
                            }).then((result) => {
                                if (result.data?.sessions.success) setShowCookieBanner(false);
                                void refetch();
                            });
                        }}
                    />
                    <PEButton
                        title="Auswahl akzeptieren"
                        type="secondary"
                        onClick={(): void => {
                            void updateCookieSettings({
                                variables: {
                                    request: {
                                        sessionCookie: acceptedSessionCookies,
                                        googleAnalytics: acceptedThirdPartyCookies,
                                    },
                                },
                            }).then((result) => {
                                if (result.data?.sessions.success) setShowCookieBanner(false);
                                void refetch();
                            });
                        }}
                    />
                    <PEButton
                        title="Alle akzeptieren"
                        onClick={(): void => {
                            void updateCookieSettings({
                                variables: {
                                    request: {
                                        sessionCookie: true,
                                        googleAnalytics: true,
                                    },
                                },
                            }).then((result) => {
                                if (result.data?.sessions.success) setShowCookieBanner(false);
                                void refetch();
                            });
                        }}
                    />
                </div>
            </div>
        </PEDialog>
    );
}
