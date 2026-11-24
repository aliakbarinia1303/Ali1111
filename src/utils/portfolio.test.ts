import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_STORE, SECTIONS } from '../data/portfolioData';
import {
  filterItemsWithIndex,
  getCategoryCounts,
  getCategoryName,
  getDocumentTitle,
  getNextCategory,
  getSafeUrl,
  getSectionById,
  getSectionItems,
  parseVideoUrl,
  resolveRoute,
  toPersianDigits,
} from './portfolio';

test('toPersianDigits converts ASCII numerals to Persian numerals', () => {
  assert.equal(toPersianDigits(0), '۰');
  assert.equal(toPersianDigits(5), '۵');
  assert.equal(toPersianDigits(1234567890), '۱۲۳۴۵۶۷۸۹۰');
});

test('getSafeUrl permits only http and https protocols', () => {
  assert.equal(getSafeUrl('https://example.com'), 'https://example.com');
  assert.equal(getSafeUrl('http://example.com/a'), 'http://example.com/a');
  assert.equal(getSafeUrl('javascript:alert(1)'), '');
  assert.equal(getSafeUrl(''), '');
});

test('parseVideoUrl detects YouTube, Aparat, and Instagram embeds', () => {
  const yt = parseVideoUrl('https://youtu.be/dQw4w9WgXcQ');
  assert.ok(yt);
  assert.equal(yt.name, 'YouTube');
  assert.equal(yt.yt, true);
  assert.equal(
    yt.embed,
    'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0'
  );

  const aparat = parseVideoUrl('https://www.aparat.com/v/abc123');
  assert.ok(aparat);
  assert.equal(aparat.name, 'آپارات');
  assert.equal(
    aparat.embed,
    'https://www.aparat.com/video/video/embed/videohash/abc123/vt/frame'
  );

  const ig = parseVideoUrl('https://www.instagram.com/reel/Cx123_abc/');
  assert.ok(ig);
  assert.equal(ig.name, 'Instagram');
  assert.equal(ig.ig, true);
  assert.equal(ig.embed, 'https://www.instagram.com/reel/Cx123_abc/embed');

  assert.equal(parseVideoUrl('https://example.com/page'), null);
});

test('resolveRoute handles empty hash, sections, unknown hash, and admin', () => {
  assert.deepEqual(resolveRoute(''), { isAdmin: false, section: SECTIONS[0] });
  assert.deepEqual(resolveRoute('#unknown'), { isAdmin: false, section: SECTIONS[0] });
  assert.equal(resolveRoute('#motion').section.id, 'motion');
  assert.equal(resolveRoute('#admin').isAdmin, true);
  assert.equal(getDocumentTitle(true, SECTIONS[0]), 'Admin | Portfolio');
  assert.equal(getDocumentTitle(false, SECTIONS[1]), 'Motion | Portfolio');
});

test('initial store overrides design and motion while preserving video and web defaults', () => {
  const motion = getSectionById('motion')!;
  const design = getSectionById('design')!;
  const video = getSectionById('video')!;
  const web = getSectionById('web')!;

  const motionItems = getSectionItems(motion, INITIAL_STORE);
  const designItems = getSectionItems(design, INITIAL_STORE);
  const videoItems = getSectionItems(video, INITIAL_STORE);
  const webItems = getSectionItems(web, INITIAL_STORE);

  assert.equal(motionItems.length, 5);
  assert.equal(designItems.length, 3);
  assert.equal(designItems[0].t, 'پوستر رویداد');
  assert.equal(videoItems.length, 6);
  assert.equal(webItems.length, 6);

  const counts = getCategoryCounts(motionItems);
  assert.deepEqual(counts, [
    { id: 'all', name: 'همه', count: 5 },
    { id: 'cul', name: 'فرهنگی', count: 3 },
    { id: 'com', name: 'تجاری', count: 2 },
  ]);

  const cultural = filterItemsWithIndex(motionItems, 'cul');
  assert.equal(cultural.length, 3);
  assert.equal(cultural[1].index, 2);
});

test('category helpers return Persian labels and cycle cleanly', () => {
  assert.equal(getCategoryName('cul'), 'فرهنگی');
  assert.equal(getCategoryName('com'), 'تجاری');
  assert.equal(getCategoryName(''), '');

  assert.equal(getNextCategory(undefined), 'cul');
  assert.equal(getNextCategory('cul'), 'com');
  assert.equal(getNextCategory('com'), undefined);
});
