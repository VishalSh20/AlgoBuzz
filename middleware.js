import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Match the protected route specifically for '/api/submissions'
const isProtectedRoute = createRouteMatcher(['/api/submissions']);

export default clerkMiddleware((auth, req) => {
  const pathname = req.nextUrl.pathname; // Use nextUrl.pathname in middleware
  if (isProtectedRoute(pathname)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Match only the '/api/submissions' API route, skip all other API routes
    '/api/submissions',
    // Skip Next.js internals, static files
    '/((?!_next|trpc|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
