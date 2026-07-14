 import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from './lib/auth';

// This function can be marked `async` if using `await` inside

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(), // headers containing the user's session token
  });
  if (!session && !session?.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: ['/items/add','/items/manage','/dashboard','/admin/dashboard',],
};
