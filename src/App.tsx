import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Product, CartItem } from './types';
import { Loader2, ShoppingBag } from 'lucide-react';

function App() {
  const [view, setView] = useState<'home' | 'cart'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, [searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (product: Product) => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      fetchCart();
      alert('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      await fetch(`/api/cart/${id}`, { method: 'DELETE' });
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    try {
      if (quantity < 1) return removeFromCart(id);
      await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity }),
      });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleCheckout = () => {
    alert('Checkout functionality coming soon! This is a demo.');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
        onCartClick={() => setView('cart')}
        onSearch={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'home' ? (
          <>
            {/* Categories / Filters */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
              {['All', 'Mobiles', 'Electronics', 'Fashion', 'Laptops', 'Home & Kitchen', 'Books'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => setView('home')}
              className="mb-6 text-blue-600 hover:underline flex items-center gap-1 font-medium"
            >
              ← Back to Shopping
            </button>
            <Cart 
              cartItems={cart} 
              onRemove={removeFromCart} 
              onUpdateQuantity={updateQuantity}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
