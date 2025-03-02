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
      "Experience the power of nature with Botanic Hydrating Hair Growth Butter. Infused with D-Panthenol, Batana Oil, and Rosemary Extract, this lightweight, non-greasy butter seals in moisture and stimulates hair growth for lush,  thicker, healthier, and vibrant hair.",
    sizePrices: [
      { size: "100ml/g", price: 19.0 },
      { size: "150ml/g", price: 26.0 },
      { size: "200ml/g", price: 35.0 },
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
  // {
  //   id: "2",
  //   name: "Flora Luxe Growth Butter",
  //   category: "hair",
  //   subCategory: "butters",
  //   description:
  //     "A gentle exfoliating scrub that removes dead skin cells and leaves your skin smooth and radiant.",
  //   sizePrices: [
  //     { size: "150ml/g/g", price: 29.99 },
  //     { size: "300ml/g", price: 59.99 },
  //   ],
  //   image: "/images/products/scrub2.webp",
  //   images: [
  //     "/images/products/coffee-scrub.webp",
  //     "/images/products/scrub.webp",
  //   ],
  //   shopeeLink: "https://shopee.com/exfoliating-body-scrub",
  //   carousellLink: "https://www.lazada.com/exfoliating-body-scrub",
  //   rating: 0,
  //   howToUse:
  //     "Apply to damp skin in circular motions, focusing on rough areas. Rinse thoroughly with warm water. Use 2-3 times a week for best results.",
  //   keyIngredients:
  //     "Sugar, Coconut Oil, Shea Butter, Vitamin E, Lavender Essential Oil",
  //   ingredients: "Aqua, ......",
  //   status: "Available",
  // },
  {
    id: "8",
    name: "Herbal Strength & Growth Shampoo",
    category: "hair",
    subCategory: "shampoos",
    description:
      "A powerful botanical blend designed to nourish the scalp, reduce breakage, and stimulate rapid hair growth. Formulated with a rich infusion of herbal extracts, vitamins, and essential nutrients, this shampoo deeply cleanses while fortifying hair from root to tip, leaving it soft, shiny, and resilient.  ",
    sizePrices: [
      { size: "120ml/g", price: 18.0 },
      { size: "250ml/g/g", price: 32.9 },
    ],
    image: "/images/products/strength-shampoo/5.webp",
    images: [
      "/images/products/strength-shampoo/1.webp",
      "/images/products/strength-shampoo/2.webp",
      "/images/products/strength-shampoo/3.webp",
      "/images/products/strength-shampoo/4.webp",
    ],
    shopeeLink: "https://my.shp.ee/k5Bxee4",
    carousellLink: "https://www.lazada.com/nourishing-shampoo",
    rating: 0,
    howToUse:
      "Wet hair thoroughly. Apply a small amount of shampoo to your palm and massage into your scalp and hair. Rinse thoroughly with warm water. For best results, follow with our SilkyGlow Hydrating Deep Conditioner.",
    keyIngredients:
      "Aloe Vera, Hibiscus, Fenugreek, Stinging Nettle, Rosemary, Panthenol",
    ingredients:
      "Purified water, Aloe Vera Juice, Nettle Extract, Rosemary Extract, Fenugreek Extract, Hibiscus Extract, Panthenol, Sodium Cocoyl Isethionate, Coco Glucoside, Decyl Glucoside, Foaming Apple, Cocamidopropyl Betaine, Olivem 1000, Castor Oil, Argan Oil, Caffeine Extract, Oats Extract, Citric Acid, Eco-Cert Preservative.",
    status: "Available",
  },
  {
    id: "9",
    name: "Herbal Tresses Leave-In Conditioner",
    category: "hair",
    subCategory: "conditioners",
    description:
      "Herbal Tresses Leave-In Conditioner - Pure Botanicals for Stronger and Nourished Strands.Experience the power of nature with Herbal Tresses Leave-In Conditioner, a luxurious herbal infusion designed to deeply nourish, hydrate, and strengthen your strands. Infused with a potent blend of flaxseed, fenugreek, rosemary, slippery elm, and oat milk, this lightweight formula delivers intense moisture, superior slip, and long-lasting strength without weighing your hair down.",
    sizePrices: [
      { size: "120ml/g", price: 19.9 },
      { size: "250ml/g/g", price: 37.9 },
    ],
    image: "/images/products/leave-in/7.webp",
    images: [
      "/images/products/leave-in/8.webp",
      "/images/products/9.webp",
      "/images/products/leave-in/10.webp",
    ],
    shopeeLink: "https://my.shp.ee/3oHiFSa",
    carousellLink: "https://www.lazada.com/exfoliating-body-scrub",
    rating: 0,
    howToUse:
      "1. Apply a generous amount to damp or freshly washed hair. 2. Work through strands with fingers or a wide-tooth comb. 3. Style as desired, perfect for wash-and-go, twist-outs, or protective styles. 4. No need to rinse, just let your hair absorb the nourishing benefits.",
    keyIngredients:
      "Oats Milk, Flaxseed Gel, Fenugreek Extract, Rosemary Extract, Slippery Elm Extract, Aloe Vera Extract, Amino Acids.",
    ingredients:
      "Water (Aqua), Avena Sativa (Oat) Milk, Linum Usitatissimum (Flaxseed) Gel, Trigonella Foenum-Graecum (Fenugreek) Extract, Rosmarinus Officinalis (Rosemary) Hydrosol, Ulmus Rubra (Slippery Elm) Extract, Argania Spinosa (Argan) Oil, Simmondsia Chinensis (Jojoba) Oil, Behentrimonium Methosulfate (BTMS-50), Cetyl Alcohol, Aloe Barbadensis (Aloe Vera) Extract, Silk Amino Acids, Tocopherol (Vitamin E), Mentha Piperita (Peppermint) Essential Oil, Preservative.",
    status: "Available",
  },
  {
    id: "3",
    name: "Flora Luxe Growth Butter",
    category: "hair",
    subCategory: "butters",
    description:
      "Flora Luxe Whipped Hair Butter – Nourish, strengthen, and hydrate with hibiscus and rosemary. Flora Luxe Whipped Hair Butter is a rich, velvety blend of nature’s most powerful botanicals, designed to deeply nourish, hydrate, and strengthen your hair. Infused with hibiscus and rosemary extracts, this lightweight yet ultra-moisturizing butter melts effortlessly into your strands, sealing in hydration without leaving a greasy feel.",
    sizePrices: [
      { size: "100ml/g", price: 18.0 },
      { size: "150ml/g", price: 25.0 },
      { size: "200ml/g", price: 34.0 },
    ],
    image: "/images/products/hibiscus-butter/front.webp",
    images: [
      "/images/products/hibiscus-butter/13.webp",
      "/images/products/hibiscus-butter/14.webp",
      "/images/products/hibiscus-butter/15.webp",
      "/images/products/hibiscus-butter/16.webp",
    ],
    shopeeLink: "https://my.shp.ee/pHKW2GB",
    carousellLink: "https://www.lazada.com/hydrating-conditioner",
    rating: 4.5,
    howToUse:
      "After shampooing, apply a generous amount to wet hair, focusing on mid-lengths and ends. Leave for 2-3 minutes, then rinse thoroughly with cool water.",
    keyIngredients:
      "Mango butter, Kokum butter, Macadamia butter, Cocoa butter, Hibiscus extract, Rosemary extract.",
    ingredients:
      "Mango butter, Kokum butter, Macadamia butter, Cocoa butter, Hibiscus extract, Rosemary extract, Castor oil, Blackseed oil, Batana oil, Neem oil, Provitamin B5, Propane-1,3-diol, Vitamin E oil, Optiphen plus.",
    status: "Available",
  },
  {
    id: "4",
    name: "Growth Elixir Oil Concentrate",
    category: "hair",
    subCategory: "oils",
    description:
      "Growth Elixir Herbal Hair Oil is a nutrient-rich blend of powerful botanical ingredients designed to nourish the scalp, strengthen hair follicles, and promote faster, healthier hair growth. Infused with a carefully selected combination of natural oils and herbs, this formula deeply penetrates the hair shaft to restore moisture, reduce breakage, and enhance overall hair health. ",
    sizePrices: [
      { size: "10ml", price: 10.0 },
      { size: "30ml", price: 22.99 },
    ],
    image: "/images/products/Oil/front.webp",
    images: [
      "/images/products/Oil/19.webp",
      "/images/products/Oil/20.webp",
      "/images/products/Oil/21.webp",
      "/images/products/Oil/22.webp",
      "/images/products/Oil/23.webp",
    ],
    shopeeLink: "https://my.shp.ee/5pB6KvY",
    carousellLink: "https://www.lazada.com/moisturizing-body-butter",
    rating: 0,
    howToUse:
      "Directions For Use: 1. Scalp Treatment: Apply a few drops to the scalp, massage for 5-10 minutes, and leave overnight or for at least 2 hours before washing. 2. Moisturizing Oil: Apply a small amount to damp or dry hair, focusing on the ends. 3. Sealant: Apply a small amount to the ends of damp or dry hair to lock in moisture and prevent breakage.",
    keyIngredients:
      "Sunflower Oil, Castor Oil, Black Cunin Seed Oil, Batana Oil, Rosemary, Moringa, Fenugreek, Hibiscus, Star Anise, Amla Fruit, Bhringraj, and vitamin E Oil.",
    ingredients:
      "Sunflower Oil, Castor Oil, Black Cunin Seed Oil, Batana Oil, Rosemary, Moringa, Fenugreek, Hibiscus, Star Anise, Amla Fruit, Bhringraj, and vitamin E Oil.",
    status: "Available",
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
      { size: "150ml/g", price: 74.99 },
      { size: "250ml/g/g", price: 119.99 },
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
      { size: "100ml/g", price: 99.99 },
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
      { size: "100ml/g", price: 20.99 },
      { size: "150ml/g", price: 29.99 },
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
