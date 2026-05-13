import type { AiToolDefinition } from '../contracts/ai-tool.types.js';

export const aiTools: AiToolDefinition[] = [
  {
    name: 'search_products',
    description: 'Search products using text, category, budget, attributes and availability filters.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        category_slug: { type: 'string' },
        min_price: { type: 'number' },
        max_price: { type: 'number' },
        must_be_in_stock: { type: 'boolean' },
        limit: { type: 'integer', minimum: 1, maximum: 10 }
      },
      required: ['query']
    }
  },
  {
    name: 'compare_products',
    description: 'Compare two to five products by specs, offers, reviews and suitability.',
    inputSchema: {
      type: 'object',
      properties: {
        product_ids: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 5 },
        user_priorities: { type: 'array', items: { type: 'string' } }
      },
      required: ['product_ids']
    }
  },
  {
    name: 'get_product_offers',
    description: 'Get current offers for a product sorted by relevance, trust and price.',
    inputSchema: {
      type: 'object',
      properties: {
        product_id: { type: 'string' },
        only_in_stock: { type: 'boolean' },
        limit: { type: 'integer', minimum: 1, maximum: 20 }
      },
      required: ['product_id']
    }
  },
  {
    name: 'get_business_profile',
    description: 'Get mini-site profile, trust signals and contact info of a business.',
    inputSchema: {
      type: 'object',
      properties: { business_id: { type: 'string' } },
      required: ['business_id']
    }
  }
];
