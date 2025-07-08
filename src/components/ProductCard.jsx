import React, { useState } from "react";

const COLOR_ORDER = ["yellow", "white", "rose"];
const COLOR_MAP = {
  yellow: { name: "Yellow Gold", hex: "#E6CA97" },
  white: { name: "White Gold", hex: "#D9D9D9" },
  rose: { name: "Rose Gold", hex: "#E1A4A9" },
};

const ProductCard = ({ product }) => {
  const { name, price, popularityOutOf5, images } = product;
  const colorOptions = COLOR_ORDER.filter((c) => images[c]);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const filledStars = Math.floor(popularityOutOf5);
  const halfStar = popularityOutOf5 % 1 >= 0.5;
  const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl shadow flex flex-col px-4 pt-4 pb-4 mx-auto" style={{ minWidth: 220, maxWidth: 260 }}>
      {/* Görsel kutusu */}
      <div className="mb-8">
        <img
          src={images[selectedColor]}
          alt={name}
          className="max-w-full object-contain"
        />
      </div>
      {/* Ürün adı */}
      <div className="text-[15px] font-avenir font-bold text-black mb-0.5">{name}</div>
      {/* Fiyat */}
      <div style={{ marginBottom: "10px" }}className="text-[15px] font-montserrat text-gray-800 mb-2">
        ${Number(price).toFixed(2)} USD
      </div>
      {/* Renk seçici */}
      <div className="flex items-center gap-2 mb-4 mt-2">
        {colorOptions.map((color) => (
          <button
            key={color}
            className={`w-6 h-6 aspect-square rounded-full border-2 flex items-center justify-center transition-all duration-150 ${selectedColor === color ? "border-black" : "border-gray-300"}`}
            style={{ background: COLOR_MAP[color].hex }}
            onClick={() => setSelectedColor(color)}
            aria-label={COLOR_MAP[color].name}
          />
        ))}
      </div>
      {/* Renk adı */}
      <div className="text-[12px] font-avenir text-gray-500 mb-2">
        {COLOR_MAP[selectedColor]?.name}
      </div>
      {/* Yıldızlı puan */}
      <div className="flex items-center gap-1 mb-2">
        {[...Array(filledStars)].map((_, i) => (
          <span key={"full-" + i} className="text-[#E6CA97] text-[15px]">★</span>
        ))}
        {halfStar && <span className="text-[#E6CA97] text-[15px]">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={"empty-" + i} className="text-gray-300 text-[15px]">★</span>
        ))}
        <span className="text-[15px] font-avenir text-gray-700 ml-1">{Number(popularityOutOf5).toFixed(1)}/5</span>
      </div>
    </div>
  );
};

export default ProductCard;
