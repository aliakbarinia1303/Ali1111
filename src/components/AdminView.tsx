import { useEffect, useRef, useState } from 'react';
import { CATEGORIES } from '../data/portfolioData';
import type {
  CategoryId,
  PortfolioItem,
  PortfolioStore,
  SectionId,
} from '../types/portfolio';
import {
  getCategoryName,
  getEditableSections,
  getItemKindLabel,
  getNextCategory,
  getSectionById,
  getSectionItems,
  isValidSectionId,
  normalizeUrl,
  parseVideoUrl,
} from '../utils/portfolio';
import { MediaPreview } from './Artwork';

interface HostAssetBridge {
  upload: (file: File) => Promise<{ id: string }>;
}

interface HostPublishBridge {
  publish: (html: string) => Promise<void>;
}

interface HostRuntime {
  use?: (capability: 'assets' | 'artifact') => Promise<unknown>;
}

interface AdminViewProps {
  hidden: boolean;
  store: PortfolioStore;
  onStoreChange: (nextStore: PortfolioStore) => void;
}

function readInitialTab(): SectionId {
  try {
    const saved = sessionStorage.getItem('tab');
    if (saved && saved !== 'home' && isValidSectionId(saved)) {
      return saved;
    }
  } catch {
    // Ignore restricted sessionStorage environments.
  }
  return 'motion';
}

