import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-[#48392e] text-[#f8f7f2] py-8">
      <div className="container mx-auto px-4 sm:px-6 ">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <Link
              to="/"
              className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0"
            >
              <img
                src="/images/logo3.webp"
                alt="Roots to Bloom Logo"
                className="h-16 sm:h-20 object-contain"
              />
              <div>
                <strong className="flex gap-1 text-lg">
                  <p>Roots</p>
                  <p className="text-[#4b774a]">to</p>
                  <p>Bloom</p>
                </strong>
                <p className="text-xs italic">
                  Rooted in Nature, Bloom in Beauty
                </p>
              </div>
            </Link>
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
                  Shop
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
          <div className="w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2 sm:mb-4">Contact Us</h4>
            <p className="text-sm">Kuala Lumpur, Malaysia</p>
            <p className="text-sm">Phone: (+60) 111 321 9046</p>
            <p className="text-sm">Email: rootstobloombeauty@gmail.com</p>
          </div>
          <div className="w-full lg:w-1/4">
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.facebook.com/share/14z5dzf6Tb/"
                className="hover:text-[#d79f63] transition duration-300"
              >
                <img
                  src="/images/facebook.webp"
                  alt="facebook-icon"
                  width={28}
                  //className="flex items-center justify-center"
                />
              </a>
              <a
                href="https://www.instagram.com/rtbloombeauty?igsh=MXE4aDQwc2RxOGppeQ=="
                className="hover:text-[#d79f63] transition duration-300"
              >
                <img
                  src="/images/instagram.webp"
                  alt="instagram-icon"
                  width={28}
                  // className="flex items-center justify-center"
                />
              </a>
              <a
                href="https://my.shp.ee/HwAFMcx"
                className="hover:text-[#d79f63] transition duration-300"
              >
                <img
                  src="/images/shopee-icon.svg"
                  alt="Shopee-icon"
                  width={25}
                  // className="flex items-center justify-center"
                />
              </a>
              <a
                href="https://my.shp.ee/HwAFMcx"
                 className="hover:text-[#d79f63] transition duration-300"
              >
                <img
                  src="/images/carousell.webp"
                  alt="Shopee-icon"
                  width={26}
                  // className="flex items-center justify-center"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm ml-[-2rem] sm:ml-0">
          <p>
            &copy; {new Date().getFullYear()} Roots to Bloom Beauty. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
