import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import type { SelectedPortfolioItem } from '../types/portfolio';
import { getAssetBlobUrl, getSafeUrl, parseVideoUrl } from '../utils/portfolio';
import { PosterArtwork, ThumbArtwork } from './Artwork';

interface ItemDialogProps {
  selected: SelectedPortfolioItem | null;
  onClose: () => void;
}

export function ItemDialog({ selected, onClose }: ItemDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selected) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [selected]);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  const renderPreview = () => {
    if (!selected) return null;
    const { section, item, index } = selected;
    const parsedVideo = parseVideoUrl(item.url);

    if (parsedVideo && !(item.a && item.a.k === 'v')) {
      return (
        <iframe
          className={`dframe${parsedVideo.ig ? ' ig' : ''}`}
          src={parsedVideo.embed}
          title={item.t}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      );
    }

    if (item.a) {
      const blobUrl = getAssetBlobUrl(item.a);
      if (item.a.k === 'v') {
        return <video className="dmedia" controls playsInline src={blobUrl} />;
      }
      return <img className="dmedia" src={blobUrl} alt="" />;
    }

    if (section.poster) {
      return (
        <span className="dposter">
          <PosterArtwork section={section} index={index} />
        </span>
      );
    }

    return (
      <span className="thumb dthumb">
        <ThumbArtwork section={section} index={index} />
      </span>
    );
  };

  const safeUrl = selected ? getSafeUrl(selected.item.url) : '';
  const parsedVideo = selected ? parseVideoUrl(selected.item.url) : null;

  return (
    <dialog ref={dialogRef} id="dlg" onClick={handleBackdropClick} onClose={onClose}>
      <div className="dlg-body" id="dlgBody">
        {selected ? (
          <>
            {renderPreview()}
            <h2>{selected.item.t}</h2>
            <p>{selected.item.d}</p>
            {safeUrl ? (
              <a className="btn" href={safeUrl} target="_blank" rel="noopener noreferrer">
                {parsedVideo ? `مشاهده در ${parsedVideo.name}` : 'مشاهده نمونه'}
              </a>
            ) : null}
            <button
              className="close"
              type="button"
              id="cl"
              onClick={() => dialogRef.current?.close()}
            >
              بستن
            </button>
          </>
        ) : null}
      </div>
    </dialog>
  );
}
