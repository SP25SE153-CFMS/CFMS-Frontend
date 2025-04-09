import { NextResponse, type NextRequest } from 'next/server';

// const FARM_ROUTE = '/farm';
// const FARM_REGISTER_ROUTE = '/farm/register';
// const DASHBOARD_ROUTE = '/dashboard';
// const SIGN_IN_ROUTE = '/sign-in';
// const SIGN_UP_ROUTE = '/sign-up';
// const FORGOT_PASSWORD_ROUTE = '/forgot-password';
// const INPUT_OTP_ROUTE = '/forgot-password/input-OTP';

// eslint-disable-next-line no-unused-vars
export function middleware(request: NextRequest) {
    // const { pathname } = request.nextUrl;

    // // Get cookies directly from the request object
    // const accessToken = request.cookies.get('accessToken')?.value;
    // const farmId = request.cookies.get('farmId')?.value;

    // // Skip middleware for static files and public assets
    // // This check helps ensure we don't interfere with static assets
    // if (
    //     pathname.startsWith('/_next') ||
    //     pathname.startsWith('/images') || // Add your public asset directories here
    //     pathname.includes('.') // Simple check for file extensions (e.g., .jpg, .png)
    // ) {
    //     return NextResponse.next();
    // }

    // // If user is logged in and tries to access login page, redirect to dashboard
    // if (pathname === SIGN_IN_ROUTE && accessToken) {
    //     return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
    // }

    // // If accessing any route except login and public routes without an access token, redirect to login
    // if (
    //     !accessToken &&
    //     pathname !== SIGN_IN_ROUTE &&
    //     pathname !== '/' &&
    //     pathname !== SIGN_UP_ROUTE &&
    //     pathname !== FORGOT_PASSWORD_ROUTE &&
    //     pathname !== INPUT_OTP_ROUTE
    // ) {
    //     return NextResponse.redirect(new URL(SIGN_IN_ROUTE, request.url));
    // }

    // // If user has an access token but no farm ID and is not on the farm selection page,
    // // redirect to farm selection page
    // if (
    //     accessToken &&
    //     !farmId &&
    //     pathname !== FARM_ROUTE &&
    //     pathname !== FARM_REGISTER_ROUTE &&
    //     pathname !== SIGN_IN_ROUTE
    // ) {
    //     return NextResponse.redirect(new URL(FARM_ROUTE, request.url));
    // }

    // If user is on the farm selection page and has a farm ID, redirect to the dashboard
    // if (pathname === FARM_ROUTE && farmId) {
    //     return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
    // }

    return NextResponse.next();
}

// Configure which routes middleware will run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
