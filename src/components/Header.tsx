import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE as string;
const CALLBACK = import.meta.env.VITE_CALLBACK_URL as string;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [who, setWho] = useState<{ authenticated: boolean; name?: string | null }>({ authenticated: false });

  // Ask backend who we are (uses next-auth cookie on backend domain)
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/whoami`, {
          credentials: "include", // VERY IMPORTANT
        });
        const json = await res.json();
        setWho(json);
      } catch {
        setWho({ authenticated: false });
      }
    };
    run();
  }, []);

  const handleLogin = () => {
    window.location.href = `${API_BASE}/api/auth/signin/spotify?callbackUrl=${encodeURIComponent(CALLBACK)}`;
  };

  const handleLogout = () => {
    window.location.href = `${API_BASE}/api/auth/signout?callbackUrl=${encodeURIComponent(CALLBACK)}`;
  };

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

            {!who.authenticated ? (
              <Button className="btn-secondary" onClick={handleLogin}>
                Login with Spotify
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Logged in as <strong>{who.name ?? "Spotify user"}</strong></span>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </div>
            )}
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

              {!who.authenticated ? (
                <Button className="btn-secondary w-full" onClick={handleLogin}>
                  Login with Spotify
                </Button>
              ) : (
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
