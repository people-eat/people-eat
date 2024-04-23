import { useQuery } from '@apollo/client';
import { PEButton, PETextField } from '@people-eat/web-core-components';
import { FindManyUserBookingRequestChatMessagesDocument } from '@people-eat/web-domain';

export interface ProfileBookingRequestChatProps {
    userId: string;
    bookingRequestId: string;
}

export function ProfileBookingRequestChat({ userId, bookingRequestId }: ProfileBookingRequestChatProps) {
    const { data } = useQuery(FindManyUserBookingRequestChatMessagesDocument, { variables: { userId, bookingRequestId } });

    return (
        <div className="flex flex-col gap-8">
            <div>
                {data?.users.bookingRequests.chatMessages.findMany?.map((chatMessage) => (
                    <div key={chatMessage.chatMessageId} className="text-gray-400">
                        {chatMessage.message}
                    </div>
                ))}
            </div>

            <form onSubmit={() => undefined} className="flex gap-4 items-center">
                <PETextField id="chat-message" type="text" />
                <PEButton type="submit" title="Senden" />
            </form>
        </div>
    );
}
