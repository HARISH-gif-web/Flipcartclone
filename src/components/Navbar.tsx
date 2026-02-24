import React from 'react';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onSearch: (query: string) => void;
}

export function Navbar({ cartCount, onCartClick, onSearch }: NavbarProps) {
  return (
    <nav className="bg-blue-600 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Menu className="h-6 w-6 sm:hidden cursor-pointer" />
            <div className="flex flex-col">
              <span className="font-bold text-xl italic tracking-wider">Flipkart</span>
              <span className="text-[10px] italic text-gray-200 flex items-center gap-1">
                Explore <span className="text-yellow-400 font-bold">Plus</span>
                <span className="text-yellow-400 text-[10px]">✦</span>
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full py-2 px-4 pl-10 rounded-sm text-gray-800 focus:outline-none shadow-sm"
                onChange={(e) => onSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-600" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6 font-medium">
            <button className="bg-white text-blue-600 px-8 py-1 rounded-sm font-semibold hover:bg-gray-50 transition-colors hidden sm:block">
              Login
            </button>
            <div className="hidden sm:block cursor-pointer hover:text-gray-200">Become a Seller</div>
            <div className="hidden sm:flex items-center gap-1 cursor-pointer hover:text-gray-200">
              <span>More</span>
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-gray-200 relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="sm:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full py-2 px-4 pl-10 rounded-sm text-gray-800 focus:outline-none shadow-sm"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </nav>
  );
}
