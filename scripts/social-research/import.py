#!/usr/bin/env python3
"""Import user-made profile exports. Standard library only; no account access."""
import argparse
import concurrent.futures
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, HTTPRedirectHandler, build_opener

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = json.loads((ROOT / 'scripts/social-research/accounts.json').read_text())
KNOWN = {row['handle']: row for row in MANIFEST['accounts']}
RAW = ROOT / 'docs/social/corpus/raw'
LEDGER = ROOT / 'docs/social/corpus/coverage.json'
MAX_FILE = 12 * 1024 * 1024
MAX_IMAGE = 8 * 1024 * 1024


def checked_url(url):
    parsed = urlsplit(url)
    host = (parsed.hostname or '').lower()
    if (parsed.scheme != 'https' or parsed.username or parsed.password or parsed.port not in (None, 443)
        or not (host == 'cdn.fbsbx.com' or any(host == domain or host.endswith('.' + domain) for domain in ('cdninstagram.com', 'fbcdn.net')))):
        raise ValueError('Image must be an HTTPS Instagram/Meta CDN URL')
    return url


class CDNRedirects(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        checked_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def cover(task):
    folder, post = task
    destination = folder / 'covers' / post['shortcode']
    existing = list(destination.parent.glob(destination.name + '.*'))
    if existing:
        return True
    try:
        urls = post.get('image_urls') or []
        if not urls:
            return False
        request = Request(checked_url(urls[0]), headers={'User-Agent': 'BlessedMoonResearch/1.0'})
        with build_opener(CDNRedirects()).open(request, timeout=20) as response:
            if int(response.headers.get('Content-Length', '0')) > MAX_IMAGE:
                raise ValueError('Cover too large')
            data = response.read(MAX_IMAGE + 1)
        if len(data) > MAX_IMAGE:
            raise ValueError('Cover too large')
        extension = 'jpg' if data[:3] == b'\xff\xd8\xff' else 'png' if data[:8] == b'\x89PNG\r\n\x1a\n' else 'webp' if data[:4] == b'RIFF' and data[8:12] == b'WEBP' else None
        if not extension:
            raise ValueError('Unsupported cover format')
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.with_suffix('.' + extension).write_bytes(data)
        return True
    except Exception as error:
        print(f"  Cover unavailable {post['shortcode']}: {error}")
        return False


def import_file(path):
    if path.stat().st_size > MAX_FILE:
        raise ValueError(f'{path}: export exceeds 12 MB')
    body = path.read_bytes()
    export = json.loads(body)
    profile = export.get('profile', {})
    handle = profile.get('username', '').lower()
    if handle not in KNOWN:
        raise ValueError(f'{path}: @{handle} is not in the verified collection manifest')
    incoming = export.get('posts')
    if not isinstance(incoming, list) or len(incoming) > 500:
        raise ValueError(f'{path}: expected up to 500 post records')
    validated = []
    for post in incoming:
        if not isinstance(post, dict) or not re.fullmatch(r'[A-Za-z0-9_-]{1,64}', post.get('shortcode', '')):
            raise ValueError(f'{path}: invalid post identifier')
        for key in ('caption', 'alt'):
            if not isinstance(post.get(key, ''), str) or len(post.get(key, '')) > 30000:
                raise ValueError(f'{path}: invalid {key}')
        urls = post.get('image_urls', [])
        if not isinstance(urls, list) or len(urls) > 100 or not all(isinstance(url, str) for url in urls):
            raise ValueError(f'{path}: invalid image URLs')
        for url in urls:
            checked_url(url)
        slides = post.get('slides', [])
        if not isinstance(slides, list) or len(slides) > 30:
            raise ValueError(f'{path}: invalid deep slide list')
        for slide in slides:
            if not isinstance(slide, dict) or type(slide.get('index')) is not int or not 1 <= slide['index'] <= 30:
                raise ValueError(f'{path}: invalid slide index')
            images = slide.get('images', [])
            if not isinstance(images, list) or len(images) > 4:
                raise ValueError(f'{path}: invalid slide images')
            for image in images:
                if not isinstance(image, dict) or not isinstance(image.get('url'), str):
                    raise ValueError(f'{path}: invalid slide image')
                checked_url(image['url'])
        validated.append({**post, 'export_sha256': hashlib.sha256(body).hexdigest()})
    # Validation finishes before creating or replacing any archive files.
    folder = RAW / handle
    folder.mkdir(parents=True, exist_ok=True)
    digest = hashlib.sha256(body).hexdigest()
    (folder / f'export-{digest}.json').write_bytes(body)
    (folder / 'profile.json').write_text(json.dumps(profile, ensure_ascii=False, indent=2) + '\n')
    file = folder / 'posts.json'
    records = {post['shortcode']: post for post in json.loads(file.read_text())} if file.exists() else {}
    for post in validated:
        previous = records.get(post['shortcode'], {})
        merged = {**previous, **post}
        if previous.get('caption_status') and not post.get('caption_status'):
            # A later grid refresh must not erase the deeper observation.
            for key in ('caption', 'caption_status', 'rendered_post_text', 'text_source', 'slides', 'slide_stop_reason', 'cta_candidates', 'visible_links'):
                if key in previous:
                    merged[key] = previous[key]
        if not post.get('date') and previous.get('date'):
            merged['date'] = previous['date']
        if post.get('media_type') == 'unknown' and previous.get('media_type') not in (None, 'unknown'):
            merged['media_type'] = previous['media_type']
        if post.get('caption_status'):
            merged['deep_export_sha256'] = post['export_sha256']
        records[post['shortcode']] = merged
    posts = list(records.values())
    file.write_text(json.dumps(posts, ensure_ascii=False, indent=2) + '\n')
    print(f'@{handle}: {len(validated)} exported, {len(posts)} distinct archived records')
    tasks = [(folder, post) for post in posts]
    for post in posts:
        for slide in post.get('slides', []):
            for index, image in enumerate(slide.get('images', []), 1):
                tasks.append((folder, {'shortcode': f"{post['shortcode']}-s{slide['index']:02d}-{index:02d}", 'image_urls': [image['url']]}))
    return tasks


def update_coverage():
    rows = []
    all_ids = set()
    audit_file = LEDGER.parent / 'audit.json'
    audit = json.loads(audit_file.read_text()) if audit_file.exists() else {}
    reviewed = {row['handle']: row for row in audit.get('accounts', [])}
    for account in MANIFEST['accounts']:
        folder = RAW / account['handle']
        file = folder / 'posts.json'
        posts = json.loads(file.read_text()) if file.exists() else []
        ids = {post['shortcode'] for post in posts}
        all_ids.update(ids)
        covers = sum(any((folder / 'covers' / (code + '.' + ext)).exists() for ext in ('jpg', 'png', 'webp')) for code in ids)
        hashes = sorted(path.stem.removeprefix('export-') for path in folder.glob('export-*.json'))
        review = reviewed.get(account['handle'], {})
        audit_matches = bool(ids) and review.get('export_hashes') == hashes and set(review.get('cover_shortcodes', [])) == ids
        rows.append({**account, 'records': len(ids), 'covers': covers,
                     'alt_text_records': sum(bool(post.get('alt')) for post in posts),
                     'caption_fields': sum(bool(post.get('caption')) for post in posts),
                     'deep_post_records': sum(bool(post.get('caption_status')) for post in posts),
                     'observed_caption_records': sum(post.get('caption_status') == 'observed-caption-heading' for post in posts),
                     'observed_slides': sum(len(post.get('slides', [])) for post in posts),
                     'saved_slide_images': len(list((folder / 'covers').glob('*-s*.*'))),
                     'video_records': sum(post.get('media_type') == 'video' for post in posts),
                     'carousel_records': sum(post.get('media_type') == 'carousel' for post in posts),
                     'unknown_format_records': sum(post.get('media_type') == 'unknown' for post in posts),
                     'export_hashes': hashes,
                     'visual_audit_status': 'covers-and-captured-material-reviewed' if audit_matches else 'not-yet-audited'})
    audited = all(row['visual_audit_status'] == 'covers-and-captured-material-reviewed' for row in rows)
    coverage = {'status': 'bounded-sample-reviewed' if audited else 'collection-in-progress' if all_ids else 'collection-pending',
                'reviewed_at': audit.get('reviewed_at') if audited else None,
                'target_records': MANIFEST['target_total'], 'unique_records': len(all_ids),
                'account_record_total': sum(row['records'] for row in rows),
                'covers': sum(row['covers'] for row in rows), 'accounts': rows,
                'limitations': ['Counts are collection coverage, not completed analysis.', 'Grid alt text is not a verified full caption.', 'Deep UI exports may include slide images and observed caption headings; completeness still needs review. Actual video and engagement remain unavailable.', 'Cross-account duplicate shortcodes are deduplicated in unique_records.']}
    LEDGER.parent.mkdir(parents=True, exist_ok=True)
    LEDGER.write_text(json.dumps(coverage, ensure_ascii=False, indent=2) + '\n')
    print(f"Coverage: {coverage['unique_records']} distinct posts; {coverage['covers']} covers saved. Status: {coverage['status']}.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('exports', type=Path, nargs='*')
    parser.add_argument('--skip-images', action='store_true', help='Import JSON only; do not fetch cover images')
    args = parser.parse_args()
    tasks = []
    for path in args.exports:
        tasks.extend(import_file(path))
    if tasks and not args.skip_images:
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            list(pool.map(cover, tasks))
    update_coverage()


if __name__ == '__main__':
    main()
