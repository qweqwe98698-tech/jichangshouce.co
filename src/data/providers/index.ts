import guangsuyun from './guangsuyun.json';
import xingdaomeng from './xingdaomeng.json';
import flycat from './flycat.json';
import u1s1 from './u1s1.json';
import weitu from './weitu.json';
import lingmao from './lingmao.json';
import jilian from './jilian.json';
import yuzhouyun from './yuzhouyun.json';
import guangnianti from './guangnianti.json';
import yifanyun from './yifanyun.json';
import ermaoyun from './ermaoyun.json';
import sogoyun from './sogoyun.json';
import kexinyun from './kexinyun.json';
import sujie from './sujie.json';
import kuaili from './kuaili.json';
import quanqiuyun from './quanqiuyun.json';

export interface ProviderPlan {
  name: string;
  price: number;
  cycle: string;
  traffic: string;
}

export interface ProviderVerification {
  status: 'verified' | 'partial' | 'pending';
  verifiedAt: string;
  notes: string;
}

export interface ProviderFAQ {
  q: string;
  a: string;
}

export interface Provider {
  id: string;
  slug: string;
  name: string;
  founded: number;
  status: string;
  tagline: string;
  pricing: {
    minPrice: string;
    cycle: string;
    priceType: string;
    traffic: string;
    plans: ProviderPlan[];
  };
  routes: string;
  protocols: string[];
  clients: string[];
  aiSupport: string;
  streamingSupport: string;
  suitableFor: string[];
  unsuitableFor: string[];
  pros: string[];
  cons: string[];
  coupon?: {
    code: string;
    desc: string;
  };
  affiliateUrl: string;
  website: string;
  speedtestImage: string;
  verification: ProviderVerification;
  faq: ProviderFAQ[];
}

export const providers: Provider[] = [
  guangsuyun,
  xingdaomeng,
  flycat,
  u1s1,
  weitu,
  lingmao,
  jilian,
  yuzhouyun,
  guangnianti,
  yifanyun,
  ermaoyun,
  sogoyun,
  kexinyun,
  sujie,
  kuaili,
  quanqiuyun
] as unknown as Provider[];

export function getProviderBySlug(slug: string): Provider | undefined {
  return providers.find(p => p.slug === slug);
}

export function getAllProviders(): Provider[] {
  return providers;
}
