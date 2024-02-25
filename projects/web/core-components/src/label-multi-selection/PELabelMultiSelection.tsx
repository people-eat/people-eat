import { PELabelButton } from '../label-button/PELabelButton';

export interface PELabelMultiSelectionProps<T> {
    options: T[];
    selectedOptions: T[];
    selectedOptionsChanged: (changedSelectedOptions: T[]) => void;

    optionTitle: (option: T) => string;
    optionIdentifier: (option: T) => string;
}

export function PELabelMultiSelection<T>({
    options,
    selectedOptions,
    selectedOptionsChanged,
    optionTitle,
    optionIdentifier,
}: PELabelMultiSelectionProps<T>) {
    return (
        <div className="flex gap-2 flex-wrap">
            {options.map((option) => (
                <PELabelButton
                    key={optionIdentifier(option)}
                    title={optionTitle(option)}
                    selected={selectedOptions.findIndex((o) => optionIdentifier(o) === optionIdentifier(option)) !== -1}
                    onSelect={() => selectedOptionsChanged([...selectedOptions, option])}
                    onDeselect={() =>
                        selectedOptionsChanged(selectedOptions.filter((o) => optionIdentifier(o) !== optionIdentifier(option)))
                    }
                />
            ))}
        </div>
    );
}
