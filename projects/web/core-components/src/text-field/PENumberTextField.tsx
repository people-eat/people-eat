import classNames from 'classnames';
import { ForwardedRef, forwardRef } from 'react';

export interface PENumberTextFieldProps {
    id: string;
    labelTitle?: string;
    placeholder?: string;
    errorMessage?: string;
    min?: number;
    max?: number;
    step?: number;
}

export const PENumberTextField = forwardRef(function (
    { id, labelTitle, placeholder, errorMessage, min, max, step, ...rest }: PENumberTextFieldProps,
    ref: ForwardedRef<HTMLInputElement>,
) {
    return (
        <div className="w-full">
            {labelTitle && (
                <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    {labelTitle}
                </label>
            )}
            <input
                id={id}
                type="number"
                placeholder={placeholder}
                className={classNames(
                    'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 focus:ring-orange-600',
                    '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                )}
                ref={ref}
                min={min}
                max={max}
                step={step}
                {...rest}
            />

            {errorMessage && <span className="ml-2 mt-1 text-sm font-semibold text-red-500">{errorMessage}</span>}
        </div>
    );
});
