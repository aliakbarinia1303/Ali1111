import { useState } from 'react';
import { ARTWORK_GRADIENTS } from '../data/portfolioData';
import type { PortfolioItem, PortfolioSection } from '../types/portfolio';
import { getAssetBlobUrl, parseVideoUrl } from '../utils/portfolio';
import { PlayIcon } from './Icons';

const ACCENT_COLOR = '#FF6500';
const INK_COLOR = '#EEF3F9';

interface ArtworkProps {
  section: PortfolioSection;
  index: number;
}

/** تصویر جایگزین افقی نمونه‌ها (16:9)؛ فقط با رنگ‌های برند */
export function ThumbArtwork({ section, index }: ArtworkProps) {
  const k = index % 3;
  const palette = ARTWORK_GRADIENTS[(index + section.id.length) % 3];
  const gradientId = `g${section.id}${index}`;

  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={palette[0]} />
          <stop offset="1" stopColor={palette[1]} />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill={`url(#${gradientId})`} />
      {section.id === 'motion' ? (
        <>
          <path
            d="M10 70C45 70 45 20 80 20s35 50 70 50"
            fill="none"
            stroke={INK_COLOR}
            strokeWidth="3"
            strokeLinecap="round"
            opacity=".85"
          />
          <circle cx={30 + k * 45} cy={k === 1 ? 20 : 62} r="7" fill={ACCENT_COLOR} />
        </>
      ) : section.id === 'web' ? (
        <>
          <rect x="22" y="14" width="116" height="62" rx="6" fill={INK_COLOR} opacity=".92" />
          <rect x="22" y="14" width="116" height="10" rx="5" fill={INK_COLOR} />
          <rect x="30" y="32" width={50 + k * 14} height="7" rx="3" fill="#1E3E62" />
          <rect x="30" y="45" width="96" height="4" rx="2" fill="#8fa3bd" />
          <rect x="30" y="54" width="70" height="4" rx="2" fill="#8fa3bd" />
          <rect x="104" y="60" width="26" height="9" rx="4" fill={ACCENT_COLOR} />
        </>
      ) : section.id === 'design' ? (
        <>
          <circle cx={55 + k * 10} cy="46" r="26" fill={INK_COLOR} opacity=".9" />
          <rect
            x={80 - k * 6}
            y="26"
            width="48"
            height="40"
            rx={k * 8}
            fill={ACCENT_COLOR}
            opacity=".92"
          />
          <path d="M20 76h120" stroke={INK_COLOR} strokeWidth="3" opacity=".7" />
        </>
      ) : (
        <>
          <rect x="12" y="52" width={50 + k * 10} height="14" rx="3" fill={INK_COLOR} opacity=".9" />
          <rect
            x={66 + k * 10}
            y="52"
            width={40 - k * 4}
            height="14"
            rx="3"
            fill={INK_COLOR}
            opacity=".55"
          />
          <rect x="12" y="34" width={70 - k * 8} height="12" rx="3" fill={INK_COLOR} opacity=".35" />
          <path d={`M${60 + k * 20} 14v64`} stroke={ACCENT_COLOR} strokeWidth="2.5" />
          <path d={`M${54 + k * 20} 14h12l-6 8z`} fill={ACCENT_COLOR} />
        </>
      )}
    </svg>
  );
}

/** پوستر عمودی نمونه‌ها (4:5)؛ فقط با رنگ‌های برند */
export function PosterArtwork({ section, index }: ArtworkProps) {
  const k = index % 3;
  const palette = ARTWORK_GRADIENTS[(index + section.id.length) % 3];
  const gradientId = `p${section.id}${index}`;

  return (
    <svg viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2=".6" y2="1">
          <stop offset="0" stopColor={palette[0]} />
          <stop offset="1" stopColor={palette[1]} />
        </linearGradient>
      </defs>
      <rect width="100" height="125" fill={`url(#${gradientId})`} />
      {section.id === 'motion' ? (
        <>
          <path
            d="M-5 100C25 100 25 42 50 42s25 58 55 58"
            fill="none"
            stroke={INK_COLOR}
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity=".85"
          />
          <circle cx={22 + k * 28} cy={k === 1 ? 42 : 96} r="6" fill={ACCENT_COLOR} />
        </>
      ) : section.id === 'design' ? (
        <>
          <circle cx={38 + k * 6} cy="58" r="24" fill={INK_COLOR} opacity=".9" />
          <rect
            x={48 - k * 4}
            y="44"
            width="40"
            height="44"
            rx={k * 8}
            fill={ACCENT_COLOR}
            opacity=".92"
          />
          <path d="M14 106h72" stroke={INK_COLOR} strokeWidth="2.5" opacity=".7" />
        </>
      ) : (
        <>
          <rect x="8" y="84" width={40 + k * 8} height="12" rx="3" fill={INK_COLOR} opacity=".9" />
          <rect
            x={52 + k * 8}
            y="84"
            width={40 - k * 8}
            height="12"
            rx="3"
            fill={INK_COLOR}
            opacity=".55"
          />
          <rect x="8" y="64" width={60 - k * 6} height="10" rx="3" fill={INK_COLOR} opacity=".35" />
          <path d={`M${40 + k * 16} 18v92`} stroke={ACCENT_COLOR} strokeWidth="2.2" />
          <path d={`M${35 + k * 16} 18h10l-5 7z`} fill={ACCENT_COLOR} />
        </>
      )}
    </svg>
  );
}

export function PlayBadge({ name }: { name: string }) {
  return (
    <span className="pl">
      <i>
        <PlayIcon />
      </i>
      <em>{name}</em>
    </span>
  );
}

export function MediaPreview({ item }: { item: PortfolioItem }) {
  if (!item.a) return null;
  const blobUrl = getAssetBlobUrl(item.a);
  if (item.a.k === 'v') {
    return <video src={`${blobUrl}#t=0.1`} muted playsInline preload="metadata" />;
  }
  return <img src={blobUrl} alt="" loading="lazy" />;
}

function YouTubeThumbnail({ videoId }: { videoId: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <img
      data-yt=""
      src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
      alt=""
      onError={() => setFailed(true)}
    />
  );
}

interface CoverMediaProps {
  section: PortfolioSection;
  index: number;
  item: PortfolioItem;
  isPoster: boolean;
}

export function CoverMedia({ section, index, item, isPoster }: CoverMediaProps) {
  const baseArtwork = isPoster ? (
    <PosterArtwork section={section} index={index} />
  ) : (
    <ThumbArtwork section={section} index={index} />
  );
  const parsedVideo = parseVideoUrl(item.url);

  if (parsedVideo && !(item.a && item.a.k === 'v')) {
    if (item.a) {
      return (
        <>
          <MediaPreview item={item} />
          <PlayBadge name={parsedVideo.name} />
        </>
      );
    }

    return (
      <>
        {baseArtwork}
        {parsedVideo.yt ? <YouTubeThumbnail key={parsedVideo.id} videoId={parsedVideo.id} /> : null}
        <PlayBadge name={parsedVideo.name} />
      </>
    );
  }

  if (item.a) {
    return <MediaPreview item={item} />;
  }

  return baseArtwork;
}
