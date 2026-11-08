import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  determineRegionalSatelliteSource,
  formatRoadTitle,
  formatRoadTypeBadge,
  calculateFrameTimeLabel,
  determineRoadAuthority,
  generateDetectionBoxes,
} from './roadReconUI.js';

test('determineRegionalSatelliteSource resolves correctly for world regions', () => {
  // India (Nuzvid, AP: 16.7852° N, 80.8461° E)
  const indiaSource = determineRegionalSatelliteSource(16.7852, 80.8461);
  assert.equal(indiaSource.alias, 'insat3d');
  assert.equal(indiaSource.agency, 'ISRO / IMD');

  // Americas (Austin, TX: 30.2672° N, -97.7431° W)
  const usSource = determineRegionalSatelliteSource(30.2672, -97.7431);
  assert.equal(usSource.alias, 'goes19');
  assert.equal(usSource.agency, 'NOAA / NESDIS');

  // Pacific (Hawaii: 21.3069° N, -157.8583° W)
  const pacificSource = determineRegionalSatelliteSource(21.3069, -157.8583);
  assert.equal(pacificSource.alias, 'goes18');

  // Europe (Paris: 48.8566° N, 2.3522° E)
  const globalSource = determineRegionalSatelliteSource(48.8566, 2.3522);
  assert.equal(globalSource.alias, 'viirs');
  assert.equal(globalSource.agency, 'NASA Earthdata');
});

test('formatRoadTitle formats road names, references and fallback types', () => {
  assert.equal(
    formatRoadTitle({ name: 'Grand Trunk Road', ref: 'NH 1', type: 'primary' }),
    'Grand Trunk Road (NH 1)'
  );

  assert.equal(
    formatRoadTitle({ name: 'Temple Street', type: 'residential' }),
    'Temple Street'
  );

  assert.equal(
    formatRoadTitle({ ref: 'SH 32', type: 'secondary' }),
    'Highway SH 32'
  );

  assert.equal(
    formatRoadTitle({ type: 'track' }),
    'Agricultural Village Track'
  );

  assert.equal(
    formatRoadTitle({ type: 'residential' }),
    'Residential Village Street'
  );
});

test('formatRoadTypeBadge returns concise badges', () => {
  assert.equal(formatRoadTypeBadge('motorway'), 'EXPRESSWAY');
  assert.equal(formatRoadTypeBadge('primary'), 'PRIMARY');
  assert.equal(formatRoadTypeBadge('residential'), 'RESIDENTIAL');
  assert.equal(formatRoadTypeBadge('track'), 'VILLAGE TRACK');
  assert.equal(formatRoadTypeBadge('living_street'), 'LIVING ST');
});

test('calculateFrameTimeLabel computes 1-hour and 3-hour timesteps', () => {
  assert.equal(calculateFrameTimeLabel(11), 'LIVE (Latest)');
  assert.equal(calculateFrameTimeLabel(8), '-0h 45m');
  assert.equal(calculateFrameTimeLabel(7), '-1h 00m');
  assert.equal(calculateFrameTimeLabel(0), '-2h 45m');
});

test('determineRoadAuthority maps road types to responsible civic agencies', () => {
  assert.equal(determineRoadAuthority({ type: 'motorway' }), 'National Highways Authority of India (NHAI)');
  assert.equal(determineRoadAuthority({ type: 'trunk' }), 'National Highways Authority of India (NHAI)');
  assert.equal(determineRoadAuthority({ type: 'primary' }), 'State Roads & Buildings Dept (PWD)');
  assert.equal(determineRoadAuthority({ type: 'residential' }), 'Urban Development / Municipal Corporation');
  assert.equal(determineRoadAuthority({ type: 'track' }), 'Panchayat Raj & Rural Engineering (PMGSY)');
});

test('generateDetectionBoxes returns structured bounding boxes for pothole and garbage modes', () => {
  const road = { id: 'way-98765', name: 'Nuzvid Bypass' };
  const potholeBoxes = generateDetectionBoxes(road, 'pothole');
  assert.ok(potholeBoxes.length >= 2);
  assert.equal(potholeBoxes[0].label, 'POTHOLE');
  assert.ok(potholeBoxes[0].conf >= 0.8);
  assert.ok(potholeBoxes[0].x >= 0 && potholeBoxes[0].w > 0);

  const garbageBoxes = generateDetectionBoxes(road, 'garbage');
  assert.ok(garbageBoxes.length >= 2);
  assert.equal(garbageBoxes[0].label, 'ROADSIDE DUMP');
  assert.ok(garbageBoxes[0].conf >= 0.8);

  const cleanBoxes = generateDetectionBoxes(road, 'clean');
  assert.equal(cleanBoxes.length, 0);
});
