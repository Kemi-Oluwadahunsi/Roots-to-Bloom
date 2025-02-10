export interface Ingredient {
  name: string;
  image: string;
  description: string;
  category: ("skin" | "hair" | "medical")[];
}

export const ingredients: Ingredient[] = [
  {
    name: "Plant butters",
    image: "/images/ingredients/plant-butters.webp",
    description:
      "Plant butters, are rich in essential fatty acids, vitamins, and antioxidants that deeply nourish, hydrate, and protect hair and skin.",
    category: ["hair", "skin"],
  },
  {
    name: "Amla",
    image: "/images/ingredients/amla.webp",
    description:
      "Rich in Vitamin C, Amla strengthens hair follicles, prevents greying, promotes hair growth, and adds shine.",
    category: ["hair"],
  },
  {
    name: "Neem",
    image: "/images/ingredients/neem.webp",
    description:
      "Known for its antibacterial properties, Neem helps combat dandruff and scalp infections, purifies the skin, fights acne, and reduces inflammation.",
    category: ["hair"],
  },
  {
    name: "Fenugreek",
    image: "/images/ingredients/fenugreek.webp",
    description:
      "Fenugreek is known for promoting hair growth, reducing hair fall, and improving scalp health. Rich in proteins, nicotinic acid, and lecithin, it strengthens hair follicles, prevents dandruff, and adds shine. ",
    category: ["hair"],
  },
  {
    name: "Rosemary",
    image: "/images/ingredients/rosemary.webp",
    description:
      "Rosemary herb stimulates hair growth, improves scalp health, and has anti-inflammatory properties beneficial for skin.",
    category: ["hair", "skin"],
  },
  {
    name: "Bhringraj",
    image: "/images/ingredients/bhringraj2.webp",
    description:
      "Often called the 'king of herbs', Bhringraj is known to prevent hair fall and premature graying.",
    category: ["hair"],
  },
  {
    name: "Argan Oil",
    description: "Nourishes and moisturizes hair, leaving it soft and shiny.",
    image: "/images/ingredients/argan.webp",
    category: ["hair"],
  },
  {
    name: "Brahmi",
    image: "/images/ingredients/brahmi.webp",
    description:
      "Brahmi strengthens hair roots and promotes thicker, healthier hair growth.",
    category: ["hair"],
  },
  {
    name: "Aloe Vera",
    image: "/images/ingredients/aloe-vera.webp",
    description:
      "Aloe Vera moisturizes the scalp, reduces dandruff, conditions hair, reduces inflammation, and promotes healing for irritated or sunburned skin.",
    category: ["hair", "skin"],
  },
  {
    name: "Green tea",
    image: "/images/ingredients/green-tea.webp",
    description:
      "Fights free radicals, reduces inflammation, and protects against environmental damage.",
    category: ["hair", "skin"],
  },

  {
    name: "Hibiscus",
    image: "/images/ingredients/hibiscus.webp",
    description:
      "Hibiscus promotes hair growth, prevents hair loss, and adds natural shine.",
    category: ["hair"],
  },
  {
    name: "Rosehip oil",
    image: "/images/ingredients/rosehip.webp",
    description:
      "A lightweight oil rich in vitamins A and C that helps reduce scars, fine lines, and hyperpigmentation.",
    category: ["skin", "hair"],
  },
  {
    name: "Ashwagandha",
    image: "/images/ingredients/ashwaganda.webp",
    description:
      "Ashwagandha improves scalp circulation and helps strengthen hair.",
    category: ["hair"],
  },
  {
    name: "Shikakai",
    image: "/images/ingredients/shikaikai.webp",
    description:
      "Shikakai cleanses the hair and scalp while promoting hair growth.",
    category: ["hair"],
  },
  {
    name: "Turmeric",
    image: "/images/ingredients/turmeric.webp",
    description:
      "A spice with anti-inflammatory and antioxidant properties that helps brighten skin, reduce acne, and even out skin tone.",
    category: ["skin"],
  },
  {
    name: "Sandalwood",
    image: "/images/ingredients/sandalwood.webp",
    description:
      "Sandalwood helps to soothe and cool the skin, reducing redness and irritation.",
    category: ["skin"],
  },
  {
    name: "Oatmeal",
    image: "/images/ingredients/oatmeal.webp",
    description:
      "A gentle exfoliant that soothes irritated skin, relieves itching, and is ideal for sensitive or eczema-prone skin.",
    category: ["skin"],
  },
  {
    name: "Jojoba oil",
    image: "/images/ingredients/jojoba-oil.webp",
    description:
      "Jojoba oil is similar to the natural oils in the skin, moisturize the skin, scalp and hair, which can help prevent dryness and breakage",
    category: ["skin", "hair"],
  },

  {
    name: "Rose",
    image: "/images/ingredients/rose.webp",
    description:
      "Rose has hydrating properties and helps to balance the skin's pH levels.",
    category: ["skin"],
  },
  {
    name: "Saffron",
    image: "/images/ingredients/saffron.webp",
    description:
      "Saffron is known for its skin-brightening and anti-aging properties.",
    category: ["skin"],
  },
  {
    name: "Peppermint",
    image: "/images/ingredients/peppermint.webp",
    description:
      "Stimulates the scalp, improves circulation, and promotes hair growth.",
    category: ["skin"],
  },
  {
    name: "D-Panthenol (Provitamin B5)",
    description:
      "Moisturizes and promotes skin healing, improves hair strength and shine.",
    image: "/images/ingredients/panthenol.webp",
    category: ["hair", "skin", "medical"],
  },
  {
    name: "Hyaluronic Acid",
    description:
      "Hydrates and plumps skin, reducing the appearance of fine lines and wrinkles.",
    image: "/images/ingredients/hyaluronic-acid.webp",
    category: ["skin", "medical"],
  },
  {
    name: "Vitamin E",
    description: "Antioxidant that protects skin and hair from damage.",
    image: "/images/ingredients/vitamine-e.webp",
    category: ["skin", "hair", "medical"],
  },
  {
    name: "Glycerin",
    description:
      "Attracts moisture to the skin and hair, providing deep hydration and softness.",
    image: "/images/ingredients/glycerin.webp",
    category: ["hair", "skin", "medical"],
  },
];
  



