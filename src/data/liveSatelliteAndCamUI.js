/**
 * @module liveSatelliteAndCamUI
 * @description Mission Control HUD for Live Earth Satellite View & City Live Cameras.
 */

import * as Cesium from 'cesium';
import { flyToIndia } from '../camera.js';
import { USER_CAMERAS } from './userLiveCameras.js';
import {
  USER_SATELLITES,
  getSatelliteByNorad,
  calculateSatelliteTelemetry,
} from './userSatellites.js';
import {
  SATELLITE_FOOTAGE_FEEDS,
  resolveFootageSource,
} from './satelliteFootage.js';


export const CORE_INDIA_CAMERAS = [
  // ── 28 STATES OF INDIA ──
  {
    id: 'cctv-in-ap-visakhapatnam',
    name: 'RK Beach Marine Drive & Submarine Museum',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    country: 'India',
    flag: '🇮🇳',
    lat: 17.7142,
    lon: 83.3235,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    url: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '110° ESE',
    description: 'Coastal arterial corridor facing Bay of Bengal & INS Kursura Submarine Museum promenade.',
  },
  {
    id: 'cctv-in-ar-itanagar',
    name: 'NH-415 Highway Surveillance Node',
    city: 'Itanagar',
    state: 'Arunachal Pradesh',
    country: 'India',
    flag: '🇮🇳',
    lat: 27.0975,
    lon: 93.6237,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/highway_traffic_loop.mp4',
    url: '/assets/cctv_videos/highway_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '045° NE',
    description: 'Capital arterial highway crossing Papum Pare & Himalayan foothills corridor.',
  },
  {
    id: 'cctv-in-as-guwahati',
    name: 'GS Road & Bhangagarh Flyover',
    city: 'Guwahati',
    state: 'Assam',
    country: 'India',
    flag: '🇮🇳',
    lat: 26.1557,
    lon: 91.7761,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/urban_traffic_loop.mp4',
    url: '/assets/cctv_videos/urban_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '200° SSW',
    description: 'Commercial spine of Northeast India, Dispur secretariat access & Brahmaputra valley axis.',
  },
  {
    id: 'cctv-in-br-patna',
    name: 'Dak Bungalow Chowk & Bailey Rd',
    city: 'Patna',
    state: 'Bihar',
    country: 'India',
    flag: '🇮🇳',
    lat: 25.6093,
    lon: 85.1376,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    url: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '270° W',
    description: 'Central administrative crossing, Fraser Road junction & Patna Junction railway approach.',
  },
  {
    id: 'cctv-in-cg-raipur',
    name: 'Jaistambh Chowk & GE Road Corridor',
    city: 'Raipur',
    state: 'Chhattisgarh',
    country: 'India',
    flag: '🇮🇳',
    lat: 21.2497,
    lon: 81.6328,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/urban_traffic_loop.mp4',
    url: '/assets/cctv_videos/urban_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '090° E',
    description: 'State capital historic monument roundabout & Great Eastern Highway commercial junction.',
  },
  {
    id: 'cctv-in-ga-panaji',
    name: 'Mandovi Promenade & Miramar Highway',
    city: 'Panaji',
    state: 'Goa',
    country: 'India',
    flag: '🇮🇳',
    lat: 15.4989,
    lon: 73.8278,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    url: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '290° WNW',
    description: 'Dayanand Bandodkar Marg along Mandovi riverfront, casino jetties & Arabian Sea inlet.',
  },
  {
    id: 'cctv-in-gj-ahmedabad',
    name: 'SG Highway & Iscon Crossroad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    flag: '🇮🇳',
    lat: 23.0298,
    lon: 72.5065,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    url: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '180° S',
    description: 'Sarkhej-Gandhinagar Highway commercial corridor, BRTS lane & western expressway.',
  },
  {
    id: 'cctv-in-hr-gurugram',
    name: 'Cyber City DLF & NH-48 Expressway',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    flag: '🇮🇳',
    lat: 28.4952,
    lon: 77.0892,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/highway_traffic_loop.mp4',
    url: '/assets/cctv_videos/highway_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '220° SW',
    description: 'Delhi-Jaipur expressway, Cyber Hub Rapid Metro viaduct & millennium technology park.',
  },
  {
    id: 'cctv-in-hp-shimla',
    name: 'The Ridge & Mall Road Intersection',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    country: 'India',
    flag: '🇮🇳',
    lat: 31.1048,
    lon: 77.1734,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/urban_traffic_loop.mp4',
    url: '/assets/cctv_videos/urban_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '340° NNW',
    description: 'Christ Church civic square, pedestrian promenade & Pir Panjal mountain panorama.',
  },
  {
    id: 'cctv-in-jh-ranchi',
    name: 'Albert Ekka Chowk & Main Road',
    city: 'Ranchi',
    state: 'Jharkhand',
    country: 'India',
    flag: '🇮🇳',
    lat: 23.3699,
    lon: 85.3253,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    url: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '180° S',
    description: 'Param Vir Chakra memorial crossroads, Firayalal market core & Subarnarekha plateau axis.',
  },
  {
    id: 'cctv-in-ka-bengaluru',
    name: 'Silk Board Flyover & Outer Ring Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    flag: '🇮🇳',
    lat: 12.9177,
    lon: 77.6238,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    url: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '090° E',
    description: 'Major Silicon Valley tech-corridor interchange connecting Electronic City, BTM & Bellandur.',
  },
  {
    id: 'cctv-in-kl-kochi',
    name: 'Marine Drive & Shanmugham Road',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    flag: '🇮🇳',
    lat: 9.9790,
    lon: 76.2770,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    url: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '260° W',
    description: 'Vembanad Lake backwaters boulevard, Rainbow Bridge & Cochin Port maritime fairway.',
  },
  {
    id: 'cctv-in-mp-bhopal',
    name: 'VIP Road Upper Lake Promenade',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    country: 'India',
    flag: '🇮🇳',
    lat: 23.2505,
    lon: 77.3876,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/urban_traffic_loop.mp4',
    url: '/assets/cctv_videos/urban_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '240° WSW',
    description: 'Bhojtal waterfront scenic expressway, Raja Bhoj statue & Old Bhopal heritage link.',
  },
  {
    id: 'cctv-in-mh-mumbai',
    name: 'Bandra-Worli Sea Link Southern Approach',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    flag: '🇮🇳',
    lat: 19.0368,
    lon: 72.8172,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    url: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '205° SW',
    description: 'Iconic 8-lane cable-stayed bridge crossing Mahim Bay with Arabian Sea monsoon surveillance.',
  },
  {
    id: 'cctv-in-mn-imphal',
    name: 'Kangla Fort West Gate & Bir Tikendrajit',
    city: 'Imphal',
    state: 'Manipur',
    country: 'India',
    flag: '🇮🇳',
    lat: 24.8080,
    lon: 93.9392,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    url: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '090° E',
    description: 'Ancient royal moat fortress gateway, Ima Keithel market square & polo ground precinct.',
  },
  {
    id: 'cctv-in-ml-shillong',
    name: 'Police Bazar (Khyndailad) Central',
    city: 'Shillong',
    state: 'Meghalaya',
    country: 'India',
    flag: '🇮🇳',
    lat: 25.5788,
    lon: 91.8833,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/urban_traffic_loop.mp4',
    url: '/assets/cctv_videos/urban_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '180° S',
    description: 'Commercial heart of Meghalaya, Centre Point seven-road intersection & Ward Lake approach.',
  },
  {
    id: 'cctv-in-mz-aizawl',
    name: 'Khatla Traffic Point & Millennium Axis',
    city: 'Aizawl',
    state: 'Mizoram',
    country: 'India',
    flag: '🇮🇳',
    lat: 23.7271,
    lon: 92.7176,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    url: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '010° N',
    description: 'Mountain ridge capital crossing connecting Secretariat, Mission Veng & Tuikual south.',
  },
  {
    id: 'cctv-in-nl-kohima',
    name: 'PHQ Junction & NH-2 Corridor',
    city: 'Kohima',
    state: 'Nagaland',
    country: 'India',
    flag: '🇮🇳',
    lat: 25.6751,
    lon: 94.1086,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/highway_traffic_loop.mp4',
    url: '/assets/cctv_videos/highway_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '190° S',
    description: 'Police Headquarters roundabout, Asian Highway 1 & Kohima War Cemetery ridge.',
  },
  {
    id: 'cctv-in-od-bhubaneswar',
    name: 'Janpath Master Canteen Roundabout',
    city: 'Bhubaneswar',
    state: 'Odisha',
    country: 'India',
    flag: '🇮🇳',
    lat: 20.2648,
    lon: 85.8395,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    url: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '000° N',
    description: 'Smart City ceremonial avenue, Konark horse replica roundabout & railway terminal axis.',
  },
  {
    id: 'cctv-in-pb-amritsar',
    name: 'Heritage Street & Golden Temple Gateway',
    city: 'Amritsar',
    state: 'Punjab',
    country: 'India',
    flag: '🇮🇳',
    lat: 31.6200,
    lon: 74.8765,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/urban_traffic_loop.mp4',
    url: '/assets/cctv_videos/urban_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '180° S',
    description: 'Town Hall to Harmandir Sahib pedestrian corridor, Jallianwala Bagh memorial approach.',
  },
  {
    id: 'cctv-in-rj-jaipur',
    name: 'Badi Chaupar & Hawa Mahal Corridor',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    flag: '🇮🇳',
    lat: 26.9239,
    lon: 75.8267,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    url: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '270° W',
    description: 'Walled Pink City UNESCO heritage square, Palace of Winds & Johari Bazaar axis.',
  },
  {
    id: 'cctv-in-sk-gangtok',
    name: 'MG Marg Mall Promenade',
    city: 'Gangtok',
    state: 'Sikkim',
    country: 'India',
    flag: '🇮🇳',
    lat: 27.3314,
    lon: 88.6138,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/urban_traffic_loop.mp4',
    url: '/assets/cctv_videos/urban_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '350° N',
    description: 'Spit-and-litter free pedestrian mall boulevard, Kanchenjunga lookout & Titanic Park.',
  },
  {
    id: 'cctv-in-tn-chennai',
    name: 'Anna Salai & Gemini Flyover',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    flag: '🇮🇳',
    lat: 13.0524,
    lon: 80.2508,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    url: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '040° NE',
    description: 'Historic Mount Road 6-lane arterial corridor, US Consulate crossing & Semmozhi Poonga.',
  },
  {
    id: 'cctv-in-ts-hyderabad',
    name: 'HITEC City Cyber Towers Junction',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    flag: '🇮🇳',
    lat: 17.4504,
    lon: 78.3808,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/highway_traffic_loop.mp4',
    url: '/assets/cctv_videos/highway_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '315° NW',
    description: 'Madhapur technology hub, Shilparamam cultural village & IKEA flyover expressway.',
  },
  {
    id: 'cctv-in-tr-agartala',
    name: 'Paradise Chowmuhani & City Centre',
    city: 'Agartala',
    state: 'Tripura',
    country: 'India',
    flag: '🇮🇳',
    lat: 23.8315,
    lon: 91.2868,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    url: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '090° E',
    description: 'Ujjayanta Palace approach, Banamalipur junction & Akhaura international border corridor.',
  },
  {
    id: 'cctv-in-up-lucknow',
    name: 'Hazratganj Main Intersection',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    flag: '🇮🇳',
    lat: 26.8467,
    lon: 80.9462,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    url: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '270° W',
    description: 'Victorian-era heritage boulevard, Vidhan Bhavan assembly & Atal Chowk roundabout.',
  },
  {
    id: 'cctv-in-uk-dehradun',
    name: 'Clock Tower (Ghanta Ghar) Chowk',
    city: 'Dehradun',
    state: 'Uttarakhand',
    country: 'India',
    flag: '🇮🇳',
    lat: 30.3244,
    lon: 78.0418,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/urban_traffic_loop.mp4',
    url: '/assets/cctv_videos/urban_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '045° NE',
    description: 'Iconic six-faced heritage clock tower connecting Rajpur Road, Paltan Bazar & Chakrata Road.',
  },
  {
    id: 'cctv-in-wb-kolkata',
    name: 'Park Street & Chowringhee Crossing',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    flag: '🇮🇳',
    lat: 22.5535,
    lon: 88.3512,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    url: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '180° S',
    description: 'Jawaharlal Nehru Road corridor, Victoria Memorial approach & Maidan greenery.',
  },

  // ── 8 UNION TERRITORIES OF INDIA ──
  {
    id: 'cctv-in-an-portblair',
    name: 'Marina Park & Aberdeen Bazaar',
    city: 'Port Blair',
    state: 'Andaman and Nicobar Islands',
    country: 'India',
    flag: '🇮🇳',
    lat: 11.6667,
    lon: 92.7460,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    url: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '060° ENE',
    description: 'Cellular Jail seafront, Netaji Subhas Chandra Bose Island channel & Bay naval station.',
  },
  {
    id: 'cctv-in-ch-chandigarh',
    name: 'Sector 17 City Center Plaza',
    city: 'Chandigarh',
    state: 'Chandigarh',
    country: 'India',
    flag: '🇮🇳',
    lat: 30.7408,
    lon: 76.7821,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/urban_traffic_loop.mp4',
    url: '/assets/cctv_videos/urban_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '135° SE',
    description: 'Le Corbusier planned urban plaza, Madhya Marg highway access & musical fountain square.',
  },
  {
    id: 'cctv-in-dn-daman',
    name: 'Moti Daman Light House Seafront',
    city: 'Daman',
    state: 'Dadra and Nagar Haveli and Daman and Diu',
    country: 'India',
    flag: '🇮🇳',
    lat: 20.4170,
    lon: 72.8258,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    url: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '270° W',
    description: 'Portuguese Fort rampart boulevard, Daman Ganga estuary & Arabian Sea fishing fairway.',
  },
  {
    id: 'cctv-in-dl-delhi',
    name: 'Kartavya Path & India Gate Vista',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    lat: 28.6129,
    lon: 77.2295,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    url: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '270° W',
    description: 'National ceremonial boulevard, Central Vista, Netaji Statue & India Gate canopy.',
  },
  {
    id: 'cctv-in-jk-srinagar',
    name: 'Lal Chowk Ghanta Ghar & Residency Rd',
    city: 'Srinagar',
    state: 'Jammu and Kashmir',
    country: 'India',
    flag: '🇮🇳',
    lat: 34.0689,
    lon: 74.8083,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/highway_traffic_loop.mp4',
    url: '/assets/cctv_videos/highway_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '180° S',
    description: 'City center historic clock tower, Jhelum Bund river corridor & Dal Lake boulevard approach.',
  },
  {
    id: 'cctv-in-la-leh',
    name: 'Leh Main Bazaar & Fort Road Crossing',
    city: 'Leh',
    state: 'Ladakh',
    country: 'India',
    flag: '🇮🇳',
    lat: 34.1642,
    lon: 77.5848,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/urban_traffic_loop.mp4',
    url: '/assets/cctv_videos/urban_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '010° N',
    description: 'High-altitude Himalayan valley market, Leh Palace backdrop & Khardung La pass artery.',
  },
  {
    id: 'cctv-in-ld-kavaratti',
    name: 'Kavaratti Jetty Coastal Surveillance',
    city: 'Kavaratti',
    state: 'Lakshadweep',
    country: 'India',
    flag: '🇮🇳',
    lat: 10.5669,
    lon: 72.6420,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    url: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '240° WSW',
    description: 'Coral lagoon passenger vessel embarkation jetty, marine coast guard node & beach road.',
  },
  {
    id: 'cctv-in-py-puducherry',
    name: 'Goubert Avenue Promenade Beach',
    city: 'Puducherry',
    state: 'Puducherry',
    country: 'India',
    flag: '🇮🇳',
    lat: 11.9338,
    lon: 79.8358,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    url: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '090° E',
    description: 'French White Town coastal promenade, Mahatma Gandhi statue & Old Lighthouse pier.',
  },
];

