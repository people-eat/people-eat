import { PELabelLink } from '@people-eat/web-core-components';
import { CookProfileTab, cookProfileTabPaths, cookProfileTabs, translatedCookProfileTabs } from '@people-eat/web-domain';

export interface PECookProfileNavigationProps {
    current: CookProfileTab;
}

export function PECookProfileNavigation({ current }: PECookProfileNavigationProps) {
    return (
        <nav className="flex gap-2 flex-wrap">
            {cookProfileTabs.map((tab) => (
                <PELabelLink key={tab} title={translatedCookProfileTabs[tab]} selected={tab === current} href={cookProfileTabPaths[tab]} />
            ))}
        </nav>
    );
}
