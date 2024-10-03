import { Redirect } from 'next';

const routeBuilders = {
    home: (_: void) => '/',
    signIn: (params: { returnTo?: string } | void) => {
        const returnToQuery = params?.returnTo ? `?redirectTo=${encodeURIComponent(params.returnTo)}` : '';
        return '/sign-in' + returnToQuery;
    },
    administration: (_: void) => '/administration',
    profile: (_: void) => '/profile',
    profileBookingRequests: (_: void) => '/profile/bookings',
    profileBookingRequest: (params: { bookingRequestId: string }) => '/profile/bookings/' + params.bookingRequestId,
} as const;

type RouteBuilderKey = keyof typeof routeBuilders;

// Type to extract the parameter types for route builders
type RouteBuilder<T> = T extends (params: infer P) => unknown ? (params: P) => string : () => string;
type Routes = { [K in RouteBuilderKey]: RouteBuilder<(typeof routeBuilders)[K]> };

// Ensure routes matches routeBuilders
export const routes: Routes = routeBuilders;

// Define the Redirect type from next
type Redirects = {
    [K in RouteBuilderKey]: (params?: Parameters<(typeof routeBuilders)[K]>[0]) => { redirect: Redirect };
};

// Generate redirects object
const generateRedirects = (): Redirects => {
    const redirects = Object.keys(routeBuilders).reduce(
        (acc, key) => {
            const routeBuilder = routeBuilders[key as RouteBuilderKey];

            acc[key as RouteBuilderKey] = ((params?: any) => ({
                redirect: {
                    permanent: false,
                    destination: (routeBuilder as any)(params),
                },
            })) as unknown as (params?: Parameters<typeof routeBuilder>[0]) => { redirect: Redirect };

            return acc;
        },
        {} as Record<RouteBuilderKey, (params?: Parameters<(typeof routeBuilders)[RouteBuilderKey]>[0]) => { redirect: Redirect }>,
    );

    return redirects;
};

export const redirectTo = generateRedirects();
