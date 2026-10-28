import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/storeData';
import { ProductCard } from '../ui/ProductCard';
import { ChevronDown, X, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Product } from '../../types/store';

const DEPARTMENTS = [
  { label: 'All pieces', value: 'all' },
  { label: 'Clothing', value: 'Clothing' },
  { label: 'Tailoring', value: 'Tailoring' },
  { label: 'Dresses', value: 'Dresses' },
  { label: 'Knitwear', value: 'Knitwear' },
  { label: 'Outerwear', value: 'Outerwear' },
  { label: 'Accessories', value: 'Accessories' },
];

export const ShopPage: React.FC = () => {
  const { navigateTo, selectedCategory, openQuickView } = useStore();

  const [activeDepartment, setActiveDepartment] = useState<string>(selectedCategory || 'all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Synchronize when selectedCategory changes from navigation
  React.useEffect(() => {
    if (selectedCategory) {
      setActiveDepartment(selectedCategory);
    }
  }, [selectedCategory]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category / Department check
      if (activeDepartment !== 'all') {
        const matchesDepartment = product.department === activeDepartment || product.category === activeDepartment;
        if (!matchesDepartment) return false;
      }

      // Size check
      if (selectedSize !== 'all') {
        if (!product.sizes.includes(selectedSize)) return false;
      }

      // Color check
      if (selectedColor !== 'all') {
        const hasColor = product.colors.some(
          (c) => c.name.toLowerCase() === selectedColor.toLowerCase()
        );
        if (!hasColor) return false;
      }

      // Price range check
      if (priceRange === 'under-10000') {
        if (product.price >= 10000) return false;
      } else if (priceRange === '10000-20000') {
        if (product.price < 10000 || product.price > 20000) return false;
      } else if (priceRange === 'above-20000') {
        if (product.price <= 20000) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0);
      return 0; // featured order default
    });
  }, [activeDepartment, selectedSize, selectedColor, priceRange, sortBy]);

  const hasActiveFilters =
    activeDepartment !== 'all' || selectedSize !== 'all' || selectedColor !== 'all' || priceRange !== 'all';

  const clearAllFilters = () => {
    setActiveDepartment('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setPriceRange('all');
    setSortBy('featured');
  };

  const handleProductCardClick = (product: Product) => {
    navigateTo('pdp', product.slug);
  };

  return (
    <div className="bg-ivory min-h-screen pt-4 sm:pt-6 pb-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-luxury text-charcoal/50 mb-6 sm:mb-8">
          <ol className="flex items-center gap-2">
            <li>
              <button onClick={() => navigateTo('home')} className="hover:text-charcoal transition-colors">
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button onClick={clearAllFilters} className="hover:text-charcoal transition-colors">
                Shop
              </button>
            </li>
            <li>/</li>
            <li className="text-charcoal font-medium">
              {activeDepartment === 'all' ? 'All pieces' : activeDepartment}
            </li>
          </ol>
        </nav>

        {/* Catalog Header */}
        <div className="mb-10 sm:mb-14">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-charcoal tracking-tight">
            The considered collection
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-charcoal/70 font-light max-w-xl leading-relaxed">
            Quietly distinctive. Beautifully versatile. Discover the building blocks of a wardrobe that feels like you.
          </p>
        </div>

        {/* Category Department Tabs */}
        <div className="border-b border-accent-border/70 pb-4 mb-8 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max">
            {DEPARTMENTS.map((dept) => {
              const isActive = activeDepartment === dept.value;
              return (
                <button
                  key={dept.value}
                  onClick={() => setActiveDepartment(dept.value)}
                  className={`px-4 py-2 text-xs uppercase tracking-luxury transition-all border ${
                    isActive
                      ? 'bg-charcoal text-ivory border-charcoal font-medium shadow-sm'
                      : 'bg-ivory text-charcoal/70 border-accent-border hover:border-charcoal/50 hover:text-charcoal'
                  }`}
                >
                  {dept.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-ivory-50 border border-accent-border p-3 sm:p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Desktop Selectors */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            {/* Category Dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by department"
                value={activeDepartment}
                onChange={(e) => setActiveDepartment(e.target.value)}
                className="appearance-none bg-ivory border border-accent-border px-3.5 py-2 pr-8 text-xs text-charcoal rounded-none outline-none hover:border-charcoal focus:border-charcoal cursor-pointer"
              >
                <option value="all">Category: All</option>
                <option value="Tailoring">Tailoring</option>
                <option value="Dresses">Dresses</option>
                <option value="Clothing">Clothing</option>
                <option value="Knitwear">Knitwear</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Size Dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="appearance-none bg-ivory border border-accent-border px-3.5 py-2 pr-8 text-xs text-charcoal rounded-none outline-none hover:border-charcoal focus:border-charcoal cursor-pointer"
              >
                <option value="all">Size: All</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="26">26</option>
                <option value="28">28</option>
                <option value="30">30</option>
                <option value="32">32</option>
                <option value="34">34</option>
                <option value="One Size">One Size</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Color Dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="appearance-none bg-ivory border border-accent-border px-3.5 py-2 pr-8 text-xs text-charcoal rounded-none outline-none hover:border-charcoal focus:border-charcoal cursor-pointer"
              >
                <option value="all">Color: All</option>
                <option value="Ivory">Ivory / Natural</option>
                <option value="Sand">Sand / Taupe</option>
                <option value="Onyx">Onyx / Black</option>
                <option value="Espresso">Espresso / Cognac</option>
                <option value="Oatmeal">Oatmeal / Dune</option>
                <option value="Camel">Camel</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Price Dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by price range"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="appearance-none bg-ivory border border-accent-border px-3.5 py-2 pr-8 text-xs text-charcoal rounded-none outline-none hover:border-charcoal focus:border-charcoal cursor-pointer"
              >
                <option value="all">Price: All</option>
                <option value="under-10000">Under ₹10,000</option>
                <option value="10000-20000">₹10,000 – ₹20,000</option>
                <option value="above-20000">Above ₹20,000</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Mobile Filter Trigger Button */}
          <div className="md:hidden flex items-center justify-between">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-accent-border bg-ivory text-xs uppercase tracking-luxury text-charcoal font-medium"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {hasActiveFilters ? '(Active)' : ''}</span>
            </button>
            <span className="text-xs text-charcoal/60 font-medium">
              {filteredProducts.length} pieces
            </span>
          </div>

          {/* Mobile Filter Collapsible Area */}
          {isMobileFilterOpen && (
            <div className="md:hidden pt-3 border-t border-accent-border/70 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <select
                  aria-label="Filter by department"
                  value={activeDepartment}
                  onChange={(e) => setActiveDepartment(e.target.value)}
                  className="bg-ivory border border-accent-border px-3 py-2 text-xs text-charcoal"
                >
                  <option value="all">Category: All</option>
                  <option value="Tailoring">Tailoring</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Knitwear">Knitwear</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Accessories">Accessories</option>
                </select>

                <select
                  aria-label="Filter by size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="bg-ivory border border-accent-border px-3 py-2 text-xs text-charcoal"
                >
                  <option value="all">Size: All</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="28">28</option>
                  <option value="30">30</option>
                </select>

                <select
                  aria-label="Filter by color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="bg-ivory border border-accent-border px-3 py-2 text-xs text-charcoal"
                >
                  <option value="all">Color: All</option>
                  <option value="Ivory">Ivory</option>
                  <option value="Sand">Sand</option>
                  <option value="Onyx">Onyx</option>
                  <option value="Espresso">Espresso</option>
                  <option value="Camel">Camel</option>
                </select>

                <select
                  aria-label="Filter by price range"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="bg-ivory border border-accent-border px-3 py-2 text-xs text-charcoal"
                >
                  <option value="all">Price: All</option>
                  <option value="under-10000">Under ₹10,000</option>
                  <option value="10000-20000">₹10,000–₹20,000</option>
                  <option value="above-20000">Above ₹20,000</option>
                </select>
              </div>
            </div>
          )}

          {/* Right: Piece Count & Sort Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-4 text-xs">
            <span className="hidden md:inline text-xs text-charcoal/60 font-medium">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
            </span>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-charcoal/50 text-xs hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  aria-label="Sort products"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-ivory border border-accent-border px-3 py-2 pr-7 text-xs text-charcoal rounded-none outline-none hover:border-charcoal focus:border-charcoal cursor-pointer font-medium"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal/60 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8 text-xs">
            <span className="text-charcoal/50 text-[11px] uppercase tracking-luxury">Applied:</span>

            {activeDepartment !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-accent-border text-charcoal text-[11px]">
                <span>Category: {activeDepartment}</span>
                <button
                  onClick={() => setActiveDepartment('all')}
                  className="hover:text-sand-dark"
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSize !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-accent-border text-charcoal text-[11px]">
                <span>Size: {selectedSize}</span>
                <button
                  onClick={() => setSelectedSize('all')}
                  className="hover:text-sand-dark"
                  aria-label="Remove size filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedColor !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-accent-border text-charcoal text-[11px]">
                <span>Color: {selectedColor}</span>
                <button
                  onClick={() => setSelectedColor('all')}
                  className="hover:text-sand-dark"
                  aria-label="Remove color filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ivory-200 border border-accent-border text-charcoal text-[11px]">
                <span>
                  Price:{' '}
                  {priceRange === 'under-10000'
                    ? 'Under ₹10,000'
                    : priceRange === '10000-20000'
                    ? '₹10,000 – ₹20,000'
                    : 'Above ₹20,000'}
                </span>
                <button
                  onClick={() => setPriceRange('all')}
                  className="hover:text-sand-dark"
                  aria-label="Remove price filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-[11px] text-charcoal/60 hover:text-charcoal underline underline-offset-4 ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center border border-accent-border bg-ivory-50 my-8">
            <span className="font-serif text-3xl text-charcoal/40 italic block mb-2">No pieces found</span>
            <p className="text-sm text-charcoal/70 max-w-sm mx-auto font-light">
              There are no pieces currently matching your selected filter criteria.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-6 px-6 py-2.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleProductCardClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
