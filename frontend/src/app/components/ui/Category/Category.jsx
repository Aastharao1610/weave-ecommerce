import React from "react";
import Image from "next/image";

const Category = () => {
  return (
    <section className="py-16 px-8 text-center">
      <div className="flex justify-center gap-10 flex-wrap">
        {["Men", "Women", "Kids"].map((cat, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-3">
            <div className="w-20 h-20 sm:w-36 sm:h-36 rounded-full bg-gray-100 shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
              <Image
                src={`/${cat.toLowerCase()}.png`} // 🔁 add men.png, women.png, kids.png in public folder
                alt={cat}
                width={70}
                height={70}
              />
            </div>
            <p className="text-lg font-medium">{cat}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
