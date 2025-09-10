import React, { createContext, useState, useContext, useEffect } from "react";
import { translations } from "../../translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("de");

    useEffect(() => {
        const storedLang = localStorage.getItem("language");
        if (storedLang) setLanguage(storedLang);
    }, []);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const t = translations[language];

    
    const languages = [
        { code: "de", label: "Deutsch", countryCode: "DE" },
        { code: "en", label: "English", countryCode: "GB" },
        //{ code: "ru", label: "Русский", countryCode: "RU" },
        //{ code: "es", label: "Español", countryCode: "ES" }
    ];

    const LanguageSwitcher = () => (
        <div className="flex space-x-3">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center px-3 py-1 rounded-lg shadow transition 
                        ${language === lang.code ? "bg-blue-500 text-white" : "bg-gray-100"}
                    `}
                >
                    <ReactCountryFlag
                        countryCode={lang.countryCode}
                        svg
                        style={{ width: "1.5em", height: "1.5em", marginRight: "0.5em" }}
                    />
                    {lang.label}
                </button>
            ))}
        </div>
    );

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, LanguageSwitcher }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
