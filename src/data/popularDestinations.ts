export interface PopularDestination {
  name: string;
  country: string;
  image: string;
  tagline: string;
  budgetLevel: 'Budget' | 'Moderate' | 'Luxury';
  idealDays: number;
  category: string;
  description: string;
  currency: string;
  interests: ('Nature' | 'History' | 'Food' | 'Shopping' | 'Temples' | 'Beaches' | 'Wildlife')[];
}

export const POPULAR_DESTINATIONS: PopularDestination[] = [
  {
    name: 'Pune',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&q=80&w=800',
    tagline: 'Cultural Capital of Maharashtra & Gateway to Hill Stations',
    budgetLevel: 'Budget',
    idealDays: 3,
    category: 'Cultural & Forts',
    description: 'Surrounded by Western Ghats, Pune blends rich Maratha history with vibrant street food, historic hill forts, and serene weather.',
    currency: 'INR',
    interests: ['History', 'Food', 'Nature', 'Temples'],
  },
  {
    name: 'Jaipur',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800',
    tagline: 'The Pink City of Royal Forts & Palaces',
    budgetLevel: 'Moderate',
    idealDays: 3,
    category: 'Heritage & Royalty',
    description: 'Immerse in majestic Rajput architecture, royal palaces, bustling handicraft bazaars, and legendary Rajasthani thalis.',
    currency: 'INR',
    interests: ['History', 'Food', 'Shopping', 'Temples'],
  },
  {
    name: 'Goa',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
    tagline: 'Sun-kissed Beaches, Portuguese Heritage & Nightlife',
    budgetLevel: 'Moderate',
    idealDays: 4,
    category: 'Beach & Coastal',
    description: 'Famous for pristine palm-fringed coastlines, water sports, historic Latin quarters, seafood shacks, and vibrant beach culture.',
    currency: 'INR',
    interests: ['Beaches', 'Food', 'Nature', 'History'],
  },
  {
    name: 'Kerala',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800',
    tagline: 'God’s Own Country - Backwaters & Tea Gardens',
    budgetLevel: 'Moderate',
    idealDays: 5,
    category: 'Nature & Wellness',
    description: 'Unwind in tranquil Alleppey houseboats, misty Munnar tea plantations, spice gardens, and rich Ayurvedic wellness retreats.',
    currency: 'INR',
    interests: ['Nature', 'Food', 'Wildlife', 'Beaches'],
  },
  {
    name: 'Hyderabad',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=800',
    tagline: 'City of Pearls & World-Famous Hyderabadi Biryani',
    budgetLevel: 'Budget',
    idealDays: 3,
    category: 'Food & Heritage',
    description: 'Explore the grand Golconda Fort, iconic Charminar, Ramoji Film City, and savour authentic aromatic biryanis and kebabs.',
    currency: 'INR',
    interests: ['History', 'Food', 'Shopping'],
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800',
    tagline: 'Futuristic Megacity & Timeless Ancient Shrines',
    budgetLevel: 'Luxury',
    idealDays: 5,
    category: 'Modern & Culinary',
    description: 'Experience high-tech cityscapes, Michelin-starred ramen joints, historic Senso-ji temples, anime culture, and bullet train hubs.',
    currency: 'JPY',
    interests: ['Food', 'Shopping', 'History', 'Temples'],
  },
  {
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
    tagline: 'City of Lights, Romance, Art & Fine Bakery',
    budgetLevel: 'Luxury',
    idealDays: 4,
    category: 'Art & Elegance',
    description: 'Walk along the Seine, visit Louvre masterpieces, marvel at the Eiffel Tower, and indulge in world-class French pastries.',
    currency: 'EUR',
    interests: ['History', 'Food', 'Shopping'],
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
    tagline: 'Island of the Gods - Terraces, Temples & Surf Break',
    budgetLevel: 'Budget',
    idealDays: 5,
    category: 'Tropical & Spiritual',
    description: 'Lush green Ubud rice terraces, clifftop sea temples, waterfalls, organic cafes, and tropical beach clubs.',
    currency: 'USD',
    interests: ['Beaches', 'Nature', 'Temples', 'Food'],
  },
];
