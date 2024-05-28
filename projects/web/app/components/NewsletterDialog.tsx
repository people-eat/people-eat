import { useMutation } from '@apollo/client';
import { Dialog, Transition } from '@headlessui/react';
import { LoadingDialog } from '@people-eat/web-components';
import { PEAlert, PEButton, PETextField } from '@people-eat/web-core-components';
import { CreateOneNewsletterSubscriptionDocument } from '@people-eat/web-domain';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const newsletterAcknowledgedKey = 'newsletter-acknowledged';

export function NewsletterDialog() {
    const [open, setOpen] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [createOne, { loading }] = useMutation(CreateOneNewsletterSubscriptionDocument);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ emailAddress: string }>();

    useEffect(() => {
        const isAcknowledged = localStorage.getItem(newsletterAcknowledgedKey);
        if (!isAcknowledged) {
            // setTimeout(() => setOpen(true), 5000);
            setOpen(true);
        }
    }, []);

    function onDecline() {
        localStorage.setItem(newsletterAcknowledgedKey, 'declined');
        setOpen(false);
    }

    async function onSubscribe(emailAddress: string) {
        localStorage.setItem(newsletterAcknowledgedKey, 'accepted');
        const { data } = await createOne({ variables: { emailAddress } });

        if (data?.newsletterSubscriptions.success) {
            setOpen(false);
            setShowSuccessAlert(true);
        }
    }

    return (
        <>
            <LoadingDialog active={loading} />

            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => undefined}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                    <form onSubmit={handleSubmit(({ emailAddress }) => onSubscribe(emailAddress))}>
                                        <div className="flex flex-col gap-4">
                                            <Image
                                                src="/newsletter/Sommerabend zuhause.jpeg"
                                                width={500}
                                                height={400}
                                                alt="Sommerabend zuhause"
                                                className="rounded-md"
                                            />

                                            <Dialog.Title as="h3" className="text-base font-semibold text-gray-900">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    Wir schenken dir 20€ auf deine ersten Privatkoch Experience! 🤩
                                                </h3>
                                            </Dialog.Title>

                                            <p className="text-sm text-gray-500">
                                                Passend zum Sommer möchten wir Kulinarik und Summer vibes miteinander verbinden und in deine
                                                eigenen vier Wände bringen. Registriere dich für den Newsletter und nutze direkt deine
                                                Vorteile!
                                            </p>

                                            <PETextField
                                                id="email-address"
                                                placeholder="Email Adresse"
                                                type="email"
                                                errorMessage={errors.emailAddress?.message}
                                                {...register('emailAddress', {
                                                    required: 'Bitte gib deine Email Adresse ein.',
                                                    pattern: {
                                                        value: /\S+@\S+\.\S+/,
                                                        message: 'Bitte eine gültige Email Adresse eingeben.',
                                                    },
                                                })}
                                            />
                                        </div>
                                        <div className="mt-5 sm:mt-6 flex gap-2">
                                            <PEButton title="Schließen" type="secondary" className="w-full" onClick={onDecline} />
                                            <PEButton title="20€ erhalten" type="submit" className="w-full" />
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <PEAlert
                open={showSuccessAlert}
                type="SUCCESS"
                title="Der Promo Code wurde erfolgreich an deine Email Adresse versendet"
                primaryButton={{
                    title: 'Fertig',
                    onClick: () => setShowSuccessAlert(false),
                }}
            />
        </>
    );
}
