import { ForwardedRef, PropsWithChildren, forwardRef } from 'react';

export interface PESliderProps {
    id: string;
    labelTitle?: string;
    step: number;
    min?: number | undefined | string;
    max?: number | undefined | string;
}

export const PESlider = forwardRef(function (
    { id, labelTitle, step, min, max, children, ...rest }: PropsWithChildren<PESliderProps>,
    ref: ForwardedRef<HTMLInputElement>,
) {
    return (
        <div>
            {labelTitle && (
                <div className="flex justify-between">
                    <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                        {labelTitle}
                    </label>
                    {children && <span>{children}</span>}
                </div>
            )}
            <input
                id={id}
                type="range"
                className="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[12px] [&::-webkit-slider-thumb]:w-[12px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
                step={step}
                min={min}
                max={max}
                ref={ref}
                {...rest}
            />
        </div>
    );
});
