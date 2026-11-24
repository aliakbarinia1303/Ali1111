import { useCallback, useEffect, useRef, useState } from 'react';
import { AdminView } from './components/AdminView';
import { Dock } from './components/Dock';
import { HomeView } from './components/HomeView';
import { ItemDialog } from './components/ItemDialog';
import { SectionView } from './components/SectionView';
import { INITIAL_STORE, SECTIONS } from './data/portfolioData';
import type {
  FilterId,
  PortfolioSection,
  PortfolioStore,
  SectionId,
  SelectedPortfolioItem,
} from './types/portfolio';
import {
  getDocumentTitle,
  getSectionItems,
  resolveRoute,
} from './utils/portfolio';

export default function App() {
  const [hash, setHash] = useState<string>(() => window.location.hash);
  const [store, setStore] = useState<PortfolioStore>(INITIAL_STORE);
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [selectedItem, setSelectedItem] = useState<SelectedPortfolioItem | null>(null);
  const lastSectionIdRef = useRef<SectionId | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const { isAdmin, section } = resolveRoute(hash);
  const isHome = !isAdmin && section.id === 'home';

  useEffect(() => {
    document.title = getDocumentTitle(isAdmin, section);

    if (isHome || isAdmin) {
      lastSectionIdRef.current = null;
    } else {
      if (lastSectionIdRef.current !== section.id) {
        setActiveFilter('all');
      }
      lastSectionIdRef.current = section.id;
    }

    window.scrollTo(0, 0);
  }, [isAdmin, isHome, section]);

  const handleNavigate = useCallback((sectionId: SectionId) => {
    window.location.hash = sectionId;
  }, []);

  const handleSelectItem = useCallback(
    (targetSection: PortfolioSection, index: number) => {
      const items = getSectionItems(targetSection, store);
      const item = items[index];
      if (!item) return;
      setSelectedItem({ section: targetSection, item, index });
    },
    [store]
  );

  const handleCloseDialog = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const homeSection = SECTIONS[0];
  const sectionItems = getSectionItems(section, store);

  return (
    <div id="shell">
      <main>
        <SectionView
          section={section}
          items={sectionItems}
          activeFilter={activeFilter}
          hidden={isHome || isAdmin}
          onFilterChange={setActiveFilter}
          onSelectItem={handleSelectItem}
        />
        <HomeView about={homeSection.about ?? ''} hidden={!isHome} />
        <AdminView hidden={!isAdmin} store={store} onStoreChange={setStore} />
      </main>
      <ItemDialog selected={selectedItem} onClose={handleCloseDialog} />
      <Dock activeSectionId={section.id} isAdmin={isAdmin} onNavigate={handleNavigate} />
    </div>
  );
}
