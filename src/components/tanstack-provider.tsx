'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const TanstackProvider = ({ children }: React.PropsWithChildren) => {
    const [client] = useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    retry: 1,
                },
            },
        }),
    );

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default TanstackProvider;
