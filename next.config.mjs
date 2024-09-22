/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:"pk_test_Z3JhdGVmdWwtdHJvdXQtODguY2xlcmsuYWNjb3VudHMuZGV2JA",
        CLERK_SECRET_KEY:"sk_test_P7M3ALuRVXHilqqHIJOnZmu4s51yhsE8dpw3QlfhzC",
        NEXT_PUBLIC_CLERK_SIGN_IN_URL:"/sign-in",
        NEXT_PUBLIC_CLERK_SIGN_UP_URL:"/sign-up",
        CLERK_WEBHOOK_SECRET:"whsec_L3eQhUL9dwHDCkRQiso4r5PxBhUl7Z8e",
        NEXT_PUBLIC_EXECUTION_WORKER_URL:"https://code-solver-worker-production.up.railway.app"
    }
};


export default nextConfig;
