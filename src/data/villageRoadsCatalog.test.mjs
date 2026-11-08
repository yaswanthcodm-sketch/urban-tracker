import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyRoadCategory,
  getRoadDamageProfile,
  QUICK_CITY_COORDINATES,
} from './villageRoadsCatalog.js';
import {
  CITY_ROAD_CATALOGS,
  generateLocalityRoadNetwork,
} from './allCitiesRoadsData.js';

test('classifyRoadCategory correctly sorts road types', () => {
  assert.equal(classifyRoadCategory('motorway'), 'major');
  assert.equal(classifyRoadCategory('trunk'), 'major');
  assert.equal(classifyRoadCategory('primary'), 'major');
  assert.equal(classifyRoadCategory('secondary'), 'major');

  assert.equal(classifyRoadCategory('tertiary'), 'residential');
  assert.equal(classifyRoadCategory('residential'), 'residential');
  assert.equal(classifyRoadCategory('living_street'), 'residential');

  assert.equal(classifyRoadCategory('track'), 'track');
  assert.equal(classifyRoadCategory('path'), 'track');
});

test('getRoadDamageProfile returns deterministic defect status', () => {
  const road1 = { id: 'way-12345', name: 'Main Bazaar Road' };
  const damage1 = getRoadDamageProfile(road1);
  assert.ok(damage1.tag);
  assert.ok(['high', 'med', 'low', 'clean'].includes(damage1.severity));
  assert.ok(['pothole', 'garbage', 'clean'].includes(damage1.type));

  // Same road ID produces identical output
  const damage2 = getRoadDamageProfile(road1);
  assert.equal(damage1.tag, damage2.tag);
  assert.equal(damage1.severity, damage2.severity);
});

test('QUICK_CITY_COORDINATES contains all key cities and towns with valid GPS', () => {
  const cities = ['nuzvid', 'vijayawada', 'guntur', 'visakhapatnam', 'tirupati', 'hyderabad', 'delhi', 'mumbai', 'bengaluru', 'chennai', 'kolkata'];
  for (const city of cities) {
    assert.ok(QUICK_CITY_COORDINATES[city], `Missing coordinate entry for ${city}`);
    assert.ok(Number.isFinite(QUICK_CITY_COORDINATES[city].lat));
    assert.ok(Number.isFinite(QUICK_CITY_COORDINATES[city].lon));
  }
});

test('generateLocalityRoadNetwork generates rich authentic roads for ANY village, town or city', () => {
  // 1. Curated city
  const hydRoads = generateLocalityRoadNetwork('Hyderabad', 17.3850, 78.4867);
  assert.ok(hydRoads.length >= 5);
  assert.ok(hydRoads.some(r => r.name.toLowerCase().includes('ring road') || r.name.toLowerCase().includes('charminar') || r.name.toLowerCase().includes('outer')));

  // 2. Custom rural village (e.g. Gollapalli / Hampi / Eluru / any village)
  const eluruRoads = generateLocalityRoadNetwork('Eluru', 16.7107, 81.0952);
  assert.ok(eluruRoads.length >= 10);
  assert.ok(eluruRoads.some(r => r.name.includes('Eluru')));
  assert.ok(eluruRoads.some(r => r.damage.type === 'pothole'));
  assert.ok(eluruRoads.some(r => r.damage.type === 'garbage'));
  assert.ok(eluruRoads.some(r => r.damage.type === 'clean'));

  // All roads have coordinates, category type, and surface
  for (const road of eluruRoads) {
    assert.ok(road.id);
    assert.ok(road.name);
    assert.ok(Number.isFinite(road.centerLat));
    assert.ok(Number.isFinite(road.centerLon));
    assert.ok(road.surface);
    assert.ok(road.damage?.tag);
  }
});
