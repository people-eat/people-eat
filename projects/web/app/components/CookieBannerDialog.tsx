import { useMutation, useQuery } from '@apollo/client';
import { PEButton } from '@people-eat/web-components';
import { FindCurrentSessionDocument, UpdateSessionCookieSettingsDocument } from '@people-eat/web-domain';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function CookieBannerDialog() {
    const [showCookieBanner, setShowCookieBanner] = useState(false);

    const { data, loading, refetch } = useQuery(FindCurrentSessionDocument);
    const [updateCookieSettings] = useMutation(UpdateSessionCookieSettingsDocument);

    useEffect(() => {
        if (!data?.sessions.current?.cookieSettings && !loading) setShowCookieBanner(true);
        if (data?.sessions.current?.cookieSettings) setShowCookieBanner(false);
    }, [data, loading]);

    return (
        <>
            {showCookieBanner && (
                <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4 z-10">
                    <div className="bg-gray-50 shadow-lg rounded-lg max-w-6xl w-full p-4 flex flex-col sm:flex-row gap-2">
                        <div className="flex flex-col gap-2">
                            <h3 className="font-semibold text-base">Wir verwenden Cookies</h3>
                            <p className="text-gray-800 text-xs">
                                Wir verwenden Cookies und ähnliche Technologien, um Inhalte zu personalisieren, das Nutzererlebnis zu
                                optimieren sowie um personalisiertes Marketing zu verwenden. Indem du auf alles klar klickst oder nur
                                notwenige cookies aktivierst, stimmst du dem zu. Du kannst Deine Einwilligung zur Datenverarbeitung und
                                -übermittlung jederzeit widerrufen. Weitere Details hierzu findest du in unserer{' '}
                                <Link
                                    href="privacy-policy"
                                    className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 text-orange-500"
                                    target="_blank"
                                    tabIndex={-1}
                                >
                                    Datenschutzrichtlinien
                                </Link>{' '}
                                .
                            </p>
                        </div>
                        <div className="flex gap-2 items-center justify-end">
                            <PEButton
                                title="Nur notwendige"
                                type="secondary"
                                onClick={(): void => {
                                    void updateCookieSettings({
                                        variables: {
                                            request: {
                                                sessionCookie: true,
                                                googleAnalytics: false,
                                                clarity: false,
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
                                                clarity: true,
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
                </div>
            )}

            {/* <PEDialog title="Privatsphäre-Einstellungen" open={showCookieBanner}>
                <div className="flex flex-col gap-8 pl-4 pr-4">
                    <p>
                        Wir verwenden Cookies und ähnliche Technologien auf unserer Website und verarbeiten personenbezogene Daten von dir,
                        um Inhalte und Anzeigen zu personalisieren, Medien von Drittanbietern einzubinden oder Zugriffe auf unsere Website
                        zu analysieren. Die Datenverarbeitung kann auch erst in Folge gesetzter Cookies stattfinden. Wir teilen diese Daten
                        mit Dritten, die wir in den{' '}
                        <Link
                            href="privacy-policy"
                            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 text-orange-500"
                            target="_blank"
                            tabIndex={-1}
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
                                            clarity: false,
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
                                            clarity: acceptedThirdPartyCookies,
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
                                            clarity: true,
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
            </PEDialog> */}
        </>
    );
}
