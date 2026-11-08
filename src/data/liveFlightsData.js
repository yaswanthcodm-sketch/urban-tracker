/**
 * @module liveFlightsData
 * @description High-fidelity simulated real-time flight stream.
 *
 * Generates continuous live flights with authentic Indian & international air
 * routes (IndiGo, Air India, Vistara, SpiceJet, Akasa, Emirates, Singapore Airlines,
 * British Airways, Lufthansa, etc.) and military patrol sorties.
 *
 * Each flight dynamically updates position along its corridor based on
 * elapsed time and ground speed, providing full live motion across the globe
 * even when third-party upstream APIs (OpenSky, adsb.lol) are unavailable or rate-limited.
 */

import { USER_COMMERCIAL_FLIGHTS } from './userCommercialFlights.js';

// Major airline metadata and nationality
const AIRLINE_INFO = {
  IGO: { name: 'IndiGo', country: 'India' },
  AIC: { name: 'Air India', country: 'India' },
  AXB: { name: 'Air India Express', country: 'India' },
  AKJ: { name: 'Akasa Air', country: 'India' },
  SEJ: { name: 'SpiceJet', country: 'India' },
  VTI: { name: 'Vistara', country: 'India' },
  UAL: { name: 'United Airlines', country: 'United States' },
  AAL: { name: 'American Airlines', country: 'United States' },
  DAL: { name: 'Delta Air Lines', country: 'United States' },
  SWA: { name: 'Southwest Airlines', country: 'United States' },
  ASA: { name: 'Alaska Airlines', country: 'United States' },
  UPS: { name: 'UPS Airlines', country: 'United States' },
  FDX: { name: 'FedEx Express', country: 'United States' },
  CXK: { name: 'SkyWest Airlines', country: 'United States' },
  ENY: { name: 'Envoy Air', country: 'United States' },
  EDV: { name: 'Endeavor Air', country: 'United States' },
  JBU: { name: 'JetBlue Airways', country: 'United States' },
  FFT: { name: 'Frontier Airlines', country: 'United States' },
  SKW: { name: 'SkyWest Airlines', country: 'United States' },
  RPA: { name: 'Republic Airways', country: 'United States' },
  TVF: { name: 'Transavia France', country: 'France' },
  AFR: { name: 'Air France', country: 'France' },
  BAW: { name: 'British Airways', country: 'United Kingdom' },
  EZY: { name: 'easyJet', country: 'United Kingdom' },
  EZS: { name: 'easyJet Switzerland', country: 'Switzerland' },
  RYR: { name: 'Ryanair', country: 'Ireland' },
  DLH: { name: 'Lufthansa', country: 'Germany' },
  EWG: { name: 'Eurowings', country: 'Germany' },
  AUA: { name: 'Austrian Airlines', country: 'Austria' },
  SWR: { name: 'Swiss International Air Lines', country: 'Switzerland' },
  SAS: { name: 'Scandinavian Airlines', country: 'Sweden' },
  KLM: { name: 'KLM Royal Dutch Airlines', country: 'Netherlands' },
  IBE: { name: 'Iberia', country: 'Spain' },
  VLG: { name: 'Vueling Airlines', country: 'Spain' },
  TAP: { name: 'TAP Air Portugal', country: 'Portugal' },
  ITY: { name: 'ITA Airways', country: 'Italy' },
  WZZ: { name: 'Wizz Air', country: 'Hungary' },
  PGT: { name: 'Pegasus Airlines', country: 'Turkey' },
  THY: { name: 'Turkish Airlines', country: 'Turkey' },
  UAE: { name: 'Emirates', country: 'United Arab Emirates' },
  ETD: { name: 'Etihad Airways', country: 'United Arab Emirates' },
  QTR: { name: 'Qatar Airways', country: 'Qatar' },
  SIA: { name: 'Singapore Airlines', country: 'Singapore' },
  THA: { name: 'Thai Airways', country: 'Thailand' },
  MAS: { name: 'Malaysia Airlines', country: 'Malaysia' },
  CPA: { name: 'Cathay Pacific', country: 'Hong Kong' },
  QFA: { name: 'Qantas', country: 'Australia' },
  ANZ: { name: 'Air New Zealand', country: 'New Zealand' },
  JAL: { name: 'Japan Airlines', country: 'Japan' },
  ANA: { name: 'All Nippon Airways', country: 'Japan' },
  KAL: { name: 'Korean Air', country: 'South Korea' },
  SAA: { name: 'South African Airways', country: 'South Africa' },
  ETH: { name: 'Ethiopian Airlines', country: 'Ethiopia' },
  MSR: { name: 'EgyptAir', country: 'Egypt' },
  TAM: { name: 'LATAM Airlines', country: 'Brazil' },
  AZU: { name: 'Azul Brazilian Airlines', country: 'Brazil' },
  GLO: { name: 'Gol Transportes Aéreos', country: 'Brazil' },
  ARG: { name: 'Aerolineas Argentinas', country: 'Argentina' },
  ACA: { name: 'Air Canada', country: 'Canada' },
  AMX: { name: 'Aeromexico', country: 'Mexico' },
  SCX: { name: 'Sun Country Airlines', country: 'United States' },
  TRF: { name: 'Tropic Air', country: 'United States' },
  XAA: { name: 'Aeronautical Charter', country: 'United States' },
};

