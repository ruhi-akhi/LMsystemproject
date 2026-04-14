"use client";

import React, { useEffect, useState } from "react";

const MouseFollower = () => {
    const [position, setPosition] = useState({ x: -9999, y: -9999 });
    const [visible, setVisible] = useState(false);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const media = window.matchMedia("(pointer: fine)");
        setEnabled(media.matches);

        const handleMediaChange = () => setEnabled(media.matches);
        media.addEventListener("change", handleMediaChange);

        const handleMove = (event: MouseEvent) => {
            setPosition({ x: event.clientX, y: event.clientY });
            setVisible(true);
        };

        const hide = () => setVisible(false);

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseout", hide);
        window.addEventListener("mouseleave", hide);

        return () => {
            media.removeEventListener("change", handleMediaChange);
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseout", hide);
            window.removeEventListener("mouseleave", hide);
        };
    }, []);

    if (!enabled) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999]">
            <div
                className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_20px_80px_rgba(255,138,60,0.25)] transition-opacity duration-200 ease-out"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    opacity: visible ? 1 : 0,
                    background: "radial-gradient(circle at center, rgba(241, 77, 32, 0.95), rgba(246, 115, 54, 0.45) 40%, rgba(246, 127, 42, 0.25) 60%, transparent 90%)",
                    backdropFilter: "blur(2px)",
                }}
            />
        </div>
    );
};

export default MouseFollower;