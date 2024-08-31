import classNames from 'classnames';
import React, { useRef } from 'react';

export interface ChatTextAreaProps {
    text: string;
    setText: (changedText: string) => void;
    maxRows: number;
    placeholder: string;
}

export function ChatTextArea({ text, setText, maxRows, placeholder }: ChatTextAreaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        adjustTextareaHeight();
    };

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            // Reset the height to allow shrinking
            textarea.style.height = 'auto';

            // Get the number of rows based on scrollHeight and line height
            const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight || '0', 10);
            const numberOfRows = Math.floor(textarea.scrollHeight / lineHeight);

            // If the rows exceed the maximum, set scrolling
            if (numberOfRows > maxRows) {
                textarea.style.overflowY = 'auto';
                textarea.style.height = `${lineHeight * maxRows}px`;
            } else {
                textarea.style.overflowY = 'hidden';
                textarea.style.height = `${textarea.scrollHeight}px`;
            }
        }
    };

    return (
        <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            rows={1}
            className={classNames(
                'w-full resize-none overflow-y-hidden py-1.5',
                'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 focus:ring-orange-600',
            )}
            placeholder={placeholder}
        />
    );
}
