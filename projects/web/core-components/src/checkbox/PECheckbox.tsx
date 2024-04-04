import classNames from 'classnames';
import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react';

export interface PECheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: {
        title: string;
        description?: string;
    };
    errorMessage?: string;
}

export const PECheckbox = forwardRef(function (
    { id, label, errorMessage, className, ...rest }: PECheckboxProps,
    ref: ForwardedRef<HTMLInputElement>,
) {
    return (
        <div>
            <div className={classNames('flex gap-4 items-start', className)}>
                <input
                    id={id}
                    type="checkbox"
                    // aria-describedby={}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                    ref={ref}
                    {...rest}
                />

                <div className="flex flex-col gap-2 items-start">
                    {label && (
                        <label htmlFor={id} className="block text-sm font-medium text-gray-900">
                            {label.title}
                        </label>
                    )}
                    {label?.description && (
                        <p id="candidates-description" className="text-gray-500 text-sm">
                            Ich habe die Datenschutzerklärung gelesen und akzeptiere sie
                        </p>
                    )}
                    {errorMessage && <span className="text-sm font-semibold text-red-500">{errorMessage}</span>}
                </div>
            </div>
        </div>
    );
});
