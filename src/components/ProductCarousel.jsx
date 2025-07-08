import React, { useState } from 'react';
import Slider from 'react-slick';
import ProductCard from './ProductCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import leftArrow from '../assets/icons/arrow-left.png';
import rightArrow from '../assets/icons/arrow-right.png';
import { FaFilter } from 'react-icons/fa';
import { useRef, useEffect } from 'react';

const Arrow = ({ className, style, onClick, left }) => (
  <button
    className={
      className +
      " !flex !items-center !justify-center !bg-white !rounded-full !shadow !w-10 !h-10 !z-20 !top-1/2 !-translate-y-1/2" +
      (left ? " !left-2" : " !right-2")
    }
    style={{ ...style, border: "none", display: "flex" }}
    onClick={onClick}
    aria-label={left ? "Previous" : "Next"}
  >
    <img
      src={left ? leftArrow : rightArrow}
      alt={left ? "Previous" : "Next"}
      className="w-4 h-4"
    />
  </button>
);

const ProductCarousel = ({ products }) => {
  // Filter panel state
  const [showFilter, setShowFilter] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minStars, setMinStars] = useState('');
  const [showPriceAccordion, setShowPriceAccordion] = useState(true);
  const [showRatingAccordion, setShowRatingAccordion] = useState(false);
  // Sort state
  const [sortType, setSortType] = useState(''); // '', 'price-asc', 'price-desc', 'rating-asc', 'rating-desc'
  const [filterDropdown, setFilterDropdown] = useState(''); // '', 'price', 'rating'

  // Filter panel toggle
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Filtered products
  let filteredProducts = products.filter(product => {
    const price = Number(product.price);
    const stars = Number(product.popularityOutOf5);
    let pass = true;
    if (minPrice !== '' || maxPrice !== '') {
      const minP = minPrice === '' ? -Infinity : Number(minPrice);
      const maxP = maxPrice === '' ? Infinity : Number(maxPrice);
      pass = pass && price >= minP && price <= maxP;
    }
    if (minStars !== '') {
      const minS = Number(minStars);
      pass = pass && stars >= minS;
    }
    return pass;
  });

  // Sorting
  if (sortType === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortType === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortType === 'rating-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.popularityOutOf5 - b.popularityOutOf5);
  } else if (sortType === 'rating-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.popularityOutOf5 - a.popularityOutOf5);
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    draggable: true,
    swipe: true,
    nextArrow: <Arrow left={false} />,
    prevArrow: <Arrow left={true} />,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  const filterDropdownRef = useRef(null);

  useEffect(() => {
    if (!showFilter && !filterDropdown && !showFilterPanel) return;
    function handleClickOutside(event) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilter(false);
        setShowFilterPanel(false);
        setFilterDropdown('');
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showFilter, filterDropdown, showFilterPanel]);

  // Geçici state'ler
  const [tempMinPrice, setTempMinPrice] = useState('');
  const [tempMaxPrice, setTempMaxPrice] = useState('');
  const [tempMinStars, setTempMinStars] = useState('');

  // Apply butonuna basınca filtreleri uygula
  function handleApply() {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setMinStars(tempMinStars);
    setFilterDropdown('');
    setShowFilter(false);
    setShowFilterPanel(false);
  }

  // Filter açılınca geçici state'leri güncelle
  useEffect(() => {
    if (filterDropdown === 'price') {
      setTempMinPrice(minPrice);
      setTempMaxPrice(maxPrice);
    }
    if (filterDropdown === 'rating') {
      setTempMinStars(minStars);
    }
  }, [filterDropdown]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Filter & Sort Bar */}
      <div className="flex gap-4 items-center mb-6 relative justify-end">
        {/* Filter Dropdown */}
        <div className="relative" ref={filterDropdownRef}>
          <select
            className="border rounded px-4 py-2 bg-white shadow w-40"
            value={filterDropdown}
            onChange={e => {
              const val = e.target.value;
              if (val === '') {
                setShowFilterPanel(s => !s); // Toggle panel
              } else {
                setShowFilterPanel(true);
              }
              setFilterDropdown(val);
            }}
            onBlur={() => setShowFilter(false)}
            onClick={() => setShowFilter(true)}
          >
            <option value="">Filter</option>
            <option value="price">Price Range</option>
            <option value="rating">Rating</option>
          </select>
          {/* Filter ana paneli */}
          {showFilterPanel && filterDropdown === '' && (
            <div className="absolute right-0 mt-1 z-30 bg-white border rounded-lg shadow w-40 p-2 flex flex-col gap-2 text-sm text-black">
              <button
                className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setFilterDropdown('price')}
              >
                Price Range
              </button>
              <button
                className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setFilterDropdown('rating')}
              >
                Rating
              </button>
            </div>
          )}
          {/* Price Range paneli */}
          {filterDropdown === 'price' && (
            <div className="absolute right-0 mt-1 z-30 bg-white border rounded-lg shadow w-40 p-2 flex flex-col gap-2 text-sm text-black">
              <div className="flex gap-1 items-center">
                <input
                  type="number"
                  value={tempMinPrice}
                  onChange={e => setTempMinPrice(e.target.value)}
                  className="border rounded px-0.5 py-0.5 w-8 text-xs"
                  placeholder="Min"
                />
                <span className="self-center">-</span>
                <input
                  type="number"
                  value={tempMaxPrice}
                  onChange={e => setTempMaxPrice(e.target.value)}
                  className="border rounded px-0.5 py-0.5 w-8 text-xs"
                  placeholder="Max"
                />
              </div>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded shadow hover:bg-blue-600 w-full text-xs mt-1"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          )}
          {/* Rating paneli */}
          {filterDropdown === 'rating' && (
            <div className="absolute right-0 mt-1 z-30 bg-white border rounded-lg shadow w-40 p-2 flex flex-col gap-2 text-sm text-black">
              <select
                className="border rounded px-2 py-1 bg-white shadow w-full text-sm"
                value={tempMinStars}
                onChange={e => setTempMinStars(e.target.value)}
              >
                <option value="">All Ratings</option>
                <option value="5">5 stars & up</option>
                <option value="4">4 stars & up</option>
                <option value="3">3 stars & up</option>
                <option value="2">2 stars & up</option>
                <option value="1">1 star & up</option>
              </select>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded shadow hover:bg-blue-600 w-full text-xs mt-1"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          )}
        </div>
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            className="border rounded px-4 py-2 bg-white shadow w-40"
            value={sortType}
            onChange={e => setSortType(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
        </div>
      </div>
      <Slider {...settings}>
        {filteredProducts.map((product, index) => (
          <div key={index} className="px-2">
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
