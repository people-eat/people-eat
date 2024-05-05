import { PELabelLink } from '@people-eat/web-core-components';
import { CookProfileTab, cookProfileTabPaths, cookProfileTabs, translatedCookProfileTabs } from '@people-eat/web-domain';
import classNames from 'classnames';

export interface PECookProfileNavigationProps {
    current: CookProfileTab;
    className?: string;
}

export function PECookProfileNavigation({ current, className }: PECookProfileNavigationProps) {
    return (
        <nav className={classNames('flex gap-2 flex-wrap', className)}>
            {cookProfileTabs.map((tab) => (
                <PELabelLink key={tab} title={translatedCookProfileTabs[tab]} selected={tab === current} href={cookProfileTabPaths[tab]} />
            ))}
        </nav>
    );
}
