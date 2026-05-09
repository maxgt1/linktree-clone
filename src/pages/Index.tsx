"use client";
import React from "react";
import Profile from "../components/Profile";
import LinkButton from "../components/LinkButton";
import SocialLinks from "../components/SocialLinks";
import { useAppContext } from "@/context/AppContext";
import { Globe } from "lucide-react";

const Index = () => {
    const {
        links,
        profile,
        theme
    } = useAppContext();

    const activeLinks = links.filter(l => l.isActive);

    const getThemeStyles = () => {
        switch (theme) {
        case "dark":
            return "bg-[#121212] text-white";
        case "sunset":
            return "bg-gradient-to-br from-orange-100 to-rose-200";
        case "ocean":
            return "bg-[#e0f2f1]";
        default:
            return "bg-[#f8f9fa]";
        }
    };

    return (
        <div
            className={`min-h-screen ${getThemeStyles()} py-16 px-4 transition-colors duration-500`}>
            <div className="max-w-md mx-auto">
                <Profile name={profile.name} bio={profile.bio} avatarUrl={profile.avatarUrl} />
                <div className="space-y-4">
                    {activeLinks.map(link => (<LinkButton
                        key={link.id}
                        title={link.title}
                        url={link.url}
                        icon={<Globe size={20} />} />))}
                    {activeLinks.length === 0 && (<div className="text-center py-12 text-gray-400">No hay enlaces activos.
                                    </div>)}
                </div>
                <SocialLinks />
                <footer className="mt-16 text-center">
                    <p
                        className={`${theme === "dark" ? "text-gray-500" : "text-gray-400"} text-sm font-medium`}></p>
                </footer>
            </div>
        </div>
    );
};

export default Index;