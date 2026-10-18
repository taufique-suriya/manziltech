"use client";

// Copied from the live site (manziltech-pages) and restyled with ManzilTech tokens.
import { Photo } from '@/components/photo';
import { useNavigate } from '@/components/use-navigate';
import { useState, useMemo } from 'react';
import {
  MapPin,
  Star,
  Calendar,
  Search,
  Filter,
  X,
  ArrowRight,
  Globe2,
} from 'lucide-react';
import { destinations } from '@/data/catalog';

const regions = ['All', 'Europe', 'Asia', 'Middle East', 'Africa', 'North America'];
const allTags = ['Beach', 'Mountain', 'Culture', 'Adventure', 'Luxury', 'Romance', 'Nature', 'City', 'Wildlife', 'Heritage', 'Unique', 'Shopping', 'Wellness'];

export function DestinationsView() {
  const onNavigate = useNavigate();
  const [region, setRegion] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filtered = useMemo(() => {
    let result = destinations.filter((d) => {
      const matchRegion = region === 'All' || d.region === region;
      const matchTags = selectedTags.length === 0 || selectedTags.every((t) => d.tags.includes(t));
      const matchSearch =
        search === '' ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.country.toLowerCase().includes(search.toLowerCase());
      return matchRegion && matchTags && matchSearch;
    });

    if (sortBy === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [region, selectedTags, search, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Photo
            loading="eager"
            src="https://images.pexels.com/photos/16226403/pexels-photo-16226403.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Kyoto cherry blossoms"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-night/70" />
        </div>
        <div className="container-page relative z-10 text-center">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Explore the World
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
            Discover your next destination
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            From ancient temples to pristine beaches, explore our handpicked collection of
            extraordinary destinations around the globe.
          </p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-16 z-30 bg-paper/95 backdrop-blur-md shadow-md py-4">
        <div className="container-page">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destinations or countries..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-mist border border-line text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-tint transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Sort:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-full bg-mist border border-line text-sm text-ink focus:outline-none focus:border-accent transition-all cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  region === r
                    ? 'bg-accent text-white shadow-md shadow-accent/30'
                    : 'bg-mist text-ink-soft hover:bg-line'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Tag Filters */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 border ${
                  selectedTags.includes(tag)
                    ? 'bg-accent text-white border-accent'
                    : 'bg-paper text-muted border-line hover:border-signal hover:text-accent'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-mist min-h-screen">
        <div className="container-page">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-muted">
              Showing <span className="font-semibold text-ink">{filtered.length}</span> destination{filtered.length !== 1 ? 's' : ''}
              {region !== 'All' && ` in ${region}`}
            </p>
            {(selectedTags.length > 0 || search || region !== 'All') && (
              <button
                onClick={() => {
                  setSelectedTags([]);
                  setSearch('');
                  setRegion('All');
                }}
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-strong font-medium"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => onNavigate('packages')}
                  className="group cursor-pointer rounded-lg overflow-hidden bg-paper shadow-md card-hover"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Photo
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-paper/90 backdrop-blur-sm flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                      <span className="text-xs font-bold text-ink">{dest.rating}</span>
                    </div>
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-bold">
                      {dest.region}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-1.5 text-white/80 text-sm mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {dest.country}
                      </div>
                      <h3 className="font-display font-bold text-2xl text-white">{dest.name}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2">{dest.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {dest.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-full bg-mist text-xs font-medium text-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-line">
                      <div>
                        <span className="text-xs text-muted">From</span>
                        <div className="font-display font-bold text-xl text-ink">
                          ${dest.price}
                          <span className="text-xs font-normal text-muted"> / person</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted">
                        <Calendar className="w-4 h-4" />
                        {dest.duration}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Globe2 className="w-16 h-16 text-muted mb-4" />
              <h3 className="font-display font-semibold text-xl text-ink mb-2">No destinations found</h3>
              <p className="text-muted mb-6">Try adjusting your filters or search terms.</p>
              <button
                onClick={() => {
                  setSelectedTags([]);
                  setSearch('');
                  setRegion('All');
                }}
                className="btn-secondary"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* CTA */}
          {filtered.length > 0 && (
            <div className="mt-16 text-center bg-paper rounded-lg p-8 sm:p-12 shadow-md">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-muted mb-6 max-w-xl mx-auto">
                {/* TEMPLATE CLAIM */}
                We offer custom itineraries to 120+ destinations worldwide. Let us craft a
                personalized journey just for you.
              </p>
              <button onClick={() => onNavigate('contact')} className="btn-primary">
                Request Custom Trip
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
