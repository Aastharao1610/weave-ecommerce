import React from "react";
import Image from "next/image";

const Banner = () => {
  return (
    <section className="relative h-[300px] sm:h-[400px] w-full">
      <Image
        src="/banner.jpg" // 🔁 replace with your image in public folder
        alt="Fashion Banner"
        layout="fill"
        objectFit="cover"
        className="rounded-b-3xl"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h2 className="text-white text-3xl sm:text-5xl font-bold">
          Style for Everyone
        </h2>
      </div>
    </section>
  );
};

export default Banner;
