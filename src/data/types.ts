export type PillarId = 'reparos' | 'reforma' | 'montagem';

export interface Subcategory {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  pillarId: PillarId;
}

export interface PillarCategory {
  id: PillarId;
  name: string;
  tagline: string;
  badge: string;
  colorTheme: 'blue' | 'amber' | 'emerald';
  subcategories: Subcategory[];
}

export interface PortfolioItem {
  title: string;
  url: string;
}

export interface ReviewItem {
  name: string;
  stars: number;
  text: string;
}

export interface Professional {
  id: string;
  name: string;
  headline: string;
  category: PillarId;
  subcategory: string;
  rating: number;
  reviewsCount: number;
  regions: string[];
  avatar: string;
  phone: string;
  priceEstimate: string;
  experienceYears: number;
  tags: string[];
  bio: string;
  verified: boolean;
  badges: string[];
  portfolio: PortfolioItem[];
  reviews: ReviewItem[];
}
