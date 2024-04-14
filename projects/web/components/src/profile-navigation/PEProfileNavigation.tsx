import { PELabelLink } from '@people-eat/web-core-components';
import { ProfileTab, profileTabPaths, profileTabs, translatedProfileTabs } from '@people-eat/web-domain';
import classNames from 'classnames';

export interface PEProfileNavigationProps {
    current: ProfileTab;
    className?: string;
}

export function PEProfileNavigation({ current, className }: PEProfileNavigationProps) {
    return (
        <nav className={classNames('flex gap-2 flex-wrap', className)}>
            {profileTabs.map((tab) => (
                <PELabelLink key={tab} title={translatedProfileTabs[tab]} selected={tab === current} href={profileTabPaths[tab]} />
            ))}
        </nav>
    );
}
