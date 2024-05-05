import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { LoadingDialog } from '@people-eat/web-components';
import { PEAlert, PEButton, PETextField } from '@people-eat/web-core-components';
import {
    BookingRequestChatMessageCreationsDocument,
    ChatMessage,
    CookBookingRequestAcceptDocument,
    CookBookingRequestDeclineDocument,
    CreateOneCookBookingRequestChatMessageDocument,
    FindManyCookBookingRequestChatMessagesDocument,
    GetCookProfileBookingsPageDataQuery,
} from '@people-eat/web-domain';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PEChatMessage } from './PEChatMessage';
import { useRouter } from 'next/router';

export interface CookProfileBookingRequestChatProps {
    cookId: string;
    hasStripePayoutMethodActivated: boolean;
    bookingRequest: NonNullable<GetCookProfileBookingsPageDataQuery['cooks']['bookingRequests']['findOne']>;
}

export function CookProfileBookingRequestChat({
    cookId,
    hasStripePayoutMethodActivated,
    bookingRequest,
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

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<{ message: string }>();

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

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                {sortedChatMessages.map((chatMessage) => (
                    <PEChatMessage key={chatMessage.chatMessageId} chatMessage={chatMessage} isAuthor={chatMessage.createdBy === cookId} />
                ))}
                <div data-element="chat-bottom" ref={chatBottom} />
            </div>

            {status === 'PENDING' && (
                <form
                    onSubmit={handleSubmit(({ message }) =>
                        send({ variables: { cookId, bookingRequestId, request: { message } } }).then(
                            ({ data }) => data?.cooks.bookingRequests.chatMessages.success && setValue('message', ''),
                        ),
                    )}
                    className="flex gap-4 items-center"
                >
                    <PETextField
                        id="chat-message"
                        placeholder="Deine Nachricht"
                        type="text"
                        errorMessage={errors.message?.message}
                        {...register('message', { required: 'This field is required' })}
                    />
                    <PEButton type="submit" title="Senden" />
                </form>
            )}

            {status === 'OPEN' && (
                <div className="flex justify-end gap-4">
                    {userAccepted === true && cookAccepted === null && (
                        <>
                            <PEButton title="Ablehnen" onClick={() => setShowDeclineDialog(true)} type="secondary" />
                            <PEButton
                                onClick={() => (hasStripePayoutMethodActivated ? setShowAcceptDialog(true) : setStripeNotSetupDialog(true))}
                                title="Akzeptieren"
                            />
                        </>
                    )}
                    {userAccepted === null && cookAccepted === true && (
                        <PEButton onClick={() => setShowDeclineDialog(true)} title="Ablehnen" />
                    )}
                </div>
            )}

            <PEAlert
                open={showAcceptDialog}
                type="SUCCESS"
                title="Buchungsanfrage akzeptieren"
                subtitle=""
                primaryButton={{
                    title: 'Akzeptieren',
                    onClick: () => {
                        accept();
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
                        decline();
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
                        router.push('/chef-profile');
                        setStripeNotSetupDialog(false);
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
