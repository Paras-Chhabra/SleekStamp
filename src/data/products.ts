export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  image: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  defaultVariantId?: string;
  sizes?: { label: string; size: string; price: number; variantId?: string }[];
  inkColors?: string[];
  features: string[];
  turnaround: string;
}

export const categories = [
  { id: "custom-stamps", name: "Big Custom Stamps", description: "Upload your logo or design — engraved to perfection" },
  { id: "wooden-stamps", name: "Wooden Stamps", description: "Classic hardwood handle stamps for every impression" },
  { id: "face-stamps", name: "Face & Logo Stamps", description: "Self-inking stamps with your face or brand logo" },
  { id: "stamp-pad", name: "Stamp Pads", description: "Premium ink pads for flawless stamping performance" },
  { id: "refill-ink", name: "Refill Ink", description: "Bold, clear refill inks for extended stamp use" },
];

import customStampImg from "@/assets/product-custom-stamp.webp";
import customStamp2Img from "@/assets/product-custom-stamp-2.webp";
import refillInkImg from "@/assets/product-refill-ink.png";
import stampPadImg from "@/assets/product-stamp-pad.webp";
import faceStampImg from "@/assets/product-face-stamp.webp";
import woodenStampImg from "@/assets/product-wooden-stamp.webp";

export const products: Product[] = [
  {
    id: "1",
    name: "Big Custom Stamps by SleekStamp®",
    slug: "big-custom-stamps-by-sleekstamp",
    category: "custom-stamps",
    price: 59.99,
    description:
      "Just upload your logo, art, or any design you love! Our advanced engraving gives sharp, detailed impressions every time. Perfect for businesses, artists, crafters, and anyone who wants to leave a lasting mark. Available in three sizes: 4×4\", 6×6\", and 8×8\". We print only once you're happy with your proof — satisfaction guaranteed.",
    shortDescription: "Upload your logo, art, or any design. Sharp, detailed impressions every time.",
    image: customStampImg,
    badge: "Best Seller",
    rating: 4.9,
    reviewCount: 2341,
    inStock: true,
    sizes: [
      { label: "4×4 inch", size: "4\" × 4\"", price: 59.99 },
      { label: "6×6 inch", size: "6\" × 6\"", price: 79.99 },
      { label: "8×8 inch", size: "8\" × 8\"", price: 99.99 },
    ],
    inkColors: ["Black", "Blue", "Red", "Green"],
    features: [
      "Upload any logo, art, or design",
      "Advanced laser engraving for sharp detail",
      "3 sizes: 4×4, 6×6, 8×8 inch",
      "Free digital proof before printing",
      "We redo it free if you're not happy",
      "Water-based, eco-friendly ink",
    ],
    turnaround: "1–3 business days",
  },
  {
    id: "2",
    name: "Stamp Pad Refill Ink – 3 Pcs",
    slug: "stamp-pad-refill-ink-3-pcs",
    category: "refill-ink",
    price: 29.99,
    description:
      "Keep your impressions bold and clear with SleekStamp's premium refill inks. Designed for smooth flow and lasting color, this set of 3 refill ink bottles is compatible with all standard stamp pads. Available in Black, Blue, Red, and Green. Water-based, fast-drying, and 100% safe.",
    shortDescription: "Bold, clear impressions. 3-pack refill ink for all stamp pads.",
    image: refillInkImg,
    badge: "New Arrival",
    rating: 4.7,
    reviewCount: 421,
    inStock: true,
    inkColors: ["Black", "Blue", "Red", "Green"],
    features: [
      "Set of 3 refill ink bottles",
      "Compatible with all standard stamp pads",
      "Water-based, fast-drying formula",
      "100% safe for skin and environment",
      "Available in 4 colors",
    ],
    turnaround: "Ships same day",
  },
  {
    id: "3",
    name: "Big Stamp Pad / Ink Pad – L",
    slug: "big-stamp-pad-ink-pad-l",
    category: "stamp-pad",
    price: 57.99,
    description:
      "Experience stamping perfection with our Premium Wooden Stamp Pad — designed for flawless performance and professional results. The large size (L) offers a generous inking surface, perfect for big custom stamps. Available in Black, Blue, Red, Green, and Purple. Re-inkable for extended use.",
    shortDescription: "Premium wooden stamp pad, large size. Flawless, professional results.",
    image: stampPadImg,
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 987,
    inStock: true,
    inkColors: ["Black", "Blue", "Red", "Green", "Purple"],
    features: [
      "Large inking surface for big stamps",
      "Premium felt for smooth, even coverage",
      "Re-inkable for extended use",
      "Solid wooden base",
      "Available in 5 colors",
    ],
    turnaround: "1–2 business days",
  },
  {
    id: "4",
    name: "Big Stamp Pad / Ink Pad – XL",
    slug: "big-stamp-pad-ink-pad-xl",
    category: "stamp-pad",
    price: 87.99,
    description:
      "Our XL Premium Wooden Stamp Pad delivers flawless stamping for the largest custom stamp sizes. Engineered for professional results every time. The extra-large surface ensures complete, even ink coverage for 8×8\" stamps. Available in Black, Blue, Red, Green, and Purple.",
    shortDescription: "Extra-large premium stamp pad. Perfect for 8×8\" custom stamps.",
    image: stampPadImg,
    rating: 4.8,
    reviewCount: 543,
    inStock: true,
    inkColors: ["Black", "Blue", "Red", "Green", "Purple"],
    features: [
      "Extra-large inking surface",
      "Ideal for 8×8\" custom stamps",
      "Premium felt for even coverage",
      "Re-inkable for extended use",
      "Solid wooden base, 5 colors available",
    ],
    turnaround: "1–2 business days",
  },
  {
    id: "5",
    name: "Self Inking Face & Logo Stamp",
    slug: "self-inking-face-logo-stamp",
    category: "face-stamps",
    price: 39.99,
    description:
      "Upload a picture of your face and we'll make a rubber stamp with your likeness. Also perfect for any logo or custom design. Our self-inking face & logo stamp delivers crisp impressions without needing a separate ink pad. A unique, fun, and professional way to personalize your packaging, mail, and more.",
    shortDescription: "Your face or logo as a self-inking stamp. Unique and personal.",
    image: faceStampImg,
    badge: "Popular",
    rating: 4.7,
    reviewCount: 672,
    inStock: true,
    inkColors: ["Black", "Blue", "Red"],
    features: [
      "Upload your face photo or any logo",
      "Built-in self-inking mechanism",
      "No separate ink pad needed",
      "Crisp, detailed impressions",
      "Perfect for packaging & personal mail",
      "Water-based, eco-friendly ink",
    ],
    turnaround: "2–3 business days",
  },
  {
    id: "6",
    name: "Wooden Stamp",
    slug: "wooden-stamp",
    category: "wooden-stamps",
    price: 34.99,
    description:
      "Classic wooden handle stamps crafted for artisans, crafters, and business owners. Upload your custom design and we'll laser-engrave it onto a premium rubber die mounted on a solid hardwood handle. Use with any stamp pad (sold separately) for versatile, beautiful impressions on paper, fabric, clay, and more.",
    shortDescription: "Classic hardwood handle, laser-engraved rubber die. Works with any ink pad.",
    image: woodenStampImg,
    rating: 4.6,
    reviewCount: 834,
    inStock: true,
    sizes: [
      { label: "4×4 inch", size: "4\" × 4\"", price: 34.99 },
      { label: "6×6 inch", size: "6\" × 6\"", price: 49.99 },
    ],
    features: [
      "Solid hardwood handle",
      "Laser-engraved rubber die",
      "Upload any custom design",
      "Works with all stamp pad inks",
      "Suitable for paper, fabric, clay & more",
    ],
    turnaround: "2–4 business days",
  },
];

export const featuredProducts = products.filter((p) =>
  ["1", "2", "5", "6"].includes(p.id)
);
