import { PEButton } from '../button/PEButton';

export interface PELabelButtonProps {
    title: string;
    selected: boolean;
    onSelect: () => void;
    onDeselect: () => void;
    className?: string;
}

export function PELabelButton({ title, selected, onSelect, onDeselect, className }: PELabelButtonProps) {
    if (!selected) {
        return <PEButton type="secondary" className={className} title={title} onClick={onSelect} />;
    }

    return <PEButton type="primary" className={className} title={title} onClick={onDeselect} />;
}
