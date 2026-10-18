"use client";

// Copied from the live site (manziltech-pages) and restyled with ManzilTech tokens.
import { Photo } from '@/components/photo';
import { useNavigate } from '@/components/use-navigate';
import { useState, useMemo } from 'react';
import {
  Star,
  Calendar,
  Users,
  MapPin,
  Check,
  ArrowRight,
  CheckCircle2,
  X,
  Search,
} from 'lucide-react';
import { tourPackages } from '@/data/catalog';

const categories = ['All', 'Romance', 'Adventure', 'Culture', 'Luxury', 'Wellness'];

export function PackagesView() {
  const onNavigate = useNavigate();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<typeof tourPackages[0] | null>(null);

  const filtered = useMemo(() => {
    return tourPackages.filter((pkg) => {
      const matchCategory = category === 'All' || pkg.category === category;
      const matchSearch =
        search === '' ||
        pkg.title.toLowerCase().includes(search.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [category, search]);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Photo
            loading="eager"
            src="https://images.pexels.com/photos/1287455/pexels-photo-1287455.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Maldives overwater bungalows"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-night/70" />
        </div>
        <div className="container-page relative z-10 text-center">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Tour Packages
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
            All-inclusive travel packages
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Hand-crafted itineraries with everything included — flights, hotels, tours, and
            unforgettable experiences. Just pack your bags and go.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 bg-paper/95 backdrop-blur-md shadow-md py-4">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    category === cat
                      ? 'bg-accent text-white shadow-md shadow-accent/30'
                      : 'bg-mist text-ink-soft hover:bg-line'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search packages..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-mist border border-line text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-tint transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-12 bg-mist min-h-screen">
        <div className="container-page">
          <p className="text-sm text-muted mb-8">
            Showing <span className="font-semibold text-ink">{filtered.length}</span> package{filtered.length !== 1 ? 's' : ''}
            {category !== 'All' && ` in ${category}`}
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group rounded-lg overflow-hidden bg-paper border border-line card-hover flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => setSelectedPackage(pkg)}>
                    <Photo
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night/40 to-transparent" />
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-bold">
                      SAVE ${(pkg.originalPrice - pkg.price).toLocaleString()}
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-paper/90 backdrop-blur-sm flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                      <span className="text-xs font-bold text-ink">{pkg.rating}</span>
                      <span className="text-xs text-muted">({pkg.reviews})</span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-paper/90 backdrop-blur-sm text-xs font-bold text-accent">
                        {pkg.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 text-sm text-muted mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {pkg.destination}
                    </div>
                    <h3
                      className="font-display font-bold text-lg text-ink mb-2 cursor-pointer hover:text-accent transition-colors"
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      {pkg.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">{pkg.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {pkg.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {pkg.groupSize}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {pkg.highlights.slice(0, 3).map((h) => (
                        <span key={h} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-mist text-xs font-medium text-muted">
                          <Check className="w-3 h-3 text-accent" />
                          {h}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-line mt-auto">
                      <div>
                        <span className="text-xs text-muted line-through">${pkg.originalPrice}</span>
                        <div className="font-display font-bold text-xl text-accent">
                          ${pkg.price}
                          <span className="text-xs font-normal text-muted"> / person</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className="px-4 py-2.5 rounded-full bg-night-line text-white text-sm font-semibold hover:bg-accent transition-all duration-300 flex items-center gap-1.5 group-hover:gap-2"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-16 h-16 text-muted mb-4" />
              <h3 className="font-display font-semibold text-xl text-ink mb-2">No packages found</h3>
              <p className="text-muted mb-6">Try a different category or search term.</p>
              <button onClick={() => { setCategory('All'); setSearch(''); }} className="btn-secondary">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedPackage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedPackage(null)}
        >
          <div
            className="bg-paper rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 overflow-hidden rounded-t-lg">
              <Photo
                src={selectedPackage.image}
                alt={selectedPackage.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
              <button
                onClick={() => setSelectedPackage(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-paper/90 backdrop-blur-sm hover:bg-paper transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-ink" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-3 py-1 rounded-full bg-accent text-white text-xs font-bold mb-2 inline-block">
                  {selectedPackage.category}
                </span>
                <h2 className="font-display font-bold text-2xl text-white">{selectedPackage.title}</h2>
                <div className="flex items-center gap-1.5 text-white/80 text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  {selectedPackage.destination}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-line">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent-tint">
                    <Calendar className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-muted">Duration</div>
                    <div className="text-sm font-semibold text-ink">{selectedPackage.duration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent-tint">
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-muted">Group Size</div>
                    <div className="text-sm font-semibold text-ink">{selectedPackage.groupSize}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent-tint">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-muted">Rating</div>
                    <div className="text-sm font-semibold text-ink">{selectedPackage.rating} ({selectedPackage.reviews} reviews)</div>
                  </div>
                </div>
              </div>

              <p className="text-ink-soft leading-relaxed mb-6">{selectedPackage.description}</p>

              <h3 className="font-display font-semibold text-lg text-ink mb-4">Package Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {selectedPackage.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 p-3 rounded-md bg-mist">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-sm text-ink">{h}</span>
                  </div>
                ))}
              </div>

              <h3 className="font-display font-semibold text-lg text-ink mb-4">What's Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {[
                  'Accommodation in 4-star hotels',
                  'Daily breakfast & select meals',
                  'All ground transportation',
                  'Expert local guide',
                  'Entrance fees to attractions',
                  '24/7 travel support',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-brand shrink-0" />
                    <span className="text-sm text-ink-soft">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-6 rounded-lg bg-mist">
                <div>
                  <div className="text-sm text-muted">Starting from</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg text-muted line-through">${selectedPackage.originalPrice}</span>
                    <span className="font-display font-bold text-3xl text-accent">${selectedPackage.price}</span>
                    <span className="text-sm text-muted">/ person</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedPackage(null);
                    onNavigate('contact');
                  }}
                  className="btn-primary"
                >
                  Book This Trip
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
