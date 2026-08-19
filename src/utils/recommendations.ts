/**
 * Provider recommendations & filtering engine
 */

export interface ProviderData {
  name: string;
  slug: string;
  logo: string;
  status: string;
  founded: string;
  description: string;
  positioning: string;
  pricing: {
    minPrice: string;
    currency: string;
    cycle: string;
  };
  plans: Array<{
    name: string;
    price: string;
    traffic: string;
    speedLimit: string;
    nodes: string;
  }>;
  protocols: string[];
  routes: string;
  regions: string[];
  paymentMethods: string[];
  clients: string[];
  aiSupport: string;
  streamingSupport: string;
  website: string;
  affiliateUrl: string;
  coupon?: string;
  promotion?: string;
  verification: {
    verifiedAt: string;
    status: string;
    sources: string[];
  };
  notes: string;
}

export interface SelectorCriteria {
  priority: 'stability' | 'budget' | 'ai' | 'streaming' | 'traffic' | 'route';
  budget: 'under15' | '15to30' | '30to50' | 'above50';
  device: 'windows' | 'macos' | 'iphone' | 'android';
}

export function filterProviders(
  providers: ProviderData[],
  criteria: Partial<SelectorCriteria>
): { recommended: ProviderData[]; matchReason: string } {
  let filtered = [...providers];
  let reason = '基于您的偏好综合匹配：';

  if (criteria.priority === 'stability' || criteria.priority === 'route') {
    filtered.sort((a, b) => (b.routes.includes('IPLC') || b.routes.includes('IEPL') ? 1 : 0) - (a.routes.includes('IPLC') || a.routes.includes('IEPL') ? 1 : 0));
    reason = '优先推荐具备全 IPLC / IEPL 专线接入、低丢包且抗高峰波动的服务商。';
  } else if (criteria.priority === 'budget') {
    filtered.sort((a, b) => parseFloat(a.pricing.minPrice) - parseFloat(b.pricing.minPrice));
    reason = '优先推荐单月与按周期折算单价亲民、高性价比的服务商。';
  } else if (criteria.priority === 'ai') {
    filtered = filtered.filter((p) => p.aiSupport.toLowerCase().includes('chatgpt') || p.aiSupport.includes('AI') || p.aiSupport.includes('原生'));
    reason = '优先推荐具备原生住宅 IP / 纯净机房出口、完美支持 ChatGPT/Claude 的服务商。';
  } else if (criteria.priority === 'streaming') {
    filtered = filtered.filter((p) => p.streamingSupport.includes('Netflix') || p.streamingSupport.includes('4K'));
    reason = '优先推荐拥有多地区原生家宽或流媒体专用 DNS 解锁的服务商。';
  }

  if (criteria.budget === 'under15') {
    filtered = filtered.filter((p) => parseFloat(p.pricing.minPrice) <= 18);
  }

  return {
    recommended: filtered.length > 0 ? filtered : providers,
    matchReason: reason,
  };
}
