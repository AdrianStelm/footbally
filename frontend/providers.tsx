'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ApolloProvider client={client}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ApolloProvider>
    );
}
