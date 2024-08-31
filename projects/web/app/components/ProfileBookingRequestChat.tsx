import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { ChatTextArea, LoadingDialog, PEAlert, PEButton } from '@people-eat/web-components';
import {
    BookingRequestChatMessageCreationsDocument,
    ChatMessage,
    CreateOneUserBookingRequestChatMessageDocument,
    FindManyUserBookingRequestChatMessagesDocument,
    GetProfileBookingsPageDataQuery,
    UserBookingRequestAcceptDocument,
    UserBookingRequestDeclineDocument,
} from '@people-eat/web-domain';
import { useEffect, useRef, useState } from 'react';
import { PEChatMessage } from './PEChatMessage';

export interface ProfileBookingRequestChatProps {
    userId: string;
    bookingRequest: NonNullable<GetProfileBookingsPageDataQuery['users']['bookingRequests']['findOne']>;
    onRequireUpdate: () => void;
}

export function ProfileBookingRequestChat({ userId, bookingRequest, onRequireUpdate }: ProfileBookingRequestChatProps) {
    const { bookingRequestId, status, cookAccepted, userAccepted } = bookingRequest;
    const chatBottom = useRef<HTMLDivElement>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    const { data } = useQuery(FindManyUserBookingRequestChatMessagesDocument, {
        variables: { userId, bookingRequestId },
    });
    const [accept, { loading: acceptLoading }] = useMutation(UserBookingRequestAcceptDocument, {
        variables: { userId, bookingRequestId },
    });
    const [decline, { loading: declineLoading }] = useMutation(UserBookingRequestDeclineDocument, {
        variables: { userId, bookingRequestId },
    });

    const [send] = useMutation(CreateOneUserBookingRequestChatMessageDocument);

    // const {
    //     register,
    //     handleSubmit,
    //     setValue,
    //     formState: { errors },
    // } = useForm<{ message: string }>();

    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showDeclineDialog, setShowDeclineDialog] = useState(false);

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
        const fetchedChatMessages = data?.users.bookingRequests.chatMessages.findMany;
        if (fetchedChatMessages) setChatMessages(fetchedChatMessages);
        setTimeout(() => scrollToChatBottom(), 200);
    }, [data]);

    useEffect(() => scrollToChatBottom(), []);

    const sortedChatMessages = chatMessages.map((chatMessage) => ({ ...chatMessage }));

    sortedChatMessages.sort(
        (chatMessageA, chatMessageB) => new Date(chatMessageA.createdAt).getTime() - new Date(chatMessageB.createdAt).getTime(),
    );

    const [text, setText] = useState('');

    return (
        <div className="flex flex-col gap-2 flex-1 overflow-hidden pb-4">
            <div className="flex flex-col gap-4 flex-1 overflow-y-auto p-4">
                {sortedChatMessages.map((chatMessage) => (
                    <PEChatMessage key={chatMessage.chatMessageId} chatMessage={chatMessage} isAuthor={chatMessage.createdBy === userId} />
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
                    //     onSubmit={handleSubmit(({ message }, event) =>
                    //         send({ variables: { userId, bookingRequestId, request: { message } } }).then(
                    //             ({ data }) => data?.users.bookingRequests.chatMessages.success && setValue('message', ''),
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
                                    send({ variables: { userId, bookingRequestId, request: { message: text } } }).then(
                                        ({ data }) => data?.users.bookingRequests.chatMessages.success && setText(''),
                                    )
                                }
                            />
                        </div>
                    </div>
                )}

                {status === 'OPEN' && (
                    <div className="flex justify-end gap-4">
                        {cookAccepted === true && userAccepted === null && (
                            <>
                                <PEButton title="Ablehnen" onClick={() => setShowDeclineDialog(true)} type="secondary" />
                                <PEButton onClick={() => setShowAcceptDialog(true)} title="Akzeptieren" />
                            </>
                        )}
                        {cookAccepted === null && userAccepted === true && (
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

            <LoadingDialog active={acceptLoading || declineLoading} />
        </div>
    );
}
