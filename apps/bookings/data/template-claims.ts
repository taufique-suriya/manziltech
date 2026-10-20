// TEMPLATE CLAIMS, copied as-is from the live site (manziltech-pages) on the owner's request.
// None of these are verified facts about ManzilTech: awards, years, traveller counts,
// ratings, team members, testimonials, address and phone numbers come from the Bolt template.
// Replace or remove every item in this file before Bookings goes live.
// Inline claims in the views are marked with a "TEMPLATE CLAIM" comment.

import { contacts, emergency, telHref, whatsappHref } from "@manziltech/ui";
import {
  Award,
  Clock,
  Globe2,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  Shield,
  Star,
  Users,
} from "lucide-react";

export const heroBadge = "Rated #1 Travel Agency 2025";

export const homeStats = [
  { icon: Globe2, value: "120+", label: "Destinations" },
  { icon: Users, value: "50K+", label: "Happy Travelers" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: Star, value: "4.9", label: "Average Rating" },
];

export const homeFeatures = [
  {
    icon: Shield,
    title: "Safe & Secure",
    desc: "Travel with confidence knowing every detail is covered by our comprehensive protection plans.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our travel experts are available around the clock to assist you wherever you are in the world.",
  },
  {
    icon: Award,
    title: "Award Winning",
    desc: "Recognized by Travel Weekly and Conde Nast as a top travel agency for 5 consecutive years.",
  },
  {
    icon: Plane,
    title: "Curated Experiences",
    desc: "Every itinerary is hand-crafted by local experts to deliver authentic, unforgettable journeys.",
  },
];

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  trip: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Mitchell",
    location: "London, UK",
    avatar: "https://images.pexels.com/photos/7968284/pexels-photo-7968284.jpeg?auto=compress&cs=tinysrgb&h=200&w=200",
    rating: 5,
    text: "Absolutely the best travel experience of my life. Every detail was perfectly planned, from the hotels to the excursions. I felt cared for every step of the way.",
    trip: "Greek Island Hopper",
  },
  {
    id: "t2",
    name: "James Chen",
    location: "Toronto, Canada",
    avatar: "https://images.pexels.com/photos/7968298/pexels-photo-7968298.jpeg?auto=compress&cs=tinysrgb&h=200&w=200",
    rating: 5,
    text: "The Bali retreat exceeded all expectations. The spiritual journey, the food, the people - everything was magical. Already booking my next trip!",
    trip: "Bali Spiritual Retreat",
  },
  {
    id: "t3",
    name: "Emma Rodriguez",
    location: "Sydney, Australia",
    avatar: "https://images.pexels.com/photos/4881151/pexels-photo-4881151.jpeg?auto=compress&cs=tinysrgb&h=200&w=200",
    rating: 5,
    text: "ManzilTech made our honeymoon absolutely unforgettable. The attention to detail and personalized service made us feel like royalty.",
    trip: "Maldives Luxury Escape",
  },
  {
    id: "t4",
    name: "Michael Brown",
    location: "New York, USA",
    avatar: "https://images.pexels.com/photos/4901940/pexels-photo-4901940.jpeg?auto=compress&cs=tinysrgb&h=200&w=200",
    rating: 5,
    text: "The safari expedition was a dream come true. Seeing the Big Five in their natural habitat was a life-changing experience. Highly recommend!",
    trip: "African Safari Expedition",
  },
];

export const aboutStats = [
  { icon: Globe2, value: "120+", label: "Destinations" },
  { icon: Users, value: "50K+", label: "Travelers" },
  { icon: Award, value: "25+", label: "Awards" },
];

export const aboutBadge = { value: "15+", label: "Years of Excellence" };

export const milestones = [
  { year: "2008", title: "The Beginning", desc: "Founded in New York by two passionate travelers with a vision to redefine travel planning." },
  { year: "2012", title: "Going Global", desc: "Expanded to serve 50+ countries with a network of local guides and partners worldwide." },
  { year: "2017", title: "Award Recognition", desc: 'Named "Best Travel Agency" by Travel Weekly for the first of five consecutive years.' },
  { year: "2021", title: "Sustainable Travel", desc: "Launched our Green Travel initiative, committing to carbon-neutral tour options." },
  { year: "2025", title: "50,000 Travelers", desc: "Surpassed 50,000 happy travelers and counting, with a 98% satisfaction rate." },
];

export const team = [
  { name: "Elena Vasquez", role: "Founder & CEO", image: "https://images.pexels.com/photos/7968284/pexels-photo-7968284.jpeg?auto=compress&cs=tinysrgb&h=400&w=400" },
  { name: "Marcus Chen", role: "Head of Operations", image: "https://images.pexels.com/photos/7968298/pexels-photo-7968298.jpeg?auto=compress&cs=tinysrgb&h=400&w=400" },
  { name: "Sophie Laurent", role: "Lead Travel Designer", image: "https://images.pexels.com/photos/4881151/pexels-photo-4881151.jpeg?auto=compress&cs=tinysrgb&h=400&w=400" },
  { name: "Amara Johnson", role: "Customer Experience", image: "https://images.pexels.com/photos/4901940/pexels-photo-4901940.jpeg?auto=compress&cs=tinysrgb&h=400&w=400" },
];

// Phone, WhatsApp and email come from the central contact config (packages/ui/src/contact.ts).
export const phone = { display: contacts.bookings.phone.display, href: telHref(contacts.bookings.phone) };
export const whatsapp = { display: contacts.bookings.whatsapp.display, href: whatsappHref(contacts.bookings.whatsapp) };
export const emergencyPhone = { display: emergency.display, href: telHref(emergency) };
export const address = ["123 Adventure Plaza", "New York, NY 10001"];
export const emails = contacts.bookings.emails;

export const contactInfo = [
  { icon: MapPin, title: "Visit Us", lines: address },
  { icon: Phone, title: "Call Us", href: phone.href, lines: [phone.display, "Mon-Sat, 9am-7pm EST"] },
  { icon: MessageCircle, title: "WhatsApp", href: whatsapp.href, lines: [whatsapp.display, "Message us on WhatsApp"] },
  { icon: Mail, title: "Email Us", href: `mailto:${emails[0] ?? ""}`, lines: emails },
  { icon: Clock, title: "Office Hours", lines: ["Mon-Fri: 9am-7pm", "Sat-Sun: 10am-5pm"] },
];

export const whyReachOut = [
  "Free, no-obligation travel consultation",
  "Custom itineraries tailored to your preferences",
  "Expert advice from seasoned travelers",
  "Best price guarantee on all packages",
  "24/7 support during your trip",
];

export const footerTagline = "Crafting unforgettable travel experiences since 2008. Your journey, our passion.";
export const footerCopyright = "ManzilTech Travel Agency. All rights reserved.";
