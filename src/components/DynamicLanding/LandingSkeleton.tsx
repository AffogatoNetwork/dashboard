import React from "react";

const Pulse = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

export const LandingSkeleton = () => (
    <div className="overflow-x-hidden w-full">
        {/* Hero */}
        <div className="min-h-screen bg-gray-300 animate-pulse rounded-t-2xl relative flex flex-col items-center justify-center gap-6 px-6">
            <Pulse className="h-14 w-3/4 max-w-xl rounded-lg" />
            <Pulse className="h-14 w-2/3 max-w-lg rounded-lg" />
            <Pulse className="h-6 w-1/2 max-w-md rounded" />
            <Pulse className="h-12 w-40 rounded-full mt-4" />
        </div>

        {/* Feature cards */}
        <div className="container xl:max-w-6xl mx-auto px-4 pt-20 pb-8">
            <div className="flex flex-wrap -mx-4">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="px-4 w-full sm:w-1/2 lg:w-1/3 mb-12">
                        <div className="py-8 px-12 bg-stone-100 shadow-lg space-y-4">
                            <Pulse className="h-10 w-10 mx-auto rounded" />
                            <Pulse className="h-5 w-28 mx-auto rounded" />
                            <Pulse className="h-4 w-full rounded" />
                            <Pulse className="h-4 w-5/6 rounded" />
                            <Pulse className="h-4 w-4/6 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Map + stats */}
        <div className="container px-5 py-12 mx-auto flex sm:flex-nowrap flex-wrap bg-zinc-100 rounded-lg gap-6">
            <div className="lg:w-2/3 md:w-1/2 rounded-lg overflow-hidden">
                <Pulse className="w-full h-64 rounded-lg" />
            </div>
            <div className="lg:w-1/2 w-full space-y-4 py-6">
                <Pulse className="h-16 w-24 mx-auto rounded" />
                <Pulse className="h-4 w-32 mx-auto rounded" />
                {[1, 2, 3, 4, 5].map((i) => (
                    <Pulse key={i} className={`h-4 w-${i % 2 === 0 ? "3/4" : "2/3"} rounded`} />
                ))}
            </div>
        </div>

        {/* Photo gallery */}
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
            <Pulse className="h-8 w-80 mx-auto mb-10 rounded" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                    <Pulse key={i} className="h-56 w-full rounded shadow-lg" />
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 py-12 px-6 space-y-4 flex flex-col items-center">
            <Pulse className="h-5 w-64 rounded" />
            <div className="flex gap-6 justify-center">
                <Pulse className="h-10 w-16 rounded" />
                <Pulse className="h-10 w-16 rounded" />
            </div>
            <Pulse className="h-4 w-24 rounded mt-2" />
            <div className="flex gap-4">
                <Pulse className="h-10 w-10 rounded" />
                <Pulse className="h-10 w-10 rounded" />
            </div>
        </div>
    </div>
);
