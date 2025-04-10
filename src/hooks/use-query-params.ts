'use client';

import { useState, useEffect } from 'react';

export default function useQueryParams(): Record<string, string> {
    const [queryParams, setQueryParams] = useState<Record<string, string>>({});

    useEffect(() => {
        // Function to parse the query parameters
        const parseQueryParams = () => {
            if (typeof window === 'undefined') return {};

            const params = new URLSearchParams(window.location.search);
            const result: Record<string, string> = {};

            params.forEach((value, key) => {
                result[key] = value;
            });

            return result;
        };

        // Set the initial query parameters
        setQueryParams(parseQueryParams());

        // Function to handle URL changes
        const handleUrlChange = () => {
            setQueryParams(parseQueryParams());
        };

        // Listen for popstate events (browser back/forward navigation)
        window.addEventListener('popstate', handleUrlChange);

        // Listen for pushstate and replacestate events (programmatic navigation)
        // This requires a custom event listener since these don't have native events
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        window.history.pushState = function (...args) {
            originalPushState.apply(this, args);
            handleUrlChange();
        };

        window.history.replaceState = function (...args) {
            originalReplaceState.apply(this, args);
            handleUrlChange();
        };

        // Clean up event listeners when component unmounts
        return () => {
            window.removeEventListener('popstate', handleUrlChange);
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
        };
    }, []);

    return queryParams;
}
