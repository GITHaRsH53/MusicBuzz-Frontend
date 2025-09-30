import { useEffect, useState } from 'react';

const musicPlatforms = [
  { name: 'Spotify', emoji: '🟢', color: '#1DB954' },
  { name: 'Apple Music', emoji: '🍎', color: '#FA243C' },
  { name: 'YouTube Music', emoji: '📺', color: '#FF0000' },
  { name: 'SoundCloud', emoji: '☁️', color: '#FF5500' },
  { name: 'Deezer', emoji: '🎵', color: '#FEAA2D' },
  { name: 'Tidal', emoji: '🌊', color: '#0F0F0F' },
];

interface FloatingIcon {
  id: number;
  platform: typeof musicPlatforms[0];
  left: number;
  delay: number;
  size: number;
}

const FloatingIcons = () => {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    const generateIcons = () => {
      const newIcons: FloatingIcon[] = [];
      for (let i = 0; i < 8; i++) {
        newIcons.push({
          id: i,
          platform: musicPlatforms[Math.floor(Math.random() * musicPlatforms.length)],
          left: Math.random() * 100, // Random position across screen width
          delay: Math.random() * 15, // Random delay up to 15 seconds
          size: 30 + Math.random() * 20, // Random size between 30-50px
        });
      }
      setIcons(newIcons);
    };

    generateIcons();
    
    // Regenerate icons every 15 seconds to keep the animation fresh
    const interval = setInterval(generateIcons, 15000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute animate-fall opacity-20 hover:opacity-40 transition-opacity"
          style={{
            left: `${icon.left}%`,
            animationDelay: `${icon.delay}s`,
            fontSize: `${icon.size}px`,
          }}
        >
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full backdrop-blur-sm border border-white/10"
            style={{
              background: `${icon.platform.color}20`,
              boxShadow: `0 0 20px ${icon.platform.color}30`,
            }}
          >
            <span className="text-2xl">{icon.platform.emoji}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingIcons;
