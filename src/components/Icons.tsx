import type { SectionId } from '../types/portfolio';

interface SectionIconProps {
  sectionId: SectionId;
}

export function SectionIcon({ sectionId }: SectionIconProps) {
  switch (sectionId) {
    case 'home':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 11l9-8 9 8" />
          <path d="M5 10v10h5v-6h4v6h5V10" />
        </svg>
      );
    case 'motion':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 18C8 18 8 6 12 6s4 12 9 12" />
          <circle cx="3" cy="18" r="1.6" fill="currentColor" />
          <circle cx="21" cy="18" r="1.6" fill="currentColor" />
        </svg>
      );
    case 'design':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3l9 9-5 5-9-9z" />
          <path d="M7 8l-4 13 13-4" />
          <circle cx="12" cy="12" r="1.3" fill="currentColor" />
        </svg>
      );
    case 'video':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M8 5v14M16 5v14M3 10h5M3 14h5M16 10h5M16 14h5" />
        </svg>
      );
    case 'web':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M3 9h18" />
          <circle cx="6.5" cy="6.5" r=".6" fill="currentColor" />
          <circle cx="9" cy="6.5" r=".6" fill="currentColor" />
        </svg>
      );
  }
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M8 5v14l11-7z" fill="#FF6500" />
    </svg>
  );
}
