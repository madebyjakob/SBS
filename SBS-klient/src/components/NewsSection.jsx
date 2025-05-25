import React from "react";

function NewsCard({ date, title, description }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="text-sm text-tabyBlue-600 mb-2">{date}</div>
            <h3 className="text-xl font-semibold text-tabyBlue-800 mb-3">{title}</h3>
            <p className="text-tabyBlue-700">{description}</p>
            <button className="mt-4 text-tabyBlue-500 font-semibold hover:text-tabyBlue-700 transition-colors">
                Läs mer →
            </button>
        </div>
    );
}

export default function NewsSection() {
    const latestNews = [
        {
            id: 1,
            title: "Nya funktioner i systemet",
            date: "2024-03-20",
            description: "Vi har lagt till flera nya funktioner för att förbättra din upplevelse."
        },
        {
            id: 2,
            title: "Uppdaterad bokhantering",
            date: "2024-03-18",
            description: "Nu är det enklare än någonsin att hantera dina böcker."
        },
        {
            id: 3,
            title: "Kommande förbättringar",
            date: "2024-03-15",
            description: "Se vad vi planerar för framtida uppdateringar."
        }
    ];

    return (
        <div className="container mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold text-tabyBlue-800 mb-8">Senaste nytt</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestNews.map((news) => (
                    <NewsCard
                        key={news.id}
                        date={news.date}
                        title={news.title}
                        description={news.description}
                    />
                ))}
            </div>
        </div>
    );
} 