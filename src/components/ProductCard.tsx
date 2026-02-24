import React from 'react';
import { Star, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-200 border border-gray-100 p-4 flex flex-col group relative">
      {/* Wishlist Button */}
      <button className="absolute top-2 right-2 text-gray-300 hover:text-red-500 z-10">
        <Heart className="h-5 w-5" />
      </button>

      {/* Image */}
      <div className="h-48 flex items-center justify-center mb-4 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1 hover:text-blue-600 cursor-pointer">
          {product.title}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            {product.rating} <Star className="h-3 w-3 fill-current" />
          </div>
          <span className="text-gray-500 text-xs font-medium">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            <span className="text-gray-500 text-sm line-through">₹{(product.price * 1.2).toFixed(0)}</span>
            <span className="text-green-600 text-sm font-bold">20% off</span>
          </div>
          <div className="text-xs text-green-700 font-medium mt-1">Free delivery</div>
        </div>

        {/* Add to Cart Button (visible on hover/mobile) */}
        <button 
          onClick={() => onAddToCart(product)}
          className="mt-3 w-full bg-yellow-400 text-gray-900 font-semibold py-2 rounded-sm hover:bg-yellow-500 transition-colors text-sm uppercase tracking-wide opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 block"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
