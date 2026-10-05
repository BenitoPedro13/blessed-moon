#!/usr/bin/env python3
"""Check archive merging/validation in a temporary folder, without account access."""
import contextlib
import importlib.util
import io
import json
import tempfile
from pathlib import Path

spec = importlib.util.spec_from_file_location('agency_import', Path(__file__).with_name('import.py'))
collector = importlib.util.module_from_spec(spec)
spec.loader.exec_module(collector)

with tempfile.TemporaryDirectory() as directory:
    root = Path(directory)
    collector.RAW = root / 'raw'
    collector.LEDGER = root / 'coverage.json'
    handle = next(iter(collector.KNOWN))
    code = 'fixture-video'
    deep = {'profile': {'username': handle}, 'posts': [{
        'shortcode': code, 'caption': 'Observed caption and case invitation.',
        'caption_status': 'observed-caption-heading', 'slides': [],
        'media_type': 'video', 'date': '2026-10-01T00:00:00.000Z', 'image_urls': [],
    }]}
    grid = {'profile': {'username': handle}, 'posts': [{
        'shortcode': code, 'caption': '', 'alt': 'Cover alt text, not a caption.',
        'media_type': 'unknown', 'date': None, 'image_urls': [],
    }]}
    with contextlib.redirect_stdout(io.StringIO()):
        for name, value in [('deep', deep), ('grid', grid)]:
            path = root / (name + '.json')
            path.write_text(json.dumps(value))
            collector.import_file(path)
        collector.update_coverage()
    posts = json.loads((collector.RAW / handle / 'posts.json').read_text())
    assert len(posts) == 1
    assert posts[0]['caption'] == deep['posts'][0]['caption']
    assert posts[0]['date'] == deep['posts'][0]['date']
    assert posts[0]['media_type'] == 'video'
    assert posts[0]['deep_export_sha256']
    coverage = json.loads(collector.LEDGER.read_text())
    assert coverage['unique_records'] == 1
    assert coverage['accounts'][0]['observed_caption_records'] == 1
    assert coverage['accounts'][0]['deep_post_records'] == 1
    assert coverage['accounts'][0]['covers'] == 0
    for bad in ['https://example.com/p.png', 'http://cdninstagram.com/p.png', 'https://cdninstagram.com.example.com/p.png', 'https://user:password@cdninstagram.com/p.png']:
        try:
            collector.checked_url(bad)
        except ValueError:
            pass
        else:
            raise AssertionError('Unsafe URL was accepted')
    invalid = root / 'invalid.json'
    invalid.write_text(json.dumps({'profile': {'username': 'not-selected'}, 'posts': []}))
    try:
        collector.import_file(invalid)
    except ValueError:
        pass
    else:
        raise AssertionError('Unselected account was accepted')
    invalid.write_text(json.dumps({**deep, 'posts': [{**deep['posts'][0], 'shortcode': '../escape'}]}))
    try:
        collector.import_file(invalid)
    except ValueError:
        pass
    else:
        raise AssertionError('Unsafe identifier was accepted')
    assert len(list((collector.RAW / handle).glob('export-*.json'))) == 2
print('Importer checks passed: deduplication, zero-frame video captions, dates/formats, coverage and input validation.')
