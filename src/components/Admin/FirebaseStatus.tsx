import React, { useEffect, useState } from 'react';
import { checkFirebaseConnection } from '../../db/firebase';

export const FirebaseStatus = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);

    useEffect(() => {
        const checkStatus = async () => {
            const connected = await checkFirebaseConnection();
            setIsConnected(connected);
        };

        // Check immediately
        checkStatus();

        // Poll every 30 seconds
        const interval = setInterval(checkStatus, 30000);

        return () => clearInterval(interval);
    }, []);

    if (isConnected === null) return null; // Loading state (optional: show gray or loading spinner)

    return (
        <div className="flex items-center gap-2" title={isConnected ? "Firebase Online" : "Firebase Offline"}>
            <div
                className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                    }`}
            />
            <span className="text-xs font-medium text-gray-600">
                {isConnected ? 'System Online' : 'System Offline'}
            </span>
        </div>
    );
};
