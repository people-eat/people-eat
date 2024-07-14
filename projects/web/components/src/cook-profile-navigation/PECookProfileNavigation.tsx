import { CookProfileTab, cookProfileTabPaths, cookProfileTabs, translatedCookProfileTabs } from '@people-eat/web-domain';
import classNames from 'classnames';
import { useRouter } from 'next/router';

export interface PECookProfileNavigationProps {
    current: CookProfileTab;
    className?: string;
}

export function PECookProfileNavigation({ current, className }: PECookProfileNavigationProps) {
    const router = useRouter();

    return (
        // <nav className={classNames('flex gap-2 flex-wrap', className)}>
        //     {cookProfileTabs.map((tab) => (
        //         <PELabelLink key={tab} title={translatedCookProfileTabs[tab]} selected={tab === current} href={cookProfileTabPaths[tab]} />
        //     ))}
        // </nav>
        <div>
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                    id="tabs"
                    name="tabs"
                    defaultValue={cookProfileTabs.find((tab) => current === tab)}
                    className="block w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    onChange={(e) => {
                        const t = cookProfileTabs.find((tab) => e.target.value === tab);
                        if (!t) return;
                        router.push(cookProfileTabPaths[t]);
                    }}
                >
                    {cookProfileTabs.map((tab) => (
                        <option key={tab} value={tab}>
                            {translatedCookProfileTabs[tab]}
                        </option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block">
                <nav aria-label="Tabs" className="flex space-x-4">
                    {cookProfileTabs.map((tab) => (
                        <a
                            key={tab}
                            href={cookProfileTabPaths[tab]}
                            // aria-current={tab.current ? 'page' : undefined}
                            className={classNames(
                                current === tab ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:text-gray-700',
                                'rounded-md px-3 py-2 text-sm font-medium',
                            )}
                        >
                            {translatedCookProfileTabs[tab]}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
}
