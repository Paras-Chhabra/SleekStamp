import { useQuery } from '@tanstack/react-query';
import { shopifyFetch } from '@/utils/shopify';
import { Product } from '@/data/products';

const GET_PRODUCTS_QUERY = `
  query getProducts {
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          productType
          description
          descriptionHtml
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Helper to map Shopify product to our local Product interface
function mapShopifyProduct(node: any): Product {
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const image = node.images.edges[0]?.node?.url || '';

  // Extract sizes if they exist
  const sizes = node.variants.edges.map((edge: any) => {
    const variant = edge.node;
    return {
      label: variant.title,
      size: variant.title,
      price: parseFloat(variant.price.amount),
      variantId: variant.id
    };
  });

  const defaultVariantId = node.variants.edges[0]?.node?.id || '';

  let category = 'custom-stamps';
  const lowTitle = node.title.toLowerCase();
  if (lowTitle.includes('refill ink') || lowTitle.includes('textile ink')) {
    category = 'refill-ink';
  } else if (lowTitle.includes('stamp pad') || lowTitle.includes('ink pad')) {
    category = 'stamp-pad';
  } else if (lowTitle.includes('face')) {
    category = 'face-stamps';
  } else if (lowTitle.includes('wood')) {
    category = 'wooden-stamps';
  } else if (node.productType) {
    category = node.productType.toLowerCase().replace(/ /g, '-');
  }

  let description = node.description;
  let features: string[] = [];
  let rating = 5;
  let reviewCount = 0;

  if (node.title.includes("Big Custom Stamps")) {
    description = "Just upload your logo, art, or any design you love! Our advanced engraving gives sharp, detailed impressions every time. Perfect for businesses, artists, crafters, and anyone who wants to leave a lasting mark. Available in three sizes: 4x4\", 6x6\", and 8x8\". We print only once you're happy with your proof — satisfaction guaranteed.";
    features = [
      "Upload any logo, art, or design",
      "Advanced laser engraving for sharp detail",
      "3 sizes: 4x4, 6x6, 8x8 inch",
      "Free digital proof before printing",
      "We redo it free if you're not happy",
      "Water-based, eco-friendly ink"
    ];
    rating = 4.9;
    reviewCount = 2341;
  }

  return {
    id: node.id,
    name: node.title,
    slug: node.handle,
    category,
    price,
    description,
    shortDescription: description.substring(0, 100) + '...',
    image,
    defaultVariantId,
    rating,
    reviewCount,
    inStock: node.variants.edges.some((v: any) => v.node.availableForSale),
    sizes: sizes.length > 1 ? sizes : undefined,
    features,
    turnaround: "1-3 business days", // Default fallback
  };
}

export function useShopifyProducts() {
  return useQuery({
    queryKey: ['shopify-products'],
    queryFn: async (): Promise<Product[]> => {
      const response = await shopifyFetch({ query: GET_PRODUCTS_QUERY });

      if (response.status !== 200 || response.error) {
        throw new Error(response.error || 'Failed to fetch products');
      }

      const productsData = response.body.data?.products?.edges || [];
      return productsData.map((edge: any) => mapShopifyProduct(edge.node));
    },
  });
}

export function useShopifyProduct(slug: string) {
  const { data: products, isLoading, error } = useShopifyProducts();

  return {
    product: products?.find((p) => p.slug === slug),
    isLoading,
    error,
  };
}
