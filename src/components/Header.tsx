// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
// import { useTheme } from "../context/ThemeContext";

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [showAboutDropdown, setShowAboutDropdown] = useState(false);
//   const { theme, toggleTheme } = useTheme();

//   const toggleMenu = () => setIsOpen(!isOpen);

//   return (
//     <header className="bg-[#f8f7f2] dark:bg-[#1a1a1a] shadow-md">
//       <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
//         <Link to="/" className="flex items-center">
//           <img
//             src="/images/logo3.png"
//             alt="Roots to Bloom Logo"
//             className="h-12 mr-2"
//           />
//           <div>
//             <strong className="flex gap-1 text-lg text-[#48392e] dark:text-[#b58552]">
//               <p>Roots</p>
//               <p className="text-[#4b774a]">to</p>
//               <p>Bloom</p>
//             </strong>
//             <p className="text-xs text-[#48392e] dark:text-[#e0e0e0] italic text-center">
//               Rooted in Nature, Bloom in Beauty
//             </p>
//           </div>
//         </Link>
//         <div className="hidden md:flex space-x-4 items-center">
//           <NavLink to="/">Home</NavLink>
//           <div
//             className="relative"
//             onMouseEnter={() => setShowAboutDropdown(true)}
//             onMouseLeave={() => setShowAboutDropdown(false)}
//           >
//             <button className="flex items-center py-2 px-4 text-[#48392e] dark:text-[#e0e0e0] hover:text-[#d79f63] dark:hover:text-[#b58552] transition duration-300">
//               About <ChevronDown className="ml-1 w-4 h-4" />
//             </button>
//             <AnimatePresence>
//               {showAboutDropdown && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#2a2a2a] rounded-md shadow-lg z-10"
//                 >
//                   <NavLink to="/about" className="block">
//                     About RtB
//                   </NavLink>
//                   <NavLink to="/ingredients" className="block">
//                     Ingredients
//                   </NavLink>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//           <NavLink to="/products">Shop</NavLink>
//           <NavLink to="/blog">Blog</NavLink>
//           <NavLink to="/contact">Contact</NavLink>
//           <button
//             onClick={toggleTheme}
//             className="p-2 rounded-full bg-[#d79f63] dark:bg-[#b58552] text-[#48392e] dark:text-[#f8f7f2]"
//           >
//             {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
//           </button>
//         </div>
//         <div className="md:hidden flex items-center">
//           <button
//             onClick={toggleTheme}
//             className="p-2 rounded-full bg-[#d79f63] dark:bg-[#b58552] text-[#48392e] dark:text-[#f8f7f2] mr-2"
//           >
//             {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
//           </button>
//           <button onClick={toggleMenu}>{isOpen ? <X /> : <Menu />}</button>
//         </div>
//       </nav>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           className="md:hidden bg-[#f8f7f2] dark:bg-[#1a1a1a] py-2"
//         >
//           <NavLink to="/" onClick={toggleMenu}>
//             Home
//           </NavLink>
//           <NavLink to="/about" onClick={toggleMenu}>
//             About RtB
//           </NavLink>
//           <NavLink to="/ingredients" onClick={toggleMenu}>
//             Ingredients
//           </NavLink>
//           <NavLink to="/products" onClick={toggleMenu}>
//             Shop
//           </NavLink>
//           <NavLink to="/blog" onClick={toggleMenu}>
//             Blog
//           </NavLink>
//           <NavLink to="/contact" onClick={toggleMenu}>
//             Contact
//           </NavLink>
//         </motion.div>
//       )}
//     </header>
//   );
// };

// const NavLink = ({
//   to,
//   children,
//   onClick,
//   className = "",
// }: {
//   to: string;
//   children: React.ReactNode;
//   onClick?: () => void;
//   className?: string;
// }) => (
//   <Link
//     to={to}
//     className={`block py-2 px-4 text-[#48392e] dark:text-[#e0e0e0] hover:text-[#d79f63] dark:hover:text-[#b58552] transition duration-300 ${className}`}
//     onClick={onClick}
//   >
//     {children}
//   </Link>
// );

// export default Header;


"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-[#f8f7f2] dark:bg-[#1a1a1a] shadow-md fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-4 sm:px-8 lg:px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src="/images/logo3.png"
            alt="Roots to Bloom Logo"
            className="h-12 mr-2"
          />
          <div>
            <strong className="flex gap-1 text-lg text-[#48392e] dark:text-[#b58552]">
              <p>Roots</p>
              <p className="text-[#4b774a]">to</p>
              <p>Bloom</p>
            </strong>
            <p className="text-xs text-[#48392e] dark:text-[#e0e0e0] italic text-center">
              Rooted in Nature, Bloom in Beauty
            </p>
          </div>
        </Link>
        <div className="hidden lg:flex space-x-2 xl:space-x-4 items-center">
          <NavLink to="/">Home</NavLink>
          <div
            className="relative"
            onMouseEnter={() => setShowAboutDropdown(true)}
            onMouseLeave={() => setShowAboutDropdown(false)}
          >
            <button className="flex items-center py-2 px-4 text-[#48392e] dark:text-[#e0e0e0] hover:text-[#d79f63] dark:hover:text-[#b58552] transition duration-300">
              About <ChevronDown className="ml-1 w-4 h-4" />
            </button>
            <AnimatePresence>
              {showAboutDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#2a2a2a] rounded-md shadow-lg z-10"
                >
                  <NavLink to="/about" className="block">
                    About RtB
                  </NavLink>
                  <NavLink to="/ingredients" className="block">
                    Ingredients
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[#d79f63] dark:bg-[#b58552] text-[#48392e] dark:text-[#f8f7f2]"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[#d79f63] dark:bg-[#b58552] text-[#48392e] dark:text-[#f8f7f2] mr-2 sm:mr-6"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={toggleMenu}>{isOpen ? <X /> : <Menu />}</button>
        </div>
      </nav>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden bg-[#f8f7f2] dark:bg-[#1a1a1a] py-4 sm:text-lg sm:pl-4"
        >
          <NavLink to="/" onClick={toggleMenu}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={toggleMenu}>
            About RtB
          </NavLink>
          <NavLink to="/ingredients" onClick={toggleMenu}>
            Ingredients
          </NavLink>
          <NavLink to="/products" onClick={toggleMenu}>
            Shop
          </NavLink>
          <NavLink to="/blog" onClick={toggleMenu}>
            Blog
          </NavLink>
          <NavLink to="/contact" onClick={toggleMenu}>
            Contact
          </NavLink>
        </motion.div>
      )}
    </header>
  );
};

const NavLink = ({
  to,
  children,
  onClick,
  className = "",
}: {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <Link
    to={to}
    className={`block py-2 px-4 text-[#48392e] dark:text-[#e0e0e0] hover:text-[#d79f63] dark:hover:text-[#b58552] transition duration-300 ${className}`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Header;

