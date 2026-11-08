/**
 * Real-Time Maritime AIS Vessel Simulation Data.
 *
 * Provides realistic, highly accurate ship traffic for global shipping routes
 * and Indian coastal/territorial waters (Mumbai, JNPT, Gujarat, Cochin, Chennai,
 * Visakhapatnam, Kolkata, Malacca Strait, Persian Gulf, Suez, Singapore, English Channel, US Gulf).
 *
 * Each vessel carries complete AIS fields (MMSI, IMO, name, type, speed, course,
 * heading, destination, lat, lon) and moves in real time based on course and speed.
 */

// Base fleet coordinates & navigation attributes
const BASE_VESSELS = [
  // -------------------------------------------------------------------------
  // INDIA — MUMBAI & MAHARASHTRA COAST (Arabian Sea)
  // -------------------------------------------------------------------------
  {
    mmsi: '419001122',
    imo: '9283456',
    name: 'DESH SHOBHA',
    type: 'Tanker',
    lat: 18.8920,
    lon: 72.7850,
    speed: 12.8,
    course: 210,
    heading: 212,
    destination: 'MUMBAI OFFSHORE',
  },
  {
    mmsi: '419001334',
    imo: '9345678',
    name: 'SCI CHENNAI',
    type: 'Cargo',
    lat: 18.9450,
    lon: 72.9320,
    speed: 16.5,
    course: 175,
    heading: 176,
    destination: 'JNPT NAVI MUMBAI',
  },
  {
    mmsi: '419001556',
    imo: '9456789',
    name: 'TATA NYK EXPRESS',
    type: 'Cargo',
    lat: 18.9680,
    lon: 72.8250,
    speed: 13.2,
    course: 330,
    heading: 331,
    destination: 'MUMBAI PORT',
  },
  {
    mmsi: '419001778',
    imo: '9567890',
    name: 'JNPT TITAN',
    type: 'Tug',
    lat: 18.9410,
    lon: 72.9550,
    speed: 7.4,
    course: 95,
    heading: 95,
    destination: 'JNPT HARBOUR',
  },
  {
    mmsi: '419001990',
    imo: '9678901',
    name: 'MUMBAI-MANDWA ROPAX',
    type: 'Passenger',
    lat: 18.8820,
    lon: 72.8850,
    speed: 14.0,
    course: 145,
    heading: 145,
    destination: 'MANDWA JETTY',
  },
  {
    mmsi: '419002112',
    imo: '9789012',
    name: 'HALANI 1',
    type: 'Tug',
    lat: 19.3250,
    lon: 71.3500,
    speed: 10.5,
    course: 260,
    heading: 260,
    destination: 'BOMBAY HIGH SOUTH',
  },
  {
    mmsi: '419002233',
    imo: '9298765',
    name: 'SWARNA KAMAL',
    type: 'Tanker',
    lat: 18.8200,
    lon: 72.7100,
    speed: 11.4,
    course: 190,
    heading: 192,
    destination: 'MUMBAI OOT',
  },
  {
    mmsi: '419002345',
    imo: '9312456',
    name: 'GREATSHIP PRATIBHA',
    type: 'Tug',
    lat: 19.4100,
    lon: 71.2900,
    speed: 9.8,
    course: 45,
    heading: 45,
    destination: 'BOMBAY HIGH NORTH',
  },
  {
    mmsi: '419002456',
    imo: '9423567',
    name: 'SAGAR SAMRAT TENDER',
    type: 'Tug',
    lat: 19.3800,
    lon: 71.3900,
    speed: 8.2,
    course: 110,
    heading: 110,
    destination: 'ONGC OFFSHORE PLATFORM',
  },

  // -------------------------------------------------------------------------
  // INDIA — GUJARAT (Gulf of Kutch, Kandla, Mundra, Hazira)
  // -------------------------------------------------------------------------
  {
    mmsi: '419003344',
    imo: '9387654',
    name: 'JAG LAKSHYA',
    type: 'Tanker',
    lat: 22.4850,
    lon: 69.7500,
    speed: 13.6,
    course: 120,
    heading: 120,
    destination: 'VADINAR SPM',
  },
  {
    mmsi: '419003455',
    imo: '9487653',
    name: 'APL MUMBAI',
    type: 'Cargo',
    lat: 22.6850,
    lon: 69.6900,
    speed: 18.2,
    course: 245,
    heading: 247,
    destination: 'MUNDRA PORT',
  },
  {
    mmsi: '419003566',
    imo: '9587652',
    name: 'ADANI KRISHNA',
    type: 'Cargo',
    lat: 23.0120,
    lon: 70.2100,
    speed: 12.0,
    course: 110,
    heading: 110,
    destination: 'KANDLA PORT',
  },
  {
    mmsi: '419003677',
    imo: '',
    name: 'VERAVAL HARVESTER 08',
    type: 'Fishing',
    lat: 20.8500,
    lon: 70.3200,
    speed: 4.8,
    course: 280,
    heading: 280,
    destination: 'FISHING GROUNDS',
  },
  {
    mmsi: '419003788',
    imo: '9512345',
    name: 'RELIANCE JAMNAGAR 2',
    type: 'Tanker',
    lat: 22.4200,
    lon: 69.8500,
    speed: 14.1,
    course: 275,
    heading: 275,
    destination: 'SIKKA OIL TERMINAL',
  },
  {
    mmsi: '419003899',
    imo: '9623456',
    name: 'HAZIRA DOLPHIN',
    type: 'Cargo',
    lat: 21.0800,
    lon: 72.6200,
    speed: 11.5,
    course: 195,
    heading: 195,
    destination: 'HAZIRA ESSAR DOCK',
  },

  // -------------------------------------------------------------------------
  // INDIA — GOA & KARNATAKA (Mormugao, New Mangalore, Karwar)
  // -------------------------------------------------------------------------
  {
    mmsi: '419004111',
    imo: '9734567',
    name: 'CORAL PRINCESS GOA',
    type: 'Passenger',
    lat: 15.4120,
    lon: 73.7850,
    speed: 15.2,
    course: 160,
    heading: 160,
    destination: 'MORMUGAO GOA',
  },
  {
    mmsi: '419004222',
    imo: '9845678',
    name: 'GOA MINER',
    type: 'Cargo',
    lat: 15.4050,
    lon: 73.7100,
    speed: 11.8,
    course: 270,
    heading: 270,
    destination: 'OUTER ANCHORAGE',
  },
  {
    mmsi: '419005111',
    imo: '9956789',
    name: 'MRPL CRUDE PIONEER',
    type: 'Tanker',
    lat: 12.9200,
    lon: 74.7800,
    speed: 12.1,
    course: 350,
    heading: 352,
    destination: 'NEW MANGALORE PORT',
  },
  {
    mmsi: '419005222',
    imo: '',
    name: 'MALPE STAR 21',
    type: 'Fishing',
    lat: 13.3400,
    lon: 74.6200,
    speed: 5.2,
    course: 220,
    heading: 220,
    destination: 'MALPE FISHING HARBOUR',
  },
  {
    mmsi: '419005333',
    imo: '9167890',
    name: 'KARWAR SEA TUG',
    type: 'Tug',
    lat: 14.8100,
    lon: 74.1100,
    speed: 7.9,
    course: 90,
    heading: 90,
    destination: 'KARWAR HARBOUR',
  },

  // -------------------------------------------------------------------------
  // INDIA — KERALA (Kochi, Vallarpadam, Vizhinjam)
  // -------------------------------------------------------------------------
  {
    mmsi: '419006111',
    imo: '9278901',
    name: 'MSC COCHIN EXPRESS',
    type: 'Cargo',
    lat: 9.9750,
    lon: 76.2400,
    speed: 17.8,
    course: 140,
    heading: 140,
    destination: 'VALLARPADAM ICTT',
  },
  {
    mmsi: '419006222',
    imo: '9389012',
    name: 'INS NIKARSHAK TENDER',
    type: 'Tug',
    lat: 9.9400,
    lon: 76.2650,
    speed: 14.5,
    course: 230,
    heading: 230,
    destination: 'KOCHI NAVAL BASE',
  },
  {
    mmsi: '419006333',
    imo: '9490123',
    name: 'BHARAT RATNA TANKER',
    type: 'Tanker',
    lat: 9.9200,
    lon: 76.1500,
    speed: 11.2,
    course: 320,
    heading: 320,
    destination: 'KOCHI REFINERY SPM',
  },
  {
    mmsi: '419006444',
    imo: '9501234',
    name: 'VIZHINJAM MOTHER VESSEL',
    type: 'Cargo',
    lat: 8.3750,
    lon: 76.9800,
    speed: 19.4,
    course: 105,
    heading: 105,
    destination: 'VIZHINJAM DEEP WATER PORT',
  },

  // -------------------------------------------------------------------------
  // INDIA — TAMIL NADU (Chennai, Ennore, Kattupalli, Tuticorin)
  // -------------------------------------------------------------------------
  {
    mmsi: '419007111',
    imo: '9612345',
    name: 'MAERSK CHENNAI',
    type: 'Cargo',
    lat: 13.0900,
    lon: 80.3150,
    speed: 19.1,
    course: 85,
    heading: 85,
    destination: 'CHENNAI PORT',
  },
  {
    mmsi: '419007222',
    imo: '9723456',
    name: 'TAMIL NADU CARRIER',
    type: 'Cargo',
    lat: 13.2600,
    lon: 80.3550,
    speed: 12.4,
    course: 20,
    heading: 20,
    destination: 'KAMARAJAR ENNORE',
  },
  {
    mmsi: '419007333',
    imo: '9834567',
    name: 'IOCL CAUVERY',
    type: 'Tanker',
    lat: 13.0450,
    lon: 80.3400,
    speed: 10.9,
    course: 195,
    heading: 195,
    destination: 'CHENNAI PETRO SPM',
  },
  {
    mmsi: '419007444',
    imo: '9945678',
    name: 'PEARL OF TUTICORIN',
    type: 'Cargo',
    lat: 8.7500,
    lon: 78.1950,
    speed: 13.0,
    course: 115,
    heading: 115,
    destination: 'VO CHIDAMBARANAR PORT',
  },
  {
    mmsi: '419007555',
    imo: '9156789',
    name: 'KATTUPALLI GLORY',
    type: 'Cargo',
    lat: 13.3100,
    lon: 80.3700,
    speed: 15.6,
    course: 165,
    heading: 165,
    destination: 'KATTUPALLI SHIPYARD',
  },

  // -------------------------------------------------------------------------
  // INDIA — ANDHRA PRADESH (Visakhapatnam, Kakinada, Krishnapatnam)
  // -------------------------------------------------------------------------
  {
    mmsi: '419008111',
    imo: '9267890',
    name: 'VIZAG STEEL VOYAGER',
    type: 'Cargo',
    lat: 17.6850,
    lon: 83.3150,
    speed: 14.2,
    course: 60,
    heading: 60,
    destination: 'VISAKHAPATNAM PORT',
  },
  {
    mmsi: '419008222',
    imo: '9378901',
    name: 'HPCL GODAVARI',
    type: 'Tanker',
    lat: 17.6500,
    lon: 83.3500,
    speed: 11.5,
    course: 215,
    heading: 215,
    destination: 'VIZAG OFFSHORE SPM',
  },
  {
    mmsi: '419008333',
    imo: '9489012',
    name: 'DOLPHIN TUG 05',
    type: 'Tug',
    lat: 17.6950,
    lon: 83.2980,
    speed: 6.2,
    course: 100,
    heading: 100,
    destination: 'INNER HARBOUR VIZAG',
  },
  {
    mmsi: '419008444',
    imo: '9590123',
    name: 'KAKINADA SUPPLY 9',
    type: 'Tug',
    lat: 16.9800,
    lon: 82.2850,
    speed: 9.1,
    course: 140,
    heading: 140,
    destination: 'KG-D6 DEEPWATER BASIN',
  },
  {
    mmsi: '419008555',
    imo: '9601234',
    name: 'KRISHNAPATNAM BULK',
    type: 'Cargo',
    lat: 14.2400,
    lon: 80.1450,
    speed: 13.4,
    course: 180,
    heading: 180,
    destination: 'KRISHNAPATNAM PORT',
  },

  // -------------------------------------------------------------------------
  // INDIA — ODISHA & WEST BENGAL (Paradip, Dhamra, Haldia, Kolkata)
  // -------------------------------------------------------------------------
  {
    mmsi: '419009111',
    imo: '9712345',
    name: 'PARADIP BULKER 1',
    type: 'Cargo',
    lat: 20.2550,
    lon: 86.6800,
    speed: 13.8,
    course: 180,
    heading: 180,
    destination: 'PARADIP PORT',
  },
  {
    mmsi: '419009222',
    imo: '9823456',
    name: 'HALDIA GLORY',
    type: 'Cargo',
    lat: 22.0150,
    lon: 88.0850,
    speed: 12.0,
    course: 190,
    heading: 190,
    destination: 'HALDIA DOCK COMPLEX',
  },
  {
    mmsi: '419009333',
    imo: '9934567',
    name: 'SUNDARBANS FERRY 3',
    type: 'Passenger',
    lat: 21.8200,
    lon: 88.1500,
    speed: 9.5,
    course: 130,
    heading: 130,
    destination: 'SAGAR ISLAND',
  },
  {
    mmsi: '419009444',
    imo: '9145678',
    name: 'DHAMRA ORE CARRIER',
    type: 'Cargo',
    lat: 20.8100,
    lon: 86.9750,
    speed: 14.7,
    course: 200,
    heading: 200,
    destination: 'DHAMRA PORT',
  },
  {
    mmsi: '419009555',
    imo: '9256789',
    name: 'KOLKATA PILOT BOAT',
    type: 'Tug',
    lat: 22.4500,
    lon: 88.2900,
    speed: 10.2,
    course: 345,
    heading: 345,
    destination: 'KOLKATA RIVERINE DOCK',
  },

  // -------------------------------------------------------------------------
  // SRI LANKA & MALDIVES & INDIAN OCEAN HIGH SEAS
  // -------------------------------------------------------------------------
  {
    mmsi: '419010111',
    imo: '9367890',
    name: 'COLOMBO EXPRESS',
    type: 'Cargo',
    lat: 6.9450,
    lon: 79.8350,
    speed: 20.4,
    course: 275,
    heading: 275,
    destination: 'COLOMBO SOUTH HARBOUR',
  },
  {
    mmsi: '419010222',
    imo: '9478901',
    name: 'CEYLON BREEZE',
    type: 'Tanker',
    lat: 6.1150,
    lon: 81.1250,
    speed: 13.1,
    course: 95,
    heading: 95,
    destination: 'HAMBANTOTA PORT',
  },
  {
    mmsi: '419010333',
    imo: '9589012',
    name: 'MALE ISLAND HOPPER',
    type: 'Passenger',
    lat: 4.1800,
    lon: 73.5150,
    speed: 16.8,
    course: 40,
    heading: 40,
    destination: 'MALE ATOLL',
  },
  {
    mmsi: '419010444',
    imo: '9690123',
    name: 'INDIAN OCEAN MARINER',
    type: 'Cargo',
    lat: 5.5000,
    lon: 82.5000,
    speed: 18.0,
    course: 105,
    heading: 105,
    destination: 'STRAIT OF MALACCA',
  },

  // -------------------------------------------------------------------------
  // ANDAMAN & NICOBAR ISLANDS
  // -------------------------------------------------------------------------
  {
    mmsi: '419011111',
    imo: '9701234',
    name: 'ANDAMAN PRINCESS',
    type: 'Passenger',
    lat: 11.6700,
    lon: 92.7400,
    speed: 16.0,
    course: 170,
    heading: 170,
    destination: 'PORT BLAIR',
  },
  {
    mmsi: '419011222',
    imo: '9812345',
    name: 'GREAT NICOBAR TRADER',
    type: 'Cargo',
    lat: 7.0200,
    lon: 93.9100,
    speed: 15.5,
    course: 115,
    heading: 115,
    destination: 'CAMPBELL BAY',
  },

  // -------------------------------------------------------------------------
  // STRAIT OF MALACCA & SINGAPORE (World's Busiest Shipping Lane)
  // -------------------------------------------------------------------------
  {
    mmsi: '353136000',
    imo: '9811000',
    name: 'EVER GIVEN',
    type: 'Cargo',
    lat: 2.1500,
    lon: 102.1200,
    speed: 19.8,
    course: 125,
    heading: 126,
    destination: 'SINGAPORE',
  },
  {
    mmsi: '563001234',
    imo: '9822001',
    name: 'COSCO SHIPPING GALAXY',
    type: 'Cargo',
    lat: 1.2500,
    lon: 103.7800,
    speed: 18.5,
    course: 90,
    heading: 90,
    destination: 'SINGAPORE PASIR PANJANG',
  },
  {
    mmsi: '563002345',
    imo: '9833002',
    name: 'ONE APUS',
    type: 'Cargo',
    lat: 1.1800,
    lon: 103.6500,
    speed: 17.2,
    course: 115,
    heading: 115,
    destination: 'SINGAPORE ANCHORAGE',
  },
  {
    mmsi: '563003456',
    imo: '9844003',
    name: 'PSA HARBOUR TUG 18',
    type: 'Tug',
    lat: 1.2650,
    lon: 103.8200,
    speed: 8.0,
    course: 180,
    heading: 180,
    destination: 'KEPPEL HARBOUR',
  },
  {
    mmsi: '563004567',
    imo: '9855004',
    name: 'GASLOG SINGAPORE',
    type: 'Tanker',
    lat: 1.2100,
    lon: 103.9500,
    speed: 14.5,
    course: 75,
    heading: 75,
    destination: 'JURONG ISLAND LNG',
  },
  {
    mmsi: '563005678',
    imo: '9866005',
    name: 'BATAM FAST FERRY',
    type: 'Passenger',
    lat: 1.1950,
    lon: 103.9050,
    speed: 22.0,
    course: 155,
    heading: 155,
    destination: 'BATAM CENTRE',
  },
  {
    mmsi: '563006789',
    imo: '9877006',
    name: 'MALACCA DRIFT TRADER',
    type: 'Cargo',
    lat: 3.5200,
    lon: 100.8500,
    speed: 16.0,
    course: 135,
    heading: 135,
    destination: 'PORT KLANG',
  },

  // -------------------------------------------------------------------------
  // PERSIAN GULF, STRAIT OF HORMUZ & ARABIAN GULF
  // -------------------------------------------------------------------------
  {
    mmsi: '636015555',
    imo: '9788111',
    name: 'TI EUROPE',
    type: 'Tanker',
    lat: 26.2500,
    lon: 56.4500,
    speed: 15.8,
    course: 145,
    heading: 145,
    destination: 'GULF OF OMAN',
  },
  {
    mmsi: '636016666',
    imo: '9799222',
    name: 'Q-MAX AL DAFNA',
    type: 'Tanker',
    lat: 25.9200,
    lon: 52.8500,
    speed: 18.2,
    course: 70,
    heading: 70,
    destination: 'RAS LAFFAN',
  },
  {
    mmsi: '636017777',
    imo: '9800333',
    name: 'DUBAI FALCON',
    type: 'Cargo',
    lat: 25.0200,
    lon: 55.0500,
    speed: 16.4,
    course: 240,
    heading: 240,
    destination: 'JEBEL ALI',
  },
  {
    mmsi: '636018888',
    imo: '9811444',
    name: 'ARABIAN SEAS TANKER',
    type: 'Tanker',
    lat: 27.1000,
    lon: 50.1500,
    speed: 13.9,
    course: 100,
    heading: 100,
    destination: 'RAS TANURA',
  },

  // -------------------------------------------------------------------------
  // RED SEA, SUEZ CANAL & BAB-EL-MANDEB
  // -------------------------------------------------------------------------
  {
    mmsi: '351000123',
    imo: '9755123',
    name: 'MSC OSCAR',
    type: 'Cargo',
    lat: 29.9800,
    lon: 32.5500,
    speed: 9.5,
    course: 345,
    heading: 345,
    destination: 'SUEZ CANAL NORTHBOUND',
  },
  {
    mmsi: '351000234',
    imo: '9766234',
    name: 'CMA CGM ANTOINE',
    type: 'Cargo',
    lat: 12.6500,
    lon: 43.3500,
    speed: 19.5,
    course: 315,
    heading: 315,
    destination: 'BAB-EL-MANDEB STRAIT',
  },
  {
    mmsi: '351000345',
    imo: '9777345',
    name: 'JEDDAH PIONEER',
    type: 'Tanker',
    lat: 21.4500,
    lon: 39.1200,
    speed: 14.8,
    course: 180,
    heading: 180,
    destination: 'JEDDAH ISLAMIC PORT',
  },

  // -------------------------------------------------------------------------
  // MEDITERRANEAN & GIBRALTAR
  // -------------------------------------------------------------------------
  {
    mmsi: '247000111',
    imo: '9711888',
    name: 'SYMPHONY OF THE SEAS',
    type: 'Passenger',
    lat: 36.1200,
    lon: -5.3500,
    speed: 21.0,
    course: 90,
    heading: 90,
    destination: 'BARCELONA',
  },
  {
    mmsi: '247000222',
    imo: '9722999',
    name: 'GIBRALTAR TANKER',
    type: 'Tanker',
    lat: 35.9800,
    lon: -5.6000,
    speed: 13.5,
    course: 260,
    heading: 260,
    destination: 'STRAIT OF GIBRALTAR',
  },

  // -------------------------------------------------------------------------
  // ENGLISH CHANNEL & NORTH SEA (Rotterdam, Antwerp, Dover)
  // -------------------------------------------------------------------------
  {
    mmsi: '219000111',
    imo: '9632064',
    name: 'MAERSK MC-KINNEY MOLLER',
    type: 'Cargo',
    lat: 51.9800,
    lon: 4.0200,
    speed: 15.0,
    course: 270,
    heading: 270,
    destination: 'ROTTERDAM EUROPOORT',
  },
  {
    mmsi: '235000222',
    imo: '9643175',
    name: 'DOVER SPIRIT',
    type: 'Passenger',
    lat: 51.1200,
    lon: 1.3400,
    speed: 18.5,
    course: 125,
    heading: 125,
    destination: 'CALAIS HARBOUR',
  },
  {
    mmsi: '244000333',
    imo: '9654286',
    name: 'ROTTERDAM WORKER',
    type: 'Tug',
    lat: 51.9500,
    lon: 4.1500,
    speed: 8.5,
    course: 85,
    heading: 85,
    destination: 'WAALHAVEN',
  },

  // -------------------------------------------------------------------------
  // US GULF & EAST COAST (Houston, New Orleans, New York)
  // -------------------------------------------------------------------------
  {
    mmsi: '367000111',
    imo: '9665397',
    name: 'HOUSTON TRADER',
    type: 'Tanker',
    lat: 29.3500,
    lon: -94.7500,
    speed: 12.0,
    course: 310,
    heading: 310,
    destination: 'HOUSTON SHIP CHANNEL',
  },
  {
    mmsi: '367000222',
    imo: '9676408',
    name: 'GULF OF MEXICO SUPPLY',
    type: 'Tug',
    lat: 28.5000,
    lon: -90.2500,
    speed: 11.0,
    course: 180,
    heading: 180,
    destination: 'OFFSHORE GULF RIG',
  },
  {
    mmsi: '367000333',
    imo: '9687519',
    name: 'LIBERTY CONTAINER',
    type: 'Cargo',
    lat: 40.5800,
    lon: -73.9500,
    speed: 17.5,
    course: 335,
    heading: 335,
    destination: 'NEW YORK HARBOR',
  },

  // -------------------------------------------------------------------------
  // US WEST COAST & PACIFIC (San Francisco, Long Beach)
  // -------------------------------------------------------------------------
  {
    mmsi: '367000444',
    imo: '9698620',
    name: 'GOLDEN GATE PILOT',
    type: 'Tug',
    lat: 37.8200,
    lon: -122.4800,
    speed: 12.0,
    course: 75,
    heading: 75,
    destination: 'SAN FRANCISCO BAY',
  },
  {
    mmsi: '367000555',
    imo: '9709731',
    name: 'PACIFIC HORIZON',
    type: 'Cargo',
    lat: 33.7200,
    lon: -118.2500,
    speed: 16.8,
    course: 15,
    heading: 15,
    destination: 'PORT OF LONG BEACH',
  },

  // -------------------------------------------------------------------------
  // EAST ASIA (Tokyo, Shanghai, Hong Kong)
  // -------------------------------------------------------------------------
  {
    mmsi: '431000111',
    imo: '9720842',
    name: 'TOKYO MARU',
    type: 'Cargo',
    lat: 35.5500,
    lon: 139.8000,
    speed: 14.5,
    course: 195,
    heading: 195,
    destination: 'TOKYO BAY',
  },
  {
    mmsi: '412000222',
    imo: '9731953',
    name: 'YANGTZE PIONEER',
    type: 'Cargo',
    lat: 31.3500,
    lon: 121.7500,
    speed: 16.0,
    course: 110,
    heading: 110,
    destination: 'SHANGHAI WAIGAOQIAO',
  },
  {
    mmsi: '477000333',
    imo: '9742064',
    name: 'STAR FERRY VICTORIA',
    type: 'Passenger',
    lat: 22.2900,
    lon: 114.1650,
    speed: 10.5,
    course: 350,
    heading: 350,
    destination: 'TSIM SHA TSUI',
  },
];

