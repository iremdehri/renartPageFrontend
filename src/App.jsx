import React, { useEffect, useState } from "react";
import ProductCarousel from "./components/ProductCarousel";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        console.log("Ürünler:", data); 
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Hata: {error}</div>;
  console.log("ProductCarousel içindeki ürün sayısı:", products.length);
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="flex flex-col items-center pt-12 pb-4">
        <h1 className="text-4xl md:text-5xl font-avenir font-normal text-center">Product List</h1>
      </div>
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-12">
        <ProductCarousel products={products} />
      </div>
    </div>
  );
}

export default App;
