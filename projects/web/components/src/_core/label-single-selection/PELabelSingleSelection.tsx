import { PELabelButton } from '../label-button/PELabelButton';

export interface PELabelSingleSelectionProps<T> {
    options: T[];
    selectedOption?: T;
    selectedOptionChanged: (changedSelectedOption?: T) => void;

    optionTitle: (option: T) => string;
    optionIdentifier: (option: T) => string;
}

export function PELabelSingleSelection<T>({
    options,
    selectedOption,
    selectedOptionChanged,
    optionTitle,
    optionIdentifier,
}: PELabelSingleSelectionProps<T>) {
    return (
        <div className="flex gap-2 flex-wrap">
            {options.map((option) => (
                <PELabelButton
                    key={optionIdentifier(option)}
                    title={optionTitle(option)}
                    selected={selectedOption ? optionIdentifier(selectedOption) === optionIdentifier(option) : false}
                    onSelect={() => selectedOptionChanged(option)}
                    onDeselect={() => selectedOptionChanged(undefined)}
                />
            ))}
        </div>
    );
}
