import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard','/p(.*)'])
export default clerkMiddleware((auth,req)=>{
    if(isProtectedRoute())
        auth().protect();
    
}
)

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and API routes, unless found in search params
    '/((?!_next|api|trpc|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};