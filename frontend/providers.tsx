'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();
console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ApolloProvider client={client}>
            <QueryClientProvider client={queryClient}>
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                    {children}
                </GoogleOAuthProvider>
            </QueryClientProvider>
        </ApolloProvider>
    );
}
