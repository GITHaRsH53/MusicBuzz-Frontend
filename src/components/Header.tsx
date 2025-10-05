// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Menu, X } from "lucide-react";

// const API_BASE = import.meta.env.VITE_API_BASE as string;          // e.g. https://musicbuzz-sigma.vercel.app
// const CALLBACK = import.meta.env.VITE_CALLBACK_URL as string;      // e.g. https://musicbuzzfrontend.vercel.app

// type WhoAmI = { authenticated: boolean; user?: { name?: string | null; email?: string | null } };

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [who, setWho] = useState<{ authenticated: boolean; name?: string | null }>({ authenticated: false });

//   useEffect(() => {
//     const ctrl = new AbortController();

//     (async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/whoami`, {
//           method: "GET",
//           credentials: "include",   // 🔑 send NextAuth cookies cross-site
//           cache: "no-store",        // avoid stale cached 'false'
//           signal: ctrl.signal,
//         });
//         const json: WhoAmI = await res.json();

//         const displayName =
//           json?.user?.name ??
//           (json?.user?.email ? json.user.email.split("@")[0] : null);

//         setWho({ authenticated: !!json?.authenticated, name: displayName });
//       } catch {
//         setWho({ authenticated: false });
//       }
//     })();

//     return () => ctrl.abort();
//   }, []);

//   const handleLogin = () => {
//     window.location.href = `${API_BASE}/api/auth/signin/spotify?callbackUrl=${encodeURIComponent(CALLBACK)}`;
//   };

//   const handleLogout = () => {
//     window.location.href = `${API_BASE}/api/auth/signout?callbackUrl=${encodeURIComponent(CALLBACK)}`;
//   };

//   return (
//     <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
//       <nav className="container mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div className="text-2xl font-bold flex items-center gap-2">
//             <span className="text-3xl">🎶</span>
//             <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               MusicBuzz
//             </span>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <a href="#home" className="nav-link">Home</a>
//             <a href="#upload" className="nav-link">Upload</a>
//             <a href="#about" className="nav-link">About</a>

//             {!who.authenticated ? (
//               <Button className="btn-secondary" onClick={handleLogin}>
//                 Login with Spotify
//               </Button>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-muted-foreground">
//                   Logged in as <strong>{who.name ?? "Spotify user"}</strong>
//                 </span>
//                 <Button variant="outline" onClick={handleLogout}>Logout</Button>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden text-foreground"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden mt-4 pb-4 border-t border-border/50">
//             <div className="flex flex-col space-y-4 pt-4">
//               <a href="#home" className="nav-link">Home</a>
//               <a href="#upload" className="nav-link">Upload</a>
//               <a href="#about" className="nav-link">About</a>

//               {!who.authenticated ? (
//                 <Button className="btn-secondary w-full" onClick={handleLogin}>
//                   Login with Spotify
//                 </Button>
//               ) : (
//                 <Button variant="outline" className="w-full" onClick={handleLogout}>
//                   Logout
//                 </Button>
//               )}
//             </div>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Header;



import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

type WhoAmI = { authenticated: boolean; user?: { name?: string | null; email?: string | null } };

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [who, setWho] = useState<{ authenticated: boolean; name?: string | null }>({
    authenticated: false,
  });

  // Ask the backend who we are (cookie stays same-origin thanks to rewrites)
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/whoami", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: ctrl.signal,
        });
        const json: WhoAmI = await res.json();

        const displayName =
          json?.user?.name ??
          (json?.user?.email ? json.user.email.split("@")[0] : null);

        setWho({ authenticated: !!json?.authenticated, name: displayName });
      } catch {
        setWho({ authenticated: false });
      }
    })();
    return () => ctrl.abort();
  }, []);

  const CALLBACK = window.location.origin; // send users back to this site

  const handleLogin = () => {
    window.location.href = `/api/auth/signin/spotify?callbackUrl=${encodeURIComponent(CALLBACK)}`;
  };

  const handleLogout = () => {
    window.location.href = `/api/auth/signout?callbackUrl=${encodeURIComponent(CALLBACK)}`;
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
                <span className="text-sm text-muted-foreground">
                  Logged in as <strong>{who.name ?? "Spotify user"}</strong>
                </span>
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
