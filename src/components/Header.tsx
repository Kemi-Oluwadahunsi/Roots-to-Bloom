import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-[#f8f7f2] dark:bg-[#1a1a1a] shadow-md">
      <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src="/images/RootsBig.png"
            alt="Roots to Bloom Logo"
            className="h-16 mr-2"
          />
         
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
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
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[#d79f63] dark:bg-[#b58552] text-[#48392e] dark:text-[#f8f7f2] mr-2"
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
          className="md:hidden bg-[#f8f7f2] dark:bg-[#1a1a1a] py-2"
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
    className="block py-2 px-4 text-[#48392e] dark:text-[#e0e0e0] hover:text-[#d79f63] dark:hover:text-[#b58552] transition duration-300"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Header;

