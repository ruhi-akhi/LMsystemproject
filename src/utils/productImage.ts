export const getProductImage = (productName: string): string => {
    const name = productName.toLowerCase();

    const imageMap: Record<string, string> = {
        carrot: "https://images.pexels.com/photos/1306559/pexels-photo-1306559.jpeg?w=800",
        onion: "https://images.pexels.com/photos/175727/pexels-photo-175727.jpeg?w=800",
        tomato: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?w=800",
        basil: "https://images.pexels.com/photos/906150/pexels-photo-906150.jpeg?w=800",
        "spring onion": "https://images.pexels.com/photos/1294540/pexels-photo-1294540.jpeg?w=800",
        "spring onion bunch": "https://images.pexels.com/photos/1424135/pexels-photo-1424135.jpeg?w=800",
        kiwi: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?w=800",
        mushroom: "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?w=800",
        avocado: "https://images.pexels.com/photos/209339/pexels-photo-209339.jpeg?w=800",
        apple: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?w=800",
        banana: "https://images.pexels.com/photos/39396/pexels-photo-39396.jpeg?w=800",
        potato: "https://images.pexels.com/photos/569685/pexels-photo-569685.jpeg?w=800",
        garlic: "https://images.pexels.com/photos/411023/pexels-photo-411023.jpeg?w=800",
        spinach: "https://images.pexels.com/photos/8390/food-salad-vegetables-healthy.jpg?w=800",
        pepper: "https://images.pexels.com/photos/247466/pexels-photo-247466.jpeg?w=800",
        lettuce: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?w=800",
        strawberry: "https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?w=800",
        lemon: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?w=800",
        cucumber: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=800",
        "chicken breast": "https://images.pexels.com/photos/620994/pexels-photo-620994.jpeg?w=800",
        "beef steak": "https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?w=800",
        salmon: "https://images.pexels.com/photos/46239/salmon-dish-food-healthy-46239.jpeg?w=800",
        shrimp: "https://images.pexels.com/photos/1441316/pexels-photo-1441316.jpeg?w=800",
        "organic flour": "https://images.pexels.com/photos/302680/pexels-photo-302680.jpeg?w=800",
        rice: "https://images.pexels.com/photos/357515/pexels-photo-357515.jpeg?w=800",
        basmati: "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?w=800",
        jasmine: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?w=800",
        brown: "https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?w=800",
    };

    for (const key in imageMap) {
        if (name.includes(key)) return imageMap[key];
    }

    return `https://picsum.photos/seed/${encodeURIComponent(productName)}/800/600`;
};