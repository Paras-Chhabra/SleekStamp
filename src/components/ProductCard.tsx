import { Link } from "react-router-dom";
import { Star, StarHalf, ShoppingCart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const decimal = rating - full;
  const hasHalf = decimal >= 0.3 && decimal < 0.8;
  const roundUp = decimal >= 0.8;
  const fullCount = roundUp ? full + 1 : full;
  const halfCount = hasHalf ? 1 : 0;
  const emptyCount = 5 - fullCount - halfCount;

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: fullCount }).map((_, i) => (
        <Star key={`f-${i}`} className="w-3 h-3 fill-gold text-gold" />
      ))}
      {halfCount > 0 && <StarHalf key="h" className="w-3 h-3 fill-gold text-gold" />}
      {Array.from({ length: emptyCount }).map((_, i) => (
        <Star key={`e-${i}`} className="w-3 h-3 text-border" />
      ))}
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
      variantId: product.defaultVariantId
    });
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-gold/40 shadow-card hover:shadow-hover transition-smooth"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
        />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-body font-semibold px-2.5 py-1 rounded-full
              ${product.badge === "Sale" ? "bg-destructive text-destructive-foreground" :
                product.badge === "New" ? "bg-gold text-accent-foreground" :
                  "bg-navy text-primary-foreground"}`}
          >
            {product.badge}
          </span>
        )}

        {/* Quick Add hover overlay */}
        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-smooth" />
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-smooth bg-navy text-primary-foreground p-2.5 rounded-lg shadow-lg hover:bg-gold hover:text-accent-foreground"
          aria-label="Quick add to cart"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">
          {product.category.replace("-", " ")}
        </p>
        <h3 className="font-display font-semibold text-base text-foreground leading-snug mb-1.5 group-hover:text-navy transition-smooth line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground font-body mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <RatingStars rating={product.rating} />
          <span className="text-xs text-muted-foreground font-body">
            {product.rating} ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-body font-bold text-lg text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through font-body">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-body">
            {product.turnaround}
          </span>
        </div>
      </div>
    </Link>
  );
}
