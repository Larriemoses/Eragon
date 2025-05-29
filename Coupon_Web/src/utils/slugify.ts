// src/utils/slugify.ts

export const slugify = (text: string): string => {
  return text
    .toString()                // Cast to string
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .toLowerCase()             // Convert to lowercase
    .trim()                    // Trim whitespace from both ends
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars (except -)
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')        // Trim - from start of text
    .replace(/-+$/, '');       // Trim - from end of text
};