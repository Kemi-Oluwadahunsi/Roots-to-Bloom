import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#48392e] text-[#f8f7f2] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">Roots to Bloom</h3>
            <p className="text-sm">Nurturing beauty from nature's essence.</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#d79f63] transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#d79f63] transition duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-[#d79f63] transition duration-300"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#d79f63] transition duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-sm">123 Nature Lane, Green City</p>
            <p className="text-sm">Phone: (123) 456-7890</p>
            <p className="text-sm">Email: info@rootstobloom.com</p>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-[#d79f63] transition duration-300"
              >
                <Facebook />
              </a>
              <a
                href="#"
                className="hover:text-[#d79f63] transition duration-300"
              >
                <Instagram />
              </a>
              <a
                href="#"
                className="hover:text-[#d79f63] transition duration-300"
              >
                <Twitter />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; 2023 Roots to Bloom Beauty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
