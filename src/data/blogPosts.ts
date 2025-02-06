export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  slug: string;
  date: string;
  categories: string[];
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Understanding Your Skin Type",
    excerpt:
      "Learn how to identify your skin type and choose the right products for your skincare routine.",
    content: `
      <p>Understanding your skin type is crucial for maintaining healthy, glowing skin. There are five main skin types: normal, dry, oily, combination, and sensitive. Here's how to identify yours:</p>
      
      <h2>Normal Skin</h2>
      <p>Normal skin is well-balanced, neither too oily nor too dry. It has a smooth texture, small pores, and few imperfections.</p>
      
      <h2>Dry Skin</h2>
      <p>Dry skin often feels tight and may have visible flakes. It's prone to fine lines and redness.</p>
      
      <h2>Oily Skin</h2>
      <p>Oily skin has a shiny appearance, especially in the T-zone. It's prone to enlarged pores and acne breakouts.</p>
      
      <h2>Combination Skin</h2>
      <p>Combination skin is dry in some areas and oily in others, typically oily in the T-zone and dry on the cheeks.</p>
      
      <h2>Sensitive Skin</h2>
      <p>Sensitive skin reacts easily to products or environmental factors, often becoming red, itchy, or irritated.</p>
      
      <p>Once you've identified your skin type, you can choose products that address your specific needs, helping you achieve healthier, more radiant skin.</p>
    `,
    image: "/images/skin-type-blog.jpg",
    slug: "understanding-your-skin-type",
    date: "2023-05-15",
    categories: ["Skincare"],
    tags: ["Skin Types", "Skincare Routine", "Skin Health"],
  },
  {
    id: 2,
    title: "Natural Hair Care Tips",
    excerpt:
      "Discover the best practices for maintaining healthy, beautiful hair using natural ingredients.",
    content: `
      <p>Maintaining healthy, beautiful hair doesn't have to involve harsh chemicals. Here are some natural hair care tips to keep your locks looking their best:</p>
      
      <h2>1. Use Natural Oils</h2>
      <p>Coconut oil, argan oil, and jojoba oil can nourish your hair and scalp. Apply them as a pre-shampoo treatment or to tame frizz.</p>
      
      <h2>2. Try an Avocado Hair Mask</h2>
      <p>Mash a ripe avocado and apply it to your hair for 30 minutes before shampooing. It's rich in vitamins and healthy fats that can moisturize your hair.</p>
      
      <h2>3. Rinse with Apple Cider Vinegar</h2>
      <p>An ACV rinse can help balance your scalp's pH and add shine to your hair. Mix one part ACV with three parts water.</p>
      
      <h2>4. Gentle Cleansing</h2>
      <p>Use sulfate-free, natural shampoos to cleanse your hair without stripping its natural oils.</p>
      
      <h2>5. Protect from Heat</h2>
      <p>When using heat styling tools, apply a natural heat protectant like argan oil or shea butter.</p>
      
      <p>Remember, everyone's hair is different. Experiment with these tips to find what works best for your unique hair type and texture.</p>
    `,
    image: "/images/hair-care-tip.webp",
    slug: "natural-hair-care-tips",
    date: "2023-05-10",
    categories: ["Hair Care"],
    tags: ["Natural Ingredients", "Hair Health", "DIY"],
  },
  {
    id: 3,
    title: "The Power of Botanical Ingredients",
    excerpt:
      "Explore the benefits of plant-based ingredients in your beauty routine.",
    content: `
      <p>Botanical ingredients have been used in skincare and haircare for centuries. Here's why they're still a powerful choice for your beauty routine:</p>
      
      <h2>1. Aloe Vera</h2>
      <p>Known for its soothing properties, aloe vera can hydrate skin and calm irritation. It's great for sunburns and minor skin irritations.</p>
      
      <h2>2. Green Tea</h2>
      <p>Rich in antioxidants, green tea can protect skin from free radicals and reduce inflammation. It's often found in anti-aging products.</p>
      
      <h2>3. Rosehip Oil</h2>
      <p>High in vitamin C and essential fatty acids, rosehip oil can help improve skin texture and reduce the appearance of scars and fine lines.</p>
      
      <h2>4. Chamomile</h2>
      <p>Chamomile has anti-inflammatory properties that can soothe sensitive skin and scalp. It's also great for lightening hair naturally.</p>
      
      <h2>5. Jojoba Oil</h2>
      <p>Similar in composition to our skin's natural sebum, jojoba oil is excellent for balancing oil production and moisturizing both skin and hair.</p>
      
      <p>When incorporating botanical ingredients into your routine, always patch test first and introduce new products gradually to ensure your skin responds well.</p>
    `,
    image: "/images/herbs-care.jpg",
    slug: "power-of-botanical-ingredients",
    date: "2023-05-05",
    categories: ["Skincare", "Hair Care"],
    tags: [
      "Botanical Ingredients",
      "Natural Beauty",
      "Skin Health",
      "Hair Health",
    ],
  },
  {
    id: 4,
    title: "The Benefits of Double Cleansing",
    excerpt:
      "Learn why double cleansing could be the game-changer in your skincare routine.",
    content: `
      <p>Double cleansing is a two-step cleansing process that has gained popularity in recent years. Here's why it might be beneficial for your skin:</p>
      
      <h2>What is Double Cleansing?</h2>
      <p>Double cleansing involves using an oil-based cleanser first, followed by a water-based cleanser. This method ensures a thorough cleanse, removing both oil-based and water-based impurities.</p>
      
      <h2>Benefits of Double Cleansing</h2>
      <ul>
        <li>Removes makeup more effectively</li>
        <li>Clears out clogged pores</li>
        <li>Allows other skincare products to penetrate better</li>
        <li>Helps balance oil production</li>
      </ul>
      
      <h2>How to Double Cleanse</h2>
      <p>1. Start with an oil-based cleanser or micellar water to remove makeup and sunscreen.</p>
      <p>2. Follow up with a gentle, water-based cleanser to remove any remaining impurities.</p>
      
      <p>Remember, while double cleansing can be beneficial, it's not necessary for everyone. If you have very dry or sensitive skin, you might want to stick to a single, gentle cleanser.</p>
    `,
    image: "/images/double-cleansing.webp",
    slug: "benefits-of-double-cleansing",
    date: "2023-05-20",
    categories: ["Skincare"],
    tags: ["Double Cleansing", "Skincare Routine", "Cleanse"],
  },
  {
    id: 5,
    title: "Understanding Hair Porosity",
    excerpt:
      "Discover what hair porosity is and why it matters for your hair care routine.",
    content: `
      <p>Hair porosity refers to your hair's ability to absorb and retain moisture. Understanding your hair's porosity can help you choose the right products and techniques for your hair care routine.</p>
      
      <h2>Types of Hair Porosity</h2>
      <h3>1. Low Porosity</h3>
      <p>Low porosity hair has tightly bound cuticles that make it difficult for moisture to penetrate. It tends to be resistant to chemical processes and can be prone to product buildup.</p>
      
      <h3>2. Medium Porosity</h3>
      <p>Medium porosity hair has a good balance of moisture retention and product absorption. It's generally the easiest to maintain.</p>
      
      <h3>3. High Porosity</h3>
      <p>High porosity hair has gaps and holes in the cuticle, allowing too much moisture to be absorbed. It can become frizzy easily and is prone to damage.</p>
      
      <h2>How to Determine Your Hair Porosity</h2>
      <p>Try the float test: Place a clean strand of hair in a glass of water. If it floats, you likely have low porosity. If it sinks quickly, you likely have high porosity. If it floats in the middle, you likely have medium porosity.</p>
      
      <p>By understanding your hair's porosity, you can better tailor your hair care routine to your specific needs.</p>
    `,
    image: "/images/porosity.webp",
    slug: "understanding-hair-porosity",
    date: "2023-05-25",
    categories: ["Hair Care"],
    tags: ["Hair Porosity", "Hair Health", "Hair Care Routine"],
  },
  {
    id: 6,
    title: "The Importance of Sunscreen",
    excerpt:
      "Learn why sunscreen should be an essential part of your daily skincare routine.",
    content: `
      <p>Sunscreen is often overlooked, but it's one of the most important steps in any skincare routine. Here's why you should never skip this crucial product:</p>
      
      <h2>Protects Against Skin Cancer</h2>
      <p>Regular use of sunscreen significantly lowers your risk of developing various types of skin cancer, including melanoma.</p>
      
      <h2>Prevents Premature Aging</h2>
      <p>Sun damage is one of the primary causes of wrinkles, fine lines, and age spots. Sunscreen helps maintain youthful skin.</p>
      
      <h2>Maintains Even Skin Tone</h2>
      <p>Sunscreen helps prevent discoloration and dark spots, helping you maintain a more even skin tone.</p>
      
      <h2>Choosing the Right Sunscreen</h2>
      <ul>
        <li>Look for broad-spectrum protection (protects against both UVA and UVB rays)</li>
        <li>Choose SPF 30 or higher</li>
        <li>Consider your skin type when choosing between chemical and physical sunscreens</li>
      </ul>
      
      <p>Remember, sunscreen should be applied every day, even when it's cloudy or you're indoors. Reapply every two hours when outdoors or after swimming or sweating.</p>
    `,
    image: "/images/sunscreen.jpeg",
    slug: "importance-of-sunscreen",
    date: "2023-05-30",
    categories: ["Skincare"],
    tags: ["Sunscreen", "Sun Protection", "Skin Health"],
  },
  {
    id: 7,
    title: "Natural Remedies for Acne",
    excerpt:
      "Discover effective, natural ways to combat acne and achieve clearer skin.",
    content: `
      <p>Acne is a common skin concern that affects people of all ages. While there are many over-the-counter treatments available, natural remedies can also be effective. Here are some natural ways to combat acne:</p>
      
      <h2>1. Tea Tree Oil</h2>
      <p>Known for its antibacterial properties, tea tree oil can help fight the bacteria that cause acne. Always dilute it before applying to your skin.</p>
      
      <h2>2. Honey</h2>
      <p>Honey has antibacterial and anti-inflammatory properties. It can be used as a spot treatment or a face mask.</p>
      
      <h2>3. Aloe Vera</h2>
      <p>Aloe vera can help reduce inflammation and promote healing. It's especially useful for acne scars.</p>
      
      <h2>4. Green Tea</h2>
      <p>Green tea is rich in antioxidants and can help reduce inflammation when applied topically.</p>
      
      <h2>5. Apple Cider Vinegar</h2>
      <p>ACV can help balance your skin's pH and has antibacterial properties. Always dilute it before use.</p>
      
      <p>Remember, while these natural remedies can be effective, severe or persistent acne may require professional treatment. Always patch test new remedies and discontinue use if irritation occurs.</p>
    `,
    image: "/images/acne-remedy.jpg",
    slug: "natural-remedies-for-acne",
    date: "2023-06-04",
    categories: ["Skincare"],
    tags: ["Acne", "Natural Remedies", "Skincare Tips"],
  },
  {
    id: 8,
    title: "The Art of Layering Skincare Products",
    excerpt:
      "Learn the correct order to apply your skincare products for maximum effectiveness.",
    content: `
      <p>Layering your skincare products correctly can make a big difference in their effectiveness. Here's a guide to help you get the most out of your skincare routine:</p>
      
      <h2>1. Cleanser</h2>
      <p>Always start with a clean slate. Use a gentle cleanser suitable for your skin type.</p>
      
      <h2>2. Toner</h2>
      <p>Toners help balance your skin's pH and prepare it for the next steps in your routine.</p>
      
      <h2>3. Serums</h2>
      <p>Apply serums from thinnest to thickest consistency. Start with water-based serums, followed by oil-based ones.</p>
      
      <h2>4. Eye Cream</h2>
      <p>Gently pat eye cream around your orbital bone using your ring finger.</p>
      
      <h2>5. Moisturizer</h2>
      <p>Lock in all the previous layers with a moisturizer suitable for your skin type.</p>
      
      <h2>6. Sunscreen (AM routine)</h2>
      <p>Always finish your morning routine with sunscreen to protect your skin from UV damage.</p>
      
      <h2>7. Face Oil (PM routine)</h2>
      <p>If you use face oils, apply them last in your evening routine to seal in all the other products.</p>
      
      <p>Remember, it's important to wait a few minutes between layers to allow each product to absorb properly. Also, not every step is necessary for everyone - tailor your routine to your skin's needs.</p>
    `,
    image: "/images/layering.webp",
    slug: "art-of-layering-skincare-products",
    date: "2023-06-09",
    categories: ["Skincare"],
    tags: ["Skincare Routine", "Skincare Tips", "Layering"],
  },
  {
    id: 9,
    title: "Understanding Hair Protein Treatments",
    excerpt:
      "Learn about protein treatments for hair and whether your hair needs one.",
    content: `
      <p>Protein treatments can be a game-changer for damaged or weakened hair. But what exactly are they, and does your hair need one? Let's dive in:</p>
      
      <h2>What are Protein Treatments?</h2>
      <p>Protein treatments are hair products that contain hydrolyzed proteins, which can temporarily "repair" damaged areas of the hair shaft.</p>
      
      <h2>Signs Your Hair Needs Protein</h2>
      <ul>
        <li>Hair feels gummy or stretchy when wet</li>
        <li>Hair is limp and lacks volume</li>
        <li>Hair is breaking more than usual</li>
        <li>Hair has lost its elasticity</li>
      </ul>
      
      <h2>Types of Protein Treatments</h2>

      <ol>
        <li>Light Protein Treatments: These are mild and can be used more frequently, often found in leave-in conditioners.</li>
        <li>Medium Protein Treatments: These are stronger and should be used less often, typically every 4-6 weeks.</li>
        <li>Heavy Protein Treatments: These are intense treatments for severely damaged hair and should be used sparingly.</li>
      </ol>

      <h2>How to Use Protein Treatments</h2>
      <p>Always follow the instructions on the product. Generally, you'll apply the treatment to clean, damp hair, leave it on for the specified time, then rinse thoroughly. Follow with a moisturizing conditioner.</p>

      <h2>Caution</h2>
      <p>Too much protein can make hair brittle and prone to breakage. Balance protein treatments with moisturizing treatments to maintain healthy hair.</p>

      <p>Remember, not all hair needs protein treatments. If your hair feels strong and healthy, focus on maintaining that balance with regular conditioning and minimal heat styling.</p>
    `,
    image: "/images/protein-treatment.webp",
    slug: "understanding-hair-protein-treatments",
    date: "2023-06-14",
    categories: ["Hair Care"],
    tags: ["Protein Treatments", "Hair Health", "Hair Care Tips"],
  },
  {
    id: 10,
    title: "The Benefits of Facial Massage",
    excerpt:
      "Discover how incorporating facial massage into your skincare routine can improve your skin's health and appearance.",
    content: `
      <p>Facial massage is more than just a luxurious spa treatment. It can have numerous benefits for your skin's health and appearance. Let's explore why you might want to incorporate facial massage into your skincare routine:</p>

      <h2>Benefits of Facial Massage</h2>
      <ul>
        <li>Improves blood circulation, bringing more oxygen and nutrients to the skin</li>
        <li>Promotes lymphatic drainage, reducing puffiness and toxin buildup</li>
        <li>Relieves tension in facial muscles, potentially reducing the appearance of fine lines</li>
        <li>Enhances product absorption</li>
        <li>Can provide a natural, temporary face-lifting effect</li>
      </ul>

      <h2>How to Perform a Facial Massage</h2>
      <ol>
        <li>Start with clean hands and a cleansed face</li>
        <li>Apply a facial oil or serum to provide slip</li>
        <li>Use gentle, upward strokes from the center of your face outward</li>
        <li>Pay special attention to areas of tension, like the jaw and forehead</li>
        <li>Use your knuckles to gently massage in circular motions</li>
        <li>Finish by gently tapping your face with your fingertips</li>
      </ol>

      <h2>Tools for Facial Massage</h2>
      <p>While you can perform facial massage with just your hands, there are also tools that can enhance the experience:</p>
      <ul>
        <li>Gua Sha tools</li>
        <li>Jade rollers</li>
        <li>Facial rollers</li>
        <li>Kansa wands</li>
      </ul>

      <p>Remember to be gentle with your skin. Facial massage should feel pleasant, not painful. If you have any skin conditions or concerns, consult with a dermatologist before incorporating facial massage into your routine.</p>
    `,
    image: "/images/facial-massage.jpg",
    slug: "benefits-of-facial-massage",
    date: "2023-06-19",
    categories: ["Skincare", "Wellness"],
    tags: ["Facial Massage", "Skin Health", "Self-Care"],
  },
];
