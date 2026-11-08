import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  USER_CAMERAS,
  getUserCameraById,
  getMiddleEastLiveStreams,
  getLondonJamCams,
} from './userLiveCameras.js';
import { LIVE_CAMERAS_CATALOG } from './liveSatelliteAndCamUI.js';

test('USER_CAMERAS catalog contains all user-provided cameras', () => {
  assert.equal(USER_CAMERAS.length, 851, 'Should have 851 user cameras');

  const israelCam = getUserCameraById('il-israel-multicam');
  assert.ok(israelCam, 'Israel multi-cam should exist');
  assert.equal(israelCam.city, 'Tel Aviv');
  assert.equal(israelCam.country, 'Israel');

  const jerusalemCam = getUserCameraById('il-jerusalem-live');
  assert.ok(jerusalemCam, 'Jerusalem live cam should exist');
  assert.equal(jerusalemCam.city, 'Jerusalem');

  const beirutCam = getUserCameraById('lb-beirut-skyline');
  assert.ok(beirutCam, 'Beirut skyline live cam should exist');
  assert.equal(beirutCam.city, 'Beirut');

  const meCam = getUserCameraById('lb-me-multicam');
  assert.ok(meCam, 'Middle East multi-cam should exist');

  const piccadilly = getUserCameraById('tfl-JamCams_00001.07450');
  assert.ok(piccadilly, 'Piccadilly Circus JamCam should exist');
  assert.equal(piccadilly.city, 'London');
  assert.equal(piccadilly.country, 'UK');
  assert.ok(piccadilly.feed_url.startsWith('https://s3-eu-west-1.amazonaws.com/jamcams.tfl.gov.uk/'));
});

test('getMiddleEastLiveStreams returns 4 Middle East streams', () => {
  const mideast = getMiddleEastLiveStreams();
  assert.equal(mideast.length, 4);
  for (const m of mideast) {
    assert.ok(m.city, 'Should have city');
  }
});

test('getLondonJamCams returns 847 TfL JamCams', () => {
  const london = getLondonJamCams();
  assert.equal(london.length, 847);
  for (const cam of london) {
    assert.equal(cam.source, 'TfL');
    assert.ok(cam.feed_url.includes('jamcams.tfl.gov.uk'));
  }
});

test('LIVE_CAMERAS_CATALOG merges India, Middle East, London JamCams, and Global landmarks', () => {
  assert.equal(LIVE_CAMERAS_CATALOG.length, 892, '36 India + 851 User + 5 Global = 892 cameras');

  const indiaCams = LIVE_CAMERAS_CATALOG.filter((c) => c.country === 'India');
  assert.equal(indiaCams.length, 36, 'All 36 Indian states & UTs present');

  const mideastCams = LIVE_CAMERAS_CATALOG.filter((c) => c.country === 'Israel' || c.country === 'Lebanon' || c.country === 'Middle East');
  assert.equal(mideastCams.length, 4, '4 Middle East live cameras present');

  const londonCams = LIVE_CAMERAS_CATALOG.filter((c) => c.country === 'UK' || c.city === 'London');
  assert.equal(londonCams.length, 848, '847 JamCams + London City landmark');
});

test('config/cctv_sources.user.json is valid and populated', () => {
  const raw = fs.readFileSync('config/cctv_sources.user.json', 'utf8');
  const parsed = JSON.parse(raw);
  assert.equal(parsed.length, 887);

  const apCam = parsed.find((s) => s.id === 'cctv-in-ap-visakhapatnam');
  assert.ok(apCam, 'Andhra Pradesh camera should exist');
  assert.equal(apCam.feedType, 'mp4');

  const israel = parsed.find((s) => s.id === 'il-israel-multicam');
  assert.ok(israel);
  assert.equal(israel.lat, 32.0853);
  assert.equal(israel.lon, 34.7818);
});
