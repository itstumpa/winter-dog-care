'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function ManageProductsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

 const fetchProducts = async () => {
  if (!user) return;

  try {
    const response = await fetch(`/api/products?userId=${user.uid}`);
    const data = await response.json();
    
    if (data.products) {
      const productsData = data.products.map(product => ({
        ...product,
        id: product._id.toString(),
      }));
      setProducts(productsData);
    }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  setDeleting(productId);
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete');
    }

    setProducts(products.filter(p => p.id !== productId));
    alert('Product deleted successfully! ✅');

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Products</h1>
            <p className="text-gray-600">View and manage all your winter dog care products</p>
          </div>
          <Link
            href="/add-product"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            ➕ Add New Product
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="text-5xl">📦</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Your Products</p>
                <p className="text-3xl font-bold text-gray-900">
                  {products.filter(p => p.createdBy === user.uid).length}
                </p>
              </div>
              <div className="text-5xl">✨</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Categories</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(products.map(p => p.category)).size}
                </p>
              </div>
              <div className="text-5xl">🏷️</div>
            </div>
          </div>
        </div>

        {/* Products Table/Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first winter dog care product</p>
            <Link
              href="/add-product"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="text-3xl mr-4">{product.emoji || '🐕'}</div>
                          <div>
                            <div className="font-semibold text-gray-900">{product.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{product.shortDescription}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">${product.price}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.createdByName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => router.push(`/products/${product.id}`)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {deleting === product.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {products.map(product => (
                <div key={product.id} className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">{product.emoji || '🐕'}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{product.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.shortDescription}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                          {product.category}
                        </span>
                        <span className="font-bold text-gray-900">${product.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/products/${product.id}`)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold disabled:bg-gray-400"
                    >
                      {deleting === product.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ManageProductsPage() {
  return (
    <ProtectedRoute>
      <ManageProductsContent />
    </ProtectedRoute>
  );
}