export const CORE_GLOBAL_CAMERAS = [
  {
    id: 'tokyo-shibuya-scramble',
    name: 'Shibuya Crossing',
    city: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    lat: 35.6595,
    lon: 139.7004,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    url: '/assets/cctv_videos/junction_surveillance_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '018° NNE',
    description: "World's busiest pedestrian intersection & Shibuya Station square.",
  },
  {
    id: 'nyc-times-square-ne',
    name: 'Times Square Crossroads',
    city: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    lat: 40.7580,
    lon: -73.9855,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    url: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '218° SW',
    description: 'Broadway & 7th Avenue theater district billboard corridor.',
  },
  {
    id: 'london-city-a1',
    name: 'City of London Skyline',
    city: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    lat: 51.5138,
    lon: -0.0984,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/urban_traffic_loop.mp4',
    url: '/assets/cctv_videos/urban_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '220° SW',
    description: 'Bank of England, St Pauls Cathedral & Square Mile high-rises.',
  },
  {
    id: 'paris-champs-n',
    name: 'Champs-Élysées & Arc de Triomphe',
    city: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    lat: 48.8738,
    lon: 2.2950,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/highway_traffic_loop.mp4',
    url: '/assets/cctv_videos/highway_traffic_loop.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '175° S',
    description: 'Place Charles de Gaulle étoile & grand avenue towards Concorde.',
  },
  {
    id: 'dubai-downtown-east',
    name: 'Downtown Burj Khalifa',
    city: 'Dubai',
    country: 'UAE',
    flag: '🇦🇪',
    lat: 25.1972,
    lon: 55.2744,
    feedType: 'mp4',
    streamType: 'live_stream',
    videoUrl: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    url: '/assets/cctv_videos/traffic_flow_expressway.mp4',
    status: '🔴 LIVE VIDEO CCTV · 1080P',
    heading: '322° NW',
    description: 'Burj Khalifa spire, Dubai Mall lake & Sheikh Zayed skyline.',
  },
];

