import type { MarketplaceListing } from "@/lib/schemas/marketplace";

export const DEFAULT_SITE_LANGUAGE = "en";

export type ListingTranslation = {
  language: string;
  languageLabel: string;
  title: string;
  description: string;
};

function englishFromListing(listing: MarketplaceListing): ListingTranslation {
  const heading = listing.patternContent.match(/^#\s+(.+)/m)?.[1]?.trim();
  const title =
    heading && !looksTranslated(heading) ? heading : listing.title;

  return {
    language: "en",
    languageLabel: "English",
    title,
    description: listing.description || listing.aiDescription.slice(0, 240),
  };
}

function looksTranslated(text: string): boolean {
  return /patr[oó]n|sudadera|cuadros de la abuela|modèle|muster|パターン/i.test(
    text,
  );
}

export function getEnglishTranslation(
  listing: MarketplaceListing,
): ListingTranslation {
  const stored = listing.languages.find((lang) => lang.language === "en");
  if (stored && !looksTranslated(stored.title)) {
    return stored;
  }
  return englishFromListing(listing);
}

export function getListingTranslation(
  listing: MarketplaceListing,
  language: string,
): ListingTranslation {
  if (language === DEFAULT_SITE_LANGUAGE) {
    return getEnglishTranslation(listing);
  }

  const match = listing.languages.find((lang) => lang.language === language);
  if (match) {
    return match;
  }

  return getEnglishTranslation(listing);
}

export function getListingLanguages(
  listing: MarketplaceListing,
): ListingTranslation[] {
  const english = getEnglishTranslation(listing);
  const others = listing.languages.filter((lang) => lang.language !== "en");
  return [english, ...others];
}

export function normalizeListingLanguages(
  languages: ListingTranslation[],
  english: { title: string; description: string },
): ListingTranslation[] {
  const others = languages.filter((lang) => lang.language !== "en");
  return [
    {
      language: "en",
      languageLabel: "English",
      title: english.title,
      description: english.description,
    },
    ...others,
  ];
}

export function normalizeMarketplaceListing(
  listing: MarketplaceListing,
): MarketplaceListing {
  const english = getEnglishTranslation(listing);
  const languages = normalizeListingLanguages(listing.languages, {
    title: english.title,
    description: english.description,
  });

  if (
    listing.title === languages[0].title &&
    listing.languages.length === languages.length &&
    listing.languages.every(
      (lang, index) =>
        lang.language === languages[index]?.language &&
        lang.title === languages[index]?.title,
    )
  ) {
    return listing;
  }

  return {
    ...listing,
    title: english.title,
    description: english.description,
    languages,
  };
}
