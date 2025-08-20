import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"

const Header = ({ className, ...props }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/library?search=${encodeURIComponent(query)}`)
    }
  }

const navigationItems = [
    { label: "Home", path: "/", icon: "Home" },
    { label: "Library", path: "/library", icon: "BookOpen" },
    { label: "My Progress", path: "/progress", icon: "TrendingUp" },
    { label: "Premium", path: "/premium", icon: "Crown" },
    { label: "Admin", path: "/admin", icon: "Shield" }
  ]

  return (
    <header className={cn("bg-white border-b border-gray-200 sticky top-0 z-50", className)} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
              <ApperIcon name="Stethoscope" className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-text-primary">MedNotes</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent ml-1">
                Pro
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                  location.pathname === item.path
                    ? "text-primary bg-primary/5"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface"
                )}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-sm mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface transition-colors"
          >
            <ApperIcon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              className="w-6 h-6 text-text-primary" 
            />
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                  location.pathname === item.path
                    ? "text-primary bg-primary/5"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface"
                )}
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header