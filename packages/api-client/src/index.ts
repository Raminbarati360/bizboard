import type { ProductDto, CategoryDto, OfferDto } from '@bizboard/types';

export class BizboardApiClient {
  constructor(private readonly baseUrl: string) {}

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`);
    if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
    return res.json() as Promise<T>;
  }

  categories() {
    return this.get<CategoryDto[]>('/categories?type=product');
  }

  products(query = '') {
    return this.get<ProductDto[]>(`/products${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  }

  product(slug: string) {
    return this.get<ProductDto>(`/products/${slug}`);
  }

  offers(productId: string) {
    return this.get<OfferDto[]>(`/products/${productId}/offers`);
  }
}

export function createBizboardClient() {
  return new BizboardApiClient(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1');
}