export function AdminView({ hidden, store, onStoreChange }: AdminViewProps) {
  const [access, setAccess] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<SectionId>(readInitialTab);
  const [statusMessage, setStatusMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('');
  const [category, setCategory] = useState<CategoryId | ''>('');
  const [description, setDescription] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const assetBridgeRef = useRef<HostAssetBridge | null>(null);
  const publishBridgeRef = useRef<HostPublishBridge | null>(null);

  useEffect(() => {
    if (hidden || access !== null) return;

    let cancelled = false;
    const checkAccess = async () => {
      try {
        const host = (window as unknown as { claude?: HostRuntime }).claude;
        if (!host || typeof host.use !== 'function') {
          if (!cancelled) setAccess(false);
          return;
        }
        const [assets, artifact] = await Promise.all([
          host.use('assets'),
          host.use('artifact'),
        ]);
        assetBridgeRef.current = assets as HostAssetBridge;
        publishBridgeRef.current = artifact as HostPublishBridge;
        if (!cancelled) {
          setAccess(Boolean(assets && artifact));
        }
      } catch {
        if (!cancelled) setAccess(false);
      }
    };

    void checkAccess();
    return () => {
      cancelled = true;
    };
  }, [hidden, access]);

  const editableSections = getEditableSections();
  const currentSection = getSectionById(activeTab) ?? getSectionById('motion')!;
  const items = getSectionItems(currentSection, store);
  const detectedVideo = parseVideoUrl(urlInput);

  const commitChange = async (mutateList: (list: PortfolioItem[]) => PortfolioItem[]) => {
    const previousStore = store;
    const baseList = getSectionItems(currentSection, store).map((item) => ({ ...item }));
    const updatedList = mutateList(baseList);
    const nextStore: PortfolioStore = {
      ...store,
      [currentSection.id]: updatedList,
    };

    try {
      onStoreChange(nextStore);
      setStatusMessage('در حال ذخیره… صفحه دوباره بارگذاری می‌شود');
      try {
        sessionStorage.setItem('tab', currentSection.id);
      } catch {
        // Ignore restricted sessionStorage environments.
      }
      if (publishBridgeRef.current) {
        await publishBridgeRef.current.publish(document.documentElement.outerHTML);
      }
    } catch (error) {
      onStoreChange(previousStore);
      const code = (error as { code?: string } | null)?.code;
      setStatusMessage(code === 'conflict' ? '' : `ذخیره نشد: ${code || ''}`);
    }
  };

  const handleTabChange = (sectionId: SectionId) => {
    if (busy) return;
    setActiveTab(sectionId);
    setStatusMessage('');
  };

  const handleAddItem = async () => {
    if (busy) return;
    const trimmedTitle = title.trim();
    const trimmedBadge = badge.trim();
    const trimmedDescription = description.trim();
    const normalizedUrl = normalizeUrl(urlInput);
    const file = fileInputRef.current?.files?.[0];

    if (!trimmedTitle) {
      setStatusMessage('عنوان را بنویس');
      return;
    }
    if (!file && !normalizedUrl) {
      setStatusMessage('فایل یا لینک لازم است');
      return;
    }

    setBusy(true);
    let uploadedAsset: PortfolioItem['a'];

    try {
      if (file && assetBridgeRef.current) {
        setStatusMessage('در حال آپلود… (ویدیو ممکن است کمی طول بکشد)');
        const uploaded = await assetBridgeRef.current.upload(file);
        uploadedAsset = {
          k: file.type.startsWith('video') ? 'v' : 'i',
          id: uploaded.id,
        };
      }
    } catch (error) {
      setBusy(false);
      const code = (error as { code?: string } | null)?.code;
      setStatusMessage(`آپلود نشد: ${code || ''}`);
      return;
    }

    const newItem: PortfolioItem = {
      t: trimmedTitle,
      d: trimmedDescription,
      url: normalizedUrl,
      ...(category ? { c: category } : {}),
      ...(trimmedBadge ? { g: trimmedBadge } : {}),
      ...(uploadedAsset ? { a: uploadedAsset } : {}),
    };

    await commitChange((list) => [...list, newItem]);
    setTitle('');
    setBadge('');
    setCategory('');
    setDescription('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setBusy(false);
  };

  const handleRowAction = async (action: 'cat' | 'up' | 'down' | 'del', index: number) => {
    if (busy) return;
    setBusy(true);

    await commitChange((list) => {
      if (action === 'del') {
        return list.filter((_, itemIndex) => itemIndex !== index);
      }

      if (action === 'cat') {
        return list.map((item, itemIndex) => {
          if (itemIndex !== index) return item;
          const nextCategory = getNextCategory(item.c);
          const nextItem: PortfolioItem = { ...item };
          if (nextCategory) {
            nextItem.c = nextCategory;
          } else {
            delete nextItem.c;
          }
          return nextItem;
        });
      }

      const targetIndex = action === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) {
        return list;
      }

      const reordered = [...list];
      const temp = reordered[index];
      reordered[index] = reordered[targetIndex];
      reordered[targetIndex] = temp;
      return reordered;
    });

    setBusy(false);
  };

  return (
    <section className="adm" id="adminView" hidden={hidden}>
      <h1>پنل مدیریت</h1>
      <div id="adminBody">
        {access === null ? (
          <p className="about">در حال بررسی دسترسی…</p>
        ) : !access ? (
          <p className="about">
            این بخش فقط برای صاحب صفحه است. با حساب کاربری که این صفحه را ساخته وارد شو و دوباره
            #admin را باز کن.
          </p>
        ) : (
          <>
            <div className="tabs">
              {editableSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className="tab"
                  data-a="tab"
                  data-v={section.id}
                  aria-current={section.id === currentSection.id ? 'true' : undefined}
                  onClick={() => handleTabChange(section.id)}
                >
                  {section.name}
                </button>
              ))}
            </div>

            <div className="aform">
              <b>افزودن نمونه به {currentSection.name}</b>
              <label>
                فایل (عکس یا ویدیو؛ برای لینک، عکس کاور)
                <input ref={fileInputRef} type="file" id="af" accept="image/*,video/*" />
              </label>
              <label>
                عنوان
                <input
                  type="text"
                  id="at"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
              {currentSection.poster ? (
                <label>
                  برچسب کوچک (مثلاً تیزر)
                  <input
                    type="text"
                    id="ag"
                    value={badge}
                    onChange={(event) => setBadge(event.target.value)}
                  />
                </label>
              ) : null}
              <label>
                دسته
                <select
                  id="ac"
                  value={category}
                  onChange={(event) => setCategory(event.target.value as CategoryId | '')}
                >
                  <option value="">بدون دسته</option>
                  {CATEGORIES.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                توضیح کوتاه
                <input
                  type="text"
                  id="ad"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </label>
              <label>
                لینک (یوتیوب، اینستاگرام، آپارات یا هر لینک دیگر؛ اختیاری)
                <input
                  type="url"
                  id="au"
                  dir="ltr"
                  placeholder="https://"
                  value={urlInput}
                  onChange={(event) => setUrlInput(event.target.value)}
                />
                <span className="ap" id="ap">
                  {detectedVideo ? `تشخیص داده شد: ${detectedVideo.name} ✓` : ''}
                </span>
              </label>
              <button className="abtn" type="button" data-a="add" onClick={handleAddItem}>
                افزودن
              </button>
            </div>

            <p className="ast" id="ast" role="status">
              {statusMessage}
            </p>

            <div>
              {items.length === 0 ? (
                <p className="about">هنوز نمونه‌ای نیست</p>
              ) : (
                items.map((item, index) => (
                  <div className="arow" key={`${currentSection.id}-${index}`}>
                    <span className="ath">{item.a ? <MediaPreview item={item} /> : <i />}</span>
                    <span className="atx">
                      <b>{item.t}</b>
                      <small>{getItemKindLabel(item)}</small>
                      {item.c ? <em>{getCategoryName(item.c)}</em> : null}
                    </span>
                    <span className="aops">
                      <button
                        type="button"
                        data-a="cat"
                        data-v={index}
                        aria-label="تغییر دسته"
                        onClick={() => handleRowAction('cat', index)}
                      >
                        {item.c ? getCategoryName(item.c) : 'بدون دسته'}
                      </button>
                      <button
                        type="button"
                        data-a="up"
                        data-v={index}
                        aria-label="بالا"
                        onClick={() => handleRowAction('up', index)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        data-a="down"
                        data-v={index}
                        aria-label="پایین"
                        onClick={() => handleRowAction('down', index)}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        data-a="del"
                        data-v={index}
                        onClick={() => handleRowAction('del', index)}
                      >
                        حذف
                      </button>
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