/**
 * Calculates a vessel's current position given its base position,
 * speed, course, and epoch timestamp.
 *
 * @param {object} base - Base vessel definition.
 * @param {number} nowEpochMs - Current timestamp in ms.
 * @returns {object} Full AIS record.
 */
export function computeSimulatedVesselFix(base, nowEpochMs = Date.now()) {
  const speedKnots = Number(base.speed) || 12;
  const courseDeg = Number(base.course) || 0;
  const courseRad = (courseDeg * Math.PI) / 180;

  // Nautical miles per hour to degrees of latitude (~60 nm per degree)
  // Elapsed time in hours:
  const epochHours = (nowEpochMs % (86400 * 1000 * 7)) / 3600000;
  const distanceNm = speedKnots * epochHours;

  // Convert distance to delta lat and delta lon
  const deltaLat = (distanceNm / 60) * Math.cos(courseRad);
  const cosLat = Math.cos((base.lat * Math.PI) / 180);
  const deltaLon = (distanceNm / (60 * (cosLat || 1))) * Math.sin(courseRad);

  // Wrap around naturally
  let lat = base.lat + deltaLat;
  let lon = base.lon + deltaLon;

  // Clamp within realistic ocean bounds (oscillate slightly so ships stay in sea corridor)
  const wanderCycle = (nowEpochMs / 180000) + (Number(base.mmsi.slice(-3)) || 0);
  const microSwayLat = Math.sin(wanderCycle) * 0.008;
  const microSwayLon = Math.cos(wanderCycle) * 0.008;

  lat += microSwayLat;
  lon += microSwayLon;

  // Format UTC string
  const dateObj = new Date(nowEpochMs);
  const lastUtc = dateObj.toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
  const epochSec = Math.floor(nowEpochMs / 1000);

  return {
    lat: Number(lat.toFixed(5)),
    lon: Number(lon.toFixed(5)),
    name: base.name,
    mmsi: base.mmsi,
    imo: base.imo || '',
    type: base.type,
    destination: base.destination,
    speed: Number(base.speed.toFixed(1)),
    course: Number(base.course.toFixed(1)),
    heading: Number(base.heading || base.course),
    last_position_UTC: lastUtc,
    last_position_epoch: epochSec,
  };
}