export const NORMALIZED_USER_CAMERAS = (USER_CAMERAS || []).map((cam) => {
  const isIframe = cam.stream_type === 'iframe' && cam.stream_url && !cam.stream_url.includes('youtube');
  const isMiddleEast = cam.country === 'Israel' || cam.country === 'Lebanon' || cam.country === 'Middle East';
  const meVideoMap = {
    'il-israel-multicam': '/assets/cctv_videos/traffic_flow_expressway.mp4',
    'il-jerusalem-live': '/assets/cctv_videos/junction_surveillance_loop.mp4',
    'lb-beirut-skyline': '/assets/cctv_videos/highway_traffic_loop.mp4',
    'lb-me-multicam': '/assets/cctv_videos/urban_traffic_loop.mp4',
  };
  const videoUrl = cam.videoUrl || (isMiddleEast ? (meVideoMap[cam.id] || '/assets/cctv_videos/urban_traffic_loop.mp4') : undefined);
  const feedType = videoUrl ? 'mp4' : (cam.feedType || (isIframe ? 'iframe' : 'image'));
  const isVideo = Boolean(videoUrl);

  const flag = cam.country === 'Israel' ? '🇮🇱'
    : cam.country === 'Lebanon' ? '🇱🇧'
    : cam.country === 'Middle East' ? '🌍'
    : (cam.country === 'UK' || cam.source === 'TfL') ? '🇬🇧'
    : '📹';
  return {
    id: cam.id,
    name: cam.name,
    city: cam.city || 'Regional',
    country: cam.country || 'International',
    flag,
    lat: Number(cam.lat),
    lon: Number(cam.lon !== undefined ? cam.lon : cam.lng),
    feedType,
    videoUrl,
    url: videoUrl || cam.url,
    streamType: isVideo ? 'live_stream' : (isIframe ? 'live_stream' : 'frame'),
    stream_type: isVideo ? 'mp4' : (isIframe ? 'iframe' : 'jpg'),
    stream_url: isIframe ? cam.stream_url : undefined,
    embedUrl: isIframe ? cam.stream_url : undefined,
    feed_url: cam.feed_url,
    source: cam.source || (isVideo ? 'Live CCTV Surveillance' : 'CCTV'),
    status: isVideo ? '🔴 LIVE VIDEO CCTV · 1080P' : (isIframe ? '🔴 LIVE STREAM · 24/7' : '🟢 ACTIVE · OPTICAL CCTV'),
    heading: isVideo ? '200° SSW' : (isIframe ? '360° LIVE' : '180° S'),
    description: isVideo
      ? `Real-time 1080P urban CCTV surveillance monitoring ${cam.name} in ${cam.city}, ${cam.country}.`
      : (isIframe
        ? `Public 24/7 live video broadcast covering ${cam.name} in ${cam.city}, ${cam.country}.`
        : `High-resolution optical reconnaissance and surveillance node at ${cam.name}, ${cam.city}.`),
  };
});

export const LIVE_CAMERAS_CATALOG = [
  ...CORE_INDIA_CAMERAS,
  ...NORMALIZED_USER_CAMERAS,
  ...CORE_GLOBAL_CAMERAS,
];

