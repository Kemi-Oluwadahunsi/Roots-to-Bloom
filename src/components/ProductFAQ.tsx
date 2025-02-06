import { useState } from "react";
import { motion } from "framer-motion";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "lucide-react";
import type { Product } from "../context/ProductContext";

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  product: Product;
}

export default function ProductFAQ({ product }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How to Use",
      answer: product.howToUse,
    },
    {
      question: "Key Ingredients",
      answer: product.keyIngredients,
    },
    {
      question: "Ingredients",
      answer: product.ingredients,
    },
    {
      question: "Storage Instructions",
      answer:
        "Store in a cool, dry place away from direct sunlight. Keep container tightly closed when not in use.",
    },
    {
      question: "Returns Policy",
      answer:
        "We offer a 30-day satisfaction guarantee. If you're not completely satisfied, contact our customer service team.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full">
        {faqs.map((faq, index) => (
          <Disclosure
            as="div"
            key={index}
            className="mt-2"
            defaultOpen={openIndex === index}
          >
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-[#48392e] dark:text-[#e0e0e0] bg-[#f0e6d2] dark:bg-[#2a2a2a] rounded-lg hover:bg-[#e6d9c1] dark:hover:bg-[#3a3a3a] focus:outline-none focus-visible:ring focus-visible:ring-[#4b774a] focus-visible:ring-opacity-75"
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <span>{faq.question}</span>
                  <ChevronUpIcon
                    className={`${
                      open ? "transform rotate-180" : ""
                    } w-5 h-5 text-[#4b774a] dark:text-[#6a9e69]`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-[#4b774a] dark:text-[#6a9e69]">
                  {faq.answer}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </motion.div>
  );
}
