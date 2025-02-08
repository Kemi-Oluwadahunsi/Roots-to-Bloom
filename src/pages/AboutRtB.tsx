import { motion } from "framer-motion";
import { Leaf, Heart, Droplet, Sun } from "lucide-react";
import type React from "react"; // Import React
// bg-[#f8f7f2] bg-opacity-90 dark:bg-[#1a1a1a] dark:bg-opacity-90
const AboutRtB = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen dark:bg-[#1a1a1a] bg-[#f8f7f2]  dark:bg-opacity-90 "
    >
      {/* <div className="absolute inset-0 min-h-screen bg-white/60 dark:bg-black/50"></div> */}
      <div className=" min-h-screen bg-contain bg-center bg-fixed bg-no-repeat bg-[url('/images/logo-faded2.png')] dark:bg-[url('/images/logo-faded-dark.png')]">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[#4b774a] dark:text-[#6a9e69] mb-8 text-center">
            About Roots to Bloom
          </h1>
          <div className="max-w-4xl mx-auto space-y-12 text-[#48392e] dark:text-[#e0e0e0]">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-semibold mb-4 text-[#4b774a] dark:text-[#6a9e69]">
                Our Story
              </h2>
              <p className="text-lg">
                Roots to Bloom is more than just a beauty brand; it's a
                celebration of nature's wisdom and the power of Ayurvedic
                traditions. Founded in 2020, our mission is to bring the
                time-tested benefits of natural ingredients to modern skincare
                and haircare routines. We believe that true beauty comes from
                within and is nurtured by the gifts of nature.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl font-semibold mb-4 text-[#4b774a] dark:text-[#6a9e69]">
                Our Philosophy
              </h2>
              <p className="text-lg mb-4">
                At Roots to Bloom, we're committed to sustainability,
                cruelty-free practices, and empowering our customers to embrace
                their natural beauty. Our products are carefully crafted using
                premium, ethically sourced Ayurvedic ingredients, each selected
                for its unique properties and benefits.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                <FeatureCard
                  icon={<Leaf className="w-10 h-10" />}
                  title="100% Natural"
                />
                <FeatureCard
                  icon={<Heart className="w-10 h-10" />}
                  title="Cruelty-Free"
                />
                <FeatureCard
                  icon={<Droplet className="w-10 h-10" />}
                  title="Ethically Sourced"
                />
                <FeatureCard
                  icon={<Sun className="w-10 h-10" />}
                  title="Sustainable"
                />
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-3xl font-semibold mb-4 text-[#4b774a] dark:text-[#6a9e69]">
                Our Commitment
              </h2>
              <p className="text-lg">
                We are dedicated to providing you with products that are free
                from harsh chemicals, parabens, and synthetic fragrances. Our
                commitment to quality ensures that you're giving your skin and
                hair only the best that nature has to offer. We believe in
                transparency and education, empowering our customers to make
                informed choices about their beauty routines.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-3xl font-semibold mb-4 text-[#4b774a] dark:text-[#6a9e69]">
                Meet the Formulator
              </h2>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <img
                  src="/images/formulator.png"
                  alt="Roots to Bloom Formulator"
                  className="w-64 h-64 object-cover rounded-full"
                />
                <div>
                  <h3 className="text-2xl font-semibold mb-2">
                    Kemi Oluwadahunsi
                  </h3>
                  <p className="text-lg mb-4">
                    Kemi is the heart and soul behind Roots to Bloom. With over
                    15 years of experience in Ayurvedic medicine and a Ph.D. in
                    Herbal Sciences, she brings a wealth of knowledge and
                    passion to our product formulations.
                  </p>
                  <p className="text-lg">
                    "My goal is to bridge the gap between ancient Ayurvedic
                    wisdom and modern skincare needs. Every product we create is
                    a labor of love, designed to nurture your skin and hair
                    while honoring the incredible power of nature." - Kemi O.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <p className="text-lg italic text-center">
                Join us on this journey of self-care and discover the
                transformative power of Ayurvedic beauty. Let your beauty bloom,
                naturally.
              </p>
            </motion.section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string }> = ({
  icon,
  title,
}) => (
  <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-[#2a2a2a] rounded-lg shadow-md">
    <div className="text-[#4b774a] dark:text-[#6a9e69] mb-2">{icon}</div>
    <h3 className="font-semibold">{title}</h3>
  </div>
);

export default AboutRtB;
