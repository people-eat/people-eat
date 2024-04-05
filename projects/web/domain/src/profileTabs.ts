export type ProfileTab = 'PERSONAL_INFORMATION' | 'BOOKINGS' | 'FAVORITE_COOKS';

export const profileTabPaths: Record<ProfileTab, string> = {
    PERSONAL_INFORMATION: '/profile',
    BOOKINGS: '/profile/bookings',
    FAVORITE_COOKS: '/profile/favorite-chefs',
};

export const profileTabs: ProfileTab[] = ['PERSONAL_INFORMATION', 'BOOKINGS']; // 'FAVORITE_COOKS'

export const translatedProfileTabs: Record<ProfileTab, string> = {
    PERSONAL_INFORMATION: 'Persönliche Informationen',
    BOOKINGS: 'Buchungen',
    FAVORITE_COOKS: 'Lieblingsköche',
};
