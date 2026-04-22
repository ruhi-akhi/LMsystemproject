export const getProductImage = (productName: string): string => {
    // Input validation: jodi productName empty thake
    if (!productName) {
        return "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80";
    }

    const name = productName.toLowerCase().trim();

    const imageMap: Record<string, string> = {
        // Vegetables Section
        "vegetable": "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/salad-1.jpg",
        "carrot": "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/salad-2.jpg",
        "carrot 1 kg": "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/salad-2.jpg",
        "tomato": "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/salad-4.jpg",
        
        // Dinner Menu Section
        "dinner": "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/salad-3.jpg",
        "smoothie": "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/smoothie.jpg",
        "dinner salad": "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/salad-1.jpg",

        // Lunch Section (Incomplete base64 bad diye ekta placeholder dilam)
        "lunch": "https://lunchbox.progressionstudios.com/wp-content/uploads/2015/06/salad-1.jpg"
    };

    // 1. First try exact match
    if (imageMap[name]) {
        return imageMap[name];
    }

    // 2. Try partial match (Longest key first jate "carrot 1 kg" agey match hoy "carrot" er cheye)
    const sortedKeys = Object.keys(imageMap).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        if (name.includes(key)) {
            return imageMap[key];
        }
    }

    // 3. Fallback to placeholder
    return "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80";
};