import type { FilterId, PortfolioItem, PortfolioSection } from '../types/portfolio';
import {
  filterItemsWithIndex,
  getCategoryCounts,
  toPersianDigits,
} from '../utils/portfolio';
import { CoverMedia } from './Artwork';

interface SectionViewProps {
  section: PortfolioSection;
  items: PortfolioItem[];
  activeFilter: FilterId;
  hidden: boolean;
  onFilterChange: (filter: FilterId) => void;
  onSelectItem: (section: PortfolioSection, index: number) => void;
}

export function SectionView({
  section,
  items,
  activeFilter,
  hidden,
  onFilterChange,
  onSelectItem,
}: SectionViewProps) {
  const filterOptions = getCategoryCounts(items);
  const visibleItems = filterItemsWithIndex(items, activeFilter);
  const isPoster = Boolean(section.poster);

  return (
    <div id="sectionView" hidden={hidden}>
      <div className="bar" />
      <p className="lead" id="lead">
        {section.lead ?? ''}
      </p>
      <div className="flt" id="flt" role="group" aria-label="دسته‌بندی نمونه‌کارها">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className="chip"
            data-f={option.id}
            aria-pressed={activeFilter === option.id}
            onClick={() => onFilterChange(option.id)}
          >
            {option.name} <small>{toPersianDigits(option.count)}</small>
          </button>
        ))}
      </div>
      <section className={`grid${isPoster ? ' pgrid' : ''}`} id="grid" aria-live="polite">
        {visibleItems.length === 0 ? (
          <p className="grid-empty">
            {items.length ? 'نمونه‌ای در این دسته نیست' : 'نمونه‌ای اضافه نشده'}
          </p>
        ) : (
          visibleItems.map(({ item, index }) =>
            isPoster ? (
              <button
                key={`${section.id}-${index}`}
                type="button"
                className="pcard"
                onClick={() => onSelectItem(section, index)}
              >
                <span className="poster">
                  <CoverMedia section={section} index={index} item={item} isPoster={true} />
                </span>
                <span className="cap">
                  {item.g ? <span className="badge">{item.g}</span> : null}
                  <b>{item.t}</b>
                </span>
              </button>
            ) : (
              <button
                key={`${section.id}-${index}`}
                type="button"
                className="card"
                onClick={() => onSelectItem(section, index)}
              >
                <span className="thumb">
                  <CoverMedia section={section} index={index} item={item} isPoster={false} />
                </span>
                <span className="meta">
                  <b>{item.t}</b>
                  <span>{item.d}</span>
                </span>
              </button>
            )
          )
        )}
      </section>
    </div>
  );
}
