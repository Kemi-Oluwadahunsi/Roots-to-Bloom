// import type React from "react";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Menu, X } from "lucide-react";

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   return (
//     <header className="bg-[#f8f7f2] shadow-md">
//       <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold text-[#4b774a]">
//           Roots to Bloom
//         </Link>
//         <div className="hidden md:flex space-x-4">
//           <NavLink to="/">Home</NavLink>
//           <NavLink to="/about">About</NavLink>
//           <NavLink to="/products">Products</NavLink>
//           <NavLink to="/contact">Contact</NavLink>
//         </div>
//         <button className="md:hidden" onClick={toggleMenu}>
//           {isOpen ? <X /> : <Menu />}
//         </button>
//       </nav>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           className="md:hidden bg-[#f8f7f2] py-2"
//         >
//           <NavLink to="/" onClick={toggleMenu}>
//             Home
//           </NavLink>
//           <NavLink to="/about" onClick={toggleMenu}>
//             About
//           </NavLink>
//           <NavLink to="/products" onClick={toggleMenu}>
//             Products
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
// }: {
//   to: string;
//   children: React.ReactNode;
//   onClick?: () => void;
// }) => (
//   <Link
//     to={to}
//     className="block py-2 px-4 text-[#48392e] hover:text-[#d79f63] transition duration-300"
//     onClick={onClick}
//   >
//     {children}
//   </Link>
// );

// export default Header;


import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-[#f8f7f2] shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src="/images/roots-to-bloom-logo.png"
            alt="Roots to Bloom Logo"
            className="h-12 mr-2"
          />
          
        </Link>
        <div className="hidden md:flex space-x-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-[#f8f7f2] py-2"
        >
          <NavLink to="/" onClick={toggleMenu}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={toggleMenu}>
            About
          </NavLink>
          <NavLink to="/products" onClick={toggleMenu}>
            Products
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
}: {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Link
    to={to}
    className="block py-2 px-4 text-[#48392e] hover:text-[#d79f63] transition duration-300"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Header;
