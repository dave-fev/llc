import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://swiftsfilling.com/api';

async function proxyRequest(request: NextRequest, endpoint: string) {
    let body;
    try {
        body = await request.json();
    } catch (e) {
        body = undefined;
    }

    const method = request.method;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // Explicitly ask for JSON from Laravel
    };

    // Forward auth token if present
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
        headers['Authorization'] = authHeader;
    }

    // Also check for token in cookies (session_token)
    const sessionToken = request.cookies.get('session_token')?.value;
    if (sessionToken && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${sessionToken}`;
    }

    const searchParams = request.nextUrl.search;
    try {
        const response = await fetch(`${API_URL}/${endpoint}${searchParams}`, {
            method,
            headers,
            body: (method !== 'GET' && method !== 'HEAD' && body) ? JSON.stringify(body) : undefined,
        });

        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error(`Non-JSON response for ${endpoint} (${response.status}):`, text.substring(0, 200));
            return NextResponse.json({
                error: 'Backend returned an invalid response format',
                status: response.status,
                debug: text.substring(0, 100)
            }, { status: 500 });
        }

        const nextResponse = NextResponse.json(data, { status: response.status });

        if (data && data.access_token) {
            nextResponse.cookies.set('session_token', data.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60,
                path: '/',
            });
        } else if (endpoint === 'auth/logout') {
            nextResponse.cookies.delete('session_token');
        }

        return nextResponse;
    } catch (error: any) {
        console.error(`Proxy exception for ${endpoint}:`, error.message);
        return NextResponse.json({ error: 'Backend connection failed: ' + error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path.join('/'));
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path.join('/'));
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path.join('/'));
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path.join('/'));
}
