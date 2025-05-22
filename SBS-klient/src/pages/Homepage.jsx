import React from "react";
import Navbar from "../components/Navbar";

export default function Homepage() {
    return (
        <div className="homepage">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold text-center">Välkommen till SB-system</h1>
                <p className="mt-4 text-lg text-center">
                    Här kan du hantera dina böcker och sidor.
                </p>
            </div>
        </div>
    )
}