import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  SATELLITE_FOOTAGE_FEEDS,
  resolveFootageSource,
  getFootageCatalog,
  getGibsSnapshotDate,
  getGibsSnapshotUrl,
  isAllowedFootageHost,
  generateSatelliteFallbackSvg,
} from './satelliteFootage.js';

describe('satelliteFootage catalog and helpers', () => {
  it('exposes all required NRT satellite sources', () => {
    assert.ok(SATELLITE_FOOTAGE_FEEDS.length >= 8);
    const ids = SATELLITE_FOOTAGE_FEEDS.map((f) => f.id);
    assert.ok(ids.includes('noaa-goes19-geocolor'), 'Includes GOES-19');
    assert.ok(ids.includes('noaa-goes18-geocolor'), 'Includes GOES-18');
    assert.ok(ids.includes('insat-3d-asia-ir1'), 'Includes INSAT Asia IR1');
    assert.ok(ids.includes('insat-loop-ir1'), 'Includes INSAT animated loop');
    assert.ok(ids.includes('nasa-viirs-snpp'), 'Includes NASA VIIRS');
    assert.ok(ids.includes('nasa-modis-terra'), 'Includes NASA MODIS');
    assert.ok(ids.includes('iss-live-hls'), 'Includes NASA ISS');
  });

  it('resolves sources by ID and aliases', () => {
    const goes19 = resolveFootageSource('goes19');
    assert.ok(goes19);
    assert.equal(goes19.id, 'noaa-goes19-geocolor');

    const goes18 = resolveFootageSource('goes-west');
    assert.ok(goes18);
    assert.equal(goes18.id, 'noaa-goes18-geocolor');

    const insat = resolveFootageSource('insat');
    assert.ok(insat);
    assert.equal(insat.id, 'insat-3d-asia-ir1');

    const loop = resolveFootageSource('storm-loop');
    assert.ok(loop);
    assert.equal(loop.id, 'insat-loop-ir1');

    const viirs = resolveFootageSource('viirs');
    assert.ok(viirs);
    assert.equal(viirs.id, 'nasa-viirs-snpp');

    const iss = resolveFootageSource('25544');
    assert.ok(iss);
    assert.equal(iss.id, 'iss-live-hls');
  });

  it('computes correct GIBS snapshot date and URL', () => {
    const dayDate = new Date('2026-10-18T14:30:00Z');
    assert.equal(getGibsSnapshotDate(dayDate), '2026-10-18');

    const earlyMorningDate = new Date('2026-10-18T01:30:00Z');
    assert.equal(getGibsSnapshotDate(earlyMorningDate), '2026-10-17');

    const url = getGibsSnapshotUrl('VIIRS_SNPP_CorrectedReflectance_TrueColor', '-60,-180,60,180', 1280, 640, dayDate);
    assert.ok(url.includes('TIME=2026-10-18'));
    assert.ok(url.includes('VIIRS_SNPP_CorrectedReflectance_TrueColor'));
    assert.ok(url.includes('WIDTH=1280'));
  });

  it('validates allowed footage hosts securely', () => {
    assert.equal(isAllowedFootageHost('https://cdn.star.nesdis.noaa.gov/GOES19/latest.jpg'), true);
    assert.equal(isAllowedFootageHost('https://mausam.imd.gov.in/Satellite/3Dasiasec_ir1.jpg'), true);
    assert.equal(isAllowedFootageHost('https://wvs.earthdata.nasa.gov/api/v1/snapshot'), true);
    assert.equal(isAllowedFootageHost('https://malicious.evil-domain.com/bad.jpg'), false);
    assert.equal(isAllowedFootageHost('not-a-valid-url'), false);
  });

  it('generates a valid fallback SVG image', () => {
    const svg = generateSatelliteFallbackSvg('INSAT-3DR', 'insat-3d-asia-ir1', 'SENSOR PASS COMPILING');
    assert.ok(svg.startsWith('<?xml'));
    assert.ok(svg.includes('INSAT-3DR'));
    assert.ok(svg.includes('SENSOR PASS COMPILING'));
    assert.ok(svg.includes('</svg>'));
  });

  it('returns valid public catalog structure', () => {
    const catalog = getFootageCatalog();
    assert.ok(catalog.total_feeds >= 8);
    assert.ok(Array.isArray(catalog.feeds));
    assert.ok(catalog.api_routes.frame);
    assert.ok(catalog.api_routes.loop);
  });
});
