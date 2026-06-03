import { useEffect, useCallback } from "react";

const useDesktopNotification = () =>
{

    useEffect( () =>
    {
        if ( "Notification" in window && Notification.permission === "default" )
        {
            Notification.requestPermission();
        }
    }, [] );

    const showNotification = useCallback( ( title, body, options = {} ) =>
    {
        if ( !( "Notification" in window ) ) return;
        if ( Notification.permission !== "granted" ) return;

        const notification = new Notification( title, {
            body,
            icon: "/logo.png",
            badge: "/logo.png",
            tag: options.tag || "chat",
            renotify: true,
            ...options,
        } );

        notification.onclick = () =>
        {
            window.focus();
            if ( options.onClick ) options.onClick();
            notification.close();
        };

        setTimeout( () => notification.close(), 5000 );
    }, [] );

    return { showNotification };
};

export default useDesktopNotification;