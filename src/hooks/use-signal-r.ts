/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface SignalRConfig {
    url: string;
    accessTokenFactory?: () => string;
    onConnected?: (connection: signalR.HubConnection) => void;
    onDisconnected?: () => void;
    onError?: (error: any) => void;
}

export default function useSignalR({
    url,
    accessTokenFactory,
    onConnected,
    onDisconnected,
    onError,
}: SignalRConfig) {
    const [connectionState, setConnectionState] = useState<
        'connecting' | 'connected' | 'disconnected'
    >('connecting');
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(url, {
                accessTokenFactory,
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connectionRef.current = connection;

        const startConnection = async () => {
            try {
                await connection.start();
                setConnectionState('connected');
                onConnected?.(connection);
            } catch (error) {
                setConnectionState('disconnected');
                onError?.(error);
            }
        };

        connection.onclose(() => {
            setConnectionState('disconnected');
            onDisconnected?.();
        });

        startConnection();

        return () => {
            connection.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    return {
        connection: connectionRef.current,
        connectionState,
    };
}
