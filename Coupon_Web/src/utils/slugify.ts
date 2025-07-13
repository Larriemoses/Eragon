export const slugify = (text: string | undefined | null): string => {
  if (typeof text !== "string") return "";
  if (typeof text !== "string") return "item"; // fallback for nulls
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/-+$/, "");
};
