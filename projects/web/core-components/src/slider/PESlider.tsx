import { PropsWithChildren } from 'react';

export interface PESliderProps {
    id: string;
    labelTitle?: string;
    value: number;
    onChange: (changedValue: number) => void;
    min: number;
    max: number;
    step: number;
}

export function PESlider({ id, labelTitle, value, onChange, min, max, step, children }: PropsWithChildren<PESliderProps>) {
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
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                type="range"
                className="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[12px] [&::-webkit-slider-thumb]:w-[12px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
                min={min}
                max={max}
                step={step}
            />
        </div>
    );
}
