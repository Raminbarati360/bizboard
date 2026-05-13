export type EntityStatus = 'draft' | 'pending' | 'active' | 'suspended' | 'rejected' | 'hidden';

export interface CategoryDto {
  id: string;
  slug: string;
  title: string;
  categoryType: 'product' | 'business' | 'service' | 'content';
  parentId?: string | null;
}

export interface ProductDto {
  id: string;
  slug: string;
  title: string;
  normalizedTitle: string;
  brandName?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  offerCount: number;
  ratingAvg: number;
  ratingCount: number;
  updatedAt?: string;
}

export interface OfferDto {
  id: string;
  productId: string;
  merchantId: string;
  merchantName: string;
  price: number;
  currency: 'IRR';
  availability: 'in_stock' | 'out_of_stock' | 'preorder' | 'unknown';
  internalCheckoutEnabled: boolean;
  merchantProductUrl?: string | null;
  lastSeenAt: string;
}

export interface BusinessDto {
  id: string;
  slug: string;
  name: string;
  businessType: string;
  ratingAvg: number;
  ratingCount: number;
  isVerified: boolean;
}

export interface AiAssistantResponse {
  message: string;
  recommendedProducts: ProductDto[];
  comparisonTable?: Array<Record<string, string | number | boolean | null>>;
  followUpQuestions: string[];
  confidence: 'low' | 'medium' | 'high';
  reasoningSummaryForUser: string;
  filtersUsed: Record<string, unknown>;
}
