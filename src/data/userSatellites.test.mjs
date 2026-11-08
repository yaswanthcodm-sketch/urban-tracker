import assert from 'node:assert/strict';
import test from 'node:test';
import {
  USER_SATELLITES,
  USER_SATELLITES_METADATA,
  getUserSatellites,
  getSatelliteByNorad,
  getSatellitesByCategory,
  searchSatellites,
  calculateSatelliteTelemetry,
} from './userSatellites.js';

test('user satellites dataset is fully decoded with exactly 1,389 satellites', () => {
  assert.equal(USER_SATELLITES.length, 1389);
  assert.equal(USER_SATELLITES_METADATA.total, 1389);
  assert.equal(getUserSatellites().length, 1389);
});

test('category distribution matches declared counts', () => {
  const science = getSatellitesByCategory('science');
  const military = getSatellitesByCategory('military');
  const earthObs = getSatellitesByCategory('earth_obs');
  const comms = getSatellitesByCategory('comms');
  const nav = getSatellitesByCategory('navigation');
  const other = getSatellitesByCategory('other');

  assert.equal(science.length, 8);
  assert.equal(military.length, 56);
  assert.equal(earthObs.length, 28);
  assert.equal(comms.length, 6);
  assert.equal(nav.length, 3);
  assert.equal(other.length, 1288);
});

test('satellite records are normalized with valid coordinates, altitude, and colors', () => {
  for (const sat of USER_SATELLITES) {
    assert.ok(typeof sat.name === 'string' && sat.name.length > 0);
    assert.ok(Number.isFinite(sat.noradId));
    assert.ok(Number.isFinite(sat.lat) && sat.lat >= -90 && sat.lat <= 90);
    assert.ok(Number.isFinite(sat.lon) && sat.lon >= -180 && sat.lon <= 180);
    assert.equal(sat.lng, sat.lon);
    assert.ok(Number.isFinite(sat.alt) && sat.alt > 0);
    assert.equal(sat.altM, sat.alt * 1000);
    assert.ok(typeof sat.mission === 'string');
    assert.ok(typeof sat.category === 'string');
    assert.ok(typeof sat.color === 'string' && sat.color.startsWith('#'));
    assert.ok(typeof sat.badge === 'string');
  }
});

test('key satellites can be retrieved by NORAD ID', () => {
  const iss = getSatelliteByNorad(25544);
  assert.ok(iss);
  assert.match(iss.name, /ISS/);
  assert.equal(iss.category, 'science');
  assert.equal(iss.color, '#FFD700');

  const cartosat = getSatelliteByNorad(43111);
  assert.ok(cartosat);
  assert.equal(cartosat.name, 'CARTOSAT 2F');

  const aditya = getSatelliteByNorad(57754);
  assert.ok(aditya);
  assert.equal(aditya.name, 'ADITYA-L1');
});

test('searchSatellites finds records by name, norad ID, or mission', () => {
  const cartosats = searchSatellites('cartosat');
  assert.ok(cartosats.length >= 7);

  const noaa = searchSatellites('noaa');
  assert.ok(noaa.length >= 7);

  const byNorad = searchSatellites('25544');
  assert.equal(byNorad.length, 1);
  assert.equal(byNorad[0].noradId, 25544);

  const weather = searchSatellites('weather');
  assert.ok(weather.length >= 20);
});

test('calculateSatelliteTelemetry generates valid live coordinates, speed, and region', () => {
  const sat = getSatelliteByNorad(43111); // Cartosat 2F
  const telemetry = calculateSatelliteTelemetry(sat, new Date());

  assert.ok(Number.isFinite(telemetry.currentLat));
  assert.ok(telemetry.currentLat >= -90 && telemetry.currentLat <= 90);
  assert.ok(Number.isFinite(telemetry.currentLon));
  assert.ok(telemetry.currentLon >= -180 && telemetry.currentLon <= 180);
  assert.ok(telemetry.speedKmH > 20000);
  assert.ok(typeof telemetry.regionName === 'string' && telemetry.regionName.length > 0);
});
