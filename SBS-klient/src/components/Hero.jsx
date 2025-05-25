import React from "react";

export default function Hero() {
    return (
        <div className="bg-gradient-to-r from-tabyBlue-500 to-tabyBlue-700">
            <div className="container mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2 text-white">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                            Välkommen till Skarpängs bibliotekssystem
                        </h1>
                        <p className="text-xl text-tabyBlue-100 mb-8">
                            Ett modernt system för att hantera dina boklån på skolan.
                        </p>
                        <button className="bg-white text-tabyBlue-500 px-8 py-3 rounded-lg font-semibold hover:bg-tabyBlue-50 transition duration-300">
                            Kom igång
                        </button>
                    </div>
                    <div className="md:w-1/2">
                        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
                            <div className="aspect-video bg-tabyBlue-600/30 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg">Placeholder för illustration</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 