function resolveCountryFallback(lat, lon) {
  if (lat >= 6 && lat <= 38 && lon >= 68 && lon <= 98) return 'India';
  if (lat >= 24 && lat <= 50 && lon >= -126 && lon <= -65) return 'United States';
  if (lat >= 35 && lat <= 70 && lon >= -10 && lon <= 40) return 'Europe';
  if (lat >= -35 && lat <= 5 && lon >= -75 && lon <= -35) return 'Brazil';
  return 'International';
}

function moveGreatCircle(latDeg, lonDeg, headingDeg, distanceM) {
  const R = 6371000.0;
  const delta = distanceM / R;
  const lat0 = (latDeg * Math.PI) / 180;
  const lon0 = (lonDeg * Math.PI) / 180;
  const brng = (headingDeg * Math.PI) / 180;

  const sinLat2 = Math.sin(lat0) * Math.cos(delta) + Math.cos(lat0) * Math.sin(delta) * Math.cos(brng);
  const lat2 = Math.asin(Math.max(-1.0, Math.min(1.0, sinLat2)));
  const y = Math.sin(brng) * Math.sin(delta) * Math.cos(lat0);
  const x = Math.cos(delta) - Math.sin(lat0) * Math.sin(lat2);
  let lon2 = lon0 + Math.atan2(y, x);
  lon2 = ((lon2 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;

  return {
    lat: (lat2 * 180) / Math.PI,
    lon: (lon2 * 180) / Math.PI,
  };
}

// Major airport coordinates
const AIRPORTS = {
  // India Core
  DEL: { name: 'Indira Gandhi Intl (Delhi)', lat: 28.5562, lon: 77.1000 },
  BOM: { name: 'Chhatrapati Shivaji Maharaj Intl (Mumbai)', lat: 19.0896, lon: 72.8656 },
  BLR: { name: 'Kempegowda Intl (Bengaluru)', lat: 13.1986, lon: 77.7066 },
  HYD: { name: 'Rajiv Gandhi Intl (Hyderabad)', lat: 17.2403, lon: 78.4294 },
  MAA: { name: 'Chennai Intl', lat: 12.9941, lon: 80.1709 },
  CCU: { name: 'Netaji Subhash Chandra Bose Intl (Kolkata)', lat: 22.6547, lon: 88.4467 },
  AMD: { name: 'Sardar Vallabhbhai Patel Intl (Ahmedabad)', lat: 23.0734, lon: 72.6347 },
  PNQ: { name: 'Pune Intl', lat: 18.5822, lon: 73.9197 },
  GOI: { name: 'Dabolim Intl (Goa)', lat: 15.3808, lon: 73.8314 },
  COK: { name: 'Cochin Intl (Kochi)', lat: 10.1520, lon: 76.4019 },
  JAI: { name: 'Jaipur Intl', lat: 26.8242, lon: 75.8122 },
  LKO: { name: 'Chaudhary Charan Singh Intl (Lucknow)', lat: 26.7606, lon: 80.8893 },
  GAU: { name: 'Lokpriya Gopinath Bordoloi Intl (Guwahati)', lat: 26.1061, lon: 91.5859 },
  SXR: { name: 'Sheikh ul-Alam Intl (Srinagar)', lat: 33.9871, lon: 74.7741 },
  ATQ: { name: 'Sri Guru Ram Dass Jee Intl (Amritsar)', lat: 31.7096, lon: 74.7973 },
  PAT: { name: 'Jay Prakash Narayan Airport (Patna)', lat: 25.5913, lon: 85.0880 },
  VNS: { name: 'Lal Bahadur Shastri Intl (Varanasi)', lat: 25.4524, lon: 82.8593 },
  BBI: { name: 'Biju Patnaik Intl (Bhubaneswar)', lat: 20.2444, lon: 85.8178 },
  IXC: { name: 'Shaheed Bhagat Singh Intl (Chandigarh)', lat: 30.6735, lon: 76.7885 },
  IDR: { name: 'Devi Ahilyabai Holkar Intl (Indore)', lat: 22.7217, lon: 75.8011 },
  NAG: { name: 'Dr. Babasaheb Ambedkar Intl (Nagpur)', lat: 21.0922, lon: 79.0472 },
  IXZ: { name: 'Veer Savarkar Intl (Port Blair)', lat: 11.6412, lon: 92.7297 },
  TRV: { name: 'Thiruvananthapuram Intl', lat: 8.4821, lon: 76.9200 },
  VTZ: { name: 'Visakhapatnam Intl', lat: 17.7212, lon: 83.2245 },
  IXB: { name: 'Bagdogra Airport (Siliguri)', lat: 26.6812, lon: 88.3286 },
  IXM: { name: 'Madurai Airport', lat: 9.8345, lon: 78.0934 },
  UDR: { name: 'Maharana Pratap Airport (Udaipur)', lat: 24.6177, lon: 73.8961 },
  // International Hubs
  DXB: { name: 'Dubai Intl', lat: 25.2532, lon: 55.3657 },
  DOH: { name: 'Hamad Intl (Doha)', lat: 25.2731, lon: 51.6081 },
  AUH: { name: 'Abu Dhabi Intl', lat: 24.4330, lon: 54.6511 },
  SIN: { name: 'Singapore Changi', lat: 1.3644, lon: 103.9915 },
  BKK: { name: 'Suvarnabhumi (Bangkok)', lat: 13.6900, lon: 100.7501 },
  KUL: { name: 'Kuala Lumpur Intl', lat: 2.7456, lon: 101.7072 },
  LHR: { name: 'London Heathrow', lat: 51.4700, lon: -0.4543 },
  CDG: { name: 'Paris Charles de Gaulle', lat: 49.0097, lon: 2.5479 },
  FRA: { name: 'Frankfurt Airport', lat: 50.0379, lon: 8.5622 },
  JFK: { name: 'John F. Kennedy Intl (New York)', lat: 40.6413, lon: -73.7781 },
  SFO: { name: 'San Francisco Intl', lat: 37.6213, lon: -122.3790 },
  LAX: { name: 'Los Angeles Intl', lat: 33.9416, lon: -118.4085 },
  HND: { name: 'Tokyo Haneda', lat: 35.5494, lon: 139.7798 },
  SYD: { name: 'Sydney Kingsford Smith', lat: -33.9399, lon: 151.1753 },
};

// Flight schedule templates
const FLIGHT_TEMPLATES = [
  // Delhi - Mumbai trunk (Multiple operators)
  { icao: '800101', callsign: '6E2034', orig: 'DEL', dest: 'BOM', airline: 'IndiGo', country: 'India', alt: 10668, speed: 230, offset: 0.12 },
  { icao: '800102', callsign: 'AI805', orig: 'DEL', dest: 'BOM', airline: 'Air India', country: 'India', alt: 11277, speed: 235, offset: 0.35 },
  { icao: '800103', callsign: 'UK993', orig: 'DEL', dest: 'BOM', airline: 'Vistara', country: 'India', alt: 10058, speed: 228, offset: 0.62 },
  { icao: '800104', callsign: 'QP1301', orig: 'DEL', dest: 'BOM', airline: 'Akasa Air', country: 'India', alt: 9753, speed: 225, offset: 0.85 },
  { icao: '800105', callsign: 'SG8169', orig: 'BOM', dest: 'DEL', airline: 'SpiceJet', country: 'India', alt: 10363, speed: 232, offset: 0.22 },
  { icao: '800106', callsign: '6E5023', orig: 'BOM', dest: 'DEL', airline: 'IndiGo', country: 'India', alt: 10972, speed: 238, offset: 0.48 },
  { icao: '800107', callsign: 'AI665', orig: 'BOM', dest: 'DEL', airline: 'Air India', country: 'India', alt: 11582, speed: 240, offset: 0.73 },

  // Delhi - Bengaluru trunk
  { icao: '800110', callsign: '6E2131', orig: 'DEL', dest: 'BLR', airline: 'IndiGo', country: 'India', alt: 10972, speed: 236, offset: 0.18 },
  { icao: '800111', callsign: 'AI506', orig: 'DEL', dest: 'BLR', airline: 'Air India', country: 'India', alt: 11582, speed: 242, offset: 0.55 },
  { icao: '800112', callsign: 'UK811', orig: 'DEL', dest: 'BLR', airline: 'Vistara', country: 'India', alt: 10363, speed: 230, offset: 0.78 },
  { icao: '800113', callsign: '6E6112', orig: 'BLR', dest: 'DEL', airline: 'IndiGo', country: 'India', alt: 10668, speed: 234, offset: 0.29 },
  { icao: '800114', callsign: 'QP1352', orig: 'BLR', dest: 'DEL', airline: 'Akasa Air', country: 'India', alt: 10058, speed: 226, offset: 0.67 },

  // Mumbai - Bengaluru
  { icao: '800120', callsign: '6E445', orig: 'BOM', dest: 'BLR', airline: 'IndiGo', country: 'India', alt: 9753, speed: 220, offset: 0.15 },
  { icao: '800121', callsign: 'AI639', orig: 'BOM', dest: 'BLR', airline: 'Air India', country: 'India', alt: 10363, speed: 230, offset: 0.45 },
  { icao: '800122', callsign: 'UK851', orig: 'BOM', dest: 'BLR', airline: 'Vistara', country: 'India', alt: 10058, speed: 225, offset: 0.75 },
  { icao: '800123', callsign: '6E518', orig: 'BLR', dest: 'BOM', airline: 'IndiGo', country: 'India', alt: 9448, speed: 218, offset: 0.38 },

  // Delhi - Hyderabad
  { icao: '800130', callsign: '6E2519', orig: 'DEL', dest: 'HYD', airline: 'IndiGo', country: 'India', alt: 10668, speed: 235, offset: 0.24 },
  { icao: '800131', callsign: 'AI560', orig: 'DEL', dest: 'HYD', airline: 'Air India', country: 'India', alt: 11277, speed: 240, offset: 0.61 },
  { icao: '800132', callsign: 'UK879', orig: 'HYD', dest: 'DEL', airline: 'Vistara', country: 'India', alt: 10363, speed: 228, offset: 0.42 },

  // Delhi - Kolkata
  { icao: '800140', callsign: '6E201', orig: 'DEL', dest: 'CCU', airline: 'IndiGo', country: 'India', alt: 10972, speed: 236, offset: 0.30 },
  { icao: '800141', callsign: 'AI764', orig: 'DEL', dest: 'CCU', airline: 'Air India', country: 'India', alt: 11582, speed: 242, offset: 0.70 },
  { icao: '800142', callsign: 'UK777', orig: 'CCU', dest: 'DEL', airline: 'Vistara', country: 'India', alt: 10363, speed: 232, offset: 0.52 },

  // Mumbai - Chennai
  { icao: '800150', callsign: '6E824', orig: 'BOM', dest: 'MAA', airline: 'IndiGo', country: 'India', alt: 10058, speed: 226, offset: 0.28 },
  { icao: '800151', callsign: 'AI570', orig: 'BOM', dest: 'MAA', airline: 'Air India', country: 'India', alt: 10668, speed: 234, offset: 0.65 },
  { icao: '800152', callsign: '6E911', orig: 'MAA', dest: 'BOM', airline: 'IndiGo', country: 'India', alt: 9753, speed: 222, offset: 0.44 },

  // Hyderabad - Chennai
  { icao: '800160', callsign: '6E324', orig: 'HYD', dest: 'MAA', airline: 'IndiGo', country: 'India', alt: 7620, speed: 210, offset: 0.33 },
  { icao: '800161', callsign: 'AI544', orig: 'MAA', dest: 'HYD', airline: 'Air India', country: 'India', alt: 7924, speed: 215, offset: 0.72 },

  // Bengaluru - Hyderabad
  { icao: '800165', callsign: '6E522', orig: 'BLR', dest: 'HYD', airline: 'IndiGo', country: 'India', alt: 7315, speed: 208, offset: 0.20 },
  { icao: '800166', callsign: 'QP1501', orig: 'HYD', dest: 'BLR', airline: 'Akasa Air', country: 'India', alt: 7620, speed: 212, offset: 0.58 },

  // Delhi - Srinagar & Northern routes
  { icao: '800170', callsign: '6E2142', orig: 'DEL', dest: 'SXR', airline: 'IndiGo', country: 'India', alt: 9144, speed: 220, offset: 0.35 },
  { icao: '800171', callsign: 'AI825', orig: 'DEL', dest: 'SXR', airline: 'Air India', country: 'India', alt: 9753, speed: 228, offset: 0.78 },
  { icao: '800172', callsign: 'SG8184', orig: 'SXR', dest: 'DEL', airline: 'SpiceJet', country: 'India', alt: 8839, speed: 216, offset: 0.50 },
  { icao: '800173', callsign: '6E2045', orig: 'DEL', dest: 'ATQ', airline: 'IndiGo', country: 'India', alt: 6705, speed: 205, offset: 0.40 },

  // Goa Leisure routes
  { icao: '800180', callsign: '6E342', orig: 'BOM', dest: 'GOI', airline: 'IndiGo', country: 'India', alt: 6400, speed: 200, offset: 0.25 },
  { icao: '800181', callsign: 'AI657', orig: 'DEL', dest: 'GOI', airline: 'Air India', country: 'India', alt: 10668, speed: 236, offset: 0.54 },
  { icao: '800182', callsign: 'QP1411', orig: 'BLR', dest: 'GOI', airline: 'Akasa Air', country: 'India', alt: 6096, speed: 195, offset: 0.70 },

  // Kerala routes
  { icao: '800190', callsign: '6E623', orig: 'BLR', dest: 'COK', airline: 'IndiGo', country: 'India', alt: 6705, speed: 205, offset: 0.30 },
  { icao: '800191', callsign: 'AI681', orig: 'BOM', dest: 'COK', airline: 'Air India', country: 'India', alt: 9753, speed: 225, offset: 0.60 },
  { icao: '800192', callsign: '6E533', orig: 'TRV', dest: 'BOM', airline: 'IndiGo', country: 'India', alt: 10363, speed: 232, offset: 0.45 },

  // Western & Central India
  { icao: '800200', callsign: '6E205', orig: 'BOM', dest: 'AMD', airline: 'IndiGo', country: 'India', alt: 6705, speed: 205, offset: 0.32 },
  { icao: '800201', callsign: 'AI613', orig: 'DEL', dest: 'AMD', airline: 'Air India', country: 'India', alt: 8534, speed: 222, offset: 0.64 },
  { icao: '800202', callsign: '6E421', orig: 'DEL', dest: 'PNQ', airline: 'IndiGo', country: 'India', alt: 10363, speed: 230, offset: 0.48 },
  { icao: '800203', callsign: 'AI851', orig: 'DEL', dest: 'PNQ', airline: 'Air India', country: 'India', alt: 10972, speed: 238, offset: 0.82 },
  { icao: '800204', callsign: '6E673', orig: 'BOM', dest: 'IDR', airline: 'IndiGo', country: 'India', alt: 7315, speed: 210, offset: 0.36 },
  { icao: '800205', callsign: '6E492', orig: 'DEL', dest: 'NAG', airline: 'IndiGo', country: 'India', alt: 9144, speed: 222, offset: 0.58 },

  // Eastern & North-Eastern India
  { icao: '800210', callsign: '6E212', orig: 'CCU', dest: 'GAU', airline: 'IndiGo', country: 'India', alt: 6705, speed: 205, offset: 0.35 },
  { icao: '800211', callsign: 'AI731', orig: 'CCU', dest: 'GAU', airline: 'Air India', country: 'India', alt: 7010, speed: 210, offset: 0.75 },
  { icao: '800212', callsign: '6E384', orig: 'CCU', dest: 'PAT', airline: 'IndiGo', country: 'India', alt: 6096, speed: 198, offset: 0.42 },
  { icao: '800213', callsign: '6E891', orig: 'DEL', dest: 'LKO', airline: 'IndiGo', country: 'India', alt: 6400, speed: 202, offset: 0.28 },
  { icao: '800214', callsign: 'AI407', orig: 'DEL', dest: 'VNS', airline: 'Air India', country: 'India', alt: 7924, speed: 218, offset: 0.62 },
  { icao: '800215', callsign: '6E611', orig: 'CCU', dest: 'BBI', airline: 'IndiGo', country: 'India', alt: 5486, speed: 190, offset: 0.50 },
  { icao: '800216', callsign: '6E801', orig: 'MAA', dest: 'IXZ', airline: 'IndiGo', country: 'India', alt: 10668, speed: 236, offset: 0.45 },

  // International Indian Flights (Middle East, SE Asia, Europe)
  { icao: '800250', callsign: 'UAE501', orig: 'BOM', dest: 'DXB', airline: 'Emirates', country: 'United Arab Emirates', alt: 10972, speed: 245, offset: 0.32 },
  { icao: '800251', callsign: 'UAE505', orig: 'DEL', dest: 'DXB', airline: 'Emirates', country: 'United Arab Emirates', alt: 11582, speed: 248, offset: 0.68 },
  { icao: '800252', callsign: 'QTR571', orig: 'DEL', dest: 'DOH', airline: 'Qatar Airways', country: 'Qatar', alt: 11277, speed: 242, offset: 0.40 },
  { icao: '800253', callsign: 'QTR573', orig: 'BLR', dest: 'DOH', airline: 'Qatar Airways', country: 'Qatar', alt: 11887, speed: 246, offset: 0.72 },
  { icao: '800254', callsign: 'ETD275', orig: 'HYD', dest: 'AUH', airline: 'Etihad Airways', country: 'United Arab Emirates', alt: 10668, speed: 240, offset: 0.55 },
  { icao: '800255', callsign: 'SIA403', orig: 'DEL', dest: 'SIN', airline: 'Singapore Airlines', country: 'Singapore', alt: 11887, speed: 250, offset: 0.28 },
  { icao: '800256', callsign: 'SIA421', orig: 'BOM', dest: 'SIN', airline: 'Singapore Airlines', country: 'Singapore', alt: 12192, speed: 252, offset: 0.63 },
  { icao: '800257', callsign: 'SIA411', orig: 'MAA', dest: 'SIN', airline: 'Singapore Airlines', country: 'Singapore', alt: 11582, speed: 248, offset: 0.85 },
  { icao: '800258', callsign: 'THA314', orig: 'CCU', dest: 'BKK', airline: 'Thai Airways', country: 'Thailand', alt: 10668, speed: 240, offset: 0.48 },
  { icao: '800259', callsign: 'AIC161', orig: 'DEL', dest: 'LHR', airline: 'Air India', country: 'India', alt: 11582, speed: 255, offset: 0.35 },
  { icao: '800260', callsign: 'BAW143', orig: 'LHR', dest: 'DEL', airline: 'British Airways', country: 'United Kingdom', alt: 11887, speed: 258, offset: 0.70 },
  { icao: '800261', callsign: 'DLH755', orig: 'BLR', dest: 'FRA', airline: 'Lufthansa', country: 'Germany', alt: 11277, speed: 250, offset: 0.52 },
  { icao: '800262', callsign: 'AFR217', orig: 'BOM', dest: 'CDG', airline: 'Air France', country: 'France', alt: 11582, speed: 252, offset: 0.65 },

  // Global Transcontinental Corridors (US, Europe, Transatlantic, Pacific)
  { icao: '400b11', callsign: 'BAW117', orig: 'LHR', dest: 'JFK', airline: 'British Airways', country: 'United Kingdom', alt: 11887, speed: 255, offset: 0.30 },
  { icao: 'a00112', callsign: 'UAL14', orig: 'JFK', dest: 'LHR', airline: 'United Airlines', country: 'United States', alt: 11277, speed: 258, offset: 0.75 },
  { icao: '390a21', callsign: 'AFR006', orig: 'CDG', dest: 'JFK', airline: 'Air France', country: 'France', alt: 11582, speed: 252, offset: 0.45 },
  { icao: 'a00223', callsign: 'AAL177', orig: 'JFK', dest: 'SFO', airline: 'American Airlines', country: 'United States', alt: 10668, speed: 245, offset: 0.25 },
  { icao: 'a00224', callsign: 'UAL225', orig: 'SFO', dest: 'JFK', airline: 'United Airlines', country: 'United States', alt: 11277, speed: 250, offset: 0.65 },
  { icao: 'a00331', callsign: 'DAL3', orig: 'JFK', dest: 'LAX', airline: 'Delta Air Lines', country: 'United States', alt: 10972, speed: 248, offset: 0.40 },
  { icao: '3c0441', callsign: 'DLH1112', orig: 'FRA', dest: 'LHR', airline: 'Lufthansa', country: 'Germany', alt: 8534, speed: 220, offset: 0.50 },
  { icao: '840551', callsign: 'ANA106', orig: 'HND', dest: 'LAX', airline: 'All Nippon Airways', country: 'Japan', alt: 12192, speed: 260, offset: 0.38 },
  { icao: '7c0661', callsign: 'QFA421', orig: 'SYD', dest: 'SIN', airline: 'Qantas', country: 'Australia', alt: 11582, speed: 255, offset: 0.55 },
];

/**
 * Great-circle distance between two lat/lon coordinates in kilometers.
 */
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Initial bearing from (lat1, lon1) to (lat2, lon2) in degrees [0, 360).
 */
function getBearingDeg(lat1, lon1, lat2, lon2) {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const theta = Math.atan2(y, x);
  return ((((theta * 180) / Math.PI) % 360) + 360) % 360;
}

/**
 * Generate a complete real-time snapshot of simulated moving flights
 * conforming to OpenSky Network `/states/all` format.
 */
export function getLiveFlightStates() {
  const nowMs = Date.now();
  const nowSec = Math.floor(nowMs / 1000);
  const states = [];
  const emittedIcaos = new Set();

  // 1. Process Core Trunk Flights (FLIGHT_TEMPLATES)
  for (let i = 0; i < FLIGHT_TEMPLATES.length; i++) {
    const flight = FLIGHT_TEMPLATES[i];
    const orig = AIRPORTS[flight.orig];
    const dest = AIRPORTS[flight.dest];
    if (!orig || !dest) continue;

    const totalDistKm = getDistanceKm(orig.lat, orig.lon, dest.lat, dest.lon);
    if (!(totalDistKm > 10)) continue;

    const speedKmS = (flight.speed * 3.6) / 3600;
    const oneWayDurationSec = totalDistKm / speedKmS;
    const roundTripDurationSec = oneWayDurationSec * 2;

    const timeProgressSec = (nowSec + flight.offset * roundTripDurationSec) % roundTripDurationSec;
    const isOutbound = timeProgressSec < oneWayDurationSec;
    const routeProgress = isOutbound
      ? timeProgressSec / oneWayDurationSec
      : (roundTripDurationSec - timeProgressSec) / oneWayDurationSec;

    const t = Math.max(0.001, Math.min(0.999, routeProgress));
    const startPt = isOutbound ? orig : dest;
    const endPt = isOutbound ? dest : orig;
    const currentLat = startPt.lat + (endPt.lat - startPt.lat) * t;
    const currentLon = startPt.lon + (endPt.lon - startPt.lon) * t;
    const currentHeading = getBearingDeg(startPt.lat, startPt.lon, endPt.lat, endPt.lon);

    const baroAlt = Math.round(flight.alt);
    const geoAlt = baroAlt + 24;
    const callsign = (flight.callsign + '        ').slice(0, 8);

    emittedIcaos.add(flight.icao.toLowerCase());
    states.push([
      flight.icao,
      callsign,
      flight.country,
      nowSec,
      nowSec,
      Math.round(currentLon * 10000) / 10000,
      Math.round(currentLat * 10000) / 10000,
      baroAlt,
      false,
      flight.speed,
      Math.round(currentHeading * 10) / 10,
      0.0,
      null,
      geoAlt,
      '3401',
      false,
      0,
    ]);
  }

  // 2. Process High-Fidelity Commercial Flight Dataset (USER_COMMERCIAL_FLIGHTS)
  const legSec = 1800; // 30-minute leg along corridor
  const roundTripSec = legSec * 2;

  for (let i = 0; i < USER_COMMERCIAL_FLIGHTS.length; i++) {
    const f = USER_COMMERCIAL_FLIGHTS[i];
    const icao = f.icao24.toLowerCase();
    if (emittedIcaos.has(icao)) continue;
    emittedIcaos.add(icao);

    const speedKnots = Number.isFinite(f.speed_knots) && f.speed_knots > 50 ? f.speed_knots : 420;
    const speedMps = speedKnots * 0.514444;
    const baseHeading = Number.isFinite(f.heading) ? f.heading : 90;
    const baseAlt = Number.isFinite(f.alt) && f.alt > 100 ? f.alt : 10600;

    // Phase offset per aircraft for desynchronized realism
    const seed = (parseInt(icao.slice(-4), 16) || i * 19) % roundTripSec;
    const timeProgress = (nowSec + seed) % roundTripSec;
    const isOutbound = timeProgress < legSec;
    const legProgressSec = isOutbound ? timeProgress : (roundTripSec - timeProgress);

    const heading = isOutbound ? baseHeading : (baseHeading + 180) % 360;
    const distanceM = speedMps * legProgressSec;

    const pos = moveGreatCircle(f.lat, f.lng, baseHeading, distanceM);
    const airlineMeta = AIRLINE_INFO[f.airline_code];
    const country = airlineMeta?.country || resolveCountryFallback(pos.lat, pos.lon);

    const baroAlt = Math.round(baseAlt);
    const geoAlt = baroAlt + 24;
    const callsign = ((f.callsign || icao.toUpperCase()) + '        ').slice(0, 8);

    states.push([
      icao,
      callsign,
      country,
      nowSec,
      nowSec,
      Math.round(pos.lon * 10000) / 10000,
      Math.round(pos.lat * 10000) / 10000,
      baroAlt,
      f.grounded === true,
      Math.round(speedMps * 10) / 10,
      Math.round(heading * 10) / 10,
      0.0,
      null,
      geoAlt,
      f.squawk || '2000',
      false,
      0,
    ]);
  }

  return {
    time: nowSec,
    states,
  };
}

/**
 * Generate a historical flight track path for `/api/opensky-track?icao24=...`.
 * Returns an array of waypoints: [time, latitude, longitude, baro_altitude, true_track, on_ground]
 */
export function getLiveFlightTrack(icao24) {
  const normIcao = String(icao24 || '').trim().toLowerCase();
  const flight = FLIGHT_TEMPLATES.find((f) => f.icao.toLowerCase() === normIcao);
  const nowSec = Math.floor(Date.now() / 1000);

  if (flight) {
    const orig = AIRPORTS[flight.orig];
    const dest = AIRPORTS[flight.dest];
    if (!orig || !dest) return null;

    const totalDistKm = getDistanceKm(orig.lat, orig.lon, dest.lat, dest.lon);
    const speedKmS = (flight.speed * 3.6) / 3600;
    const oneWayDurationSec = totalDistKm / speedKmS;
    const roundTripDurationSec = oneWayDurationSec * 2;

    const timeProgressSec = (nowSec + flight.offset * roundTripDurationSec) % roundTripDurationSec;
    const isOutbound = timeProgressSec < oneWayDurationSec;
    const currentT = isOutbound
      ? timeProgressSec / oneWayDurationSec
      : (roundTripDurationSec - timeProgressSec) / oneWayDurationSec;

    const path = [];
    const numSteps = 20;
    const heading = isOutbound
      ? getBearingDeg(orig.lat, orig.lon, dest.lat, dest.lon)
      : getBearingDeg(dest.lat, dest.lon, orig.lat, orig.lon);

    for (let s = 0; s <= numSteps; s++) {
      const fraction = (s / numSteps) * currentT;
      const lat = isOutbound
        ? orig.lat + (dest.lat - orig.lat) * fraction
        : dest.lat + (orig.lat - dest.lat) * fraction;
      const lon = isOutbound
        ? orig.lon + (dest.lon - orig.lon) * fraction
        : dest.lon + (orig.lon - dest.lon) * fraction;

      const timeAtStep = nowSec - Math.round((currentT - fraction) * oneWayDurationSec);
      path.push([
        timeAtStep,
        Math.round(lat * 10000) / 10000,
        Math.round(lon * 10000) / 10000,
        Math.round(flight.alt),
        Math.round(heading * 10) / 10,
        s === 0
      ]);
    }

    return {
      icao24: normIcao,
      callsign: flight.callsign,
      startTime: path[0]?.[0] || nowSec,
      endTime: nowSec,
      path,
    };
  }

  // Check user commercial flight dataset
  const uFlight = USER_COMMERCIAL_FLIGHTS.find((f) => f.icao24.toLowerCase() === normIcao);
  if (uFlight) {
    const speedKnots = Number.isFinite(uFlight.speed_knots) && uFlight.speed_knots > 50 ? uFlight.speed_knots : 420;
    const speedMps = speedKnots * 0.514444;
    const baseHeading = Number.isFinite(uFlight.heading) ? uFlight.heading : 90;
    const baseAlt = Number.isFinite(uFlight.alt) && uFlight.alt > 100 ? uFlight.alt : 10600;

    const legSec = 1800;
    const roundTripSec = legSec * 2;
    const seed = (parseInt(normIcao.slice(-4), 16) || 0) % roundTripSec;
    const timeProgress = (nowSec + seed) % roundTripSec;
    const isOutbound = timeProgress < legSec;
    const legProgressSec = isOutbound ? timeProgress : (roundTripSec - timeProgress);

    const curHeading = isOutbound ? baseHeading : (baseHeading + 180) % 360;
    const curDistanceM = speedMps * legProgressSec;

    const path = [];
    const numSteps = 20;
    const stepDuration = Math.min(15, Math.max(5, Math.floor(legProgressSec / numSteps)));

    for (let s = 0; s <= numSteps; s++) {
      const stepBackSec = (numSteps - s) * stepDuration;
      const stepDistM = Math.max(0, curDistanceM - (isOutbound ? stepBackSec * speedMps : -stepBackSec * speedMps));
      const pt = moveGreatCircle(uFlight.lat, uFlight.lng, baseHeading, stepDistM);
      path.push([
        nowSec - stepBackSec,
        Math.round(pt.lat * 10000) / 10000,
        Math.round(pt.lon * 10000) / 10000,
        Math.round(baseAlt),
        Math.round(curHeading * 10) / 10,
        false
      ]);
    }

    return {
      icao24: normIcao,
      callsign: uFlight.callsign,
      startTime: path[0]?.[0] || nowSec,
      endTime: nowSec,
      path,
    };
  }

  return null;
}

/**
 * Generate simulated military patrol flights for `/api/adsblol/mil`.
 */
export function getLiveMilitaryFlightStates() {
  const nowMs = Date.now();
  const nowSec = Math.floor(nowMs / 1000);

  const MILITARY_SORTIES = [
    // Indian Air Force
    { hex: '7fff01', flight: 'IAF101', type: 'SU30', desc: 'Su-30MKI Flanker-H (Ambala AFS)', lat: 30.37, lon: 76.81, heading: 140, alt: 8500, gs: 280 },
    { hex: '7fff02', flight: 'IAF102', type: 'RFLE', desc: 'Dassault Rafale (Ambala AFS)', lat: 30.55, lon: 76.95, heading: 320, alt: 9200, gs: 300 },
    { hex: '7fff03', flight: 'IAF201', type: 'TEJAS', desc: 'LCA Tejas Mk1 (Sulur AFS)', lat: 11.01, lon: 77.16, heading: 210, alt: 7800, gs: 270 },
    { hex: '7fff04', flight: 'IAF301', type: 'C17', desc: 'Boeing C-17 Globemaster III (Hindon AFS)', lat: 28.70, lon: 77.36, heading: 95, alt: 9500, gs: 240 },
    { hex: '7fff05', flight: 'IAF401', type: 'E3TF', desc: 'Netra AEW&C (Bhatinda AFS)', lat: 30.23, lon: 74.95, heading: 270, alt: 10500, gs: 230 },
    { hex: '7fff06', flight: 'IAF501', type: 'SU30', desc: 'Su-30MKI Patrol (Pune AFS)', lat: 18.58, lon: 73.92, heading: 250, alt: 8900, gs: 285 },
    { hex: '7fff07', flight: 'IAF601', type: 'RFLE', desc: 'Dassault Rafale (Hasimara AFS)', lat: 26.70, lon: 89.37, heading: 80, alt: 9800, gs: 310 },
    { hex: '7fff08', flight: 'IAF701', type: 'P8I', desc: 'Boeing P-8I Neptune (INS Hansa, Goa)', lat: 15.38, lon: 73.83, heading: 260, alt: 7500, gs: 235 },
  ];

  const ac = MILITARY_SORTIES.map((s, idx) => {
    // Dynamic circular / elliptical patrol motion
    const cycle = (nowSec / 120 + idx * 0.4) * Math.PI * 2;
    const patrolRadiusDeg = 0.45;
    const lat = s.lat + Math.sin(cycle) * patrolRadiusDeg;
    const lon = s.lon + Math.cos(cycle) * patrolRadiusDeg * 1.2;
    const track = Math.round((((cycle + Math.PI / 2) * 180) / Math.PI) % 360);

    return {
      hex: s.hex,
      flight: s.flight,
      lat: Math.round(lat * 10000) / 10000,
      lon: Math.round(lon * 10000) / 10000,
      alt_baro: s.alt,
      alt_geom: s.alt + 20,
      track,
      gs: s.gs,
      type: s.type,
      desc: s.desc,
      category: 'A1',
      military: true,
      seen: 0.2,
      messages: 1240,
    };
  });

  return {
    ac,
    msg: 'No error',
    now: nowSec,
    total: ac.length,
    ctime: nowSec,
  };
}
