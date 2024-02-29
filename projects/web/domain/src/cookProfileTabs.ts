export type CookProfileTab = 'PERSONAL_INFORMATION' | 'BOOKINGS' | 'MEALS' | 'MENUS';

export const cookProfileTabPaths: Record<CookProfileTab, string> = {
    PERSONAL_INFORMATION: '/chef-profile',
    BOOKINGS: '/chef-profile/bookings',
    MEALS: '/chef-profile/meals',
    MENUS: '/chef-profile/menus',
};

export const cookProfileTabs: CookProfileTab[] = ['PERSONAL_INFORMATION', 'BOOKINGS', 'MEALS', 'MENUS'];

export const translatedCookProfileTabs: Record<CookProfileTab, string> = {
    PERSONAL_INFORMATION: 'Persönliche Informationen',
    BOOKINGS: 'Buchungen',
    MEALS: 'Gerichte',
    MENUS: 'Menüs',
};
