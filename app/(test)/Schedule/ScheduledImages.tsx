"use client";
import React, { useEffect, useState } from "react";

interface ScheduleItem {
    image: string;
    link: string;
    uptime: string;
    downtime: string;
}

export default function ScheduledImages({ schedule }: { schedule: ScheduleItem[] }) {
    const [visibleImages, setVisibleImages] = useState<ScheduleItem[]>([]);

    useEffect(() => {
        const checkSchedule = () => {
            const now = new Date();
            const active = schedule.filter((item) => {
                const up = new Date(item.uptime);
                const down = new Date(item.downtime);
                return now >= up && now <= down;
            });
            setVisibleImages(active);
        };

        checkSchedule();
        const interval = setInterval(checkSchedule, 30000); // ทุก 30 วิ
        return () => clearInterval(interval);
    }, [schedule]);

    return (
        <div className="w-full flex flex-col items-center">
            {visibleImages.length > 0 ? (
                visibleImages.map((item, idx) => (
                    <div key={idx} className="my-4 text-center">
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <img
                                src={item.image}
                                alt={`Scheduled ${idx}`}
                                className="max-w-full h-auto rounded shadow-lg transition-opacity duration-500"
                            />
                        </a>
                        <p className="mt-2 text-sm text-gray-600">
                            Showing: {new Date(item.uptime).toLocaleString()} →{" "}
                            {new Date(item.downtime).toLocaleString()}
                        </p>
                    </div>
                ))
            ) : (
                <p className="text-gray-400 italic">No scheduled image right now.</p>
            )}
        </div>
    );
}
