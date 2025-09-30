import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">🎶</span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MusicBuzz
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="nav-link">Home</a>
            <a href="#upload" className="nav-link">Upload</a>
            <a href="#about" className="nav-link">About</a>
            <Button className="btn-secondary">
              Login with Spotify
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50">
            <div className="flex flex-col space-y-4 pt-4">
              <a href="#home" className="nav-link">Home</a>
              <a href="#upload" className="nav-link">Upload</a>
              <a href="#about" className="nav-link">About</a>
              <Button className="btn-secondary w-full">
                Login with Spotify
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;