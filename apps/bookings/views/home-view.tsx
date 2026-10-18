"use client";

// Copied from the live site (manziltech-pages) and restyled with ManzilTech tokens.
import { Photo } from '@/components/photo';
import { useNavigate } from '@/components/use-navigate';
import { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  Quote,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { destinations, tourPackages } from '@/data/catalog';
import { heroBadge, homeFeatures as features, homeStats as stats, testimonials, type Testimonial } from '@/data/template-claims';

export function HomeView() {
  const onNavigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  // Always in range: the index wraps with the modulo below.
  const current = testimonials[activeTestimonial] as Testimonial;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);



  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100svh-4rem)] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Photo
            loading="eager"
            src="https://images.pexels.com/photos/4784345/pexels-photo-4784345.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Tropical beach paradise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-night/80 via-night/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent" />
        </div>

        <div className="container-page relative z-10 pt-16 pb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-paper/10 backdrop-blur-md border border-white/20 mb-6 animate-fade-in-down">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-white text-sm font-medium">{heroBadge}</span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] mb-6 animate-fade-in-up">
              Discover the world,
              <br />
              <span className="text-accent">one journey</span> at a time
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed animate-fade-in-up">
              From sun-soaked beaches to snow-capped mountains, we craft unforgettable travel
              experiences tailored to your dreams. Your adventure starts here.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up">
              <button onClick={() => onNavigate('destinations')} className="btn-primary">
                Explore Destinations
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => onNavigate('packages')} className="btn-ghost">
                View Packages
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-12 max-w-4xl bg-paper/95 backdrop-blur-md rounded-lg shadow-2xl p-4 sm:p-6 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-md bg-mist transition-colors hover:bg-line">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide">Destination</label>
                  <input
                    type="text"
                    placeholder="Where to?"
                    className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-md bg-mist transition-colors hover:bg-line">
                <Calendar className="w-5 h-5 text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide">When</label>
                  <input
                    type="text"
                    placeholder="Add dates"
                    className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-md bg-mist transition-colors hover:bg-line">
                <Users className="w-5 h-5 text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide">Travelers</label>
                  <input
                    type="text"
                    placeholder="Add guests"
                    className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={() => onNavigate('packages')}
                className="btn-primary justify-center"
              >
                <Search className="w-4 h-4" />
                Search Trips
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-night py-12">
        <div className="container-page">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex p-3 rounded-lg bg-night-line mb-3 group-hover:bg-accent transition-all duration-500 group-hover:-translate-y-1">
                  <stat.icon className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                </div>
                <div className="font-display font-bold text-3xl text-white">{stat.value}</div>
                <div className="text-sm text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-paper">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label">Why Choose Us</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mb-4">
              Travel with confidence and style
            </h2>
            <p className="text-muted leading-relaxed">
              {/* TEMPLATE CLAIM */}
              We've been perfecting the art of travel for over 15 years, combining local expertise
              with world-class service to create journeys that last a lifetime.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-lg bg-mist border border-line card-hover hover:bg-paper"
              >
                <div className="inline-flex p-3 rounded-md bg-accent-tint mb-4 group-hover:bg-accent transition-all duration-500">
                  <feature.icon className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-lg text-ink mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-mist">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="section-label">Popular Destinations</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink">
                Trending this season
              </h2>
            </div>
            <button
              onClick={() => onNavigate('destinations')}
              className="flex items-center gap-2 text-accent font-semibold text-sm hover:gap-3 transition-all"
            >
              View all destinations
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.slice(0, 6).map((dest) => (
              <div
                key={dest.id}
                onClick={() => onNavigate('destinations')}
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
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-white/80 text-sm mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {dest.country}
                    </div>
                    <h3 className="font-display font-bold text-2xl text-white">{dest.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">{dest.description}</p>
                  <div className="flex items-center justify-between">
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
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Photo
            src="https://images.pexels.com/photos/27260270/pexels-photo-27260270.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Hot air balloons in Cappadocia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-night/70" />
        </div>
        <div className="container-page relative z-10 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-[0.2em] mb-3">
              Limited Time Offer
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
              {/* TEMPLATE CLAIM */}
              Up to 30% off on selected tours
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Book your dream vacation now and save big on our most popular packages. Offer ends soon!
            </p>
            <button onClick={() => onNavigate('packages')} className="btn-primary text-base px-8 py-4">
              Grab the Deal
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-paper">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="section-label">Featured Packages</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink">
                Curated travel experiences
              </h2>
            </div>
            <button
              onClick={() => onNavigate('packages')}
              className="flex items-center gap-2 text-accent font-semibold text-sm hover:gap-3 transition-all"
            >
              View all packages
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourPackages.slice(0, 3).map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => onNavigate('packages')}
                className="group cursor-pointer rounded-lg overflow-hidden bg-paper border border-line card-hover"
              >
                <div className="relative h-56 overflow-hidden">
                  <Photo
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-bold">
                    SAVE ${(pkg.originalPrice - pkg.price).toLocaleString()}
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-paper/90 backdrop-blur-sm flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                    <span className="text-xs font-bold text-ink">{pkg.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-sm text-muted mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {pkg.destination}
                  </div>
                  <h3 className="font-display font-bold text-lg text-ink mb-2 group-hover:text-accent transition-colors">
                    {pkg.title}
                  </h3>
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
                  <div className="flex items-center justify-between pt-4 border-t border-line">
                    <div>
                      <span className="text-xs text-muted line-through">${pkg.originalPrice}</span>
                      <div className="font-display font-bold text-xl text-accent">
                        ${pkg.price}
                        <span className="text-xs font-normal text-muted"> / person</span>
                      </div>
                    </div>
                    <button className="p-2.5 rounded-full bg-mist group-hover:bg-accent transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-ink-soft group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-mist">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label">Testimonials</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mb-4">
              Stories from our travelers
            </h2>
            <p className="text-muted leading-relaxed">
              {/* TEMPLATE CLAIM */}
              Don't just take our word for it. Hear from the thousands of adventurers who've
              trusted us with their dream vacations.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-paper rounded-lg shadow-xl p-8 sm:p-12">
              <Quote className="absolute top-6 right-6 w-16 h-16 text-line" />
              <div className="relative">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-lg text-ink leading-relaxed mb-8 min-h-[120px]">
                  "{current.text}"
                </p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <Photo
                      src={current.avatar}
                      alt={current.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-accent-tint"
                    />
                    <div>
                      <div className="font-display font-semibold text-ink">
                        {current.name}
                      </div>
                      <div className="text-sm text-muted">
                        {current.location}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-accent-tint text-accent text-sm font-medium">
                    {current.trip}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="p-3 rounded-full bg-paper shadow-md hover:bg-accent hover:shadow-lg transition-all duration-300 group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-ink-soft group-hover:text-white transition-colors" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeTestimonial ? 'w-8 bg-accent' : 'w-2 bg-mist'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="p-3 rounded-full bg-paper shadow-md hover:bg-accent hover:shadow-lg transition-all duration-300 group"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-ink-soft group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-paper">
        <div className="container-page">
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-accent to-accent-strong p-8 sm:p-12 lg:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-signal/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
                  Ready for your next adventure?
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  Let our travel experts craft the perfect itinerary for you. Get a free
                  consultation today and start planning the trip of a lifetime.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <button onClick={() => onNavigate('contact')} className="btn-primary bg-paper text-accent-strong hover:bg-accent-tint">
                  Get Free Consultation
                </button>
                <button onClick={() => onNavigate('packages')} className="btn-ghost">
                  Browse Packages
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
