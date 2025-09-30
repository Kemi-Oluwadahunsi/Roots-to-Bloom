import type { Product } from "../context/ProductContext";

export enum Currency {
  MYR = "MYR",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  AUD = "AUD",
  SGD = "SGD",
  JPY = "JPY",
  INR = "INR",
  CNY = "CNY",
  CAD = "CAD",
  NGN = "NGN",
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
    image: "/images/products/botanic/48.webp",
    images: [
      "/images/products/botanic/49.webp",
      "/images/products/botanic/54.webp",
      "/images/products/botanic/50.webp",
      "/images/products/botanic/58.webp",
      // "/images/products/botanic/51.webp",
    ],
    rating: 5,
    howToUse:
      "Take a small amount and melt between palms. Apply to damp or dry hair, focusing on ends and scalp, massage gently to boost absorption and stimulate circulation. Use as a daily moisturizer or sealant after leave-in conditioner. For best results, use consistently as part of your hair care routine.",
    keyIngredients:
      "Macadamia Seed Butter, Kokum Butter, Mango Butter, Shea Butter, Cocoa Butter, D-Panthenol, and Rosemary Extract.",
    ingredients:
      "Macadamia Seed Butter, Kokum Butter, Mango Butter, Shea Butter, Cocoa Butter, D-Panthenol, Rosemary Oil, Batana Oil, Black Seed Oil, Castor Oil,  Neem Oil, Vitamin E Oil, Moringa Powder, Propanediol, Menthol Crystals, Rosemary Essential Oil, Peppermint Essential Oil, Spearmint Essential Oil, Tea Trea Essential Oil, Optiphen Plus.",
    status: "Available",
    // E-commerce fields
    stock: 100,
    isActive: true,
    tags: ["hair", "butters", "growth", "hydrating"],
    weight: 0.15, // kg
    dimensions: {
      length: 8,
      width: 6,
      height: 4
    },
    sku: "RTB-BHGB-001",
    brand: "Roots to Bloom",
  },
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
    rating: 5,
    howToUse:
      "Wet hair thoroughly. Apply a small amount of shampoo to your palm and massage into your scalp and hair. Rinse thoroughly with warm water. For best results, follow with our SilkyGlow Hydrating Deep Conditioner.",
    keyIngredients:
      "Aloe Vera, Hibiscus, Fenugreek, Stinging Nettle, Rosemary, Panthenol",
    ingredients:
      "Purified water, Aloe Vera Juice, Nettle Extract, Rosemary Extract, Fenugreek Extract, Hibiscus Extract, Panthenol, Sodium Cocoyl Isethionate, Coco Glucoside, Decyl Glucoside, Foaming Apple, Cocamidopropyl Betaine, Olivem 1000, Castor Oil, Argan Oil, Caffeine Extract, Oats Extract, Citric Acid, Eco-Cert Preservative.",
    status: "Available",
    // E-commerce fields
    stock: 100,
    isActive: true,
    tags: ["hair", "shampoos", "strength", "growth"],
    weight: 0.12, // kg
    dimensions: {
      length: 7,
      width: 5,
      height: 18
    },
    sku: "RTB-HSGS-008",
    brand: "Roots to Bloom",
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
      "/images/products/leave-in/9.webp",
      "/images/products/leave-in/10.webp",
    ],
    rating: 5,
    howToUse:
      "1. Apply a generous amount to damp or freshly washed hair. 2. Work through strands with fingers or a wide-tooth comb. 3. Style as desired, perfect for wash-and-go, twist-outs, or protective styles. 4. No need to rinse, just let your hair absorb the nourishing benefits.",
    keyIngredients:
      "Oats Milk, Flaxseed Gel, Fenugreek Extract, Rosemary Extract, Slippery Elm Extract, Aloe Vera Extract, Amino Acids.",
    ingredients:
      "Water (Aqua), Avena Sativa (Oat) Milk, Linum Usitatissimum (Flaxseed) Gel, Trigonella Foenum-Graecum (Fenugreek) Extract, Rosmarinus Officinalis (Rosemary) Hydrosol, Ulmus Rubra (Slippery Elm) Extract, Argania Spinosa (Argan) Oil, Simmondsia Chinensis (Jojoba) Oil, Behentrimonium Methosulfate (BTMS-50), Cetyl Alcohol, Aloe Barbadensis (Aloe Vera) Extract, Silk Amino Acids, Tocopherol (Vitamin E), Mentha Piperita (Peppermint) Essential Oil, Preservative.",
    status: "Available",
    // E-commerce fields
    stock: 100,
    isActive: true,
    tags: ["hair", "conditioners", "leave-in", "nourishing"],
    weight: 0.12, // kg
    dimensions: {
      length: 7,
      width: 5,
      height: 18
    },
    sku: "RTB-HTLC-009",
    brand: "Roots to Bloom",
  },
  {
    id: "3",
    name: "Flora Luxe Growth Butter",
    category: "hair",
    subCategory: "butters",
    description:
      "Flora Luxe Whipped Hair Butter – Nourish, strengthen, and hydrate with hibiscus and rosemary. Flora Luxe Whipped Hair Butter is a rich, velvety blend of nature's most powerful botanicals, designed to deeply nourish, hydrate, and strengthen your hair. Infused with hibiscus and rosemary extracts, this lightweight yet ultra-moisturizing butter melts effortlessly into your strands, sealing in hydration without leaving a greasy feel.",
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
    rating: 4.6,
    howToUse:
      "After shampooing, apply a generous amount to wet hair, focusing on mid-lengths and ends. Leave for 2-3 minutes, then rinse thoroughly with cool water.",
    keyIngredients:
      "Mango butter, Kokum butter, Macadamia butter, Cocoa butter, Hibiscus extract, Rosemary extract.",
    ingredients:
      "Mango butter, Kokum butter, Macadamia butter, Cocoa butter, Hibiscus extract, Rosemary extract, Castor oil, Blackseed oil, Batana oil, Neem oil, Provitamin B5, Propane-1,3-diol, Vitamin E oil, Optiphen plus.",
    status: "Available",
    // E-commerce fields
    stock: 100,
    isActive: true,
    tags: ["hair", "butters", "growth", "hibiscus"],
    weight: 0.15, // kg
    dimensions: {
      length: 8,
      width: 6,
      height: 4
    },
    sku: "RTB-FLGB-003",
    brand: "Roots to Bloom",
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
    rating: 5,
    howToUse:
      "Directions For Use: 1. Scalp Treatment: Apply a few drops to the scalp, massage for 5-10 minutes, and leave overnight or for at least 2 hours before washing. 2. Moisturizing Oil: Apply a small amount to damp or dry hair, focusing on the ends. 3. Sealant: Apply a small amount to the ends of damp or dry hair to lock in moisture and prevent breakage.",
    keyIngredients:
      "Sunflower Oil, Castor Oil, Black Cunin Seed Oil, Batana Oil, Rosemary, Moringa, Fenugreek, Hibiscus, Star Anise, Amla Fruit, Bhringraj, and vitamin E Oil.",
    ingredients:
      "Sunflower Oil, Castor Oil, Black Cunin Seed Oil, Batana Oil, Rosemary, Moringa, Fenugreek, Hibiscus, Star Anise, Amla Fruit, Bhringraj, and vitamin E Oil.",
    status: "Available",
    // E-commerce fields
    stock: 100,
    isActive: true,
    tags: ["hair", "oils", "growth", "elixir"],
    weight: 0.03, // kg
    dimensions: {
      length: 5,
      width: 5,
      height: 10
    },
    sku: "RTB-GEOC-004",
    brand: "Roots to Bloom",
  },
  {
    id: "5",
    name: "SilkyGlow Hydrating Deep Conditioner",
    category: "hair",
    subCategory: "conditioners",
    description:
      "Give your hair the ultimate nourishment with our SilkyGlow Hydrating Deep Conditioner, for Intense Hydration & Repair, formulated with a powerful blend of plant-based milks, proteins, and botanical extracts to restore, strengthen, and deeply hydrate your hair.  This luxurious deep conditioner penetrates every strand, repairing damage, enhancing elasticity, and locking in moisture for long-lasting softness and shine.",
    sizePrices: [{ size: "250ml/g", price: 25.0 }],
    image: "/images/products/deep-conditioner/34.webp",
    images: [
      "/images/products/deep-conditioner/35.webp",
      "/images/products/deep-conditioner/36.webp",
      "/images/products/deep-conditioner/37.webp",
      "/images/products/deep-conditioner/38.webp",
    ],
    rating: 5,
    howToUse:
      "1. Apply generously to clean, damp hair, focusing on mid-lengths to ends. 2. Massage gently and detangle with fingers or a wide-tooth comb. 3. Leave on for 15 to 30 minutes for deep penetration. 4. Rinse thoroughly with cool water to seal in moisture.  ",
    keyIngredients: "Rice Milk, Oats Milk, Coconut Milk, Honey, Proteins",
    ingredients:
      "Aqua (Water), Rice Milk, Oat Milk, Coconut Milk, Aloe Vera Juice, Hydrolyzed Silk Protein, Glycerin, Panthenol (Pro-Vitamin B5), Mango Seed Butter, Castor Seed Oil, Grape Seed Oil, Cetearyl Alcohol, BTMS-50, Honey, Hydrolyzed Wheat Protein, Baobab Extract, Green Tea Extract, Vitamin E Oil, NipaGuard, Essential Oil Blend (Lavender, Rosemary, or Peppermint), Citric Acid.",
    status: "Available",
    // E-commerce fields
    stock: 100,
    isActive: true,
    tags: ["hair", "conditioners", "deep", "hydrating"],
    weight: 0.25, // kg
    dimensions: {
      length: 7,
      width: 5,
      height: 20
    },
    sku: "RTB-SHDC-005",
    brand: "Roots to Bloom",
  },
  {
    id: "6",
    name: "Anti-Dandruff & Scalp Therapy Shampoo",
    category: "hair",
    subCategory: "shampoos",
    description:
      "This herbal anti-dandruff shampoo is a powerful yet gentle solution designed to combat dandruff, soothe the scalp, and restore hair health. Infused with natural botanicals, purifying agents, and scalp-nourishing ingredients, it effectively removes flakes, reduces itchiness, and prevents future dandruff outbreaks. The advanced formula detoxifies the scalp, regulates excess oil production, and provides long-lasting hydration to maintain a balanced scalp environment.",
    sizePrices: [
      { size: "120ml", price: 29.0 },
      { size: "250ml/g", price: 54.0 },
    ],
    image: "/images/products/antidandruff/front.webp",
    images: [
      "/images/products/antidandruff/10.webp",
      "/images/products/antidandruff/11.webp",
      "/images/products/antidandruff/12.webp",
      "/images/products/antidandruff/13.webp",
    ],
    rating: 5,
    howToUse:
      "Apply a generous amount to wet hair and scalp. Massage gently for two to three minutes, allowing the active ingredients to penetrate. Rinse thoroughly and repeat if necessary. For best results, use consistently and follow up with a lightweight conditioner.",
    keyIngredients:
      "Activated Charcoal, Piroctone Olamine, Zinc PCA, Salicylic Acid, Provitamin B5, Tea Tree Oil, Neem Oil, Peppermint Oil",
    ingredients:
      "Purified Water, Aloe Vera Juice, Hydrolyzed Oat Protein, Piroctone Olamine, Salicylic Acid (BHA), Zinc PCA, Activated Charcoal, Sodium Cocoyl Isethionate (SCI), Coco Glucoside, Decyl Glucoside, Cocamidopropyl Betaine, Neem Extract, Tea Tree Oil, Black Cumin Seed Oil, Peppermint Oil, Menthol Crystals, Panthenol (Provitamin B5), Guar Hydroxypropyltrimonium Chloride, Eco-Cert Preservative (Geogard ECT), Citric Acid.",
    status: "Available",
    // E-commerce fields
    stock: 100,
    isActive: true,
    tags: ["hair", "shampoos", "anti-dandruff", "scalp"],
    weight: 0.12, // kg
    dimensions: {
      length: 7,
      width: 5,
      height: 18
    },
    sku: "RTB-ADSTS-006",
    brand: "Roots to Bloom",
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
    rating: 5,
    howToUse:
      "Wet the bar and work into a lather. Gently massage onto face or body, then rinse thoroughly with warm water. Suitable for daily use.",
    keyIngredients:
      "Glycerin, Shea Butter, Aloe Vera, Chamomile Extract, Vitamin E",
    ingredients: "Aqua, ......",
    status: "Unavailable",
    // E-commerce fields
    stock: 0,
    isActive: false,
    tags: ["skin", "bar soaps", "cleansing", "gentle"],
    weight: 0.05, // kg
    dimensions: {
      length: 8,
      width: 5,
      height: 2
    },
    sku: "RTB-GCB-007",
    brand: "Roots to Bloom",
  },
];
