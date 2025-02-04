import type { Product } from "../context/ProductContext";

export const products: Product[] = [
  {
    id: "1",
    name: "Nourishing Shampoo",
    category: "hair",
    subCategory: "shampoos",
    description:
      "A gentle, nourishing shampoo made with natural ingredients to cleanse and revitalize your hair.",
    sizePrices: [
      { size: "100ml", price: 20.99 },
      { size: "250ml", price: 45.99 },
      { size: "500ml", price: 89.99 },
    ],
    image: "/images/nourishing-shampoo.jpg",
    shopeeLink: "https://shopee.com/nourishing-shampoo",
    lazadaLink: "https://www.lazada.com/nourishing-shampoo",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Hydrating Conditioner",
    category: "hair",
    subCategory: "conditioners",
    description:
      "A rich, hydrating conditioner that leaves your hair soft, smooth, and manageable.",
    sizePrices: [
      { size: "100ml", price: 22.99 },
      { size: "250ml", price: 49.99 },
      { size: "500ml", price: 94.99 },
    ],
    image: "/images/hydrating-conditioner.jpg",
    shopeeLink: "https://shopee.com/hydrating-conditioner",
    lazadaLink: "https://www.lazada.com/hydrating-conditioner",
    rating: 4.5,
  },
  {
    id: "3",
    name: "Revitalizing Hair Mask",
    category: "hair",
    subCategory: "masks",
    description:
      "An intensive treatment mask that deeply nourishes and repairs damaged hair.",
    sizePrices: [
      { size: "50ml", price: 29.99 },
      { size: "150ml", price: 74.99 },
      { size: "250ml", price: 119.99 },
    ],
    image: "/images/revitalizing-hair-mask.jpg",
    shopeeLink: "https://shopee.com/revitalizing-hair-mask",
    lazadaLink: "https://www.lazada.com/revitalizing-hair-mask",
    rating: 4.5,
  },
  {
    id: "4",
    name: "Nourishing Hair Oil",
    category: "hair",
    subCategory: "oils",
    description:
      "A lightweight hair oil that adds shine and protects against heat damage.",
    sizePrices: [
      { size: "30ml", price: 34.99 },
      { size: "60ml", price: 64.99 },
      { size: "100ml", price: 99.99 },
    ],
    image: "/images/nourishing-hair-oil.jpg",
    shopeeLink: "https://shopee.com/nourishing-hair-oil",
    lazadaLink: "https://www.lazada.com/nourishing-hair-oil",
    rating: 4.5,
  },
  {
    id: "5",
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
    image: "/images/moisturizing-body-butter.jpg",
    shopeeLink: "https://shopee.com/moisturizing-body-butter",
    lazadaLink: "https://www.lazada.com/moisturizing-body-butter",
    rating: 4.5,
  },
  {
    id: "6",
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
    image: "/images/gentle-cleansing-bar.jpg",
    shopeeLink: "https://shopee.com/gentle-cleansing-bar",
    lazadaLink: "https://www.lazada.com/gentle-cleansing-bar",
    rating: 4.5,
  },
  {
    id: "7",
    name: "Exfoliating Body Scrub",
    category: "skin",
    subCategory: "body scrubs",
    description:
      "A gentle exfoliating scrub that removes dead skin cells and leaves your skin smooth and radiant.",
    sizePrices: [
      { size: "150ml", price: 29.99 },
      { size: "300ml", price: 59.99 },
    ],
    image: "/images/exfoliating-body-scrub.jpg",
    shopeeLink: "https://shopee.com/exfoliating-body-scrub",
    lazadaLink: "https://www.lazada.com/exfoliating-body-scrub",
    rating: 4.5,
  },
];
