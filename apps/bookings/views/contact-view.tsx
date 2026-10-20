"use client";

// Copied from the live site (manziltech-pages) and restyled with ManzilTech tokens.
import { contactInfo, emergencyPhone, whyReachOut } from '@/data/template-claims';
import { limits, validateDate, validateEmail, validateMessage, validateMobile, validateName } from '@manziltech/validation';
import { Photo } from '@/components/photo';
import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  MessageSquare,
  User,
  Calendar,
} from 'lucide-react';

export function ContactView() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    date: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Central rules (packages/validation); the same wording is used on every form.
  const check = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        return validateName(value) ?? undefined;
      case 'email':
        return validateEmail(value) ?? undefined;
      case 'phone':
        return validateMobile(value, { required: false }) ?? undefined;
      case 'date':
        return validateDate(value, { label: 'the travel date', required: false, notBefore: new Date().toISOString().slice(0, 10) }) ?? undefined;
      case 'message':
        return validateMessage(value) ?? undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: check(name, value) });
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setErrors({ ...errors, [e.target.name]: check(e.target.name, e.target.value) });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found: Record<string, string | undefined> = {};
    for (const name of ['name', 'email', 'phone', 'date', 'message'] as const) found[name] = check(name, form[name]);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', phone: '', destination: '', date: '', message: '' });
    }, 4000);
  };


  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Photo
            loading="eager"
            src="https://images.pexels.com/photos/6899674/pexels-photo-6899674.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Swiss alps lake"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-night/70" />
        </div>
        <div className="container-page relative z-10 text-center">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Get in Touch
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
            Let's start planning your trip
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Have questions or ready to book? Our travel experts are here to help you craft the
            {/* TEMPLATE CLAIM */}
            perfect adventure. Reach out and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-paper">
        <div className="container-page">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {contactInfo.map((info, i) => {
              const Wrapper = "href" in info && info.href ? "a" : "div";
              return (
              <Wrapper key={i} {...("href" in info && info.href ? { href: info.href } : {})} className="group p-6 rounded-lg bg-mist border border-line card-hover hover:bg-paper text-center">
                <div className="inline-flex p-3 rounded-md bg-accent-tint mb-4 group-hover:bg-accent transition-all duration-500 mx-auto">
                  <info.icon className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-lg text-ink mb-2">{info.title}</h3>
                {info.lines.map((line, j) => (
                  <p key={j} className="text-sm text-muted">{line}</p>
                ))}
              </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="pb-20 bg-paper">
        <div className="container-page">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3 p-8 rounded-lg bg-mist border border-line">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-md bg-accent">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-ink">Send us a message</h2>
                  {/* TEMPLATE CLAIM */}
                  <p className="text-sm text-muted">We'll get back to you within 24 hours</p>
                </div>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                  <div className="p-4 rounded-full bg-brand-tint mb-4">
                    <CheckCircle2 className="w-12 h-12 text-brand" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-ink mb-2">Message Sent!</h3>
                  <p className="text-muted">Thank you for reaching out. We'll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={limits.name.max}
                          placeholder="John Doe"
                          className="w-full pl-11 pr-4 py-3 rounded-md bg-paper border border-line text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-tint transition-all"
                        />
                      </div>
                      {errors.name && <p role="alert" className="mt-1.5 text-xs font-medium text-danger">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={limits.email}
                          placeholder="john@example.com"
                          className="w-full pl-11 pr-4 py-3 rounded-md bg-paper border border-line text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-tint transition-all"
                        />
                      </div>
                      {errors.email && <p role="alert" className="mt-1.5 text-xs font-medium text-danger">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={20}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-11 pr-4 py-3 rounded-md bg-paper border border-line text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-tint transition-all"
                        />
                      </div>
                      {errors.phone && <p role="alert" className="mt-1.5 text-xs font-medium text-danger">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">Travel Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                          type="date"
                          name="date"
                          value={form.date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          min={new Date().toISOString().slice(0, 10)}
                          className="w-full pl-11 pr-4 py-3 rounded-md bg-paper border border-line text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-tint transition-all"
                        />
                      </div>
                      {errors.date && <p role="alert" className="mt-1.5 text-xs font-medium text-danger">{errors.date}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Destination of Interest</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <select
                        name="destination"
                        value={form.destination}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-md bg-paper border border-line text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-tint transition-all appearance-none"
                      >
                        <option value="">Select a destination</option>
                        <option value="santorini">Santorini, Greece</option>
                        <option value="bali">Bali, Indonesia</option>
                        <option value="swiss-alps">Swiss Alps, Switzerland</option>
                        <option value="kyoto">Kyoto, Japan</option>
                        <option value="dubai">Dubai, UAE</option>
                        <option value="paris">Paris, France</option>
                        <option value="safari">African Safari, Kenya</option>
                        <option value="maldives">Maldives</option>
                        <option value="other">Other / Not sure yet</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Your Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={limits.message.max}
                      rows={5}
                      placeholder="Tell us about your dream trip..."
                      className="w-full px-4 py-3 rounded-md bg-paper border border-line text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-tint transition-all resize-none"
                    />
                    {errors.message && <p role="alert" className="mt-1.5 text-xs font-medium text-danger">{errors.message}</p>}
                  </div>
                  <button type="submit" className="btn-primary w-full text-base py-4">
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Map + Quick Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-lg overflow-hidden shadow-lg h-64">
                <iframe
                  title="ManzilTech Office Location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-74.01%2C40.74%2C-73.99%2C40.76&layer=mapnik&marker=40.75%2C-74.00"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-accent to-accent-strong text-white">
                <h3 className="font-display font-bold text-xl mb-4">Why reach out to us?</h3>
                <ul className="space-y-3">
                  {whyReachOut.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-accent-tint shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-lg bg-night text-white">
                <h3 className="font-display font-bold text-lg mb-2">Travel Emergency?</h3>
                <p className="text-sm text-muted mb-4">
                  Already on a trip and need urgent assistance? Call our 24/7 hotline.
                </p>
                <a
                  href={emergencyPhone.href}
                  className="flex items-center gap-2 text-accent font-semibold hover:text-accent-tint transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {emergencyPhone.display}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
