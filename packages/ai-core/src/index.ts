export * from './contracts/ai-provider.interface.js';
export * from './contracts/ai-message.types.js';
export * from './contracts/ai-response.types.js';
export * from './contracts/ai-tool.types.js';
export * from './providers/openai-compatible.provider.js';
export * from './providers/gapgpt.provider.js';
export * from './providers/openai.provider.js';
export * from './providers/deepseek.provider.js';
export * from './prompts/shopping-assistant.prompt.js';
export * from './tools/index.js';

export const aiToolNames = [
  'search_products',
  'compare_products',
  'get_product_offers',
  'get_price_history',
  'search_businesses',
  'get_business_profile',
  'track_outbound_click',
  'start_checkout'
] as const;

export type AiToolName = (typeof aiToolNames)[number];
