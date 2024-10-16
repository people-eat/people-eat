import { useLazyQuery, useMutation, useQuery, useSubscription } from '@apollo/client';
import { ChatTextArea, LoadingDialog } from '@people-eat/web-components';
import { PEAlert, PEButton, PETextField } from '@people-eat/web-components';
import {
    BookingRequestChatMessageCreationsDocument,
    ChatMessage,
    CookBookingRequestAcceptDocument,
    CookBookingRequestDeclineDocument,
    CookGetStripeOnboardingUrlDocument,
    CreateOneCookBookingRequestChatMessageDocument,
    FindManyCookBookingRequestChatMessagesDocument,
    GetProfileBookingsPageDataQuery,
    UpdateCookHasStripePayoutMethodActivatedDocument,
} from '@people-eat/web-domain';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PEChatMessage } from './PEChatMessage';

export interface CookProfileBookingRequestChatProps {
    cookId: string;
    hasStripePayoutMethodActivated: boolean;
    bookingRequest: NonNullable<GetProfileBookingsPageDataQuery['cooks']['bookingRequests']['findOne']>;
    onRequireUpdate: () => void;
}

export function CookProfileBookingRequestChat({
    cookId,
    hasStripePayoutMethodActivated,
    bookingRequest,
    onRequireUpdate,
}: CookProfileBookingRequestChatProps) {
    const router = useRouter();
    const { bookingRequestId, status, cookAccepted, userAccepted } = bookingRequest;
    const chatBottom = useRef<HTMLDivElement>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    const { data } = useQuery(FindManyCookBookingRequestChatMessagesDocument, {
        variables: { cookId, bookingRequestId },
    });
    const [accept, { loading: acceptLoading }] = useMutation(CookBookingRequestAcceptDocument, {
        variables: { cookId, bookingRequestId },
    });
    const [decline, { loading: declineLoading }] = useMutation(CookBookingRequestDeclineDocument, {
        variables: { cookId, bookingRequestId },
    });

    const [send] = useMutation(CreateOneCookBookingRequestChatMessageDocument);

    // const {
    //     register,
    //     handleSubmit,
    //     setValue,
    //     formState: { errors },
    // } = useForm<{ message: string }>();

    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showDeclineDialog, setShowDeclineDialog] = useState(false);
    const [showStripeNotSetupDialog, setStripeNotSetupDialog] = useState(false);

    useSubscription(BookingRequestChatMessageCreationsDocument, {
        variables: { bookingRequestId: bookingRequest.bookingRequestId },
        onData: ({ data: subscriptionData }) => {
            const newChatMessage = subscriptionData.data?.bookingRequestChatMessageCreations;
            if (!newChatMessage) return;
            setChatMessages([...chatMessages, newChatMessage]);
            setTimeout(() => scrollToChatBottom(), 200);
            if (newChatMessage.generated) onRequireUpdate();
        },
    });

    function scrollToChatBottom(): void {
        chatBottom.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
        });
    }

    useEffect(() => {
        const fetchedChatMessages = data?.cooks.bookingRequests.chatMessages.findMany;
        if (fetchedChatMessages) setChatMessages(fetchedChatMessages);
        setTimeout(() => scrollToChatBottom(), 200);
    }, [data]);

    useEffect(() => scrollToChatBottom(), []);

    const sortedChatMessages = chatMessages.map((chatMessage) => ({ ...chatMessage }));

    sortedChatMessages.sort(
        (chatMessageA, chatMessageB) => new Date(chatMessageA.createdAt).getTime() - new Date(chatMessageB.createdAt).getTime(),
    );

    const [getStripeOnboardingUrl, { loading: loadingStripeOnboardingUrl }] = useLazyQuery(CookGetStripeOnboardingUrlDocument, {
        variables: { cookId, returnBookingId: bookingRequestId },
    });

    const [
        requestHasStripePayoutMethodActivatedUpdate,
        { loading: walletUpdateLoading, reset: resetUpdateWallet, data: updateWalletData },
    ] = useMutation(UpdateCookHasStripePayoutMethodActivatedDocument, { variables: { cookId } });

    const updateWalletStatus = typeof router.query['update-wallet-status'] === 'string';

    function updateHasStripePayoutMethodActivated() {
        requestHasStripePayoutMethodActivatedUpdate()
            // .then(() => router.replace({ query: { bookingItems: router.query.bookingItems } }, undefined, { scroll: false }))
            .then(onRequireUpdate);
    }

    useEffect(() => {
        if (updateWalletStatus) updateHasStripePayoutMethodActivated();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [text, setText] = useState('');

    return (
        <div className="flex flex-col gap-2 flex-1 overflow-hidden pb-4">
            <div className="flex flex-col gap-4 flex-1 overflow-y-auto p-4">
                {sortedChatMessages.map((chatMessage) => (
                    <PEChatMessage key={chatMessage.chatMessageId} chatMessage={chatMessage} isAuthor={chatMessage.createdBy === cookId} />
                ))}
                <div data-element="chat-bottom" ref={chatBottom} />
            </div>

            <div className="ml-4 mr-4">
                {(status === 'PENDING' || status === 'COMPLETED') && (
                    // <form
                    //     autoComplete="off"
                    //     onKeyDown={(e) => {
                    //         if (e.key === 'Enter') e.preventDefault();
                    //     }}
                    //     onSubmit={handleSubmit(({ message }) =>
                    //         send({ variables: { cookId, bookingRequestId, request: { message } } }).then(
                    //             ({ data }) => data?.cooks.bookingRequests.chatMessages.success && setValue('message', ''),
                    //         ),
                    //     )}
                    //     className="flex gap-4 items-center"
                    // >
                    //     <PETextField
                    //         id="chat-message"
                    //         placeholder="Deine Nachricht"
                    //         type="text"
                    //         errorMessage={errors.message?.message}
                    //         {...register('message', { required: true })}
                    //     />
                    //     <PEButton type="submit" title="Senden" />
                    // </form>
                    <div className="flex gap-4 items-end">
                        <ChatTextArea text={text} setText={setText} maxRows={4} placeholder="Deine Nachricht" />
                        <div>
                            <PEButton
                                title="Senden"
                                onClick={() =>
                                    send({ variables: { cookId, bookingRequestId, request: { message: text } } }).then(
                                        ({ data }) => data?.cooks.bookingRequests.chatMessages.success && setText(''),
                                    )
                                }
                            />
                        </div>
                    </div>
                )}

                {status === 'OPEN' && (
                    <div className="flex justify-end gap-4">
                        {userAccepted === true && cookAccepted === null && (
                            <>
                                <PEButton title="Ablehnen" onClick={() => setShowDeclineDialog(true)} type="secondary" />
                                <PEButton
                                    onClick={() =>
                                        hasStripePayoutMethodActivated ? setShowAcceptDialog(true) : setStripeNotSetupDialog(true)
                                    }
                                    title="Akzeptieren"
                                />
                            </>
                        )}
                        {userAccepted === null && cookAccepted === true && (
                            <PEButton onClick={() => setShowDeclineDialog(true)} title="Ablehnen" />
                        )}
                    </div>
                )}
            </div>

            <PEAlert
                open={showAcceptDialog}
                type="SUCCESS"
                title="Buchungsanfrage akzeptieren"
                subtitle=""
                primaryButton={{
                    title: 'Akzeptieren',
                    onClick: () => {
                        accept().then(onRequireUpdate);
                        setShowAcceptDialog(false);
                    },
                }}
                secondaryButton={{
                    title: 'Abbrechen',
                    onClick: () => setShowAcceptDialog(false),
                }}
            />

            <PEAlert
                open={showDeclineDialog}
                type="ERROR"
                title="Buchungsanfrage ablehnen"
                subtitle=""
                primaryButton={{
                    title: 'Ablehnen',
                    onClick: () => {
                        decline().then(onRequireUpdate);
                        setShowDeclineDialog(false);
                    },
                }}
                secondaryButton={{
                    title: 'Abbrechen',
                    onClick: () => setShowDeclineDialog(false),
                }}
            />

            <PEAlert
                open={showStripeNotSetupDialog}
                type="INFO"
                title="Wallet notwendig"
                subtitle="Um Buchungsanfragen akzeptieren zu können, muss die Eirichtung der Wallet abgeschlossen sein."
                primaryButton={{
                    title: 'Wallet einrichten',
                    onClick: () => {
                        setStripeNotSetupDialog(false);
                        void getStripeOnboardingUrl()
                            .then(({ data: sData }) => {
                                if (sData?.cooks.getStripeOnboardingUrl) router.push(sData.cooks.getStripeOnboardingUrl);
                            })
                            .catch((e) => console.error(e));
                    },
                }}
                secondaryButton={{
                    title: 'Abbrechen',
                    onClick: () => setStripeNotSetupDialog(false),
                }}
            />

            <LoadingDialog active={acceptLoading || declineLoading} />
        </div>
    );
}
