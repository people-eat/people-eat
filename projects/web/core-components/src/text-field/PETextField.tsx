import { ForwardedRef, HTMLInputTypeAttribute, ReactElement, forwardRef } from 'react';

// extends InputHTMLAttributes<never>
export interface PETextFieldProps {
    id: string;
    labelTitle?: string;
    type: HTMLInputTypeAttribute;
    autoComplete?: string;
    placeholder?: string;
    errorMessage?: string;
    leadingChildren?: ReactElement;
    trailingChildren?: ReactElement;
}

export const PETextField = forwardRef(function (
    { id, labelTitle, type, autoComplete, placeholder, errorMessage, leadingChildren, trailingChildren, ...rest }: PETextFieldProps,
    ref: ForwardedRef<HTMLInputElement>,
) {
    return (
        <div className="w-full">
            {labelTitle && (
                <label htmlFor={id} className="block text-base font-medium leading-6 text-gray-900 mb-2">
                    {labelTitle}
                </label>
            )}

            <div className="flex gap-2 items-center">
                {leadingChildren}
                <input
                    id={id}
                    type={type}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 focus:ring-orange-600"
                    ref={ref}
                    {...rest}
                />
                {trailingChildren}
            </div>

            {errorMessage && <span className="ml-2 mt-1 text-sm font-semibold text-red-500">{errorMessage}</span>}
        </div>
    );
});