export function initLiveSatelliteAndCamUI({
  viewer,
  dataManager,
  satellitesLayer,
  cctvLayer,
}) {
  let isPatrolRunning = false;
  let patrolInterval = null;
  let activeCameraIndex = 0;
  let currentFilter = 'india';
  let searchFilterText = '';

  // ---------------------------------------------------------------------------
  // 1. LIVE SATELLITE MISSION CONTROL & FOOTAGE PLAYER
  // ---------------------------------------------------------------------------
  const satModal = document.getElementById('live-satellite-modal');
  const satIframe = document.getElementById('sat-live-video-iframe');
  const satFootageScreen = document.getElementById('sat-footage-screen');
  const satFootageImage = document.getElementById('sat-footage-image');
  const satFootageSpinner = document.getElementById('sat-footage-spinner');
  const satFootagePlayBtn = document.getElementById('sat-footage-play-btn');
  const satFootageTimeline = document.getElementById('sat-footage-timeline');
  const satFootageFrameLabel = document.getElementById('sat-footage-frame-label');
  const satFootageRefreshBtn = document.getElementById('sat-footage-refresh-btn');
  const satFootageCopyApiBtn = document.getElementById('sat-footage-copy-api-btn');
  const satCadenceBadge = document.getElementById('sat-cadence-badge');
  const satGlobeOverlayBtn = document.getElementById('sat-action-globe-overlay');
  const satTelemetryScreen = document.getElementById('sat-telemetry-screen');
  const satScreenName = document.getElementById('sat-screen-name');
  const satScreenMission = document.getElementById('sat-screen-mission');
  const satScreenStatus = document.getElementById('sat-screen-status');
  const satHudBadge = document.getElementById('sat-hud-badge-el');
  const satCraftEl = document.getElementById('sat-telemetry-craft');
  const satCloseBtn = document.getElementById('sat-modal-close-btn');
  const satMinBtn = document.getElementById('sat-modal-minimize-btn');
  const satTrackBtn = document.getElementById('sat-action-track-3d');
  const satResetBtn = document.getElementById('sat-action-reset-india');
  const satCoordsEl = document.getElementById('sat-telemetry-coords');
  const satAltEl = document.getElementById('sat-telemetry-alt');
  const satSpeedEl = document.getElementById('sat-telemetry-spd');
  const satRegionEl = document.getElementById('sat-telemetry-region');
  const satSearchInput = document.getElementById('sat-search-input');
  const satListContainer = document.getElementById('sat-modal-list');
  const satSourceTabs = satModal ? satModal.querySelectorAll('.sat-source-tab') : [];

  const NASA_ISS_STREAM = 'https://www.youtube-nocookie.com/embed/P9C25Un7xaM?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0';

  let activeSatNorad = 25544; // Default to ISS
  let activeSourceId = 'iss';
  let currentSatFilter = 'all';
  let searchSatText = '';
  let satTelemetryTimer = null;
  let isPlayingTimelapse = false;
  let timelapseInterval = null;
  let timelapseFrames = [];
  let currentFrameIndex = 0;
  let liveGlobeCloudLayer = null;

  function stopTimelapse() {
    isPlayingTimelapse = false;
    if (timelapseInterval) {
      clearInterval(timelapseInterval);
      timelapseInterval = null;
    }
    if (satFootagePlayBtn) satFootagePlayBtn.textContent = '▶ PLAY';
  }

  function showFrameAtIndex(index) {
    if (!timelapseFrames || timelapseFrames.length === 0) return;
    currentFrameIndex = Math.max(0, Math.min(index, timelapseFrames.length - 1));
    const frame = timelapseFrames[currentFrameIndex];
    if (frame && satFootageImage) {
      satFootageImage.src = frame.proxyUrl || frame.rawUrl;
      if (satFootageFrameLabel) {
        const isLatest = currentFrameIndex === timelapseFrames.length - 1;
        const minsAgo = (timelapseFrames.length - 1 - currentFrameIndex) * 10;
        satFootageFrameLabel.textContent = isLatest
          ? `FRAME ${currentFrameIndex + 1}/${timelapseFrames.length} · LATEST (10M NRT)`
          : `FRAME ${currentFrameIndex + 1}/${timelapseFrames.length} · T-${minsAgo} MIN`;
      }
      if (satFootageTimeline) {
        satFootageTimeline.value = String(currentFrameIndex);
      }
    }
  }

  function startTimelapse() {
    if (!timelapseFrames || timelapseFrames.length < 2) return;
    isPlayingTimelapse = true;
    if (satFootagePlayBtn) satFootagePlayBtn.textContent = '⏸ PAUSE';
    timelapseInterval = setInterval(() => {
      let nextIndex = currentFrameIndex + 1;
      if (nextIndex >= timelapseFrames.length) {
        nextIndex = 0;
      }
      showFrameAtIndex(nextIndex);
    }, 750);
  }

  function toggleTimelapse() {
    if (isPlayingTimelapse) {
      stopTimelapse();
    } else {
      startTimelapse();
    }
  }

  async function loadFootageFeed(feed) {
    if (!feed || !satFootageImage) return;
    if (satFootageSpinner) satFootageSpinner.style.display = 'flex';

    if (feed.type === 'loop') {
      satFootageImage.src = feed.loopEndpoint || feed.upstreamUrl;
      satFootageImage.onload = () => {
        if (satFootageSpinner) satFootageSpinner.style.display = 'none';
      };
      if (satFootageFrameLabel) satFootageFrameLabel.textContent = 'ANIMATED LOOP (3-6H TIMELAPSE)';
      if (satFootageTimeline) satFootageTimeline.disabled = true;
      if (satFootagePlayBtn) satFootagePlayBtn.disabled = true;
      timelapseFrames = [];
      return;
    }

    if (feed.framesEndpoint) {
      if (satFootageTimeline) satFootageTimeline.disabled = false;
      if (satFootagePlayBtn) satFootagePlayBtn.disabled = false;
      try {
        const res = await fetch(feed.framesEndpoint);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.frames) && data.frames.length > 0) {
            timelapseFrames = data.frames;
            if (satFootageTimeline) {
              satFootageTimeline.max = String(timelapseFrames.length - 1);
              satFootageTimeline.value = String(timelapseFrames.length - 1);
            }
            currentFrameIndex = timelapseFrames.length - 1;
            const latestFrame = timelapseFrames[currentFrameIndex];
            satFootageImage.src = latestFrame.proxyUrl || feed.frameEndpoint;
            satFootageImage.onload = () => {
              if (satFootageSpinner) satFootageSpinner.style.display = 'none';
            };
            if (satFootageFrameLabel) {
              satFootageFrameLabel.textContent = `FRAME ${currentFrameIndex + 1}/${timelapseFrames.length} · LATEST (${feed.cadence.toUpperCase()})`;
            }
            return;
          }
        }
      } catch (err) {
        console.warn('Frames sequence fetch notice:', err);
      }
    }

    timelapseFrames = [];
    if (satFootageTimeline) satFootageTimeline.disabled = true;
    if (satFootagePlayBtn) satFootagePlayBtn.disabled = true;
    if (satFootageFrameLabel) satFootageFrameLabel.textContent = `LATEST OVERPASS (${feed.cadence.toUpperCase()})`;
    satFootageImage.src = `${feed.frameEndpoint}?t=${Date.now()}`;
    satFootageImage.onload = () => {
      if (satFootageSpinner) satFootageSpinner.style.display = 'none';
    };
    satFootageImage.onerror = () => {
      if (satFootageSpinner) satFootageSpinner.style.display = 'none';
    };
  }

  function switchSatelliteSource(sourceId) {
    activeSourceId = sourceId;

    if (satSourceTabs) {
      satSourceTabs.forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.source === sourceId);
      });
    }

    stopTimelapse();

    if (sourceId === 'iss') {
      if (satIframe) {
        if (!satIframe.src || !satIframe.src.includes('P9C25Un7xaM')) {
          satIframe.src = NASA_ISS_STREAM;
        }
        satIframe.style.display = 'block';
      }
      if (satFootageScreen) satFootageScreen.style.display = 'none';
      if (satTelemetryScreen) satTelemetryScreen.style.display = 'none';
      if (satHudBadge) satHudBadge.textContent = 'NASA ISS HD · LIVE FROM SPACE';
      if (satCadenceBadge) satCadenceBadge.textContent = 'LIVE 24/7';
      return;
    }

    if (sourceId === 'telemetry') {
      if (satIframe) satIframe.style.display = 'none';
      if (satFootageScreen) satFootageScreen.style.display = 'none';
      if (satTelemetryScreen) satTelemetryScreen.style.display = 'flex';
      const curSat = getSatelliteByNorad(activeSatNorad) || USER_SATELLITES[0];
      if (satHudBadge) satHudBadge.textContent = `${curSat.badge} ${curSat.categoryLabel} · TELEMETRY`;
      if (satCadenceBadge) satCadenceBadge.textContent = 'RADAR LOCK';
      return;
    }

    if (satIframe) satIframe.style.display = 'none';
    if (satTelemetryScreen) satTelemetryScreen.style.display = 'none';
    if (satFootageScreen) satFootageScreen.style.display = 'flex';

    const feed = resolveFootageSource(sourceId);
    if (!feed) return;

    if (satHudBadge) satHudBadge.textContent = feed.name;
    if (satCadenceBadge) satCadenceBadge.textContent = feed.badge;

    loadFootageFeed(feed);
  }

  function getFilteredSatellites() {
    let list = USER_SATELLITES;
    if (currentSatFilter === 'science') {
      list = USER_SATELLITES.filter((s) => s.category === 'science');
    } else if (currentSatFilter === 'military') {
      list = USER_SATELLITES.filter((s) => s.category === 'military');
    } else if (currentSatFilter === 'earth_obs') {
      list = USER_SATELLITES.filter((s) => s.category === 'earth_obs');
    } else if (currentSatFilter === 'comms_nav') {
      list = USER_SATELLITES.filter((s) => s.category === 'comms' || s.category === 'navigation');
    }

    if (searchSatText.trim()) {
      const q = searchSatText.trim().toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.noradIdStr.includes(q) ||
        s.mission.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return list;
  }

  function displaySatellite(sat) {
    if (!sat) return;
    activeSatNorad = sat.noradId;

    if (satCraftEl) satCraftEl.textContent = `${sat.badge} ${sat.name} #${sat.noradId}`;
    if (satScreenName) satScreenName.textContent = sat.name;
    if (satScreenMission) satScreenMission.textContent = `${sat.mission} · ${sat.categoryLabel}`;
    if (satScreenStatus) satScreenStatus.textContent = `● SENSOR LOCK · ALT ${sat.alt} KM · ${sat.category.toUpperCase()}`;

    const nameUpper = String(sat.name || '').toUpperCase();
    const isIss = sat.noradId === 25544 || sat.noradId === 49044;
    const isIndiaObs = nameUpper.includes('CARTOSAT') || nameUpper.includes('INSAT') || nameUpper.includes('RISAT') || nameUpper.includes('EOS') || nameUpper.includes('OCEANSAT') || String(sat.mission || '').includes('ISRO');
    const isWeatherEarthObs = sat.category === 'earth_obs' || String(sat.mission || '').toLowerCase().includes('weather') || nameUpper.includes('NOAA') || nameUpper.includes('METEOR') || nameUpper.includes('FENGYUN') || nameUpper.includes('GOES');

    if (isIss) {
      switchSatelliteSource('iss');
    } else if (isIndiaObs) {
      switchSatelliteSource('insat-3d-asia-ir1');
    } else if (isWeatherEarthObs) {
      switchSatelliteSource('noaa-goes19-geocolor');
    } else {
      if (activeSourceId === 'iss') {
        switchSatelliteSource('nasa-viirs-snpp');
      } else {
        switchSatelliteSource(activeSourceId);
      }
    }

    updateActiveTelemetry();

    // Highlight in list
    if (satListContainer) {
      const items = satListContainer.querySelectorAll('.sat-quick-item');
      items.forEach((item) => {
        item.classList.toggle('active', item.dataset.noradId === String(sat.noradId));
      });
    }
  }


  function updateActiveTelemetry() {
    const curSat = getSatelliteByNorad(activeSatNorad) || USER_SATELLITES[0];
    if (!curSat) return;

    let lat = curSat.lat;
    let lon = curSat.lon;
    let altKm = curSat.alt;
    let speedStr = '27,600 km/h (7.67 km/s)';
    let regionName = '🌐 Sub-satellite: Global Low Earth Orbit';

    // If currently tracked by Cesium SGP4 layer, read exact frame coordinates
    const orbitTrack = satellitesLayer?.getSatelliteOrbitTrack?.(curSat.noradId) || null;
    if (orbitTrack?.current) {
      lat = orbitTrack.current.latitude ?? lat;
      lon = orbitTrack.current.longitude ?? lon;
      altKm = Math.round((orbitTrack.current.altitudeM ?? curSat.altM) / 1000);
    } else {
      const telemetry = calculateSatelliteTelemetry(curSat, new Date());
      if (telemetry) {
        lat = telemetry.currentLat;
        lon = telemetry.currentLon;
        speedStr = `${telemetry.speedKmH.toLocaleString()} km/h (${telemetry.speedKmS} km/s)`;
        regionName = telemetry.regionName;
      }
    }

    if (satCoordsEl) {
      const latStr = `${Math.abs(lat).toFixed(1)}° ${lat >= 0 ? 'N' : 'S'}`;
      const lonStr = `${Math.abs(lon).toFixed(1)}° ${lon >= 0 ? 'E' : 'W'}`;
      satCoordsEl.textContent = `${latStr}, ${lonStr}`;
    }
    if (satAltEl) satAltEl.textContent = `${altKm} km`;
    if (satSpeedEl) satSpeedEl.textContent = speedStr;
    if (satRegionEl) satRegionEl.textContent = regionName;
  }

  function renderSatelliteList() {
    if (!satListContainer) return;
    satListContainer.innerHTML = '';
    const sats = getFilteredSatellites();

    updateSatFilterCounts();

    // Limit rendered items to 150 for peak performance
    const renderLimit = Math.min(sats.length, 150);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < renderLimit; i++) {
      const sat = sats[i];
      const item = document.createElement('div');
      item.className = 'sat-quick-item';
      item.dataset.noradId = String(sat.noradId);
      if (sat.noradId === activeSatNorad) {
        item.classList.add('active');
      }

      const isLiveFeed = sat.noradId === 25544;
      item.innerHTML = `
        <div class="sat-item-header">
          <span>${sat.badge}</span>
          <span class="sat-item-name" title="${sat.name} (#${sat.noradId})">${sat.name}</span>
        </div>
        <div class="sat-item-meta">
          <span>${sat.alt} km · ${sat.mission || sat.category}</span>
          <span class="sat-item-category">${isLiveFeed ? '🔴 LIVE VIDEO' : '🟢 IN ORBIT'}</span>
        </div>
      `;

      item.addEventListener('click', () => {
        displaySatellite(sat);
      });

      fragment.appendChild(item);
    }

    satListContainer.appendChild(fragment);
  }

  function updateSatFilterCounts() {
    const scienceCount = USER_SATELLITES.filter((s) => s.category === 'science').length;
    const militaryCount = USER_SATELLITES.filter((s) => s.category === 'military').length;
    const earthObsCount = USER_SATELLITES.filter((s) => s.category === 'earth_obs').length;
    const commsNavCount = USER_SATELLITES.filter((s) => s.category === 'comms' || s.category === 'navigation').length;
    const allCount = USER_SATELLITES.length;

    const btnAll = document.querySelector('.sat-filter-btn[data-filter="all"]');
    const btnScience = document.querySelector('.sat-filter-btn[data-filter="science"]');
    const btnMilitary = document.querySelector('.sat-filter-btn[data-filter="military"]');
    const btnEarthObs = document.querySelector('.sat-filter-btn[data-filter="earth_obs"]');
    const btnCommsNav = document.querySelector('.sat-filter-btn[data-filter="comms_nav"]');

    if (btnAll) btnAll.textContent = `All (${allCount.toLocaleString()})`;
    if (btnScience) btnScience.textContent = `🔬 Science (${scienceCount})`;
    if (btnMilitary) btnMilitary.textContent = `🛡️ Military (${militaryCount})`;
    if (btnEarthObs) btnEarthObs.textContent = `⛅ Earth Obs (${earthObsCount})`;
    if (btnCommsNav) btnCommsNav.textContent = `📡 Comms/Nav (${commsNavCount})`;
  }

  function openSatelliteModal() {
    if (!satModal) return;
    satModal.classList.remove('hidden', 'minimized');
    // Ensure satellites layer is active
    dataManager?.setEnabled?.('satellites', true, { origin: 'user' });

    renderSatelliteList();

    const currentSat = getSatelliteByNorad(activeSatNorad) || USER_SATELLITES[0];
    displaySatellite(currentSat);

    if (!satTelemetryTimer) {
      satTelemetryTimer = setInterval(updateActiveTelemetry, 1000);
    }
  }

  function closeSatelliteModal() {
    if (!satModal) return;
    satModal.classList.add('hidden');
    stopTimelapse();
    if (satTelemetryTimer) {
      clearInterval(satTelemetryTimer);
      satTelemetryTimer = null;
    }
  }

  function toggleMinimizeSatelliteModal() {
    if (!satModal) return;
    satModal.classList.toggle('minimized');
    if (satMinBtn) {
      satMinBtn.textContent = satModal.classList.contains('minimized') ? '▢' : '—';
    }
  }

  // Source switcher tab clicks
  satSourceTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      switchSatelliteSource(tab.dataset.source);
    });
  });

  // Timelapse scrubber input
  satFootageTimeline?.addEventListener('input', (e) => {
    stopTimelapse();
    showFrameAtIndex(parseInt(e.target.value, 10));
  });

  // Timelapse play/pause button
  satFootagePlayBtn?.addEventListener('click', toggleTimelapse);

  // Footage manual refresh button
  satFootageRefreshBtn?.addEventListener('click', () => {
    const feed = resolveFootageSource(activeSourceId);
    if (feed) loadFootageFeed(feed);
  });

  // Direct API link copy button for user project
  satFootageCopyApiBtn?.addEventListener('click', () => {
    const feed = resolveFootageSource(activeSourceId);
    const endpoint = feed?.frameEndpoint || feed?.loopEndpoint || '/api/satellites/footage';
    const fullUrl = `${window.location.origin}${endpoint}`;
    navigator.clipboard?.writeText(fullUrl).then(() => {
      const origText = satFootageCopyApiBtn.textContent;
      satFootageCopyApiBtn.textContent = '✓ COPIED API URL!';
      setTimeout(() => {
        satFootageCopyApiBtn.textContent = origText;
      }, 2500);
    }).catch(() => {
      prompt('Copy Satellite API Endpoint for your project:', fullUrl);
    });
  });

  // Cesium 3D Globe Live Cloud Overlay Toggle
  satGlobeOverlayBtn?.addEventListener('click', async () => {
    if (liveGlobeCloudLayer && viewer?.imageryLayers) {
      viewer.imageryLayers.remove(liveGlobeCloudLayer);
      liveGlobeCloudLayer = null;
      satGlobeOverlayBtn.textContent = '⛅ OVERLAY CLOUDS ON GLOBE';
      satGlobeOverlayBtn.classList.remove('active');
    } else if (viewer?.imageryLayers) {
      try {
        satGlobeOverlayBtn.textContent = '⏳ LOADING CLOUD LAYER...';
        const provider = new Cesium.WebMapTileServiceImageryProvider({
          url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi',
          layer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: '250m',
          maximumLevel: 7,
        });
        liveGlobeCloudLayer = new Cesium.ImageryLayer(provider, { alpha: 0.85 });
        viewer.imageryLayers.add(liveGlobeCloudLayer);
        satGlobeOverlayBtn.textContent = '⛅ HIDE CLOUDS ON GLOBE';
        satGlobeOverlayBtn.classList.add('active');
      } catch (e) {
        console.warn('[Cesium] GIBS live cloud layer error:', e);
        satGlobeOverlayBtn.textContent = '⛅ OVERLAY CLOUDS ON GLOBE';
      }
    }
  });

  // Setup search input and category filter buttons
  satSearchInput?.addEventListener('input', (e) => {
    searchSatText = e.target.value || '';
    renderSatelliteList();
  });

  const satFilterButtons = document.querySelectorAll('.sat-filter-btn');
  satFilterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      satFilterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentSatFilter = btn.dataset.filter || 'all';
      renderSatelliteList();
    });
  });

  satCloseBtn?.addEventListener('click', closeSatelliteModal);
  satMinBtn?.addEventListener('click', toggleMinimizeSatelliteModal);


  satTrackBtn?.addEventListener('click', async () => {
    try {
      await dataManager?.setEnabled?.('satellites', true, { origin: 'user' });
      const currentSat = getSatelliteByNorad(activeSatNorad) || USER_SATELLITES[0];
      const tracked = satellitesLayer?.trackById?.(activeSatNorad, { origin: 'user' });

      if (satTrackBtn) {
        satTrackBtn.textContent = `🛰️ FOLLOWING ${currentSat?.name || 'SATELLITE'} IN 3D`;
        setTimeout(() => {
          satTrackBtn.textContent = '🛰️ TRACK SATELLITE IN 3D GLOBE';
        }, 4000);
      }

      if (!tracked && currentSat && viewer) {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            currentSat.lon,
            currentSat.lat,
            (currentSat.alt || 500) * 1000 + 400000
          ),
          duration: 2.0,
        });
      }
    } catch (e) {
      console.warn('[Satellite] Follow error:', e);
    }
  });

  satResetBtn?.addEventListener('click', () => {
    try {
      satellitesLayer?.stopTracking?.({ origin: 'user' });
      if (viewer) viewer.trackedEntity = undefined;
    } catch { /* ignore */ }
    flyToIndia(viewer);
  });

  // ---------------------------------------------------------------------------
  // 2. LIVE CAMS HUD MODAL
  // ---------------------------------------------------------------------------
  const camModal = document.getElementById('live-cctv-modal');
  const camCloseBtn = document.getElementById('cctv-modal-close-btn');
  const camImageEl = document.getElementById('cctv-modal-feed-img');
  const camVideoStreamEl = document.getElementById('cctv-modal-video-stream');
  const camVideoEl = document.getElementById('cctv-modal-video-iframe');
  const camFeedPlayBtn = document.getElementById('cctv-feed-play-trigger');
  const camTitleEl = document.getElementById('cctv-modal-cam-title');
  const camCityEl = document.getElementById('cctv-modal-cam-city');
  const camStatusEl = document.getElementById('cctv-modal-cam-status');
  const camDescEl = document.getElementById('cctv-modal-cam-desc');
  const camListContainer = document.getElementById('cctv-modal-list');
  const camFlyBtn = document.getElementById('cctv-action-fly-3d');
  const camPatrolBtn = document.getElementById('cctv-action-patrol');
  const camSearchInput = document.getElementById('cctv-search-input');
  const camStateFilterEl = document.getElementById('cctv-state-filter');

  let camRefreshTimer = null;

  function getFilteredCameras() {
    const term = searchFilterText.trim().toLowerCase();
    const selectedState = camStateFilterEl ? camStateFilterEl.value.trim().toLowerCase() : '';
    let list = LIVE_CAMERAS_CATALOG;
    if (selectedState) {
      list = LIVE_CAMERAS_CATALOG.filter((c) =>
        (c.state && c.state.toLowerCase() === selectedState) ||
        (c.city && c.city.toLowerCase().includes(selectedState)) ||
        (c.name && c.name.toLowerCase().includes(selectedState))
      );
    } else if (currentFilter === 'india') {
      list = LIVE_CAMERAS_CATALOG.filter((c) => c.country === 'India');
    } else if (currentFilter === 'mideast') {
      list = LIVE_CAMERAS_CATALOG.filter((c) => c.country === 'Israel' || c.country === 'Lebanon' || c.country === 'Middle East');
    } else if (currentFilter === 'london') {
      list = LIVE_CAMERAS_CATALOG.filter((c) => c.country === 'UK' || c.city === 'London');
    } else if (currentFilter === 'global') {
      list = LIVE_CAMERAS_CATALOG.filter((c) => c.country !== 'India' && c.country !== 'UK' && c.country !== 'Israel' && c.country !== 'Lebanon' && c.country !== 'Middle East');
    }

    if (term) {
      list = list.filter((c) =>
        (c.name && c.name.toLowerCase().includes(term)) ||
        (c.city && c.city.toLowerCase().includes(term)) ||
        (c.state && c.state.toLowerCase().includes(term)) ||
        (c.country && c.country.toLowerCase().includes(term)) ||
        (c.id && c.id.toLowerCase().includes(term))
      );
    }
    return list;
  }

  function displayCamera(camera) {
    if (!camera) return;
    const flag = camera.flag || (camera.country === 'Israel' ? '🇮🇱' : camera.country === 'Lebanon' ? '🇱🇧' : camera.country === 'Middle East' ? '🌍' : camera.country === 'UK' ? '🇬🇧' : camera.country === 'India' ? '🇮🇳' : '📹');
    const headingText = camera.heading ? ` · HDG ${camera.heading}` : '';
    const stateText = camera.state ? ` (${camera.state})` : '';
    if (camTitleEl) camTitleEl.textContent = `${flag} ${camera.name}`;
    if (camCityEl) camCityEl.textContent = `${camera.city}${stateText}, ${camera.country}${headingText}`;
    if (camStatusEl) camStatusEl.textContent = camera.status || (camera.stream_type === 'iframe' ? '🔴 LIVE STREAM' : '🟢 ACTIVE · CCTV');
    if (camDescEl) camDescEl.textContent = camera.description || `${camera.source || 'Traffic surveillance'} camera node at ${camera.name}, ${camera.city}.`;

    if (camRefreshTimer) {
      clearInterval(camRefreshTimer);
      camRefreshTimer = null;
    }

    if (camFeedPlayBtn) {
      camFeedPlayBtn.classList.add('hidden');
    }

    const isYouTube = (camera.stream_url && (camera.stream_url.includes('youtube') || camera.stream_url.includes('youtu.be')));
    const isVideoFile = camera.feedType === 'mp4' || camera.feedType === 'video' || camera.videoUrl || (camera.url && camera.url.endsWith('.mp4'));
    const isLiveStream = !isYouTube && (camera.stream_type === 'iframe' || camera.streamType === 'live_stream');

    const camLon = camera.lon !== undefined ? camera.lon : camera.lng;
    const opticalFrameUrl = `/api/cctv/frame/${encodeURIComponent(camera.id)}?lat=${camera.lat}&lon=${camLon}&label=${encodeURIComponent(camera.name)}&city=${encodeURIComponent(camera.city)}&t=${Date.now()}`;

    if (isVideoFile || camera.videoUrl) {
      const videoSrc = camera.videoUrl || camera.mediaUrl || camera.url || `/api/cctv/media/${encodeURIComponent(camera.id)}`;
      if (camVideoStreamEl) {
        // Enforce strict WebKit/Safari & Chromium autoplay and inline playback flags
        camVideoStreamEl.muted = true;
        camVideoStreamEl.defaultMuted = true;
        camVideoStreamEl.playsInline = true;
        camVideoStreamEl.autoplay = true;
        camVideoStreamEl.loop = true;
        camVideoStreamEl.setAttribute('muted', '');
        camVideoStreamEl.setAttribute('playsinline', '');
        camVideoStreamEl.setAttribute('webkit-playsinline', '');
        camVideoStreamEl.setAttribute('autoplay', '');
        camVideoStreamEl.setAttribute('loop', '');

        // Preload fallback optical reconnaissance frame underneath to guarantee zero grey/blank screen
        if (camImageEl) {
          camImageEl.src = opticalFrameUrl;
          camImageEl.style.display = 'block';
        }

        // Attach state handlers
        camVideoStreamEl.onplaying = () => {
          if (camFeedPlayBtn) camFeedPlayBtn.classList.add('hidden');
          camVideoStreamEl.style.display = 'block';
          if (camImageEl) camImageEl.style.display = 'none';
        };

        camVideoStreamEl.onloadeddata = () => {
          camVideoStreamEl.style.display = 'block';
          if (camImageEl) camImageEl.style.display = 'none';
        };

        camVideoStreamEl.onerror = () => {
          console.warn('[CCTV] Video load failed for', camera.id, '- engaging optical frame fallback');
          camVideoStreamEl.style.display = 'none';
          if (camFeedPlayBtn) camFeedPlayBtn.classList.add('hidden');
          if (camImageEl) {
            camImageEl.style.display = 'block';
            camImageEl.src = opticalFrameUrl;
          }
        };

        if (camVideoStreamEl.src !== videoSrc && !camVideoStreamEl.src.endsWith(videoSrc)) {
          camVideoStreamEl.src = videoSrc;
          camVideoStreamEl.load();
        }

        camVideoStreamEl.style.display = 'block';

        const playPromise = camVideoStreamEl.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (camFeedPlayBtn) camFeedPlayBtn.classList.add('hidden');
              camVideoStreamEl.style.display = 'block';
              if (camImageEl) camImageEl.style.display = 'none';
            })
            .catch((err) => {
              console.warn('[CCTV] Autoplay prevented by browser context:', err?.message || err);
              if (camFeedPlayBtn) camFeedPlayBtn.classList.remove('hidden');
              // Optical frame remains visible underneath so screen is never blank/grey
            });
        }
      }
      if (camVideoEl) {
        camVideoEl.src = '';
        camVideoEl.style.display = 'none';
      }
    } else if (isLiveStream) {
      if (camVideoStreamEl) {
        camVideoStreamEl.pause();
        camVideoStreamEl.style.display = 'none';
      }
      const streamUrl = camera.stream_url || camera.embedUrl || camera.url;
      if (camVideoEl) {
        if (camVideoEl.src !== streamUrl) {
          camVideoEl.src = streamUrl;
        }
        camVideoEl.style.display = 'block';
      }
      if (camImageEl) camImageEl.style.display = 'none';
    } else {
      if (camVideoStreamEl) {
        camVideoStreamEl.pause();
        camVideoStreamEl.style.display = 'none';
      }
      if (camVideoEl) {
        camVideoEl.src = '';
        camVideoEl.style.display = 'none';
      }
      if (camImageEl) {
        camImageEl.style.display = 'block';
        const loadFrame = () => {
          const targetSrc = camera.feed_url
            ? `${camera.feed_url.split('?')[0]}?t=${Date.now()}`
            : `/api/cctv/frame/${encodeURIComponent(camera.id)}?lat=${camera.lat}&lon=${camLon}&label=${encodeURIComponent(camera.name)}&city=${encodeURIComponent(camera.city)}&t=${Date.now()}`;
          camImageEl.src = targetSrc;
        };
        loadFrame();
        camImageEl.onerror = () => {
          camImageEl.onerror = null;
          camImageEl.src = `/api/cctv/frame/${encodeURIComponent(camera.id)}?lat=${camera.lat}&lon=${camLon}&label=${encodeURIComponent(camera.name)}&city=${encodeURIComponent(camera.city)}&t=${Date.now()}`;
        };
        camRefreshTimer = setInterval(loadFrame, 5000);
      }
    }

    // Highlight in list
    if (camListContainer) {
      const items = camListContainer.querySelectorAll('.cctv-quick-item');
      items.forEach((item) => {
        item.classList.toggle('active', item.dataset.camId === camera.id);
      });
    }

    // Also sync with cctvLayer if enabled
    try {
      cctvLayer?.selectCamera?.(camera.id, { focus: false });
    } catch { /* ignore */ }
  }

  function renderCameraList() {
    if (!camListContainer) return;
    camListContainer.innerHTML = '';
    const cams = getFilteredCameras();

    // Update filter counts
    updateFilterCounts();

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < cams.length; i++) {
      const cam = cams[i];
      const item = document.createElement('div');
      item.className = 'cctv-quick-item';
      item.dataset.camId = cam.id;
      const isLive = cam.streamType === 'live_stream' || cam.feedType === 'mp4' || (cam.status && cam.status.includes('LIVE'));
      const stateBadge = cam.state ? ` · ${cam.state}` : '';
      item.innerHTML = `
        <div class="cctv-item-header">
          <span class="cctv-item-flag">${cam.flag || '📹'}</span>
          <span class="cctv-item-name" title="${cam.name}">${cam.name}</span>
        </div>
        <div class="cctv-item-meta">
          <span>${cam.city}${stateBadge}</span>
          <span class="cctv-item-status">${isLive ? '🔴 LIVE VIDEO' : '🟢 ACTIVE'}</span>
        </div>
      `;

      item.addEventListener('click', () => {
        activeCameraIndex = i;
        displayCamera(cam);
      });

      fragment.appendChild(item);
    }

    camListContainer.appendChild(fragment);

    // Set first camera in filtered list if active is out of range
    if (cams.length > 0) {
      if (activeCameraIndex >= cams.length) activeCameraIndex = 0;
      displayCamera(cams[activeCameraIndex]);
    }
  }

  function updateFilterCounts() {
    const indiaCount = LIVE_CAMERAS_CATALOG.filter((c) => c.country === 'India').length;
    const mideastCount = LIVE_CAMERAS_CATALOG.filter((c) => c.country === 'Israel' || c.country === 'Lebanon' || c.country === 'Middle East').length;
    const londonCount = LIVE_CAMERAS_CATALOG.filter((c) => c.country === 'UK' || c.city === 'London').length;
    const globalCount = LIVE_CAMERAS_CATALOG.filter((c) => c.country !== 'India' && c.country !== 'UK' && c.country !== 'Israel' && c.country !== 'Lebanon' && c.country !== 'Middle East').length;
    const allCount = LIVE_CAMERAS_CATALOG.length;

    const btnIndia = document.querySelector('.cctv-filter-btn[data-filter="india"]');
    const btnMideast = document.querySelector('.cctv-filter-btn[data-filter="mideast"]');
    const btnLondon = document.querySelector('.cctv-filter-btn[data-filter="london"]');
    const btnGlobal = document.querySelector('.cctv-filter-btn[data-filter="global"]');
    const btnAll = document.querySelector('.cctv-filter-btn[data-filter="all"]');

    if (btnIndia) btnIndia.textContent = `🇮🇳 India All States (${indiaCount})`;
    if (btnMideast) btnMideast.textContent = `🔴 Middle East (${mideastCount})`;
    if (btnLondon) btnLondon.textContent = `🇬🇧 London (${londonCount})`;
    if (btnGlobal) btnGlobal.textContent = `🌍 Global (${globalCount})`;
    if (btnAll) btnAll.textContent = `All (${allCount})`;
  }

  function openCctvModal() {
    if (!camModal) return;
    camModal.classList.remove('hidden');
    dataManager?.setEnabled?.('cctv', true, { origin: 'user' });

    renderCameraList();

    if (!camRefreshTimer) {
      camRefreshTimer = setInterval(() => {
        const cams = getFilteredCameras();
        const cur = cams[activeCameraIndex] || LIVE_CAMERAS_CATALOG[0];
        if (cur && cur.streamType === 'frame' && camImageEl && camImageEl.style.display !== 'none') {
          const camLon = cur.lon !== undefined ? cur.lon : cur.lng;
          const freshSrc = cur.feed_url
            ? `${cur.feed_url.split('?')[0]}?t=${Date.now()}`
            : `/api/cctv/frame/${encodeURIComponent(cur.id)}?lat=${cur.lat}&lon=${camLon}&label=${encodeURIComponent(cur.name)}&city=${encodeURIComponent(cur.city)}&t=${Date.now()}`;
          camImageEl.src = freshSrc;
        }
      }, 3000);
    }
  }

  function closeCctvModal() {
    if (!camModal) return;
    camModal.classList.add('hidden');
    if (camRefreshTimer) {
      clearInterval(camRefreshTimer);
      camRefreshTimer = null;
    }
    if (isPatrolRunning) {
      stopPatrol();
    }
    if (camFeedPlayBtn) {
      camFeedPlayBtn.classList.add('hidden');
    }
    if (camVideoStreamEl) {
      camVideoStreamEl.pause();
      camVideoStreamEl.removeAttribute('src');
      camVideoStreamEl.load();
      camVideoStreamEl.style.display = 'none';
    }
    if (camVideoEl) {
      camVideoEl.src = '';
      camVideoEl.style.display = 'none';
    }
  }

  function startPatrol() {
    isPatrolRunning = true;
    if (camPatrolBtn) {
      camPatrolBtn.classList.add('active');
      camPatrolBtn.textContent = '⏸ PAUSE AUTO-PATROL';
    }
    patrolInterval = setInterval(() => {
      const cams = getFilteredCameras();
      if (!cams.length) return;
      activeCameraIndex = (activeCameraIndex + 1) % cams.length;
      const nextCam = cams[activeCameraIndex];
      displayCamera(nextCam);
      try {
        cctvLayer?.selectCamera?.(nextCam.id, { focus: true });
      } catch { /* ignore */ }
    }, 8000);
  }

  function stopPatrol() {
    isPatrolRunning = false;
    if (patrolInterval) {
      clearInterval(patrolInterval);
      patrolInterval = null;
    }
    if (camPatrolBtn) {
      camPatrolBtn.classList.remove('active');
      camPatrolBtn.textContent = '🔄 AUTO-PATROL';
    }
  }

  camCloseBtn?.addEventListener('click', closeCctvModal);

  if (camFeedPlayBtn) {
    camFeedPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (camVideoStreamEl) {
        camVideoStreamEl.muted = true;
        camVideoStreamEl.play().then(() => {
          camFeedPlayBtn.classList.add('hidden');
          camVideoStreamEl.style.display = 'block';
          if (camImageEl) camImageEl.style.display = 'none';
        }).catch((err) => console.error('[CCTV] Manual play failed:', err));
      }
    });
  }

  if (camVideoStreamEl) {
    camVideoStreamEl.addEventListener('click', () => {
      if (camVideoStreamEl.paused) {
        camVideoStreamEl.muted = true;
        camVideoStreamEl.play().then(() => {
          if (camFeedPlayBtn) camFeedPlayBtn.classList.add('hidden');
        }).catch(console.error);
      } else {
        camVideoStreamEl.pause();
        if (camFeedPlayBtn) camFeedPlayBtn.classList.remove('hidden');
      }
    });
  }

  camPatrolBtn?.addEventListener('click', () => {
    if (isPatrolRunning) stopPatrol();
    else startPatrol();
  });

  camFlyBtn?.addEventListener('click', () => {
    const cams = getFilteredCameras();
    const cam = cams[activeCameraIndex] || LIVE_CAMERAS_CATALOG[0];
    if (cam) {
      try {
        dataManager?.setEnabled?.('cctv', true, { origin: 'user' });
        const handled = cctvLayer?.selectCamera?.(cam.id, { focus: true, durationSec: 2.2 });
        if (!handled && viewer?.camera) {
          const lat = cam.lat;
          const lon = cam.lon !== undefined ? cam.lon : cam.lng;
          if (Number.isFinite(lat) && Number.isFinite(lon)) {
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(lon, lat, 350),
              orientation: {
                heading: Cesium.Math.toRadians(cam.headingDeg || 180),
                pitch: Cesium.Math.toRadians(-25),
                roll: 0,
              },
              duration: 2.2,
            });
          }
        }
      } catch (e) {
        console.warn('[CCTV] Fly to camera error:', e);
      }
    }
  });

  const camSatPassBtn = document.getElementById('cctv-action-sat-pass');
  camSatPassBtn?.addEventListener('click', () => {
    const cams = getFilteredCameras();
    const curCam = cams[activeCameraIndex] || LIVE_CAMERAS_CATALOG[0];
    closeCctvModal();
    openSatelliteModal();
    if (curCam?.country === 'India') {
      switchSatelliteSource('insat3d');
    } else if (curCam?.country === 'United States' || curCam?.country === 'USA') {
      switchSatelliteSource('goes19');
    } else {
      switchSatelliteSource('viirs');
    }
  });

  // Filter tab buttons
  document.querySelectorAll('.cctv-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cctv-filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'all';
      activeCameraIndex = 0;
      renderCameraList();
    });
  });

  // Search input
  camSearchInput?.addEventListener('input', (e) => {
    searchFilterText = e.target.value || '';
    activeCameraIndex = 0;
    renderCameraList();
  });

  // State dropdown selector
  camStateFilterEl?.addEventListener('change', () => {
    if (camStateFilterEl.value) {
      currentFilter = 'india';
      document.querySelectorAll('.cctv-filter-btn').forEach((b) => b.classList.remove('active'));
      const btnIndia = document.querySelector('.cctv-filter-btn[data-filter="india"]');
      if (btnIndia) btnIndia.classList.add('active');
    }
    activeCameraIndex = 0;
    renderCameraList();
  });

  // ---------------------------------------------------------------------------
  // 3. WIRE UP HEADER & TOOLBAR TRIGGER BUTTONS
  // ---------------------------------------------------------------------------
  const headerSatBtn = document.getElementById('header-live-sat-btn');
  const headerCctvBtn = document.getElementById('header-live-cctv-btn');
  const dockSatBtn = document.getElementById('dock-live-sat-btn');
  const dockCctvBtn = document.getElementById('dock-live-cams-btn');
  const statsSatPill = document.getElementById('stats-sats-pill');
  const statsCctvPill = document.getElementById('stats-cctv-pill');

  headerSatBtn?.addEventListener('click', openSatelliteModal);
  dockSatBtn?.addEventListener('click', openSatelliteModal);
  statsSatPill?.addEventListener('click', openSatelliteModal);

  headerCctvBtn?.addEventListener('click', openCctvModal);
  dockCctvBtn?.addEventListener('click', openCctvModal);
  statsCctvPill?.addEventListener('click', openCctvModal);

  return {
    openSatelliteModal,
    closeSatelliteModal,
    openCctvModal,
    closeCctvModal,
  };
}
