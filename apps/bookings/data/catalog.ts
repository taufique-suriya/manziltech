// Destinations and tour packages copied from the live site (manziltech-pages).
// TEMPLATE CLAIM: prices (USD), ratings, review counts and "original" prices are template values. Replace before launch.

export type Destination = {
  id: string;
  name: string;
  country: string;
  region: string;
  image: string;
  price: number;
  duration: string;
  rating: number;
  description: string;
  tags: string[];
};

export const destinations: Destination[] = [
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1899,
    duration: '7 days',
    rating: 4.9,
    description: 'Whitewashed buildings, blue-domed churches, and stunning sunsets over the Aegean Sea await you on this iconic island getaway.',
    tags: ['Beach', 'Romance', 'Culture'],
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    image: 'https://images.pexels.com/photos/36810327/pexels-photo-36810327.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1299,
    duration: '10 days',
    rating: 4.8,
    description: 'Lush rice terraces, ancient temples, and vibrant culture make Bali a tropical paradise for the soul-seeking traveler.',
    tags: ['Nature', 'Culture', 'Adventure'],
  },
  {
    id: 'swiss-alps',
    name: 'Swiss Alps',
    country: 'Switzerland',
    region: 'Europe',
    image: 'https://images.pexels.com/photos/6899674/pexels-photo-6899674.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 2499,
    duration: '6 days',
    rating: 4.9,
    description: 'Snow-capped peaks, crystal-clear lakes, and charming alpine villages create a breathtaking mountain experience.',
    tags: ['Mountain', 'Nature', 'Luxury'],
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    region: 'Asia',
    image: 'https://images.pexels.com/photos/16226263/pexels-photo-16226263.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 2199,
    duration: '8 days',
    rating: 4.9,
    description: 'Step into ancient Japan with cherry blossoms, serene temples, and traditional tea ceremonies in the cultural heart of Japan.',
    tags: ['Culture', 'Heritage', 'Nature'],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    image: 'https://images.pexels.com/photos/28350363/pexels-photo-28350363.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1799,
    duration: '5 days',
    rating: 4.7,
    description: 'Experience ultramodern luxury, world-class shopping, and desert adventures in the most glamorous city of the Middle East.',
    tags: ['Luxury', 'City', 'Adventure'],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    image: 'https://images.pexels.com/photos/14681748/pexels-photo-14681748.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1499,
    duration: '5 days',
    rating: 4.8,
    description: 'The City of Light welcomes you with iconic landmarks, world-renowned cuisine, and an unmistakable sense of romance.',
    tags: ['City', 'Romance', 'Culture'],
  },
  {
    id: 'safari',
    name: 'African Safari',
    country: 'Kenya',
    region: 'Africa',
    image: 'https://images.pexels.com/photos/13129167/pexels-photo-13129167.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 2999,
    duration: '12 days',
    rating: 5.0,
    description: 'Witness the majesty of African wildlife up close on an unforgettable safari adventure across the savanna.',
    tags: ['Adventure', 'Nature', 'Wildlife'],
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    region: 'Asia',
    image: 'https://images.pexels.com/photos/1287455/pexels-photo-1287455.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 2799,
    duration: '7 days',
    rating: 4.9,
    description: 'Overwater bungalows, turquoise lagoons, and pristine coral reefs define the ultimate tropical luxury escape.',
    tags: ['Beach', 'Luxury', 'Romance'],
  },
  {
    id: 'cappadocia',
    name: 'Cappadocia',
    country: 'Turkey',
    region: 'Middle East',
    image: 'https://images.pexels.com/photos/27260270/pexels-photo-27260270.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1399,
    duration: '5 days',
    rating: 4.8,
    description: 'Float above fairy chimneys in a hot air balloon at sunrise and explore ancient cave dwellings in this otherworldly landscape.',
    tags: ['Adventure', 'Culture', 'Nature'],
  },
  {
    id: 'new-york',
    name: 'New York City',
    country: 'USA',
    region: 'North America',
    image: 'https://images.pexels.com/photos/6108477/pexels-photo-6108477.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1699,
    duration: '5 days',
    rating: 4.7,
    description: 'The city that never sleeps offers iconic landmarks, Broadway shows, world-class dining, and endless energy.',
    tags: ['City', 'Culture', 'Shopping'],
  },
  {
    id: 'iceland',
    name: 'Iceland',
    country: 'Iceland',
    region: 'Europe',
    image: 'https://images.pexels.com/photos/31291321/pexels-photo-31291321.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 2299,
    duration: '8 days',
    rating: 4.9,
    description: 'Chase the Northern Lights, explore volcanic landscapes, and relax in geothermal hot springs in the land of fire and ice.',
    tags: ['Nature', 'Adventure', 'Unique'],
  },
  {
    id: 'tropical-beach',
    name: 'Hidden Beaches',
    country: 'Thailand',
    region: 'Asia',
    image: 'https://images.pexels.com/photos/17000396/pexels-photo-17000396.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 999,
    duration: '10 days',
    rating: 4.7,
    description: 'Discover secluded tropical beaches, crystal-clear waters, and vibrant marine life on this island-hopping adventure.',
    tags: ['Beach', 'Adventure', 'Nature'],
  },
];

