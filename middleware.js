import { NextResponse } from 'next/server'

export function middleware(request) {

    const path = request.nextUrl.pathname;

    const isPublicPath =
        path === "/auth/signin" ||
        path === "/auth/signup" ||
        path === "/auth/forgot-password" ||
        path === "/auth/forgot-password-complete" ||
        path === "/auth/email-verification";

    const hart = request.cookies.get("hart")?.value || '';

    if (isPublicPath && hart) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!isPublicPath && !hart) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

}

export const config = {
    matcher: [
        '/',
        '/auth/signin',
        '/auth/signup',
        '/auth/forgot-password',
        '/auth/forgot-password-complete',
        '/auth/email-verification',
    ],
}