export const getProductImage = (productName: string): string => {
    if (!productName) {
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
    }

    const name = productName.toLowerCase().trim();

    const imageMap: Record<string, string> = {
        // --- Dinner Menu ---
        "dinner": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
        "dinner platter": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
        "meal": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
        "dinner salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",

        // --- Lunch ---
        "lunch": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
        "lunch box": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",

        // --- Breakfast ---
        "breakfast": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80",
        "burrito": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80",

        // --- Seafood ---
        "seafood": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
        "salmon": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",

        // --- Vegetables ---

        "vegetable": "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/salad-2.jpg",
        "spring onion": "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/salad-1.jpg",



        // --- Fruits & Smoothies ---
        "fresh fruit": "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/salad-4.jpg",
        "fruit": "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/smoothie.jpg"
    };

    // Exact Match
    if (imageMap[name]) return imageMap[name];

    // Partial Match
    const sortedKeys = Object.keys(imageMap).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        if (name.includes(key)) {
            return imageMap[key];
        }
    }

    // Default Fallback (Lunch Salad)
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
};