import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Grid, List, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { useShopifyProducts } from "@/hooks/useShopify";

const sortOptions = [
  { label: "Most Popular", value: "popular" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Highest Rated", value: "rating" },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("popular");
  const [view, setView] = useState<"grid" | "list">("grid");

  const activeCategory = searchParams.get("category");
  const { data: products = [], isLoading } = useShopifyProducts();

  const filteredProducts = useMemo(() => {
    let list = activeCategory
      ? products.filter((p) => p.category === activeCategory)
      : products;

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [activeCategory, sort]);

  const activeCategoryData = categories.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Page Header */}
      <div className="bg-navy text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <nav className="text-xs text-primary-foreground/50 mb-3 font-body flex gap-1.5">
            <Link to="/" className="hover:text-gold transition-smooth">Home</Link>
            <span>/</span>
            <span className="text-primary-foreground/80">
              {activeCategoryData ? activeCategoryData.name : "All Stamps"}
            </span>
          </nav>
          <h1 className="font-display text-3xl font-bold mb-2">
            {activeCategoryData ? activeCategoryData.name : "All Custom Stamps"}
          </h1>
          <p className="text-primary-foreground/70 font-body text-sm max-w-xl">
            {activeCategoryData
              ? activeCategoryData.description
              : "Browse our complete collection of premium custom stamps, seals, and supplies."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <h3 className="font-display font-semibold text-sm text-foreground mb-3 uppercase tracking-wider">
                Categories
              </h3>
              <nav className="space-y-0.5">
                <Link
                  to="/products"
                  className={`block px-3 py-2 rounded text-sm font-body transition-smooth
                    ${!activeCategory ? "bg-navy text-primary-foreground font-medium" : "text-charcoal hover:bg-secondary hover:text-navy"}`}
                >
                  All Products
                  <span className="ml-1 text-xs opacity-60">({products.length})</span>
                </Link>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category === cat.id).length;
                  return (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.id}`}
                      className={`block px-3 py-2 rounded text-sm font-body transition-smooth
                        ${activeCategory === cat.id ? "bg-navy text-primary-foreground font-medium" : "text-charcoal hover:bg-secondary hover:text-navy"}`}
                    >
                      {cat.name}
                      <span className="ml-1 text-xs opacity-60">({count})</span>
                    </Link>
                  );
                })}
              </nav>


            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="text-sm text-muted-foreground font-body">
                <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
              </p>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-card border border-border rounded-lg px-3 py-2 pr-8 text-sm font-body text-foreground cursor-pointer hover:border-navy focus:outline-none focus:border-navy transition-smooth"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>

                {/* View toggle */}
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 transition-smooth ${view === "grid" ? "bg-navy text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`p-2 transition-smooth ${view === "list" ? "bg-navy text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Category Pills */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              <Link
                to="/products"
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-smooth
                  ${!activeCategory ? "bg-navy text-primary-foreground" : "bg-card border border-border text-charcoal"}`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-smooth
                    ${activeCategory === cat.id ? "bg-navy text-primary-foreground" : "bg-card border border-border text-charcoal"}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {isLoading ? (
              <div className="py-20 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground font-body">No products found in this category.</p>
                <Link to="/products" className="mt-4 inline-block text-navy font-semibold font-body hover:text-gold transition-smooth">
                  View All Products →
                </Link>
              </div>
            ) : (
              <div className={view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                : "flex flex-col gap-4"
              }>
                {filteredProducts.map((product) =>
                  view === "grid" ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      className="flex gap-4 bg-card rounded-xl border border-border hover:border-gold/40 shadow-card hover:shadow-hover transition-smooth p-4"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg shrink-0 bg-secondary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-0.5">
                          {product.category.replace("-", " ")}
                        </p>
                        <h3 className="font-display font-semibold text-base text-foreground mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground font-body line-clamp-2">{product.shortDescription}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-body font-bold text-lg text-navy">${product.price.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground font-body">{product.turnaround}</p>
                      </div>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
