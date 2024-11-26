import Link from "next/link";
import { useRouter } from "next/router";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "da", name: "Danish", nativeName: "Dansk" },
];

export const LanguageFooter = () => {
  const router = useRouter();
  const { pathname, asPath, query } = router;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <h2 className="mb-4 text-center text-sm font-medium text-gray-500">Available Languages</h2>
      <div className="grid grid-cols-2 place-items-center gap-y-3 gap-x-6 sm:grid-cols-3 md:grid-cols-5">
        {languages.map((lang) => (
          <Link
            key={lang.code}
            href={{ pathname, query }}
            as={asPath}
            locale={lang.code}
            className={`text-center text-sm ${
              router.locale === lang.code
                ? "font-semibold text-gray-900 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
            rel="alternate"
            hrefLang={lang.code}
          >
            <span className="flex flex-col items-center gap-0.5">
              <span>{lang.nativeName}</span>
              <span className="text-xs text-gray-500">({lang.name})</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