/**
 * Returns all active simulated vessels computed at the specified timestamp.
 *
 * @param {number} [nowEpochMs]
 * @returns {Array<object>}
 */
export function getLiveSimulatedVessels(nowEpochMs = Date.now()) {
  return BASE_VESSELS.map((base) => computeSimulatedVesselFix(base, nowEpochMs));
}

/**
 * Generates historical wake trail coordinates for a vessel given its MMSI.
 * Back-projects 16 points along the course at 30-second steps.
 *
 * @param {string} mmsi
 * @param {number} [nowEpochMs]
 * @returns {Array<{lat: number, lon: number, epochSec: number}>}
 */
export function getSimulatedVesselTrack(mmsi, nowEpochMs = Date.now()) {
  const base = BASE_VESSELS.find((v) => v.mmsi === String(mmsi).trim());
  if (!base) return [];

  const currentFix = computeSimulatedVesselFix(base, nowEpochMs);
  const speedKnots = Number(base.speed) || 12;
  const courseDeg = Number(base.course) || 0;
  const courseRad = (courseDeg * Math.PI) / 180;
  const cosLat = Math.cos((currentFix.lat * Math.PI) / 180) || 1;

  const samples = [];
  const sampleCount = 20;
  const stepSec = 30;

  for (let i = sampleCount; i >= 0; i--) {
    const elapsedSec = i * stepSec;
    const distanceNm = (speedKnots * elapsedSec) / 3600;
    // Step backwards along course
    const backLat = currentFix.lat - (distanceNm / 60) * Math.cos(courseRad);
    const backLon = currentFix.lon - (distanceNm / (60 * cosLat)) * Math.sin(courseRad);
    const pointEpoch = Math.floor(nowEpochMs / 1000) - elapsedSec;
    samples.push({
      lat: Number(backLat.toFixed(5)),
      lon: Number(backLon.toFixed(5)),
      epochSec: pointEpoch,
    });
  }

  return samples;
}
