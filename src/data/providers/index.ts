// Top 10 Priority Brands
import guangsuyun from './guangsuyun.json';
import muguang from './muguang.json';
import flycat from './flycat.json';
import weifeng from './weifeng.json';
import dalaoyun from './dalaoyun.json';
import xingdaomeng from './xingdaomeng.json';
import ermaoyun from './ermaoyun.json';
import wuyou from './wuyou.json';
import weitu from './weitu.json';
import firefly from './firefly.json';

// Brands 11 - 28
import yuzhouyun from './yuzhouyun.json';
import u1s1 from './u1s1.json';
import lingmao from './lingmao.json';
import jilian from './jilian.json';
import guangnianti from './guangnianti.json';
import yifanyun from './yifanyun.json';
import sogoyun from './sogoyun.json';
import kexinyun from './kexinyun.json';
import sujie from './sujie.json';
import shanyue from './shanyue.json';
import quanqiuyun from './quanqiuyun.json';
import shandianshu from './shandianshu.json';
import yunjiexian from './yunjiexian.json';
import liulianyun from './liulianyun.json';
import shenxing from './shenxing.json';
import huanqiuti from './huanqiuti.json';
import yinxingren from './yinxingren.json';
import tiziyun from './tiziyun.json';

// 14 Trailing Historical Brands (排在后面)
import wgetcloud from './wgetcloud.json';
import baiyueguang from './baiyueguang.json';
import flyingbird from './flyingbird.json';
import cyberguard from './cyberguard.json';
import longmaoyun from './longmaoyun.json';
import fatcat from './fatcat.json';
import tntcloud from './tntcloud.json';
import qingyunti from './qingyunti.json';
import shanshuiyun from './shanshuiyun.json';
import lingdongyun from './lingdongyun.json';
import langwang from './langwang.json';
import edgenova from './edgenova.json';
import yinghuochong from './yinghuochong.json';
import sslar from './sslar.json';

// Legacy retained brand for URL stability
import kuaili from './kuaili.json';

export interface SpeedtestRecord {
  node: string;
  latency: string;
  download: string;
  testDate?: string;
}

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
  speedtestImage?: string;
  speedtestImages?: string[];
  unlockImages?: string[];
  speedtestData?: SpeedtestRecord[];
  reviewContent?: string;
  verification: ProviderVerification;
  faq: ProviderFAQ[];
}

export const providers: Provider[] = [
  // Top 10 (Strict priority: 光速云 #1, 暮光加速 #2, 飞猫云 #3, 微风网络 #4, 大佬云 #5, 星岛梦 #6, 二猫云 #7, 无忧链接 #8, 唯兔云 #9, Firefly #10)
  guangsuyun,
  muguang,
  flycat,
  weifeng,
  dalaoyun,
  xingdaomeng,
  ermaoyun,
  wuyou,
  weitu,
  firefly,

  // Brands 11-28
  yuzhouyun,
  u1s1,
  lingmao,
  jilian,
  guangnianti,
  yifanyun,
  sogoyun,
  kexinyun,
  sujie,
  shanyue,
  quanqiuyun,
  shandianshu,
  yunjiexian,
  liulianyun,
  shenxing,
  huanqiuti,
  yinxingren,
  tiziyun,

  // 14 Trailing Historical Brands (排在后面)
  wgetcloud,
  baiyueguang,
  flyingbird,
  cyberguard,
  longmaoyun,
  fatcat,
  tntcloud,
  qingyunti,
  shanshuiyun,
  lingdongyun,
  langwang,
  edgenova,
  yinghuochong,
  sslar,

  // Retained legacy provider
  kuaili,
] as unknown as Provider[];

export function getProviderBySlug(slug: string): Provider | undefined {
  return providers.find(p => p.slug === slug);
}

export function getAllProviders(): Provider[] {
  return providers;
}
