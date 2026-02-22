export async function shopifyFetch({
    query,
    variables,
}: {
    query: string;
    variables?: any;
}) {
    const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
    const key = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !key) {
        console.error("Missing Shopify credentials in .env.local file");
        return {
            status: 500,
            error: "Missing credentials",
        };
    }

    const endpoint = `https://${domain}/api/2024-01/graphql.json`;

    try {
        const result = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": key,
            },
            body: JSON.stringify({ query, variables }),
        });

        return {
            status: result.status,
            body: await result.json(),
        };
    } catch (error) {
        console.error("Error communicating with Shopify:", error);
        return {
            status: 500,
            error: "Error receiving data",
        };
    }
}

export async function createShopifyCheckout(cartItems: any[]) {
    // Check for invalid cart items (often caused by legacy items in localStorage)
    const invalidItems = cartItems.filter(item => !item.variantId);
    if (invalidItems.length > 0) {
        throw new Error("Some items in your cart are missing Shopify variant data. Please remove them and add them again to update your cart session.");
    }

    // Convert our items to Shopify's line item format
    const lineItems = cartItems.map(item => {
        // We send line item custom attributes for the customization details
        const customAttributes = [];
        if (item.stampPad) customAttributes.push({ key: "Stamp Pad", value: item.stampPad });
        if (item.priorityProcessing) customAttributes.push({ key: "Priority Processing", value: "Yes" });
        if (item.logo && typeof item.logo === "string") customAttributes.push({ key: "Logo", value: "Uploaded" });

        return {
            merchandiseId: item.variantId,
            quantity: item.quantity,
            attributes: customAttributes
        };
    });

    const query = `
    mutation createCart($cartInput: CartInput) {
      cartCreate(input: $cartInput) {
        cart {
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

    const response = await shopifyFetch({
        query,
        variables: {
            cartInput: {
                lines: lineItems
            }
        }
    });

    if (response.status === 200 && response.body?.data?.cartCreate?.cart?.checkoutUrl) {
        return response.body.data.cartCreate.cart.checkoutUrl;
    }

    console.error("Failed to create cart", response.body?.data?.cartCreate?.userErrors);
    throw new Error("Failed to initialize checkout.");
}
