export interface RankingSignals {
  relevance: number;
  trust: number;
  quality: number;
  priceCompetitiveness: number;
  freshness: number;
  engagement: number;
}

export function productRankingScore(signals: RankingSignals) {
  return signals.relevance * 0.35
    + signals.trust * 0.2
    + signals.quality * 0.15
    + signals.priceCompetitiveness * 0.1
    + signals.freshness * 0.1
    + signals.engagement * 0.1;
}

export function calculateCommission(amount: number, rate = 0.06) {
  return Math.round(amount * rate);
}
