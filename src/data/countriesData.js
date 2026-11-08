/**
 * Curated Global Geographic Hierarchy: Countries -> Cities -> Towns & Villages.
 * Provides instant zero-latency lookup for towns, cities, and villages scoped to
 * each country with calibrated close-up coordinates for road and street viewing.
 *
 * @module data/countriesData
 */

import { INDIA_NOTABLE_COORDINATES, INDIA_STATES_AND_UTS, findIndiaPlace } from './indiaData.js';

export const COUNTRIES = [
  {
    id: 'india',
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    lat: 20.5937,
    lon: 78.9629,
    rangeM: 2800000,
    cities: [
      { name: 'New Delhi', lat: 28.6139, lon: 77.2090, state: 'Delhi', type: 'city' },
      { name: 'Mumbai', lat: 19.0760, lon: 72.8777, state: 'Maharashtra', type: 'city' },
      { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, state: 'Karnataka', type: 'city' },
      { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, state: 'Telangana', type: 'city' },
      { name: 'Chennai', lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu', type: 'city' },
      { name: 'Kolkata', lat: 22.5726, lon: 88.3639, state: 'West Bengal', type: 'city' },
      { name: 'Jaipur', lat: 26.9124, lon: 75.7873, state: 'Rajasthan', type: 'city' },
      { name: 'Varanasi', lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh', type: 'city' },
      { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, state: 'Gujarat', type: 'city' },
      { name: 'Pune', lat: 18.5204, lon: 73.8567, state: 'Maharashtra', type: 'city' },
      { name: 'Lucknow', lat: 26.8467, lon: 80.9462, state: 'Uttar Pradesh', type: 'city' },
      { name: 'Agra', lat: 27.1767, lon: 78.0081, state: 'Uttar Pradesh', type: 'city' },
    ],
    villagesAndTowns: [
      { name: 'Hampi', lat: 15.3350, lon: 76.4600, state: 'Karnataka', type: 'village', tag: 'Heritage Village' },
      { name: 'Ayodhya', lat: 26.7922, lon: 82.1998, state: 'Uttar Pradesh', type: 'town', tag: 'Ancient City' },
      { name: 'Bodh Gaya', lat: 24.6961, lon: 84.9869, state: 'Bihar', type: 'town', tag: 'Heritage Site' },
      { name: 'Khajuraho', lat: 24.8318, lon: 79.9199, state: 'Madhya Pradesh', type: 'town', tag: 'Historic Town' },
      { name: 'Pushkar', lat: 26.4897, lon: 74.5511, state: 'Rajasthan', type: 'town', tag: 'Sacred Town' },
      { name: 'Rishikesh', lat: 30.0869, lon: 78.2676, state: 'Uttarakhand', type: 'town', tag: 'Yoga Capital' },
      { name: 'Mawlynnong', lat: 25.2014, lon: 91.9048, state: 'Meghalaya', type: 'village', tag: 'Cleanest Village' },
      { name: 'Kedarnath', lat: 30.7346, lon: 79.0669, state: 'Uttarakhand', type: 'village', tag: 'Himalayan Shrine' },
      { name: 'Leh', lat: 34.1526, lon: 77.5771, state: 'Ladakh', type: 'town', tag: 'High Altitude' },
      { name: 'Manali', lat: 32.2432, lon: 77.1892, state: 'Himachal Pradesh', type: 'town', tag: 'Hill Town' },
      { name: 'Ooty', lat: 11.4102, lon: 76.6950, state: 'Tamil Nadu', type: 'town', tag: 'Queen of Hills' },
      { name: 'Kasol', lat: 32.0100, lon: 77.3150, state: 'Himachal Pradesh', type: 'village', tag: 'Valley Village' },
      { name: 'Kuldhara', lat: 26.8524, lon: 70.7850, state: 'Rajasthan', type: 'village', tag: 'Historic Village' },
      { name: 'Lepakshi', lat: 13.8044, lon: 77.6074, state: 'Andhra Pradesh', type: 'village', tag: 'Temple Village' },
    ],
  },
  {
    id: 'pakistan',
    name: 'Pakistan',
    code: 'PK',
    flag: '🇵🇰',
    lat: 30.3753,
    lon: 69.3451,
    rangeM: 2000000,
    cities: [
      { name: 'Islamabad', lat: 33.6844, lon: 73.0479, state: 'Federal Capital', type: 'city' },
      { name: 'Karachi', lat: 24.8607, lon: 67.0011, state: 'Sindh', type: 'city' },
      { name: 'Lahore', lat: 31.5204, lon: 74.3587, state: 'Punjab', type: 'city' },
      { name: 'Rawalpindi', lat: 33.5651, lon: 73.0169, state: 'Punjab', type: 'city' },
      { name: 'Peshawar', lat: 34.0151, lon: 71.5249, state: 'Khyber Pakhtunkhwa', type: 'city' },
      { name: 'Quetta', lat: 30.1798, lon: 66.9750, state: 'Balochistan', type: 'city' },
      { name: 'Faisalabad', lat: 31.4504, lon: 73.1350, state: 'Punjab', type: 'city' },
      { name: 'Multan', lat: 30.1575, lon: 71.5249, state: 'Punjab', type: 'city' },
    ],
    villagesAndTowns: [
      { name: 'Gwadar', lat: 25.1264, lon: 62.3225, state: 'Balochistan', type: 'town', tag: 'Port City' },
      { name: 'Hunza', lat: 36.3167, lon: 74.6500, state: 'Gilgit-Baltistan', type: 'village', tag: 'Mountain Valley' },
      { name: 'Skardu', lat: 35.2971, lon: 75.6333, state: 'Gilgit-Baltistan', type: 'town', tag: 'Gateway to K2' },
      { name: 'Taxila', lat: 33.7463, lon: 72.8397, state: 'Punjab', type: 'town', tag: 'Ancient City' },
      { name: 'Mohenjo-daro', lat: 27.3294, lon: 68.1386, state: 'Sindh', type: 'village', tag: 'Indus Valley Civilisation' },
    ],
  },
  {
    id: 'usa',
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    lat: 37.0902,
    lon: -95.7129,
    rangeM: 4500000,
    cities: [
      { name: 'New York', lat: 40.7128, lon: -74.0060, state: 'New York', type: 'city' },
      { name: 'San Francisco', lat: 37.7749, lon: -122.4194, state: 'California', type: 'city' },
      { name: 'Austin', lat: 30.2672, lon: -97.7431, state: 'Texas', type: 'city' },
      { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, state: 'California', type: 'city' },
      { name: 'Chicago', lat: 41.8781, lon: -87.6298, state: 'Illinois', type: 'city' },
      { name: 'Seattle', lat: 47.6062, lon: -122.3321, state: 'Washington', type: 'city' },
      { name: 'Miami', lat: 25.7617, lon: -80.1918, state: 'Florida', type: 'city' },
      { name: 'Washington D.C.', lat: 38.9072, lon: -77.0369, state: 'District of Columbia', type: 'city' },
    ],
    villagesAndTowns: [
      { name: 'Aspen', lat: 39.1911, lon: -106.8175, state: 'Colorado', type: 'town', tag: 'Mountain Town' },
      { name: 'Sedona', lat: 34.8697, lon: -111.7610, state: 'Arizona', type: 'town', tag: 'Red Rock Town' },
      { name: 'Carmel-by-the-Sea', lat: 36.5552, lon: -121.9233, state: 'California', type: 'village', tag: 'Coastal Village' },
      { name: 'Key West', lat: 24.5551, lon: -81.7800, state: 'Florida', type: 'town', tag: 'Island Town' },
      { name: 'Moab', lat: 38.5733, lon: -109.5498, state: 'Utah', type: 'town', tag: 'Canyon Town' },
      { name: 'Bar Harbor', lat: 44.3876, lon: -68.2039, state: 'Maine', type: 'town', tag: 'Harbor Town' },
    ],
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    lat: 55.3781,
    lon: -3.4360,
    rangeM: 1800000,
    cities: [
      { name: 'London', lat: 51.5074, lon: -0.1278, state: 'England', type: 'city' },
      { name: 'Edinburgh', lat: 55.9533, lon: -3.1883, state: 'Scotland', type: 'city' },
      { name: 'Manchester', lat: 53.4808, lon: -2.2426, state: 'England', type: 'city' },
      { name: 'Birmingham', lat: 52.4862, lon: -1.8904, state: 'England', type: 'city' },
      { name: 'Oxford', lat: 51.7520, lon: -1.2577, state: 'England', type: 'city' },
      { name: 'Cambridge', lat: 52.2053, lon: 0.1218, state: 'England', type: 'city' },
    ],
    villagesAndTowns: [
      { name: 'Castle Combe', lat: 51.4932, lon: -2.2285, state: 'Wiltshire', type: 'village', tag: 'Historic Village' },
      { name: 'Bibury', lat: 51.7584, lon: -1.8328, state: 'Cotswolds', type: 'village', tag: 'Cotswolds Village' },
      { name: 'Bath', lat: 51.3811, lon: -2.3590, state: 'Somerset', type: 'town', tag: 'Roman Spa Town' },
      { name: 'Windermere', lat: 54.3807, lon: -2.9061, state: 'Cumbria', type: 'town', tag: 'Lake District' },
      { name: 'St Ives', lat: 50.2111, lon: -5.4804, state: 'Cornwall', type: 'town', tag: 'Coastal Town' },
      { name: 'Clovelly', lat: 50.9991, lon: -4.3995, state: 'Devon', type: 'village', tag: 'Cliffside Village' },
    ],
  },
  {
    id: 'japan',
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    lat: 36.2048,
    lon: 138.2529,
    rangeM: 2000000,
    cities: [
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503, state: 'Kanto', type: 'city' },
      { name: 'Kyoto', lat: 35.0116, lon: 135.7681, state: 'Kansai', type: 'city' },
      { name: 'Osaka', lat: 34.6937, lon: 135.5023, state: 'Kansai', type: 'city' },
      { name: 'Yokohama', lat: 35.4437, lon: 139.6380, state: 'Kanagawa', type: 'city' },
      { name: 'Sapporo', lat: 43.0618, lon: 141.3545, state: 'Hokkaido', type: 'city' },
      { name: 'Hiroshima', lat: 34.3853, lon: 132.4553, state: 'Chugoku', type: 'city' },
    ],
    villagesAndTowns: [
      { name: 'Shirakawa-go', lat: 36.2562, lon: 136.9066, state: 'Gifu', type: 'village', tag: 'Gassho Village' },
      { name: 'Hakone', lat: 35.2323, lon: 139.1069, state: 'Kanagawa', type: 'town', tag: 'Onsen Town' },
      { name: 'Nara', lat: 34.6851, lon: 135.8048, state: 'Nara', type: 'city', tag: 'Ancient Capital' },
      { name: 'Takayama', lat: 36.1460, lon: 137.2522, state: 'Gifu', type: 'town', tag: 'Old Town' },
      { name: 'Ine no Funaya', lat: 35.6706, lon: 135.2891, state: 'Kyoto', type: 'village', tag: 'Boathouse Village' },
    ],
  },
  {
    id: 'uae',
    name: 'United Arab Emirates',
    code: 'AE',
    flag: '🇦🇪',
    lat: 23.4241,
    lon: 53.8478,
    rangeM: 800000,
    cities: [
      { name: 'Dubai', lat: 25.2048, lon: 55.2708, state: 'Dubai', type: 'city' },
      { name: 'Abu Dhabi', lat: 24.4539, lon: 54.3773, state: 'Abu Dhabi', type: 'city' },
      { name: 'Sharjah', lat: 25.3463, lon: 55.4209, state: 'Sharjah', type: 'city' },
      { name: 'Al Ain', lat: 24.2075, lon: 55.7447, state: 'Abu Dhabi', type: 'city' },
    ],
    villagesAndTowns: [
      { name: 'Hatta', lat: 24.8142, lon: 56.1246, state: 'Dubai', type: 'village', tag: 'Mountain Village' },
      { name: 'Al Badia', lat: 25.4333, lon: 56.3500, state: 'Fujairah', type: 'village', tag: 'Historic Village' },
      { name: 'Khor Fakkan', lat: 25.3374, lon: 56.3420, state: 'Sharjah', type: 'town', tag: 'Coastal Town' },
    ],
  },
  {
    id: 'france',
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    lat: 46.2276,
    lon: 2.2137,
    rangeM: 1600000,
    cities: [
      { name: 'Paris', lat: 48.8566, lon: 2.3522, state: 'Île-de-France', type: 'city' },
      { name: 'Marseille', lat: 43.2965, lon: 5.3698, state: 'Provence', type: 'city' },
      { name: 'Lyon', lat: 45.7640, lon: 4.8357, state: 'Auvergne-Rhône-Alpes', type: 'city' },
      { name: 'Nice', lat: 43.7102, lon: 7.2620, state: 'Côte d’Azur', type: 'city' },
      { name: 'Bordeaux', lat: 44.8378, lon: -0.5792, state: 'Nouvelle-Aquitaine', type: 'city' },
    ],
    villagesAndTowns: [
      { name: 'Mont Saint-Michel', lat: 48.6360, lon: -1.5115, state: 'Normandy', type: 'village', tag: 'Island Abbey' },
      { name: 'Giverny', lat: 49.0760, lon: 1.5332, state: 'Normandy', type: 'village', tag: 'Monet Village' },
      { name: 'Rocamadour', lat: 44.7994, lon: 1.6186, state: 'Occitanie', type: 'village', tag: 'Cliffside Village' },
      { name: 'Eguisheim', lat: 48.0428, lon: 7.3061, state: 'Alsace', type: 'village', tag: 'Medieval Village' },
    ],
  },
  {
    id: 'germany',
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    lat: 51.1657,
    lon: 10.4515,
    rangeM: 1400000,
    cities: [
      { name: 'Berlin', lat: 52.5200, lon: 13.4050, state: 'Berlin', type: 'city' },
      { name: 'Munich', lat: 48.1351, lon: 11.5820, state: 'Bavaria', type: 'city' },
      { name: 'Frankfurt', lat: 50.1109, lon: 8.6821, state: 'Hesse', type: 'city' },
      { name: 'Hamburg', lat: 53.5511, lon: 9.9937, state: 'Hamburg', type: 'city' },
      { name: 'Cologne', lat: 50.9375, lon: 6.9603, state: 'North Rhine-Westphalia', type: 'city' },
    ],
    villagesAndTowns: [
      { name: 'Rothenburg ob der Tauber', lat: 49.3768, lon: 10.1788, state: 'Bavaria', type: 'town', tag: 'Walled Town' },
      { name: 'Füssen', lat: 47.5714, lon: 10.7014, state: 'Bavaria', type: 'town', tag: 'Castle Town' },
      { name: 'Cochem', lat: 50.1469, lon: 7.1664, state: 'Rhineland', type: 'town', tag: 'Moselle Town' },
    ],
  },
  {
    id: 'canada',
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    lat: 56.1304,
    lon: -106.3468,
    rangeM: 5000000,
    cities: [
      { name: 'Toronto', lat: 43.6532, lon: -79.3832, state: 'Ontario', type: 'city' },
      { name: 'Vancouver', lat: 49.2827, lon: -123.1207, state: 'British Columbia', type: 'city' },
      { name: 'Montreal', lat: 45.5017, lon: -73.5673, state: 'Quebec', type: 'city' },
      { name: 'Calgary', lat: 51.0447, lon: -114.0719, state: 'Alberta', type: 'city' },
    ],
    villagesAndTowns: [
      { name: 'Banff', lat: 51.1784, lon: -115.5708, state: 'Alberta', type: 'town', tag: 'Rocky Mtn Town' },
      { name: 'Whistler', lat: 50.1163, lon: -122.9574, state: 'British Columbia', type: 'town', tag: 'Alpine Village' },
      { name: 'Niagara-on-the-Lake', lat: 43.2550, lon: -79.0773, state: 'Ontario', type: 'town', tag: 'Historic Town' },
    ],
  },
  {
    id: 'australia',
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    lat: -25.2744,
    lon: 133.7751,
    rangeM: 4500000,
    cities: [
      { name: 'Sydney', lat: -33.8688, lon: 151.2093, state: 'New South Wales', type: 'city' },
      { name: 'Melbourne', lat: -37.8136, lon: 144.9631, state: 'Victoria', type: 'city' },
      { name: 'Brisbane', lat: -27.4698, lon: 153.0251, state: 'Queensland', type: 'city' },
      { name: 'Perth', lat: -31.9505, lon: 115.8605, state: 'Western Australia', type: 'city' },
    ],
    villagesAndTowns: [
      { name: 'Byron Bay', lat: -28.6474, lon: 153.6120, state: 'New South Wales', type: 'town', tag: 'Coastal Town' },
      { name: 'Cairns', lat: -16.9186, lon: 145.7781, state: 'Queensland', type: 'town', tag: 'Reef Gateway' },
      { name: 'Hahndorf', lat: -35.0294, lon: 138.8094, state: 'South Australia', type: 'village', tag: 'Heritage Village' },
    ],
  },
  {
    id: 'singapore',
    name: 'Singapore',
    code: 'SG',
    flag: '🇸🇬',
    lat: 1.3521,
    lon: 103.8198,
    rangeM: 80000,
    cities: [
      { name: 'Downtown Singapore', lat: 1.29027, lon: 103.851959, state: 'Central', type: 'city' },
      { name: 'Marina Bay', lat: 1.2847, lon: 103.8610, state: 'Central', type: 'city' },
      { name: 'Jurong', lat: 1.3329, lon: 103.7436, state: 'West', type: 'town' },
      { name: 'Changi', lat: 1.3644, lon: 103.9915, state: 'East', type: 'town' },
    ],
    villagesAndTowns: [
      { name: 'Sentosa', lat: 1.2494, lon: 103.8303, state: 'South', type: 'town', tag: 'Island Town' },
      { name: 'Pulau Ubin', lat: 1.4124, lon: 103.9572, state: 'North-East', type: 'village', tag: 'Rustic Island' },
      { name: 'Kampong Lorong Buangkok', lat: 1.3831, lon: 103.8767, state: 'North-East', type: 'village', tag: 'Last Kampong' },
    ],
  },
];

/**
 * Finds a country by id, code, or name.
 * @param {string} query
 * @returns {object|null}
 */
export function findCountry(query) {
  if (!query) return null;
  const q = String(query).trim().toLowerCase();
  return COUNTRIES.find((c) =>
    c.id === q ||
    c.name.toLowerCase() === q ||
    c.code.toLowerCase() === q ||
    c.name.toLowerCase().includes(q)
  ) || null;
}

/**
 * Resolves a town, city, or village scoped to a given country.
 * @param {string} countryId - Country identifier (e.g. 'india', 'usa')
 * @param {string} placeQuery - Place name to find
 * @returns {object|null}
 */
export function findPlaceInCountry(countryId, placeQuery) {
  if (!placeQuery) return null;
  const c = findCountry(countryId) || COUNTRIES[0]; // defaults to India
  const q = placeQuery.trim().toLowerCase();

  // If India, leverage our comprehensive Indian geographical database
  if (c.id === 'india') {
    const hit = findIndiaPlace(q);
    if (hit) return hit;
  }

  // Check country curated cities
  for (const city of c.cities) {
    if (city.name.toLowerCase() === q || city.name.toLowerCase().includes(q) || q.includes(city.name.toLowerCase())) {
      return {
        name: city.name,
        label: `${city.name}, ${city.state ? city.state + ', ' : ''}${c.name}`,
        lat: city.lat,
        lon: city.lon,
        type: city.type || 'city',
        country: c.name,
        rangeM: 2800,
      };
    }
  }

  // Check country curated towns and villages
  for (const item of c.villagesAndTowns) {
    if (item.name.toLowerCase() === q || item.name.toLowerCase().includes(q) || q.includes(item.name.toLowerCase())) {
      return {
        name: item.name,
        label: `${item.name}, ${item.state ? item.state + ', ' : ''}${c.name}`,
        lat: item.lat,
        lon: item.lon,
        type: item.type || 'village',
        country: c.name,
        rangeM: item.type === 'village' ? 1200 : 2000,
      };
    }
  }

  return null;
}
