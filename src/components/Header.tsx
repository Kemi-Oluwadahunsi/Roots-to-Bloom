import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, ChevronDown, User, LogOut, CheckCircle, AlertCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const { currentUser, userProfile, logout } = useAuth()
  const { theme, toggleTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="bg-[#f8f7f2] dark:bg-[#1a1a1a] shadow-md fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-4 sm:px-8 lg:px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src="/images/logo3.webp"
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

        {/* Desktop Nav */}
        <div className="hidden lg:flex space-x-2 xl:space-x-4 items-center">
          <NavLink to="/" currentPath={location.pathname}>
            Home
          </NavLink>

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
                  <NavLink
                    to="/about"
                    currentPath={location.pathname}
                    className="block"
                  >
                    About RtB
                  </NavLink>
                  <NavLink
                    to="/ingredients"
                    currentPath={location.pathname}
                    className="block"
                  >
                    Ingredients
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/products" currentPath={location.pathname}>
            Shop
          </NavLink>
          <NavLink to="/blog" currentPath={location.pathname}>
            Blog
          </NavLink>
          <NavLink to="/contact" currentPath={location.pathname}>
            Contact
          </NavLink>
          
          {/* Admin Link - Only show for authenticated users */}
          {currentUser && (
            <NavLink to="/admin" currentPath={location.pathname}>
              Admin
            </NavLink>
          )}

          {/* User Authentication */}
          {currentUser ? (
            <div
              className="relative"
              onMouseEnter={() => setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <button className="flex items-center py-2 px-4 text-[#48392e] dark:text-[#e0e0e0] hover:text-[#d79f63] dark:hover:text-[#b58552] transition duration-300">
                <div className="w-8 h-8 bg-[#4b774a] dark:bg-[#6a9e69] rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                  {userProfile?.firstName?.charAt(0) || currentUser.email?.charAt(0)}
                </div>
                <div className="flex items-center">
                  <span className="mr-1">{userProfile?.firstName || "User"}</span>
                  {userProfile?.emailVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-500"  />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500"  />
                  )}
                </div>
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2a2a2a] rounded-md shadow-lg z-10"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-[#48392e] dark:text-[#e0e0e0] hover:bg-[#f0e6d2] dark:hover:bg-[#3a3a3a] transition duration-300"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-[#48392e] dark:text-[#e0e0e0] hover:bg-[#f0e6d2] dark:hover:bg-[#3a3a3a] transition duration-300"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 text-[#48392e] dark:text-[#e0e0e0] hover:text-[#d79f63] dark:hover:text-[#b58552] transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-[#4b774a] dark:bg-[#6a9e69] text-white rounded-md hover:bg-opacity-90 transition duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[#d79f63] dark:bg-[#b58552] text-[#48392e] dark:text-[#f8f7f2] cursor-pointer"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[#d79f63] dark:bg-[#b58552] text-[#48392e] dark:text-[#f8f7f2] mr-3 sm:mr-6"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={toggleMenu} ref={buttonRef}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-[#f8f7f2] dark:bg-[#1a1a1a] py-4 sm:text-lg sm:pl-4"
          >
            <NavLink
              to="/"
              onClick={toggleMenu}
              currentPath={location.pathname}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              onClick={toggleMenu}
              currentPath={location.pathname}
            >
              About RtB
            </NavLink>
            <NavLink
              to="/ingredients"
              onClick={toggleMenu}
              currentPath={location.pathname}
            >
              Ingredients
            </NavLink>
            <NavLink
              to="/products"
              onClick={toggleMenu}
              currentPath={location.pathname}
            >
              Shop
            </NavLink>
            <NavLink
              to="/blog"
              onClick={toggleMenu}
              currentPath={location.pathname}
            >
              Blog
            </NavLink>
            <NavLink
              to="/contact"
              onClick={toggleMenu}
              currentPath={location.pathname}
            >
              Contact
            </NavLink>
            
            {/* Admin Link - Only show for authenticated users */}
            {currentUser && (
              <NavLink
                to="/admin"
                onClick={toggleMenu}
                currentPath={location.pathname}
              >
                Admin
              </NavLink>
            )}

            {currentUser ? (
            <>
              <div className="flex items-center justify-between py-2 px-4">
                <NavLink to="/profile" onClick={toggleMenu} currentPath={location.pathname}>
                  Profile
                </NavLink>
                <div className="flex items-center">
                  {userProfile?.emailVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-500"  />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500"  />
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout()
                  toggleMenu()
                }}
                className="block w-full text-left py-2 px-4 text-[#48392e] dark:text-[#e0e0e0] hover:text-[#d79f63] dark:hover:text-[#b58552] transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={toggleMenu} currentPath={location.pathname}>
                Login
              </NavLink>
              <NavLink to="/register" onClick={toggleMenu} currentPath={location.pathname}>
                Sign Up
              </NavLink>
            </>
          )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const NavLink = ({
  to,
  children,
  currentPath,
  onClick,
  className = "",
}: {
  to: string;
  children: React.ReactNode;
  currentPath: string;
  onClick?: () => void;
  className?: string;
}) => {
  const isActive = currentPath === to;

  return (
    <Link
      to={to}
      className={`relative block py-2 px-4 transition duration-300 ${
        isActive
          ? "text-[#d79f63] dark:text-[#b58552] font-semibold"
          : "text-[#48392e] dark:text-[#e0e0e0] hover:text-[#d79f63] dark:hover:text-[#b58552]"
      } ${className}`}
      onClick={onClick}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="underline"
          className="absolute bottom-0 left-0 w-full h-[2px] bg-[#d79f63] dark:bg-[#b58552]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
};

export default Header;
