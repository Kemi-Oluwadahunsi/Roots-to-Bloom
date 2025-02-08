import type { Product } from "../context/ProductContext";


  export enum Currency {
    MYR = "MYR",
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
  }

export const products: Product[] = [
  {
    id: "1",
    name: "Nourishing Shampoo",
    category: "hair",
    subCategory: "shampoos",
    description:
      "A gentle, nourishing shampoo made with natural ingredients to cleanse and revitalize your Hair.",
    sizePrices: [
      { size: "100ml", price: 20.99 },
      { size: "250ml", price: 45.99 },
      { size: "500ml", price: 89.99 },
    ],
    image: "/images/products/shampoo.jpg",
    images: [
      "/images/products/shampoo-2.jpg",
      "/images/products/shampoo-3.jpg",
      "/images/products/shampoo-4.jpg",
    ],
    shopeeLink: "https://shopee.com/nourishing-shampoo",
    lazadaLink: "https://www.lazada.com/nourishing-shampoo",
    rating: 4.5,
    howToUse:
      "Wet hair thoroughly. Apply a small amount of shampoo to your palm and massage into your scalp and hair. Rinse thoroughly with warm water. For best results, follow with our Hydrating Conditioner.",
    keyIngredients:
      "Aloe Vera, Jojoba Oil, Vitamin E, Panthenol, Chamomile Extract",
    ingredients: "Aqua, ......",
  },
  {
    id: "2",
    name: "Lush Body Polish",
    category: "skin",
    subCategory: "body scrubs",
    description:
      "A gentle exfoliating scrub that removes dead skin cells and leaves your skin smooth and radiant.",
    sizePrices: [
      { size: "150ml", price: 29.99 },
      { size: "300ml", price: 59.99 },
    ],
    image: "/images/products/scrub2.jpg",
    images: ["/images/products/body-scrub-2.jpg"],
    shopeeLink: "https://shopee.com/exfoliating-body-scrub",
    lazadaLink: "https://www.lazada.com/exfoliating-body-scrub",
    rating: 4.5,
    howToUse:
      "Apply to damp skin in circular motions, focusing on rough areas. Rinse thoroughly with warm water. Use 2-3 times a week for best results.",
    keyIngredients:
      "Sugar, Coconut Oil, Shea Butter, Vitamin E, Lavender Essential Oil",
    ingredients: "Aqua, ......",
  },
  {
    id: "3",
    name: "Hydrating Conditioner",
    category: "hair",
    subCategory: "conditioners",
    description:
      "A rich, hydrating conditioner that leaves your Hair soft, smooth, and manageable.",
    sizePrices: [
      { size: "100ml", price: 22.99 },
      { size: "250ml", price: 49.99 },
      { size: "500ml", price: 94.99 },
    ],
    image: "/images/products/body-lotion-2.jpg",
    images: [
      "/images/products/conditioner-2.jpg",
      "/images/products/conditioner-3.jpg",
    ],
    shopeeLink: "https://shopee.com/hydrating-conditioner",
    lazadaLink: "https://www.lazada.com/hydrating-conditioner",
    rating: 4.5,
    howToUse:
      "After shampooing, apply a generous amount to wet hair, focusing on mid-lengths and ends. Leave for 2-3 minutes, then rinse thoroughly with cool water.",
    keyIngredients: "Argan Oil, Keratin, Aloe Vera, Biotin, Silk Protein",
    ingredients: "Aqua, ......",
  },
  {
    id: "4",
    name: "Moisturizing Body Butter",
    category: "skin",
    subCategory: "butter creams",
    description:
      "A rich, creamy body butter that deeply moisturizes and nourishes your skin.",
    sizePrices: [
      { size: "100ml", price: 39.99 },
      { size: "200ml", price: 69.99 },
      { size: "300ml", price: 99.99 },
    ],
    image: "/images/products/body-butter.jpg",
    images: ["/images/products/body-butter-2.jpg"],
    shopeeLink: "https://shopee.com/moisturizing-body-butter",
    lazadaLink: "https://www.lazada.com/moisturizing-body-butter",
    rating: 4.5,
    howToUse:
      "Apply generously to clean, dry skin, massaging in circular motions until fully absorbed. Use daily for best results, especially after bathing or showering.",
    keyIngredients:
      "Shea Butter, Cocoa Butter, Jojoba Oil, Vitamin E, Aloe Vera",
    ingredients: "Aqua, ......",
  },
  {
    id: "5",
    name: "Revitalizing Hair Mask",
    category: "hair",
    subCategory: "masks",
    description:
      "An intensive treatment mask that deeply nourishes and repairs damaged Hair.",
    sizePrices: [
      { size: "50ml", price: 29.99 },
      { size: "150ml", price: 74.99 },
      { size: "250ml", price: 119.99 },
    ],
    image: "/images/products/jar-open.jpeg",
    images: ["/images/products/hair-mask-2.jpg"],
    shopeeLink: "https://shopee.com/revitalizing-Hair-mask",
    lazadaLink: "https://www.lazada.com/revitalizing-Hair-mask",
    rating: 4.5,
    howToUse:
      "After shampooing, apply generously to damp hair from roots to ends. Leave on for 10-15 minutes, then rinse thoroughly. Use once a week or as needed for intense hydration.",
    keyIngredients: "Argan Oil, Keratin, Shea Butter, Biotin, Avocado Oil",
    ingredients: "Aqua, ......",
  },
  {
    id: "6",
    name: "Nourishing Hair Oil",
    category: "hair",
    subCategory: "oils",
    description:
      "A lightweight Hair oil that adds shine and protects against heat damage.",
    sizePrices: [
      { size: "30ml", price: 34.99 },
      { size: "60ml", price: 64.99 },
      { size: "100ml", price: 99.99 },
    ],
    image: "/images/products/oil-bottle.jpeg",
    images: [
      "/images/products/hair-oil-2.jpg",
      "/images/products/hair-oil-3.jpg",
    ],
    shopeeLink: "https://shopee.com/nourishing-Hair-oil",
    lazadaLink: "https://www.lazada.com/nourishing-Hair-oil",
    rating: 4.5,
    howToUse:
      "Apply a small amount to damp or dry hair, focusing on mid-lengths and ends. Use before heat styling for protection or as a finishing touch for added shine.",
    keyIngredients:
      "Argan Oil, Jojoba Oil, Vitamin E, Grapeseed Oil, Rosemary Extract",
    ingredients: "Oils, ......",
  },
  {
    id: "7",
    name: "Gentle Cleansing Bar",
    category: "skin",
    subCategory: "bar soaps",
    description:
      "A mild, fragrance-free cleansing bar suitable for all skin types.",
    sizePrices: [
      { size: "50g", price: 12.99 },
      { size: "100g", price: 20.99 },
      { size: "150g", price: 29.99 },
    ],
    image: "/images/products/bar-soap.avif",
    images: ["/images/products/cleansing-bar-2.jpg"],
    shopeeLink: "https://shopee.com/gentle-cleansing-bar",
    lazadaLink: "https://www.lazada.com/gentle-cleansing-bar",
    rating: 4.5,
    howToUse:
      "Wet the bar and work into a lather. Gently massage onto face or body, then rinse thoroughly with warm water. Suitable for daily use.",
    keyIngredients:
      "Glycerin, Shea Butter, Aloe Vera, Chamomile Extract, Vitamin E",
    ingredients: "Aqua, ......",
  },
];
