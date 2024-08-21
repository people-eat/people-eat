import { ForwardedRef, TextareaHTMLAttributes, forwardRef } from 'react';

export interface PETextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    labelTitle?: string;
    placeholder?: string;
    errorMessage?: string;
}

export const PETextArea = forwardRef(function (
    { id, labelTitle, placeholder, errorMessage, ...rest }: PETextAreaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
) {
    return (
        <div>
            {labelTitle && (
                <label htmlFor={id} className="block text-base font-medium leading-6 text-gray-900">
                    {labelTitle}
                </label>
            )}
            <div className="mt-2">
                <textarea
                    placeholder={placeholder}
                    rows={4}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 max-h-40"
                    defaultValue=""
                    ref={ref}
                    {...rest}
                />
            </div>
            {errorMessage && <span className="ml-2 mt-1 text-sm font-semibold text-red-500">{errorMessage}</span>}
        </div>
    );
});
