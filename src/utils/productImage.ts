export const getProductImage = (productName: string): string => {
    const name = productName.toLowerCase();

    const imageMap: Record<string, string> = {
        carrot: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800&q=80",
        "carrot 1 kg": "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800&q=80",
        onion: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
        tomato: "https://images.unsplash.com/photo-1546470427-e5f2e4b6e4c6?w=800&q=80",
        basil: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=800&q=80",
        "spring onion": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        "spring onion bunch": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        kiwi: "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=800&q=80",
        mushroom: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80",
        avocado: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&q=80",
        "fresh avocado": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&q=80",
        apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80",
        banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80",
        potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
        garlic: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&q=80",
        spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80",
        pepper: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&q=80",
        lettuce: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&q=80",
        strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80",
        lemon: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=800&q=80",
        cucumber: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=800&q=80",
        "chicken breast": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80",
        "beef steak": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
        salmon: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
        "salmon fish": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
        shrimp: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80",
        "shrimp pack": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80",
        "organic flour": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
        flour: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
        rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
        "basmati rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
        "premium basmati rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
        "jasmine rice": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&q=80",
  
    };

    // First try exact match
    if (imageMap[name]) {
        return imageMap[name];
    }

    // Then try partial match (longest match first)
    const sortedKeys = Object.keys(imageMap).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        if (name.includes(key)) {
            return imageMap[key];
        }
    }

    // Fallback to placeholder
    return `https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80`;
};