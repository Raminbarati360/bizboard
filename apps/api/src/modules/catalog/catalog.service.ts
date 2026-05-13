import { Injectable } from '@nestjs/common';
import type { CategoryDto, OfferDto, ProductDto } from '@bizboard/types';

const categories: CategoryDto[] = [
  { id: 'cat-mobile', slug: 'mobile-accessories', title: 'موبایل و لوازم جانبی', categoryType: 'product' },
  { id: 'cat-laptop', slug: 'laptop-computer', title: 'لپ‌تاپ و کامپیوتر', categoryType: 'product' },
  { id: 'cat-home', slug: 'digital-home-appliances', title: 'لوازم خانگی دیجیتال و برقی', categoryType: 'product' },
  { id: 'cat-av', slug: 'audio-video', title: 'صوتی و تصویری', categoryType: 'product' },
  { id: 'cat-gadget', slug: 'smart-gadgets', title: 'گجت و کالای هوشمند', categoryType: 'product' }
];

const products: ProductDto[] = [
  {
    id: 'prod-iphone-13',
    slug: 'apple-iphone-13-128gb',
    title: 'گوشی اپل iPhone 13 ظرفیت 128 گیگابایت',
    normalizedTitle: 'apple iphone 13 128gb',
    brandName: 'Apple',
    minPrice: 385000000,
    maxPrice: 420000000,
    offerCount: 3,
    ratingAvg: 4.5,
    ratingCount: 18,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-lenovo-loq',
    slug: 'lenovo-loq-15',
    title: 'لپ‌تاپ Lenovo LOQ 15 مناسب برنامه‌نویسی و گیمینگ',
    normalizedTitle: 'lenovo loq 15',
    brandName: 'Lenovo',
    minPrice: 520000000,
    maxPrice: 590000000,
    offerCount: 2,
    ratingAvg: 4.3,
    ratingCount: 9,
    updatedAt: new Date().toISOString()
  }
];

const offers: OfferDto[] = [
  {
    id: 'offer-1',
    productId: 'prod-iphone-13',
    merchantId: 'merchant-1',
    merchantName: 'فروشگاه نمونه دارای سایت',
    price: 385000000,
    currency: 'IRR',
    availability: 'in_stock',
    internalCheckoutEnabled: false,
    merchantProductUrl: 'https://example.com/product/iphone-13',
    lastSeenAt: new Date().toISOString()
  },
  {
    id: 'offer-2',
    productId: 'prod-iphone-13',
    merchantId: 'merchant-2',
    merchantName: 'فروشنده بدون سایت نمونه',
    price: 399000000,
    currency: 'IRR',
    availability: 'in_stock',
    internalCheckoutEnabled: true,
    merchantProductUrl: null,
    lastSeenAt: new Date().toISOString()
  }
];

@Injectable()
export class CatalogService {
  categories(type?: string) {
    return type ? categories.filter((category) => category.categoryType === type) : categories;
  }

  products(q?: string) {
    if (!q) return products;
    const needle = q.toLowerCase();
    return products.filter((product) => `${product.title} ${product.normalizedTitle} ${product.brandName ?? ''}`.toLowerCase().includes(needle));
  }

  productBySlug(slug: string) {
    return products.find((product) => product.slug === slug) ?? null;
  }

  offers(productId: string) {
    return offers.filter((offer) => offer.productId === productId);
  }
}
