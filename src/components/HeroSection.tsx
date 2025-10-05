"use client";

import { Button } from '@/components/ui/button';
import { Upload, FileText, Music } from 'lucide-react';
import heroImage from '@/assets/hero-illustration.jpg';

const HeroSection = () => {
  const goToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Turn Your Songs into{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Playlists
                </span>{' '}
                Instantly
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Upload a CSV or paste your songs, and MusicBuzz creates a Spotify playlist for you. 
                No more manual searching - just pure musical magic.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="btn-hero group" onClick={goToUpload}>
                <Upload className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Upload CSV
              </Button>
              <Button className="btn-secondary group" onClick={goToUpload}>
                <FileText className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Paste Text → Convert to CSV
              </Button>
            </div>

            <div className="pt-4">
              <Button className="btn-hero text-xl px-12 py-6 animate-pulse-glow" onClick={goToUpload}>
                <Music className="mr-3 h-6 w-6" />
                Create Playlist
              </Button>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Music streaming illustration with headphones and playlists" 
                className="w-full max-w-lg rounded-3xl shadow-elegant animate-float"
              />
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-float animation-delay-1">
                <Music className="text-primary-foreground" size={24} />
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-purple rounded-full flex items-center justify-center animate-float animation-delay-2">
                <span className="text-2xl">🎵</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
