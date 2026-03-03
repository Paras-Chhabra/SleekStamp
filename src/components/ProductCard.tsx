import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, StarHalf, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentImg, setCurrentImg] = useState(0);

  const allImages = product.images && product.images.length > 1
    ? product.images
    : [product.image];

  const hasMultiple = allImages.length > 1;

  const goLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImg((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goRight = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImg((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-gold/40 shadow-card hover:shadow-hover transition-smooth"
    >
      {/* Image with slideshow */}
      <div className="relative overflow-hidden aspect-square bg-secondary">
        <img
          src={allImages[currentImg]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
        />

        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-body font-semibold px-2.5 py-1 rounded-full z-10
              ${product.badge === "Sale" ? "bg-destructive text-destructive-foreground" :
                product.badge === "New" ? "bg-gold text-accent-foreground" :
                  "bg-navy text-primary-foreground"}`}
          >
            {product.badge}
          </span>
        )}

        {/* Slideshow controls — visible on hover */}
        {hasMultiple && (
          <>
            {/* Left / Right arrows */}
            <button
              onClick={goLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-white text-foreground w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-200 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-white text-foreground w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-200 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImg(i); }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${i === currentImg ? "bg-white scale-125 shadow" : "bg-white/50 hover:bg-white/80"
                    }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
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
