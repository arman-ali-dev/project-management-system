import React, { useEffect, useRef, useState } from "react";

// Animated counter hook
const useCountUp = ( target, duration = 1200, start = false ) =>
{
    const [ count, setCount ] = useState( 0 );

    useEffect( () =>
    {
        if ( !start ) return;
        let startTime = null;
        const step = ( timestamp ) =>
        {
            if ( !startTime ) startTime = timestamp;
            const progress = Math.min( ( timestamp - startTime ) / duration, 1 );
            // Ease out cubic
            const eased = 1 - Math.pow( 1 - progress, 3 );
            setCount( Math.floor( eased * target ) );
            if ( progress < 1 ) requestAnimationFrame( step );
        };
        requestAnimationFrame( step );
    }, [ target, duration, start ] );

    return count;
};

const StatsCard = ( { icon, iconBg, statusIcon, label, num, delay = 0 } ) =>
{
    const [ visible, setVisible ] = useState( false );
    const [ hovered, setHovered ] = useState( false );
    const cardRef = useRef( null );
    const animatedNum = useCountUp( num, 1000, visible );

    useEffect( () =>
    {
        const observer = new IntersectionObserver(
            ( [ entry ] ) =>
            {
                if ( entry.isIntersecting )
                {
                    setTimeout( () => setVisible( true ), delay );
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if ( cardRef.current ) observer.observe( cardRef.current );
        return () => observer.disconnect();
    }, [] );

    return (
        <div
            ref={ cardRef }
            onMouseEnter={ () => setHovered( true ) }
            onMouseLeave={ () => setHovered( false ) }
            style={ {
                opacity: visible ? 1 : 0,
                transform: visible
                    ? "translateY(0) scale(1)"
                    : "translateY(20px) scale(0.97)",
                transition: `opacity 0.5s ease ${ delay }ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${ delay }ms, box-shadow 0.25s ease`,
                boxShadow: hovered
                    ? "0 12px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)"
                    : "0 2px 8px rgba(0,0,0,0.06)",
                cursor: "default",
            } }
            className="rounded-2xl px-6 py-5 bg-white"
        >
            {/* Icon */ }
            <div
                style={ {
                    backgroundColor: iconBg,
                    transform: hovered ? "scale(1.1) rotate(-6deg)" : "scale(1) rotate(0deg)",
                    transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                } }
                className="rounded-full h-11 w-11 flex justify-center items-center"
            >
                <img src={ icon } className="w-5.5 h-5.5" alt="" />
            </div>

            <p
                className="text-[14px] font-medium mt-3"
                style={ {
                    opacity: visible ? 0.75 : 0,
                    transition: `opacity 0.4s ease ${ delay + 200 }ms`,
                } }
            >
                { label }
            </p>

            <div className="mt-2 flex justify-between items-center">
                <p
                    className="text-[27px] font-semibold"
                    style={ {
                        opacity: 0.85,
                        transition: "color 0.2s ease",
                        color: hovered ? iconBg : "#111",
                    } }
                >
                    { animatedNum }
                </p>

                <span
                    className="flex gap-1 items-center py-0.5 px-3 rounded-full text-[11px] font-medium"
                    style={ {
                        backgroundColor: "rgba(1,255,18,0.15)",
                        color: "#1C8F24",
                        transform: hovered ? "scale(1.05)" : "scale(1)",
                        transition: "transform 0.2s ease",
                    } }
                >
                    <img src={ statusIcon } className="w-3 h-3" alt="" />
                    32.54%
                </span>
            </div>

            {/* Subtle bottom accent line */ }
            <div
                style={ {
                    height: "3px",
                    borderRadius: "0 0 12px 12px",
                    backgroundColor: iconBg,
                    transform: hovered ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.3s ease",
                    marginTop: "16px",
                    marginLeft: "-24px",
                    marginRight: "-24px",
                    marginBottom: "-20px",
                } }
            />
        </div>
    );
};

export default StatsCard;