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
    name: "Botanic Hydrating Hair Growth Butter",
    category: "hair",
    subCategory: "butters",
    description:
      "A gentle, nourishing shampoo made with natural ingredients to cleanse and revitalize your Hair.",
    sizePrices: [
      { size: "100g", price: 19.0 },
      { size: "150g", price: 26.0 },
      { size: "200g", price: 35.0 },
    ],
    image: "/images/products/botanic/Main-photo.png",
    images: [
      "/images/products/botanic/rose+d-panthenol.png",
      "/images/products/botanic/butters.png",
      "/images/products/botanic/Ayurvedic-ing.png",
    ],
    shopeeLink:
      "https://shopee.com.my/Roos-to-Bloom-Botanic-Hydrating-Hair-Growth-Butter-i.723006657.26626260012?sp_atk=1576c31e-5ba6-47f6-8cbc-d5488125aaae&xptdk=1576c31e-5ba6-47f6-8cbc-d5488125aaae",
    carousellLink:
      "https://www.carousell.com.my/p/botanic-hydrating-hair-growth-butter-1353084844/",
    rating: 4.9,
    howToUse:
      "Take a small amount and melt between palms. Apply to damp or dry hair, focusing on ends and scalp, massage gently to boost absorption and stimulate circulation. Use as a daily moisturizer or sealant after leave-in conditioner. For best results, use consistently as part of your hair care routine.",
    keyIngredients:
      "Macadamia Seed Butter, Kokum Butter, Mango Butter, Shea Butter, Cocoa Butter, D-Panthenol, and Rosemary Extract.",
    ingredients:
      "Macadamia Seed Butter, Kokum Butter, Mango Butter, Shea Butter, Cocoa Butter, D-Panthenol, Rosemary Oil, Batana Oil, Black Seed Oil, Castor Oil,  Neem Oil, Vitamin E Oil, Moringa Powder, Propanediol, Menthol Crystals, Rosemary Essential Oil, Peppermint Essential Oil, Spearmint Essential Oil, Tea Trea Essential Oil, Optiphen Plus.",
    status: "Available",
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
    image: "/images/products/scrub2.webp",
    images: [
      "/images/products/coffee-scrub.webp",
      "/images/products/scrub.webp",
    ],
    shopeeLink: "https://shopee.com/exfoliating-body-scrub",
    carousellLink: "https://www.lazada.com/exfoliating-body-scrub",
    rating: 0,
    howToUse:
      "Apply to damp skin in circular motions, focusing on rough areas. Rinse thoroughly with warm water. Use 2-3 times a week for best results.",
    keyIngredients:
      "Sugar, Coconut Oil, Shea Butter, Vitamin E, Lavender Essential Oil",
    ingredients: "Aqua, ......",
    status: "Available",
  },
  {
    id: "8",
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
    image: "/images/products/shampoo.webp",
    images: [
      "/images/products/shampoo-2.jpg",
      "/images/products/shampoo-3.jpg",
      "/images/products/shampoo-4.jpg",
    ],
    shopeeLink: "https://shopee.com/nourishing-shampoo",
    carousellLink: "https://www.lazada.com/nourishing-shampoo",
    rating: 0,
    howToUse:
      "Wet hair thoroughly. Apply a small amount of shampoo to your palm and massage into your scalp and hair. Rinse thoroughly with warm water. For best results, follow with our Hydrating Conditioner.",
    keyIngredients:
      "Aloe Vera, Jojoba Oil, Vitamin E, Panthenol, Chamomile Extract",
    ingredients: "Aqua, ......",
    status: "Unavailable",
  },
  {
    id: "9",
    name: "Lush Body Polish",
    category: "skin",
    subCategory: "body scrubs",
    description:
      "A gentle exfoliating scrub that removes dead skin cells and leaves your skin smooth and radiant.",
    sizePrices: [
      { size: "150ml", price: 29.99 },
      { size: "300ml", price: 59.99 },
    ],
    image: "/images/products/scrub2.webp",
    images: [
      "/images/products/coffee-scrub.webp",
      "/images/products/scrub.webp",
    ],
    shopeeLink: "https://shopee.com/exfoliating-body-scrub",
    carousellLink: "https://www.lazada.com/exfoliating-body-scrub",
    rating: 0,
    howToUse:
      "Apply to damp skin in circular motions, focusing on rough areas. Rinse thoroughly with warm water. Use 2-3 times a week for best results.",
    keyIngredients:
      "Sugar, Coconut Oil, Shea Butter, Vitamin E, Lavender Essential Oil",
    ingredients: "Aqua, ......",
    status: "Unavailable",
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
    image: "/images/products/body-lotion-2.webp",
    images: [
      "/images/products/conditioner-2.jpg",
      "/images/products/conditioner-3.jpg",
    ],
    shopeeLink: "https://shopee.com/hydrating-conditioner",
    carousellLink: "https://www.lazada.com/hydrating-conditioner",
    rating: 4.5,
    howToUse:
      "After shampooing, apply a generous amount to wet hair, focusing on mid-lengths and ends. Leave for 2-3 minutes, then rinse thoroughly with cool water.",
    keyIngredients: "Argan Oil, Keratin, Aloe Vera, Biotin, Silk Protein",
    ingredients: "Aqua, ......",
    status: "Unavailable",
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
    image: "/images/products/body-butter.webp",
    images: ["/images/products/whippedBodyButter.webp"],
    shopeeLink: "https://shopee.com/moisturizing-body-butter",
    carousellLink: "https://www.lazada.com/moisturizing-body-butter",
    rating: 0,
    howToUse:
      "Apply generously to clean, dry skin, massaging in circular motions until fully absorbed. Use daily for best results, especially after bathing or showering.",
    keyIngredients:
      "Shea Butter, Cocoa Butter, Jojoba Oil, Vitamin E, Aloe Vera",
    ingredients: "Aqua, ......",
    status: "Unavailable",
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
    image: "/images/products/jar-open.webp",
    images: ["/images/products/hair-mask-2.jpg"],
    shopeeLink: "https://shopee.com/revitalizing-Hair-mask",
    carousellLink: "https://www.lazada.com/revitalizing-Hair-mask",
    rating: 0,
    howToUse:
      "After shampooing, apply generously to damp hair from roots to ends. Leave on for 10-15 minutes, then rinse thoroughly. Use once a week or as needed for intense hydration.",
    keyIngredients: "Argan Oil, Keratin, Shea Butter, Biotin, Avocado Oil",
    ingredients: "Aqua, ......",
    status: "Unavailable",
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
    image: "/images/products/oil-bottle.webp",
    images: [
      "/images/products/hair-oil-2.jpg",
      "/images/products/hair-oil-3.jpg",
    ],
    shopeeLink: "https://shopee.com/nourishing-Hair-oil",
    carousellLink: "https://www.lazada.com/nourishing-Hair-oil",
    rating: 0,
    howToUse:
      "Apply a small amount to damp or dry hair, focusing on mid-lengths and ends. Use before heat styling for protection or as a finishing touch for added shine.",
    keyIngredients:
      "Argan Oil, Jojoba Oil, Vitamin E, Grapeseed Oil, Rosemary Extract",
    ingredients: "Oils, ......",
    status: "Unavailable",
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
    carousellLink: "https://www.lazada.com/gentle-cleansing-bar",
    rating: 0,
    howToUse:
      "Wet the bar and work into a lather. Gently massage onto face or body, then rinse thoroughly with warm water. Suitable for daily use.",
    keyIngredients:
      "Glycerin, Shea Butter, Aloe Vera, Chamomile Extract, Vitamin E",
    ingredients: "Aqua, ......",
    status: "Unavailable",
  },
];
