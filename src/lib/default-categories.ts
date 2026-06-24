import Category from "@/models/Category";

export const DEFAULT_CATEGORIES = [
  { name: "Electronics", description: "Electronic devices and gadgets" },
  { name: "Clothing", description: "Apparel and fashion items" },
  { name: "Food & Beverage", description: "Food and drink products" },
  { name: "Home & Garden", description: "Home and garden supplies" },
  { name: "General", description: "General inventory items" },
];

export async function ensureDefaultCategories() {
  const count = await Category.countDocuments();
  if (count > 0) return Category.find().sort({ name: 1 }).lean();

  await Category.insertMany(DEFAULT_CATEGORIES);
  return Category.find().sort({ name: 1 }).lean();
}
