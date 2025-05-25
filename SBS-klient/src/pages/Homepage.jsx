import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import NewsSection from "../components/NewsSection";

export default function Homepage() {
    return (
        <div className="homepage min-h-screen bg-tabyBlue-50">
            <Navbar />
            <Hero />
            <NewsSection />
        </div>
    );
}