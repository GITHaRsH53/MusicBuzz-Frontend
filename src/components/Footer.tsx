const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border/50">
      <div className="container mx-auto">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold flex items-center justify-center gap-2">
            <span className="text-3xl">🎶</span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MusicBuzz
            </span>
          </div>
          
          <p className="text-muted-foreground">
            Built with ❤️ using React, Vite, Spotify API, and modern web technologies
          </p>
          
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="nav-link">Privacy</a>
            <a href="#" className="nav-link">Terms</a>
            <a href="#" className="nav-link">Support</a>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © 2024 MusicBuzz. Transform your music experience.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;