import { ChatMessage } from '@people-eat/web-domain';
import classNames from 'classnames';

export interface PEChatMessageProps {
    chatMessage: ChatMessage;
    isAuthor: boolean;
}

export function PEChatMessage({ chatMessage, isAuthor }: PEChatMessageProps) {
    if (chatMessage.generated) {
        return <div className="bg-gray-100 text-blue-400 px-4 py-2 rounded-xl text-center">{chatMessage.message}</div>;
    }

    return (
        <div className="flex gap-4">
            {isAuthor && <span className="flex-1" />}
            <div
                className={classNames('flex-1 flex', {
                    'justify-end': isAuthor,
                    'justify-start': !isAuthor,
                })}
            >
                <span
                    className={classNames('bg-gray-100 px-4 py-2 rounded-xl', {
                        'self-start': isAuthor,
                        'self-end': !isAuthor,
                    })}
                >
                    {chatMessage.message}
                </span>
            </div>
            {!isAuthor && <span className="flex-1" />}
        </div>
    );
}
