export type CategoryId = 'cul' | 'com';

export type FilterId = 'all' | CategoryId;

export type SectionId = 'home' | 'motion' | 'design' | 'video' | 'web';

export type RouteId = SectionId | 'admin';

export interface MediaAsset {
  /** 'v' for video, 'i' for image */
  k: 'v' | 'i';
  /** Uploaded asset identifier */
  id: string;
}

export interface PortfolioItem {
  /** Optional short badge label (used on poster cards) */
  g?: string;
  /** Item title */
  t: string;
  /** Item short description */
  d: string;
  /** Optional external or video embed URL */
  url: string;
  /** Optional category ('cul' | 'com') */
  c?: CategoryId;
  /** Optional uploaded media asset */
  a?: MediaAsset;
}

export interface PortfolioSection {
  id: SectionId;
  name: string;
  poster?: boolean;
  about?: string;
  lead?: string;
  items?: PortfolioItem[];
}

export type PortfolioStore = Partial<Record<SectionId, PortfolioItem[]>>;

export interface CategoryOption {
  id: CategoryId;
  name: string;
}

export interface FilterChipOption {
  id: FilterId;
  name: string;
  count: number;
}

export interface ParsedVideo {
  id: string;
  name: string;
  embed: string;
  yt?: boolean;
  ig?: boolean;
}

export interface SelectedPortfolioItem {
  section: PortfolioSection;
  item: PortfolioItem;
  index: number;
}
