import { CookRank } from './graphql/_generated/graphql';

export const translatedCookRanks: Record<CookRank, string> = {
    ['HOBBY']: 'Hobbykoch',
    ['PROFESSIONAL']: 'Professioneller Koch',
};

export const cookRanks: CookRank[] = ['HOBBY', 'PROFESSIONAL'];
