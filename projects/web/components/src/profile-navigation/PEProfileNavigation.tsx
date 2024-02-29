import { PELabelLink } from '@people-eat/web-core-components';
import { ProfileTab, profileTabPaths, profileTabs, translatedProfileTabs } from '@people-eat/web-domain';

export interface PEProfileNavigationProps {
    current: ProfileTab;
}

export function PEProfileNavigation({ current }: PEProfileNavigationProps) {
    return (
        <nav className="flex gap-2 flex-wrap">
            {profileTabs.map((tab) => (
                <PELabelLink key={tab} title={translatedProfileTabs[tab]} selected={tab === current} href={profileTabPaths[tab]} />
            ))}
        </nav>
    );
}
