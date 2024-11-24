import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface Language {
  code: string;
  label: string;
  name: string;
}

const DEFAULT_LANGUAGE: Language = { code: "en", label: "English", name: "English" };

export function LanguageSwitcher() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = [
    DEFAULT_LANGUAGE,
    { code: "de", label: "Deutsch", name: "German" },
    { code: "fr", label: "Français", name: "French" },
    { code: "es", label: "Español", name: "Spanish" },
    { code: "it", label: "Italiano", name: "Italian" },
    { code: "nl", label: "Nederlands", name: "Dutch" },
    { code: "pt", label: "Português", name: "Portuguese" },
    { code: "pl", label: "Polski", name: "Polish" },
    { code: "sv", label: "Svenska", name: "Swedish" },
    { code: "da", label: "Dansk", name: "Danish" },
  ];

  const changeLanguage = (locale: string) => {
    void router.push(router.pathname, router.asPath, { locale });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLanguage = languages.find(lang => lang.code === router.locale) ?? DEFAULT_LANGUAGE;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Current Selection */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      >
        <div className="flex items-center gap-2">
          <Image
            src={`/flags/${currentLanguage.code}.svg`}
            alt={`${currentLanguage.name} flag`}
            width={20}
            height={15}
            className="rounded"
          />
          <span>{currentLanguage.label}</span>
        </div>
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-white/10 bg-[#1a1f35] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/90 hover:bg-white/5"
              >
                <Image
                  src={`/flags/${lang.code}.svg`}
                  alt={`${lang.name} flag`}
                  width={20}
                  height={15}
                  className="rounded"
                />
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
