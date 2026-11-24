import { CATEGORIES, SECTIONS } from '../data/portfolioData';
import type {
  CategoryId,
  FilterChipOption,
  FilterId,
  MediaAsset,
  ParsedVideo,
  PortfolioItem,
  PortfolioSection,
  PortfolioStore,
  RouteId,
  SectionId,
} from '../types/portfolio';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

export function toPersianDigits(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

export function getSafeUrl(url?: string): string {
  return /^https?:\/\//i.test(url || '') ? url || '' : '';
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function getAssetBlobUrl(asset?: MediaAsset): string {
  if (!asset) return '';
  return `/_blob/${encodeURIComponent(asset.id)}`;
}

export function getCategoryName(categoryId?: CategoryId | ''): string {
  const match = CATEGORIES.find((category) => category.id === categoryId);
  return match ? match.name : '';
}

export function getNextCategory(categoryId?: CategoryId): CategoryId | undefined {
  const order: Array<CategoryId | undefined> = [undefined, 'cul', 'com'];
  const nextIndex = (order.indexOf(categoryId) + 1) % order.length;
  return order[nextIndex];
}

export function getSectionById(id: string): PortfolioSection | undefined {
  return SECTIONS.find((section) => section.id === id);
}

export function resolveRoute(hash: string): { isAdmin: boolean; section: PortfolioSection } {
  const clean = hash.replace(/^#/, '');
  const isAdmin = clean === 'admin';
  const section = getSectionById(clean) || SECTIONS[0];
  return { isAdmin, section };
}

export function getDocumentTitle(isAdmin: boolean, section: PortfolioSection): string {
  return `${isAdmin ? 'Admin' : section.name} | Portfolio`;
}

export function getSectionItems(
  section: PortfolioSection,
  store: PortfolioStore
): PortfolioItem[] {
  return store[section.id] ?? section.items ?? [];
}

export function getCategoryCounts(items: PortfolioItem[]): FilterChipOption[] {
  return [
    { id: 'all', name: 'همه', count: items.length },
    ...CATEGORIES.map((category) => ({
      id: category.id,
      name: category.name,
      count: items.filter((item) => item.c === category.id).length,
    })),
  ];
}

export function filterItemsWithIndex(
  items: PortfolioItem[],
  filter: FilterId
): Array<{ item: PortfolioItem; index: number }> {
  return items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => filter === 'all' || item.c === filter);
}

export function parseVideoUrl(rawUrl?: string): ParsedVideo | null {
  const url = rawUrl || '';
  let match: RegExpMatchArray | null;

  match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/))([\w-]{11})/i
  );
  if (match) {
    return {
      id: match[1],
      yt: true,
      name: 'YouTube',
      embed: `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0`,
    };
  }

  match = url.match(/aparat\.com\/v\/(\w+)/i);
  if (match) {
    return {
      id: match[1],
      name: 'آپارات',
      embed: `https://www.aparat.com/video/video/embed/videohash/${match[1]}/vt/frame`,
    };
  }

  match = url.match(/instagram\.com\/(p|reels?|tv)\/([\w-]+)/i);
  if (match) {
    const kind = match[1].toLowerCase().startsWith('reel') ? 'reel' : 'p';
    return {
      id: match[2],
      ig: true,
      name: 'Instagram',
      embed: `https://www.instagram.com/${kind}/${match[2]}/embed`,
    };
  }

  return null;
}

export function getItemKindLabel(item: PortfolioItem): string {
  const parsedVideo = parseVideoUrl(item.url);
  if (parsedVideo) return parsedVideo.name;
  if (item.a) return item.a.k === 'v' ? 'ویدیو' : 'تصویر';
  return item.url ? 'لینک' : 'نمونه';
}

export function getEditableSections(): PortfolioSection[] {
  return SECTIONS.filter((section) => section.id !== 'home');
}

export function isValidSectionId(id: string): id is SectionId {
  return SECTIONS.some((section) => section.id === id);
}

export function getRouteHash(route: RouteId): string {
  return `#${route}`;
}
