import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { env } from '@/env';

export interface Notification {
    title: string;
    message: string;
    timestamp: string;
}

export default function useSignalR(hubUrl: string) {
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(env.NEXT_PUBLIC_API_URL + hubUrl)
            .withAutomaticReconnect()
            .build();

        connection.on(
            'ReceiveNotification',
            (title: string, message: string, timestamp: string) => {
                setNotifications((prev) => [...prev, { title, message, timestamp }]);
            },
        );

        connection
            .start()
            .then(() => {
                setConnected(true);
                console.log('SignalR connected for notifications');
            })
            .catch((err) => console.error('SignalR connection error:', err));

        connectionRef.current = connection;

        return () => {
            connection.stop();
        };
    }, [hubUrl]);

    return { notifications, connected };
}
