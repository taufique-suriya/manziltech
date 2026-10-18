"use client";

// Copied from the live site (manziltech-pages) and restyled with ManzilTech tokens.
import { aboutBadge, aboutStats, milestones, team } from '@/data/template-claims';
import { Photo } from '@/components/photo';
import { useNavigate } from '@/components/use-navigate';
import {
  Compass,
  Target,
  Eye,
  Heart,
  Award,
  Leaf,
  Handshake,
  Sparkles,
} from 'lucide-react';

export function AboutView() {
  const onNavigate = useNavigate();
  const values = [
    {
      icon: Heart,
      title: 'Passion for Travel',
      desc: 'We live and breathe travel. Every recommendation comes from firsthand experience and genuine love for exploration.',
    },
    {
      icon: Handshake,
      title: 'Integrity',
      desc: 'Transparent pricing, honest advice, and no hidden fees. We build trust through every interaction.',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      desc: 'We partner with eco-conscious local providers to minimize environmental impact and support local communities.',
    },
    {
      icon: Sparkles,
      title: 'Excellence',
      desc: 'From the first call to the journey home, we obsess over every detail to deliver a flawless experience.',
    },
  ];



  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Photo
            loading="eager"
            src="https://images.pexels.com/photos/6173322/pexels-photo-6173322.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Hot air balloons Cappadocia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-night/70" />
        </div>
        <div className="container-page relative z-10 text-center">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            About ManzilTech
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 max-w-3xl mx-auto">
            We turn travel dreams into reality
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {/* TEMPLATE CLAIM */}
            For over 15 years, we've been crafting extraordinary journeys for travelers who seek
            more than just a vacation — they seek transformation.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-paper">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Photo
                  src="https://images.pexels.com/photos/8837598/pexels-photo-8837598.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Our team"
                  className="rounded-lg shadow-lg w-full h-64 object-cover"
                />
                <Photo
                  src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Team meeting"
                  className="rounded-lg shadow-lg w-full h-64 object-cover mt-8"
                />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-accent text-white px-8 py-4 rounded-lg shadow-xl flex items-center gap-3">
                <Award className="w-6 h-6" />
                <div>
                  <div className="font-display font-bold text-2xl">{aboutBadge.value}</div>
                  <div className="text-xs">{aboutBadge.label}</div>
                </div>
              </div>
            </div>
            <div>
              <span className="section-label">Our Story</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mb-6">
                From a small idea to a global adventure
              </h2>
              <div className="space-y-4 text-ink-soft leading-relaxed">
                <p>
                  {/* TEMPLATE CLAIM */}
                  ManzilTech was born in 2008 from a simple belief: travel should be effortless,
                  enriching, and deeply personal. What started as a two-person operation in a
                  tiny New York office has grown into a global travel agency serving thousands
                  of adventurers each year.
                </p>
                <p>
                  We've always believed that the best journeys are crafted by people who truly
                  understand the destinations. That's why our team consists of seasoned travelers
                  and local experts who have lived the experiences they design.
                </p>
                <p>
                  Today, we offer curated tours across 120+ destinations on six continents, each
                  one designed to deliver authentic, immersive, and unforgettable experiences.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                {aboutStats.map((stat) => (
                  <div key={stat.label} className="text-center p-4 rounded-md bg-mist">
                    <stat.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                    <div className="font-display font-bold text-2xl text-ink">{stat.value}</div>
                    <div className="text-xs text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-mist">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-lg bg-paper shadow-md">
              <div className="inline-flex p-3 rounded-md bg-accent-tint mb-4">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-bold text-2xl text-ink mb-3">Our Mission</h3>
              <p className="text-ink-soft leading-relaxed">
                To create transformative travel experiences that connect people with the world's
                most extraordinary places, cultures, and communities — while making travel
                planning effortless and enjoyable for everyone.
              </p>
            </div>
            <div className="p-8 rounded-lg bg-paper shadow-md">
              <div className="inline-flex p-3 rounded-md bg-accent-tint mb-4">
                <Eye className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-bold text-2xl text-ink mb-3">Our Vision</h3>
              <p className="text-ink-soft leading-relaxed">
                To be the world's most trusted travel partner, inspiring a global community of
                passionate travelers who explore responsibly and return home with stories that
                last a lifetime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-paper">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label">Our Values</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mb-4">
              What we stand for
            </h2>
            <p className="text-muted leading-relaxed">
              These core values guide every decision we make and every journey we craft.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="group p-6 rounded-lg bg-mist border border-line card-hover hover:bg-paper">
                <div className="inline-flex p-3 rounded-md bg-accent-tint mb-4 group-hover:bg-accent transition-all duration-500">
                  <value.icon className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-lg text-ink mb-2">{value.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-mist">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label">Our Journey</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mb-4">
              Milestones along the way
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white font-display font-bold text-sm shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {m.year}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-line my-2" />
                  )}
                </div>
                <div className="pb-12 pt-3">
                  <h3 className="font-display font-semibold text-lg text-ink mb-1">{m.title}</h3>
                  <p className="text-muted leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-paper">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label">Meet the Team</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mb-4">
              The people behind your adventures
            </h2>
            <p className="text-muted leading-relaxed">
              Our team of travel enthusiasts brings decades of combined experience and a shared
              passion for creating unforgettable journeys.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="group text-center">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <Photo
                    src={member.image}
                    alt={member.name}
                    className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="font-display font-semibold text-lg text-ink">{member.name}</h3>
                <p className="text-sm text-accent font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-mist">
        <div className="container-page">
          <div className="bg-gradient-to-br from-night to-night rounded-lg p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <Compass className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="font-display font-bold text-3xl text-white mb-4">
                Let's plan your next journey together
              </h2>
              <p className="text-night-text max-w-xl mx-auto mb-8">
                {/* TEMPLATE CLAIM */}
                Join thousands of travelers who've trusted us to create their dream vacations.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => onNavigate('contact')} className="btn-primary">
                  Get in Touch
                </button>
                <button onClick={() => onNavigate('destinations')} className="btn-ghost">
                  Explore Destinations
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