export type TourPackage = {
  id: string;
  title: string;
  destination: string;
  image: string;
  price: number;
  originalPrice: number;
  duration: string;
  groupSize: string;
  rating: number;
  reviews: number;
  highlights: string[];
  description: string;
  category: string;
};

export const tourPackages: TourPackage[] = [
  {
    id: 'greek-island-hopper',
    title: 'Greek Island Hopper',
    destination: 'Santorini, Greece',
    image: 'https://images.pexels.com/photos/33851769/pexels-photo-33851769.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1899,
    originalPrice: 2399,
    duration: '7 days / 6 nights',
    groupSize: 'Max 12 people',
    rating: 4.9,
    reviews: 248,
    highlights: ['Sunset in Oia', 'Caldera cruise', 'Wine tasting', 'Volcanic hot springs'],
    description: 'Island-hop through the Cyclades on a curated journey of whitewashed villages, volcanic beaches, and Mediterranean cuisine.',
    category: 'Romance',
  },
  {
    id: 'bali-spiritual-retreat',
    title: 'Bali Spiritual Retreat',
    destination: 'Bali, Indonesia',
    image: 'https://images.pexels.com/photos/7980413/pexels-photo-7980413.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1299,
    originalPrice: 1699,
    duration: '10 days / 9 nights',
    groupSize: 'Max 10 people',
    rating: 4.8,
    reviews: 187,
    highlights: ['Rice terrace trek', 'Temple ceremonies', 'Yoga sessions', 'Traditional cooking class'],
    description: 'Reconnect with nature and spirit on a transformative journey through Bali\'s most sacred sites and serene landscapes.',
    category: 'Wellness',
  },
  {
    id: 'alpine-explorer',
    title: 'Alpine Explorer',
    destination: 'Swiss Alps, Switzerland',
    image: 'https://images.pexels.com/photos/34125830/pexels-photo-34125830.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 2499,
    originalPrice: 2999,
    duration: '6 days / 5 nights',
    groupSize: 'Max 8 people',
    rating: 4.9,
    reviews: 156,
    highlights: ['Glacier express train', 'Mountain cable car', 'Lakeside dining', 'Chocolate factory tour'],
    description: 'Journey through the majestic Swiss Alps with scenic rail rides, alpine villages, and breathtaking mountain vistas.',
    category: 'Adventure',
  },
  {
    id: 'kyoto-cultural-immersion',
    title: 'Kyoto Cultural Immersion',
    destination: 'Kyoto, Japan',
    image: 'https://images.pexels.com/photos/2793733/pexels-photo-2793733.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 2199,
    originalPrice: 2599,
    duration: '8 days / 7 nights',
    groupSize: 'Max 10 people',
    rating: 4.9,
    reviews: 203,
    highlights: ['Tea ceremony', 'Kimono experience', 'Bamboo grove walk', 'Geisha district tour'],
    description: 'Immerse yourself in Japanese tradition with ancient temples, cherry blossoms, and authentic cultural experiences.',
    category: 'Culture',
  },
  {
    id: 'dubai-luxury-experience',
    title: 'Dubai Luxury Experience',
    destination: 'Dubai, UAE',
    image: 'https://images.pexels.com/photos/15693280/pexels-photo-15693280.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1799,
    originalPrice: 2199,
    duration: '5 days / 4 nights',
    groupSize: 'Max 15 people',
    rating: 4.7,
    reviews: 312,
    highlights: ['Burj Khalifa visit', 'Desert safari', 'Gold souk shopping', 'Luxury yacht cruise'],
    description: 'Indulge in the ultimate luxury experience with world-class dining, shopping, and desert adventures in glamorous Dubai.',
    category: 'Luxury',
  },
  {
    id: 'african-safari-expedition',
    title: 'African Safari Expedition',
    destination: 'Maasai Mara, Kenya',
    image: 'https://images.pexels.com/photos/35447816/pexels-photo-35447816.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 2999,
    originalPrice: 3599,
    duration: '12 days / 11 nights',
    groupSize: 'Max 8 people',
    rating: 5.0,
    reviews: 98,
    highlights: ['Big Five game drives', 'Maasai village visit', 'Hot air balloon safari', 'Bush dinner'],
    description: 'Embark on the adventure of a lifetime with up-close wildlife encounters across the African savanna.',
    category: 'Adventure',
  },
];
