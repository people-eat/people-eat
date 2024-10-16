import { SearchMode } from '@people-eat/web-domain';
import { PEButton } from '../_core';

export interface SearchModeSwitchProps {
    activeMode: SearchMode;
    onChange: (changedSearchMode: SearchMode) => void;
}

export function SearchModeSwitch({ activeMode, onChange }: SearchModeSwitchProps) {
    return (
        <div className="flex gap-4">
            <PEButton title="Menüs" onClick={() => onChange('MENUS')} type={activeMode === 'MENUS' ? 'primary' : 'secondary'} />
            <PEButton title="Köche" onClick={() => onChange('COOKS')} type={activeMode === 'COOKS' ? 'primary' : 'secondary'} />
        </div>
    );
}
