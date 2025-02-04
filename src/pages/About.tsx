import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-[#48392e] mb-8 text-center">
        About Roots to Bloom
      </h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#4b774a] mb-4">
          Our Story
        </h2>
        <p className="text-[#48392e] mb-4">
          Roots to Bloom was born from a passion for natural beauty and a deep
          respect for the environment. Our journey began with a simple idea: to
          create skin and hair care products that harness the power of nature
          while promoting sustainability and ethical practices.
        </p>
        <p className="text-[#48392e]">
          Founded in 2020, we've grown from a small, home-based operation to a
          beloved brand that touches the lives of thousands. Our commitment to
          quality, purity, and effectiveness remains at the heart of everything
          we do.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#4b774a] mb-4">
          Our Philosophy
        </h2>
        <ul className="list-disc list-inside text-[#48392e] space-y-2">
          <li>We believe in the power of nature to nourish and heal.</li>
          <li>
            We are committed to sustainable and ethical sourcing of ingredients.
          </li>
          <li>We strive for transparency in our processes and ingredients.</li>
          <li>
            We are dedicated to creating products that are effective and safe
            for all skin types.
          </li>
          <li>
            We aim to minimize our environmental impact through eco-friendly
            packaging and practices.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#4b774a] mb-4">
          Our Promise
        </h2>
        <p className="text-[#48392e]">
          At Roots to Bloom, we promise to continue innovating and creating
          products that not only enhance your natural beauty but also contribute
          to a healthier planet. We're more than just a beauty brand; we're a
          community of individuals who believe in the harmony between personal
          care and environmental responsibility.
        </p>
      </section>
    </motion.div>
  );
};

export default About;
