'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sample products if Firebase is empty
  const sampleProducts = [
    {
      id: '1',
      title: 'Premium Winter Dog Coat',
      shortDescription: 'Waterproof and insulated jacket for maximum warmth',
      price: '49.99',
      category: 'Clothing',
      gradient: 'from-blue-400 to-blue-600',
      emoji: '🧥'
    },
    {
      id: '2',
      title: 'Paw Protection Boots',
      shortDescription: 'Protect paws from ice, snow, and salt on roads',
      price: '29.99',
      category: 'Accessories',
      gradient: 'from-purple-400 to-purple-600',
      emoji: '🐾'
    },
    {
      id: '3',
      title: 'Winter Nutrition Pack',
      shortDescription: 'Special diet supplements for cold weather energy',
      price: '39.99',
      category: 'Nutrition',
      gradient: 'from-green-400 to-green-600',
      emoji: '🍖'
    },
    {
      id: '4',
      title: 'Cozy Dog Bed',
      shortDescription: 'Extra warm orthopedic bed for winter comfort',
      price: '79.99',
      category: 'Furniture',
      gradient: 'from-pink-400 to-pink-600',
      emoji: '🛏️'
    },
    {
      id: '5',
      title: 'Reflective Safety Vest',
      shortDescription: 'High visibility vest for safe winter walks',
      price: '24.99',
      category: 'Safety',
      gradient: 'from-yellow-400 to-orange-600',
      emoji: '🦺'
    },
    {
      id: '6',
      title: 'Heated Water Bowl',
      shortDescription: 'Prevents water from freezing in cold weather',
      price: '44.99',
      category: 'Accessories',
      gradient: 'from-red-400 to-red-600',
      emoji: '💧'
    }
  ];

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : sampleProducts;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Winter Dog Care Products
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our premium collection of winter essentials to keep your furry friend warm, safe, and happy during the cold season.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Categories</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Furniture">Furniture</option>
                <option value="Safety">Safety</option>
              </select>
              <svg 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{displayProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}