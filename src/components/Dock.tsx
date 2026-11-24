import { SECTIONS } from '../data/portfolioData';
import type { SectionId } from '../types/portfolio';
import { SectionIcon } from './Icons';

interface DockProps {
  activeSectionId: SectionId;
  isAdmin: boolean;
  onNavigate: (sectionId: SectionId) => void;
}

export function Dock({ activeSectionId, isAdmin, onNavigate }: DockProps) {
  return (
    <div className="dock">
      <nav id="dock" aria-label="Sections">
        {SECTIONS.map((section) => {
          const isCurrent = !isAdmin && activeSectionId === section.id;
          return (
            <button
              key={section.id}
              type="button"
              data-id={section.id}
              aria-current={isCurrent ? 'page' : undefined}
              onClick={() => onNavigate(section.id)}
            >
              <SectionIcon sectionId={section.id} />
              <span>{section.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
