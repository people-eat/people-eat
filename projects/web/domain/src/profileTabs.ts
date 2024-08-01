export type ProfileTab = 'PERSONAL_INFORMATION' | 'BOOKINGS' | 'FAVORITE_COOKS' | 'MEALS' | 'MENUS';

export const profileTabPaths: Record<ProfileTab, string> = {
    PERSONAL_INFORMATION: '/profile',
    BOOKINGS: '/profile/bookings',
    FAVORITE_COOKS: '/profile/favorite-chefs',
    MEALS: '/profile/meals',
    MENUS: '/profile/menus',
};

export const profileTabsForUser: ProfileTab[] = ['PERSONAL_INFORMATION', 'BOOKINGS']; // 'FAVORITE_COOKS'
export const profileTabsForCook: ProfileTab[] = ['PERSONAL_INFORMATION', 'BOOKINGS', 'MEALS', 'MENUS']; // 'FAVORITE_COOKS'

export const translatedProfileTabs: Record<ProfileTab, string> = {
    PERSONAL_INFORMATION: 'Persönliche Informationen',
    BOOKINGS: 'Buchungen',
    FAVORITE_COOKS: 'Lieblingsköche',
    MEALS: 'Gerichte',
    MENUS: 'Menüs',
};
