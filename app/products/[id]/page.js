'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetailsPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const docRef = doc(db, 'products', params.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        // Sample product for demo
        setSampleProduct();
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setSampleProduct();
    } finally {
      setLoading(false);
    }
  };

  const setSampleProduct = () => {
    const sampleProducts = {
      '1': {
        id: '1',
        title: 'Premium Winter Dog Coat',
        shortDescription: 'Waterproof and insulated jacket for maximum warmth',
        fullDescription: 'Our Premium Winter Dog Coat is designed with your pet\'s comfort in mind. Made from high-quality, waterproof materials with an insulated inner layer, this coat will keep your dog warm and dry during the coldest winter days. Features adjustable straps for a perfect fit, reflective strips for nighttime visibility, and a stylish design that your dog will love wearing. Suitable for all breeds and sizes. Machine washable for easy care.',
        price: '49.99',
        category: 'Clothing',
        gradient: 'from-blue-400 to-blue-600',
        emoji: '🧥',
        features: ['Waterproof outer layer', 'Insulated interior', 'Adjustable fit', 'Reflective strips', 'Machine washable']
      },
      '2': {
        id: '2',
        title: 'Paw Protection Boots',
        shortDescription: 'Protect paws from ice, snow, and salt on roads',
        fullDescription: 'Keep your dog\'s paws safe and comfortable with our Paw Protection Boots. These durable boots protect against ice, snow, salt, and rough terrain. The non-slip sole provides excellent traction, while the adjustable velcro straps ensure they stay securely in place. Made from breathable, weather-resistant materials. Perfect for winter walks and outdoor adventures.',
        price: '29.99',
        category: 'Accessories',
        gradient: 'from-purple-400 to-purple-600',
        emoji: '🐾',
        features: ['Non-slip sole', 'Adjustable velcro straps', 'Breathable material', 'Set of 4 boots', 'Multiple sizes available']
      },
      '3': {
        id: '3',
        title: 'Winter Nutrition Pack',
        shortDescription: 'Special diet supplements for cold weather energy',
        fullDescription: 'Our Winter Nutrition Pack is specially formulated to help your dog maintain energy and health during the cold winter months. Contains essential vitamins, minerals, and omega fatty acids that support immune function, joint health, and coat quality. Veterinarian recommended and made with all-natural ingredients. Easy to add to your dog\'s regular meals.',
        price: '39.99',
        category: 'Nutrition',
        gradient: 'from-green-400 to-green-600',
        emoji: '🍖',
        features: ['Vet approved formula', 'All-natural ingredients', 'Supports immune system', 'Promotes healthy coat', '30-day supply']
      }
    };

    setProduct(sampleProducts[params.id] || sampleProducts['1']);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link href="/products" className="text-blue-600 hover:text-blue-700">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8 font-semibold"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className={`bg-gradient-to-br ${product.gradient || 'from-blue-400 to-blue-600'} flex items-center justify-center p-12`}>
              <div className="text-[200px] leading-none">{product.emoji || '🐕'}</div>
            </div>

            {/* Product Info */}
            <div className="p-8 md:p-12">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category || 'General'}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              <div className="flex items-center mb-6">
                <span className="text-5xl font-bold text-blue-600">
                  ${product.price}
                </span>
                <span className="ml-4 text-gray-500 line-through text-xl">
                  ${(parseFloat(product.price) * 1.3).toFixed(2)}
                </span>
              </div>

              <p className="text-gray-600 text-lg mb-6">
                {product.shortDescription}
              </p>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.fullDescription || product.shortDescription}
                </p>
              </div>

              {product.features && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                  Add to Cart 🛒
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition">
                  ❤️
                </button>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-700 text-sm">
                  ✓ Free shipping on orders over $50 • 30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}