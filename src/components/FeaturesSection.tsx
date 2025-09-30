import { Clock, Settings, Download, Zap } from 'lucide-react';

const features = [
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Save Time",
    description: "Bulk playlist creation in seconds. No more adding songs one by one."
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: "Smart Processing",
    description: "Handles messy inputs like 'artist-song' or 'song by artist' automatically."
  },
  {
    icon: <Download className="h-8 w-8" />,
    title: "CSV Export",
    description: "Get detailed reports with found/not found songs for perfect organization."
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Lightning Fast",
    description: "Powered by Spotify's API for instant playlist creation and song matching."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MusicBuzz
            </span>
            ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your music workflow with intelligent playlist creation that understands your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card text-center group"
            >
              <div className="text-primary mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;