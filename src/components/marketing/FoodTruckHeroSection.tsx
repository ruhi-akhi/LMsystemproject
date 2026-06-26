import Image from 'next/image';
import React from 'react';

const sectionData = {
  serving: {
    title: 'SERVING SINCE 1987',
    text: 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly.',
    buttonText: 'TRUCK LOCATOR',
    image: 'https://taqueria.progressionstudios.com/wp-content/uploads/2019/05/bigstock-street-sale-and-people-concept-281164996-1.jpg'
  },
  authentic: {
    title: 'AUTHENTIC TACOS',
    text: 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head.',
    buttonText: 'VIEW MENU',
    image: 'https://taqueria.progressionstudios.com/wp-content/uploads/2019/05/bigstock-Mexican-Tacos-With-Chicken-Mea-279849772.jpg'
  },
  gallery: {
    title: 'TACO TRUCK GALLERY',
    subtitle: 'We offer catering for birthdays, weddings & more!',
    // এখানে ৮টি ইমেজের লিঙ্কই নিশ্চিত করা হয়েছে
    images: [
      'https://taqueria.progressionstudios.com/wp-content/uploads/elementor/thumbs/bigstock-Close-Up-Worker-Cooking-Tasty-267971764-1-o7tsmymaan3oxgyqdioaqnx9pctdosz7hrt7dl4k94.jpg',
      'https://taqueria.progressionstudios.com/wp-content/uploads/elementor/thumbs/bigstock-street-sale-and-people-concept-286761718-1-o7tsn0hyob69kow02jhjvng6w4k4476o6146c51rwo.jpg',
      'https://taqueria.progressionstudios.com/wp-content/uploads/elementor/thumbs/bigstock-street-sale-payment-and-peopl-253677799-1-o7tsn2dn1z8u7wt9rkat0mz42waujle4uaf5aoyzk8.jpg',
      'https://taqueria.progressionstudios.com/wp-content/uploads/elementor/thumbs/bigstock-Street-tacos-with-carnitas-225381346-1-o7tsn49bfnbev4qjgl425mi19o1kyzllijq498w77s.jpg',
      'https://taqueria.progressionstudios.com/wp-content/uploads/elementor/thumbs/bigstock-Three-Delicious-Pulled-Pork-Ta-260508940-1-o7tsn64ztbdzicnt5lxbam0ygfsbedt26t137stevc.jpg',
      'https://taqueria.progressionstudios.com/wp-content/uploads/elementor/thumbs/bigstock-mexican-street-tacos-with-barb-145963172-1-o7tsn80o6zgk5kl2umqkfljvn7j1ts0iv2c26cqmiw.jpg',
      'https://taqueria.progressionstudios.com/wp-content/uploads/elementor/thumbs/bigstock-Tortilla-Burritos-Sandwiches-274721500-1-o7tsn9wcknj4ssicjnjtkl2stz9s967zjbn14wnu6g.jpg',
      'https://taqueria.progressionstudios.com/wp-content/uploads/2019/05/bigstock-street-sale-and-people-concept-281164996-1.jpg' // ৮ম ইমেজ হিসেবে প্রথমটি ব্যবহার করা হয়েছে
    ]
  }
};

const FoodTruckHeroSection: React.FC = () => {
  return (
    <div className="bg-white text-[#111]">
      {/* Serving Section */}
      <section className="container mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[1.4/1] w-full overflow-hidden">
          <Image
            src={sectionData.serving.image}
            alt="Serving"
            fill
            className="object-cover rounded-sm"
          />
        </div>
        <div className="max-w-md">
           <div className="flex items-center gap-2 mb-4">
              <span className="text-[#FF6B35]">🚚</span>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">{sectionData.serving.title}</h2>
           </div>
           <p className="text-gray-600 mb-8 leading-relaxed">{sectionData.serving.text}</p>
           <button className="bg-[#FF6B35] hover:bg-black hover:text-white transition-all duration-300 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-sm">
             {sectionData.serving.buttonText}
           </button>
        </div>
      </section>

{/* Tacos Section: Text on Left, Image on Right */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Text Content - Left Side */}
          <div className="max-w-md">
             <div className="flex items-center gap-2 mb-4">
                <span className="text-[#FF6B35]">🍴</span>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">
                  {sectionData.authentic.title}
                </h2>
             </div>
             <p className="text-gray-600 mb-8 leading-relaxed">
               {sectionData.authentic.text}
             </p>
             <button className="bg-[#FF6B35] hover:bg-black hover:text-white transition-all duration-300 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-sm">
               {sectionData.authentic.buttonText}
             </button>
          </div>

          {/* Image - Right Side */}
          <div className="relative aspect-[1.4/1] w-full overflow-hidden">
            <Image
              src={sectionData.authentic.image}
              alt="Tacos"
              fill
              className="object-cover rounded-sm"
            />
          </div>

        </div>
      </section>

      {/* Gallery Section - ঠিক ছবির মতো কালো ব্যাকগ্রাউন্ড */}
  {/* Gallery Section */}
      <section className="py-20 bg-white">
        {/* উপরের টেক্সট অংশ - ব্যাকগ্রাউন্ড কালো [#111] */}
        <div className="bg-[#111] py-16 mb-10 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">
              <span className="text-[#FF6B35]">TACO</span> TRUCK GALLERY
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {sectionData.gallery.subtitle}
            </p>
          </div>
        </div>
        
        {/* নিচের ইমেজ গ্রিড অংশ - ব্যাকগ্রাউন্ড সাদা [white] */}
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {sectionData.gallery.images.map((img, idx) => (
              <div key={idx} className="relative aspect-square group overflow-hidden cursor-pointer shadow-sm">
                <Image
                  src={img}
                  alt={`Gallery ${idx}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* হোভার করলে প্লাস আইকন */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-3xl font-light">+</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FoodTruckHeroSection;