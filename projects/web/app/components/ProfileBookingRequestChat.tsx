import { useMutation, useQuery } from '@apollo/client';
import { PEButton, PETextField } from '@people-eat/web-core-components';
import { CreateOneUserBookingRequestChatMessageDocument, FindManyUserBookingRequestChatMessagesDocument } from '@people-eat/web-domain';
import { useForm } from 'react-hook-form';

export interface ProfileBookingRequestChatProps {
    userId: string;
    bookingRequestId: string;
}

export function ProfileBookingRequestChat({ userId, bookingRequestId }: ProfileBookingRequestChatProps) {
    const { data } = useQuery(FindManyUserBookingRequestChatMessagesDocument, { variables: { userId, bookingRequestId } });
    const [send] = useMutation(CreateOneUserBookingRequestChatMessageDocument);
    // useSubscription(BookingRequestChatMessageCreationsDocument, {
    //     variables: { bookingRequestId },
    //     onData: ({ data: subscriptionData }) => {
    //         const newChatMessage = subscriptionData.data?.bookingRequestChatMessageCreations;
    //         if (!newChatMessage) return;
    //         setChatMessages([...chatMessages, newChatMessage]);
    //         // setTimeout(() => scrollToChatBottom(), 200);
    //     },
    // });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<{ message: string }>();

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                {data?.users.bookingRequests.chatMessages.findMany?.map((chatMessage) => (
                    <div key={chatMessage.chatMessageId} className="flex">
                        <div className="flex-1">
                            <span className="bg-gray-100 px-4 py-2 rounded-xl self-start inline-block">{chatMessage.message}</span>
                        </div>
                        <span className="flex-1" />
                    </div>
                ))}
            </div>

            <form
                onSubmit={handleSubmit(({ message }) =>
                    send({ variables: { userId, bookingRequestId, request: { message } } }).then(
                        ({ data }) => data?.users.bookingRequests.chatMessages.success && setValue('message', ''),
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
        </div>
    );
}
