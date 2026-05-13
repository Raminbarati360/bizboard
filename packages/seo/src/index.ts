import type { ProductDto, OfferDto } from '@bizboard/types';

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function productJsonLd(product: ProductDto, offers: OfferDto[] = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    brand: product.brandName ? { '@type': 'Brand', name: product.brandName } : undefined,
    aggregateRating: product.ratingCount
      ? { '@type': 'AggregateRating', ratingValue: product.ratingAvg, reviewCount: product.ratingCount }
      : undefined,
    offers: offers.map((offer) => ({
      '@type': 'Offer',
      price: offer.price,
      priceCurrency: offer.currency,
      availability: offer.availability === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: offer.merchantName },
      url: offer.merchantProductUrl ?? undefined
    }))
  };
}
