/**
 * @module indianLanguages
 * @description Official 22 8th Schedule Indian Languages translations and switcher for RoadGuard AI.
 */

import { geminiSpeakText } from '../services/geminiService.js';

export const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🌐' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇮🇳' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: '🇮🇳' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी', flag: '🇮🇳' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', flag: '🇮🇳' },
  { code: 'mni', name: 'Manipuri (Meitei)', native: 'মৈতৈলোন্', flag: '🇮🇳' },
  { code: 'brx', name: 'Bodo', native: 'बड़ो', flag: '🇮🇳' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', flag: '🇮🇳' },
  { code: 'ks', name: 'Kashmiri', native: 'कॉशुर', flag: '🇮🇳' },
  { code: 'sd', name: 'Sindhi', native: 'सिन्धी', flag: '🇮🇳' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', flag: '🇮🇳' },
];

export const TRANSLATIONS = {
  en: {
    portal_title: "RoadGuard AI",
    portal_subtitle: "National Smart Road & Grievance Redressal System",
    welcome: "Welcome Back",
    sign_in_desc: "Sign in to access your road maintenance and grievance operations.",
    citizen_portal: "Citizen Portal",
    officer_portal: "Officer / Contractor Login",
    email_or_mobile: "Email or 10-Digit Mobile",
    password: "Password",
    remember_me: "Remember this device",
    forgot_password: "Forgot Password?",
    sign_in_btn: "Sign In to Portal",
    guest_btn: "Continue as Guest (Open 3D Map)",
    track_complaint: "Track Road Complaint",
    track_complaint_desc: "Check live progress of your road repair from registration to final approval.",
    report_damage: "Report Road Damage",
    damage_map: "3D Road Network",
    select_language: "Select Language (22 Official Indian Languages)",
    
    // Road Types
    all_roads: "All Types of Roads",
    cement_roads: "Cement Roads (CC Roads)",
    cement_roads_desc: "Rigid pavement concrete streets & residential colony roads",
    village_streets: "Village & Local Streets",
    village_streets_desc: "Gram Panchayat lanes and rural connectivity roads",
    city_roads: "City Roads",
    city_roads_desc: "Municipal corporation ward roads and urban commercial corridors",
    main_roads: "Main Roads",
    main_roads_desc: "Major district roads and high-density arterial thoroughfares",
    highways: "Highways & Expressways",
    highways_desc: "National and State Highways under NHAI / PWD jurisdiction",

    // Tracking Stages
    stage_registered: "Complaint Registered",
    stage_registered_desc: "Complaint successfully raised with automated geotag & token ID.",
    stage_authority: "Authority Assigned",
    stage_authority_desc: "Transferred to jurisdictional division (Municipal / PWD / Panchayat).",
    stage_worker: "Worker / Crew Appointed",
    stage_worker_desc: "Repair supervisor & contractor team assigned with equipment.",
    stage_repair: "Repair In Progress",
    stage_repair_desc: "Active surface preparation, bitumen/concrete filling, & compaction.",
    stage_review: "Road Condition Review",
    stage_review_desc: "Photometric verification of Before vs After condition.",
    stage_approved: "Final Approval & Resolved",
    stage_approved_desc: "Quality audit passed and grievance closed with digital sign-off.",

    // Actions & Labels
    enter_tracking_id: "Enter Tracking ID (e.g. RG-2026-CC-8492)...",
    track_status_btn: "Track Status",
    before_repair: "BEFORE REPAIR (Distress Evidence)",
    after_repair: "AFTER REPAIR (Restored Surface)",
    lead_worker: "Site Supervisor",
    work_crew: "Repair Crew",
    department: "Responsible Authority",
    target_sla: "Target Resolution (SLA)",
    location: "Location",
    severity: "Severity Level",
    priority: "Priority",
    road_type_label: "Road Classification",
    lodge_grievance: "Lodge Official Grievance",
    verified_by_ai: "AI Verified Detection",
    village_roads_title: "Village & City Road Network",
    roads_ready: "Roads Ready",
    switch_locality: "🌐 SWITCH CITY / TOWN / VILLAGE:",
    type_any_locality: "Or type ANY town, city, or village... (e.g. Eluru, Warangal, Jaipur)",
    filter_roads_placeholder: "Filter streets & roads of selected town by name...",
    scan_btn: "SCAN",
    pill_all_roads: "ALL ROADS",
    pill_cement_roads: "CEMENT (CC) ROADS",
    pill_village_streets: "VILLAGE STREETS",
    pill_city_roads: "CITY ROADS",
    pill_main_roads: "MAIN ROADS",
    pill_highways: "HIGHWAYS",
    badge_damaged_road: "🔴 DAMAGED ROAD",
    badge_fair_road: "🟡 FAIR CONDITION",
    badge_good_road: "🟢 GOOD CONDITION",
    btn_inspect_detect: "🔍 INSPECT & DETECT",
    btn_raise_problem: "🚨 RAISE THE PROBLEM",
    btn_problem_raised_done: "✅ PROBLEM RAISED",
    floating_damaged_title: "🔴 THIS ROAD IS DAMAGED",
    floating_warning_title: "🟡 FAIR CONDITION · MODERATE WEAR",
    floating_good_title: "🟢 THIS ROAD IS IN GOOD CONDITION",
    defect_score_lbl: "Defect Score",
    responsible_dept_lbl: "Responsible Dept",
    road_hierarchy_lbl: "Road Hierarchy",
    pavement_surface_lbl: "Pavement Surface",
    btn_satellite_recon: "🛰️ SATELLITE 1-HR RECON",
    btn_satellite_hud: "🛰️ FULL SATELLITE HUD",
    btn_fly_street: "📍 FLY TO STREET (3D)",
    btn_all_roads_locality: "📋 ALL ROADS IN LOCALITY",
    btn_live_cams: "📹 LIVE CAMS",
    damage_desc_severe_potholes: "Severe Potholes Detected · Surface Milling & Restoration Needed",
    damage_desc_warning_debris: "Roadside Waste & Surface Fissures · Maintenance Scheduled",
    damage_desc_smooth_pavement: "Surface Intact · Smooth Asphalt Pavement · Zero Defects",
    voice_announcement: "Voice Announcement",
    restoration_needed: "Surface Milling & Restoration Needed",
    maintenance_scheduled: "Maintenance Scheduled",
    score_critical: "Critical Distress",
    score_moderate: "Moderate Wear",
    score_optimal: "Optimal Quality",
    problem_raised_heading: "PROBLEM RAISED SUCCESSFULLY!",
    badge_city_street: "CITY STREET",
    badge_village_track: "VILLAGE TRACK",
    badge_secondary_main: "SECONDARY MAIN",
    badge_highway_nh: "NATIONAL HIGHWAY",
  },

  hi: {
    portal_title: "रोडगार्ड एआई",
    portal_subtitle: "राष्ट्रीय स्मार्ट सड़क एवं शिकायत निवारण प्रणाली",
    welcome: "वापसी पर स्वागत है",
    sign_in_desc: "सड़क रखरखाव एवं शिकायत निवारण पोर्टल में लॉगिन करें।",
    citizen_portal: "नागरिक पोर्टल",
    officer_portal: "अधिकारी / ठेकेदार लॉगिन",
    email_or_mobile: "ईमेल या 10-अंकों का मोबाइल",
    password: "पासवर्ड",
    remember_me: "इस डिवाइस को याद रखें",
    forgot_password: "पासवर्ड भूल गए?",
    sign_in_btn: "पोर्टल में साइन इन करें",
    guest_btn: "अतिथि के रूप में जारी रखें (3D मैप खोलें)",
    track_complaint: "सड़क शिकायत ट्रैक करें",
    track_complaint_desc: "पंजीकरण से लेकर अंतिम स्वीकृति तक अपनी सड़क मरम्मत की लाइव प्रगति देखें।",
    report_damage: "सड़क क्षति की रिपोर्ट करें",
    damage_map: "3D सड़क नेटवर्क",
    select_language: "भाषा चुनें (22 आधिकारिक भारतीय भाषाएं)",

    all_roads: "सभी प्रकार की सड़कें",
    cement_roads: "सीमेंट सड़कें (सीसी रोड)",
    cement_roads_desc: "आवासीय कॉलोनियों एवं गलियों की कंक्रीट सड़कें",
    village_streets: "ग्रामीण एवं स्थानीय सड़कें",
    village_streets_desc: "ग्राम पंचायत की सड़कें एवं ग्रामीण संपर्क मार्ग",
    city_roads: "शहरी सड़कें",
    city_roads_desc: "नगर निगम वार्ड सड़कें और वाणिज्यिक गलियारे",
    main_roads: "मुख्य सड़कें",
    main_roads_desc: "प्रमुख जिला सड़कें और भारी यातायात वाले मार्ग",
    highways: "राजमार्ग एवं एक्सप्रेसवे",
    highways_desc: "एनएचएआई और लोक निर्माण विभाग (पीडब्ल्यूडी) के राष्ट्रीय व राज्य राजमार्ग",

    stage_registered: "शिकायत पंजीकृत",
    stage_registered_desc: "जियोटैग और टोकन आईडी के साथ शिकायत सफलतापूर्वक दर्ज हुई।",
    stage_authority: "प्राधिकरण सौंपा गया",
    stage_authority_desc: "क्षेत्राधिकार विभाग (नगर निगम / पीडब्ल्यूडी / पंचायत) को भेजा गया।",
    stage_worker: "कर्मचारी / टीम नियुक्त",
    stage_worker_desc: "मरम्मत पर्यवेक्षक और ठेकेदार दल को उपकरणों सहित नियुक्त किया गया।",
    stage_repair: "मरम्मत प्रगति पर",
    stage_repair_desc: "सड़क खुदाई, कंक्रीट/बिटुमेन भराई और समतलीकरण कार्य जारी।",
    stage_review: "सड़क स्थिति समीक्षा",
    stage_review_desc: "मरम्मत से पहले और बाद की तस्वीरों का फोटोमेट्रिक सत्यापन।",
    stage_approved: "अंतिम स्वीकृति व निस्तारण",
    stage_approved_desc: "गुणवत्ता जांच उत्तीर्ण और डिजिटल हस्ताक्षर के साथ शिकायत हल।",

    enter_tracking_id: "ट्रैकिंग आईडी दर्ज करें (उदा. RG-2026-CC-8492)...",
    track_status_btn: "स्थिति ट्रैक करें",
    before_repair: "मरम्मत से पहले (क्षति प्रमाण)",
    after_repair: "मरम्मत के बाद (पुनर्निर्मित सतह)",
    lead_worker: "साइट सुपरवाइजर",
    work_crew: "मरम्मत दल",
    department: "जिम्मेदार प्राधिकरण",
    target_sla: "लक्ष्य समाधान अवधि (SLA)",
    location: "स्थान",
    severity: "गंभीरता स्तर",
    priority: "प्राथमिकता",
    road_type_label: "सड़क का प्रकार",
    lodge_grievance: "आधिकारिक शिकायत दर्ज करें",
    verified_by_ai: "एआई सत्यापित पहचान",
    village_roads_title: "ग्रामीण एवं शहरी सड़क नेटवर्क",
    roads_ready: "सड़कें उपलब्ध",
    switch_locality: "🌐 शहर / कस्बा / गाँव चुनें:",
    type_any_locality: "किसी भी शहर या गाँव का नाम लिखें... (उदा. एलुरु, वारंगल, जयपुर)",
    filter_roads_placeholder: "नाम से सड़कें खोजें...",
    scan_btn: "स्कैन करें",
    pill_all_roads: "सभी सड़कें",
    pill_cement_roads: "सीमेंट (सीसी) सड़कें",
    pill_village_streets: "ग्रामीण सड़कें",
    pill_city_roads: "शहरी सड़कें",
    pill_main_roads: "मुख्य सड़कें",
    pill_highways: "राजमार्ग",
    badge_damaged_road: "🔴 क्षतिग्रस्त सड़क",
    badge_fair_road: "🟡 सामान्य स्थिति",
    badge_good_road: "🟢 अच्छी स्थिति",
    btn_inspect_detect: "🔍 निरीक्षण व जांच",
    btn_raise_problem: "🚨 समस्या दर्ज करें",
    btn_problem_raised_done: "✅ समस्या दर्ज हुई",
    floating_damaged_title: "🔴 यह सड़क क्षतिग्रस्त है",
    floating_warning_title: "🟡 सामान्य स्थिति · हल्का नुकसान",
    floating_good_title: "🟢 यह सड़क अच्छी स्थिति में है",
    defect_score_lbl: "दोष स्कोर",
    responsible_dept_lbl: "जिम्मेदार विभाग",
    road_hierarchy_lbl: "सड़क श्रेणी",
    pavement_surface_lbl: "सड़क की सतह",
    btn_satellite_recon: "🛰️ उपग्रह 1-घंटे का स्कैन",
    btn_satellite_hud: "🛰️ पूर्ण उपग्रह HUD",
    btn_fly_street: "📍 सड़क पर जाएं (3D)",
    btn_all_roads_locality: "📋 क्षेत्र की सभी सड़कें",
    btn_live_cams: "📹 लाइव कैमरे",
    damage_desc_severe_potholes: "गहरे गड्ढे पाए गए · सतह का पुनर्निर्माण आवश्यक",
    damage_desc_warning_debris: "सड़क पर टूट-फूट एवं मलबा · मरम्मत निर्धारित",
    damage_desc_smooth_pavement: "सड़क सुरक्षित है · चिकनी डामर सतह · कोई दोष नहीं",
    badge_city_street: "शहरी सड़क",
    badge_village_track: "ग्रामीण मार्ग",
    badge_secondary_main: "मुख्य मार्ग",
    badge_highway_nh: "राष्ट्रीय राजमार्ग",
  },

  te: {
    voice_announcement: "వాయిస్ ప్రకటన",
    restoration_needed: "ఉపరితల పునరుద్ధరణ & తక్షణ ప్యాచ్ పనులు అవసరం",
    maintenance_scheduled: "నిర్వహణ పనులు షెడ్యూల్ చేయబడ్డాయి",
    score_critical: "తీవ్రమైన సమస్య",
    score_moderate: "మధ్యస్థ అరుగుదల",
    score_optimal: "ఉత్తమ నాణ్యత",
    problem_raised_heading: "సమస్య విజయవంతంగా నమోదైంది!",
    road_recon_title: "రోడ్డు పరిశీలన & AI నష్టం గుర్తింపు",
    status_label: "స్థితి",
    track_modal_title: "రోడ్డు ఫిర్యాదుల స్థితి ట్రాకింగ్ వ్యవస్థ",
    track_modal_subtitle: "ఫిర్యాదు నమోదు నుండి మరమ్మతు ఆమోదం వరకు పూర్తి పారదర్శక ట్రాకింగ్.",
    authority_worker_card_title: "అధికార విభాగం & కార్మికుల నియామకం",
    repair_log_card_title: "మరమ్మతు స్థితి & పనుల వివరాలు",
    photometric_audit_title: "మరమ్మతుకు ముందు & తర్వాత ఫోటోల తనిఖీ",
    resolution_cert_title: "డిజిటల్ ఆమోద ధృవీకరణ పత్రం",

    portal_title: "రోడ్‌గార్డ్ AI",
    portal_subtitle: "జాతీయ స్మార్ట్ రోడ్డు మరమ్మతులు & ఫిర్యాదుల పరిష్కార వ్యవస్థ",
    welcome: "పునఃస్వాగతం",
    sign_in_desc: "రోడ్డు నిర్వహణ మరియు ఫిర్యాదుల పోర్టల్‌లోకి లాగిన్ అవ్వండి.",
    citizen_portal: "పౌర వేదిక (Citizen Portal)",
    officer_portal: "అధికారి / కాంట్రాక్టర్ లాగిన్",
    email_or_mobile: "ఈమెయిల్ లేదా 10 అంకెల మొబైల్",
    password: "పాస్‌వర్డ్",
    remember_me: "గుర్తుంచుకో",
    forgot_password: "పాస్‌వర్డ్ మర్చిపోయారా?",
    sign_in_btn: "పోర్టల్‌లోకి సైన్ ఇన్ చేయండి",
    guest_btn: "గెస్ట్‌గా కొనసాగండి (3D మ్యాప్ తెరవండి)",
    track_complaint: "రోడ్డు ఫిర్యాదును ట్రాక్ చేయండి",
    track_complaint_desc: "రిజిస్ట్రేషన్ నుండి పూర్తి పరిష్కారం వరకు మీ రోడ్డు మరమ్మతు పురోగతిని చూడండి.",
    report_damage: "రోడ్డు గుంతల ఫిర్యాదు",
    damage_map: "3D రోడ్డు నెట్‌వర్క్",
    select_language: "భాషను ఎంచుకోండి (22 అధికారిక భారతీయ భాషలు)",

    all_roads: "అన్ని రకాల రోడ్లు",
    cement_roads: "సిమెంట్ రోడ్లు (CC రోడ్లు)",
    cement_roads_desc: "నివాస ప్రాంతాలు & కాలనీల కాంక్రీట్ సీసీ రోడ్లు",
    village_streets: "గ్రామీణ మరియు స్థానిక వీధులు",
    village_streets_desc: "గ్రామ పంచాయతీ వీధులు మరియు గ్రామీణ అనుసంధాన రహదారులు",
    city_roads: "నగర రోడ్లు",
    city_roads_desc: "మున్సిపల్ కార్పొరేషన్ వార్డు రోడ్లు మరియు వాణిజ్య వీధులు",
    main_roads: "ప్రధాన రోడ్లు",
    main_roads_desc: "ముఖ్య జిల్లా రోడ్లు మరియు భారీ ట్రాఫిక్ ధమనులు",
    highways: "హైవేలు & ఎక్స్‌ప్రెస్‌వేలు",
    highways_desc: "NHAI మరియు స్టేట్ PWD జాతీయ రహదారులు",

    stage_registered: "ఫిర్యాదు నమోదైంది",
    stage_registered_desc: "జియోట్యాగ్ మరియు టోకెన్ ఐడీతో ఫిర్యాదు విజయవంతంగా నమోదైంది.",
    stage_authority: "సంబంధిత విభాగానికి కేటాయింపు",
    stage_authority_desc: "అధికార పరిధిలోని శాఖకు (మున్సిపల్ / PWD / పంచాయతీ రాజ్) బదిలీ చేయబడింది.",
    stage_worker: "సిబ్బంది & బృందం నియామకం",
    stage_worker_desc: "మరమ్మతు సూపర్వైజర్ మరియు వర్క్ టీమ్ కేటాయించబడ్డారు.",
    stage_repair: "మరమ్మతు పని జరుగుతోంది",
    stage_repair_desc: "గుంతల పూడ్చివేత, కాంక్రీట్ లేదా తారు పనులు కొనసాగుతున్నాయి.",
    stage_review: "రోడ్డు పరిస్థితి పరిశీలన",
    stage_review_desc: "మరమ్మతుకు ముందు మరియు తర్వాత ఫోటోల తనిఖీ.",
    stage_approved: "తుది ఆమోదం & సమస్య పరిష్కారం",
    stage_approved_desc: "క్వాలిటీ ఆడిట్ పూర్తయి అధికారిక డిజిటల్ సంతకంతో పరిష్కరించబడింది.",

    enter_tracking_id: "ట్రాకింగ్ ఐడీ నమోదు చేయండి (ఉదా. RG-2026-CC-8492)...",
    track_status_btn: "స్టేటస్ ట్రాక్ చేయండి",
    before_repair: "మరమ్మతుకు ముందు (లోపం ఫోటో)",
    after_repair: "మరమ్మతు తర్వాత (పూర్తయిన రోడ్డు)",
    lead_worker: "సైట్ సూపర్వైజర్",
    work_crew: "మరమ్మతు సిబ్బంది",
    department: "బాధ్యతాయుత అధికారం",
    target_sla: "లక్ష్య పరిష్కార సమయం (SLA)",
    location: "ప్రదేశం",
    severity: "తీవ్రత స్థాయి",
    priority: "ప్రాధాన్యత",
    road_type_label: "రోడ్డు వర్గం",
    lodge_grievance: "అధికారిక ఫిర్యాదు నమోదు చేయండి",
    verified_by_ai: "AI ధృవీకరించిన లోపం",
    village_roads_title: "గ్రామ & నగర రోడ్డు నెట్‌వర్క్",
    roads_ready: "రోడ్లు సిద్ధంగా ఉన్నాయి",
    switch_locality: "🌐 నగరం / పట్టణం / గ్రామం ఎంచుకోండి:",
    type_any_locality: "ఏదైనా నగరం లేదా గ్రామం పేరు నమోదు చేయండి... (ఉదా: ఏలూరు, వరంగల్, జైపూర్)",
    filter_roads_placeholder: "రోడ్ల పేరుతో శోధించండి...",
    scan_btn: "స్కాన్ చేయండి",
    pill_all_roads: "అన్ని రోడ్లు",
    pill_cement_roads: "సిమెంట్ (CC) రోడ్లు",
    pill_village_streets: "గ్రామ వీధులు",
    pill_city_roads: "నగర రోడ్లు",
    pill_main_roads: "ప్రధాన రోడ్లు",
    pill_highways: "హైవేలు",
    badge_damaged_road: "🔴 దెబ్బతిన్న రోడ్డు",
    badge_fair_road: "🟡 సాధారణ స్థితి",
    badge_good_road: "🟢 మంచి స్థితి",
    btn_inspect_detect: "🔍 తనిఖీ & పరిశీలన",
    btn_raise_problem: "🚨 సమస్యను నమోదు చేయండి",
    btn_problem_raised_done: "✅ సమస్య నమోదైంది",
    floating_damaged_title: "🔴 ఈ రోడ్డు దెబ్బతిన్నది",
    floating_warning_title: "🟡 సాధారణ స్థితి · కొద్దిగా దెబ్బతిన్నది",
    floating_good_title: "🟢 ఈ రోడ్డు మంచి స్థితిలో ఉంది",
    defect_score_lbl: "లోపం స్కోరు",
    responsible_dept_lbl: "బాధ్యతాయుత విభాగం",
    road_hierarchy_lbl: "రోడ్డు వర్గం",
    pavement_surface_lbl: "రోడ్డు ఉపరితలం",
    btn_satellite_recon: "🛰️ ఉపగ్రహ 1-గంట రీకాన్",
    btn_satellite_hud: "🛰️ పూర్తి ఉపగ్రహ HUD",
    btn_fly_street: "📍 వీధికి వెళ్లండి (3D)",
    btn_all_roads_locality: "📋 స్థానిక అన్ని రోడ్లు",
    btn_live_cams: "📹 లైవ్ కెమెరాలు",
    damage_desc_severe_potholes: "తీవ్రమైన గుంతలు గుర్తించబడ్డాయి · తక్షణ మరమ్మతులు అవసరం",
    damage_desc_warning_debris: "రోడ్డు ఉపరితలం దెబ్బతిన్నది · మరమ్మతులు షెడ్యూల్ చేయబడ్డాయి",
    damage_desc_smooth_pavement: "రోడ్డు సురక్షితంగా ఉంది · నునుపైన తారు రోడ్డు · ఎటువంటి లోపాలు లేవు",
    badge_city_street: "నగర వీధి",
    badge_village_track: "గ్రామ రహదారి",
    badge_secondary_main: "ప్రధాన రోడ్డు",
    badge_highway_nh: "జాతీయ రహదారి",
  },

  ta: {
    portal_title: "ரோட்கார்ட் AI",
    portal_subtitle: "தேசிய சாலைப் பராமரிப்பு மற்றும் குறைதீர்க்கும் அமைப்பு",
    welcome: "மீண்டும் வருக",
    sign_in_desc: "சாலைப் பராமரிப்பு மற்றும் புகார்கள் போர்ட்டலில் உள்நுழையவும்.",
    citizen_portal: "குடிமக்கள் போர்டல்",
    officer_portal: "அதிகாரி / ஒப்பந்ததாரர் உள்நுழைவு",
    email_or_mobile: "மின்னஞ்சல் அல்லது 10 இலக்க மொபைல்",
    password: "கடவுச்சொல்",
    remember_me: "நினைவில் கொள்க",
    forgot_password: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
    sign_in_btn: "உள்நுழைக",
    guest_btn: "விருந்தினராக தொடர்க (3D வரைபடம்)",
    track_complaint: "சாலைப் புகாரைக் கண்காணிக்கவும்",
    track_complaint_desc: "பதிவு முதல் இறுதி ஒப்புதல் வரை சாலை பழுதுபார்க்கும் நேரடி முன்னேற்றத்தைக் காண்க.",
    report_damage: "சாலை சேதத்தைப் புகாரளிக்கவும்",
    damage_map: "3D சாலை வரைபடம்",
    select_language: "மொழியைத் தேர்ந்தெடுக்கவும் (22 இந்திய மொழிகள்)",

    all_roads: "அனைத்து வகை சாலைகள்",
    cement_roads: "சிமெண்ட் சாலைகள் (CC சாலைகள்)",
    cement_roads_desc: "குடியிருப்புப் பகுதி கான்கிரீட் தெருக்கள்",
    village_streets: "கிராமப்புற மற்றும் உள்ளூர் தெருக்கள்",
    village_streets_desc: "கிராம ஊராட்சி சாலைகள் மற்றும் இணைப்புப் பாதைகள்",
    city_roads: "நகர சாலைகள்",
    city_roads_desc: "மாநகராட்சி வார்டு சாலைகள் மற்றும் வணிக பகுதிகள்",
    main_roads: "முக்கிய சாலைகள்",
    main_roads_desc: "மாவட்ட சாலைகள் மற்றும் போக்குவரத்து வழித்தடங்கள்",
    highways: "நெடுஞ்சாலைகள் & விரைவுச்சாலைகள்",
    highways_desc: "NHAI மற்றும் மாநில நெடுஞ்சாலைகள்",

    stage_registered: "புகார் பதிவு செய்யப்பட்டது",
    stage_registered_desc: "புவிக்குறியீடு மற்றும் டோக்கன் ஐடியுடன் புகார் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது.",
    stage_authority: "அதிகாரப் பிரிவுக்கு ஒதுக்கப்பட்டது",
    stage_authority_desc: "சம்பந்தப்பட்ட துறைக்கு (மாநகராட்சி / நெடுஞ்சாலைத் துறை) அனுப்பப்பட்டது.",
    stage_worker: "பணியாளர் / குழு நியமிக்கப்பட்டது",
    stage_worker_desc: "பழுதுபார்க்கும் மேற்பார்வையாளர் மற்றும் பணிக்குழு நியமிக்கப்பட்டுள்ளது.",
    stage_repair: "பழுதுபார்க்கும் பணி நடக்கிறது",
    stage_repair_desc: "குழிகள் சரிசெய்தல் மற்றும் தார்/கான்கிரீட் இடுதல் தொடர்கிறது.",
    stage_review: "சாலை நிலை ஆய்வு",
    stage_review_desc: "பழுதுபார்ப்பதற்கு முந்தைய மற்றும் பிந்தைய படங்களின் சரிபார்ப்பு.",
    stage_approved: "இறுதி ஒப்புதல் & தீர்க்கப்பட்டது",
    stage_approved_desc: "தரத் தணிக்கை நிறைவடைந்து டிஜிட்டல் கையொப்பத்துடன் தீர்க்கப்பட்டது.",

    enter_tracking_id: "கண்காணிப்பு ஐடியை உள்ளிடவும் (எ.கா. RG-2026-CC-8492)...",
    track_status_btn: "நிலையைக் கண்காணிக்கவும்",
    before_repair: "பழுதுபார்ப்பதற்கு முன்",
    after_repair: "பழுதுபார்த்த பின்",
    lead_worker: "தள மேற்பார்வையாளர்",
    work_crew: "பணிக்குழு",
    department: "பொறுப்பான துறை",
    target_sla: "தீர்வு இலக்கு (SLA)",
    location: "இடம்",
    severity: "தீவிர நிலை",
    priority: "முன்னுரிமை",
    road_type_label: "சாலை வகை",
    lodge_grievance: "அதிகாரப்பூர்வ புகார் பதிவு",
    verified_by_ai: "AI சரிபார்க்கப்பட்ட கண்டறிதல்",
    village_roads_title: "கிராம மற்றும் நகர சாலை வலைப்பின்னல்",
    roads_ready: "சாலைகள் தயார்",
    switch_locality: "🌐 நகரம் / கிராமம் தேர்ந்தெடுக்கவும்:",
    type_any_locality: "நகரம் அல்லது கிராமத்தின் பெயரை உள்ளிடவும்...",
    filter_roads_placeholder: "சாலைகளின் பெயர் மூலம் தேடுங்கள்...",
    scan_btn: "ஸ்கேன் செய்க",
    pill_all_roads: "அனைத்து சாலைகள்",
    pill_cement_roads: "சிமெண்ட் (CC) சாலைகள்",
    pill_village_streets: "கிராம சாலைகள்",
    pill_city_roads: "நகர சாலைகள்",
    pill_main_roads: "முக்கிய சாலைகள்",
    pill_highways: "நெடுஞ்சாலைகள்",
    badge_damaged_road: "🔴 சேதமடைந்த சாலை",
    badge_fair_road: "🟡 சாதாரண நிலை",
    badge_good_road: "🟢 நல்ல நிலை",
    btn_inspect_detect: "🔍 ஆய்வு & கண்டறிதல்",
    btn_raise_problem: "🚨 புகாரைப் பதிவு செய்யவும்",
    btn_problem_raised_done: "✅ புகார் பதிவு செய்யப்பட்டது",
    floating_damaged_title: "🔴 இந்த சாலை சேதமடைந்துள்ளது",
    floating_warning_title: "🟡 சாதாரண நிலை · சிறிய சேதம்",
    floating_good_title: "🟢 இந்த சாலை நல்ல நிலையில் உள்ளது",
    defect_score_lbl: "சேதக் குறியீடு",
    responsible_dept_lbl: "பொறுப்பான துறை",
    road_hierarchy_lbl: "சாலை வகை",
    pavement_surface_lbl: "சாலை மேற்பரப்பு",
    btn_satellite_recon: "🛰️ செயற்கைக்கோள் 1-மணி நேர ஆய்வு",
    btn_satellite_hud: "🛰️ முழு செயற்கைக்கோள் HUD",
    btn_fly_street: "📍 சாலைக்குச் செல்லவும் (3D)",
    btn_all_roads_locality: "📋 இப்பகுதியின் அனைத்து சாலைகள்",
    btn_live_cams: "📹 நேரலைக் கேமராக்கள்",
    damage_desc_severe_potholes: "கடுமையான பள்ளங்கள் கண்டறியப்பட்டன · உடனடி பழுது தேவை",
    damage_desc_warning_debris: "மேற்பரப்பு சேதம் மற்றும் குப்பைகள் · பழுது திட்டமிடப்பட்டது",
    damage_desc_smooth_pavement: "சாலை பாதுகாப்பாக உள்ளது · குறைபாடுகள் இல்லை",
    badge_city_street: "நகர சாலை",
    badge_village_track: "கிராமப் பாதை",
    badge_secondary_main: "முதன்மை சாலை",
    badge_highway_nh: "தேசிய நெடுஞ்சாலை",
  },

  kn: {
    portal_title: "ರೋಡ್‌ಗಾರ್ಡ್ AI",
    portal_subtitle: "ರಾಷ್ಟ್ರೀಯ ಸ್ಮಾರ್ಟ್ ರಸ್ತೆ ನಿರ್ವಹಣೆ ಮತ್ತು ದೂರು ನಿವಾರಣಾ ವ್ಯವಸ್ಥೆ",
    welcome: "ಮತ್ತೆ ಸುಸ್ವಾಗತ",
    sign_in_desc: "ರಸ್ತೆ ನಿರ್ವಹಣೆ ಮತ್ತು ದೂರುಗಳ ಪೋರ್ಟಲ್‌ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    citizen_portal: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
    officer_portal: "ಅಧಿಕಾರಿ / ಗುತ್ತಿಗೆದಾರ ಲಾಗಿನ್",
    email_or_mobile: "ಇಮೇಲ್ ಅಥವಾ 10-ಅಂಕಿಯ ಮೊಬೈಲ್",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    remember_me: "ನೆನಪಿಡಿ",
    forgot_password: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?",
    sign_in_btn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
    guest_btn: "ಅತಿಥಿಯಾಗಿ ಮುಂದುವರಿಯಿರಿ (3D ನಕ್ಷೆ)",
    track_complaint: "ರಸ್ತೆ ದೂರನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    track_complaint_desc: "ನೋಂದಣಿಯಿಂದ ಅಂತಿಮ ಅನುಮೋದನೆಯವರೆಗೆ ರಸ್ತೆ ದುರಸ್ತಿಯ ನೇರ ಪ್ರಗತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
    report_damage: "ರಸ್ತೆ ಗುಂಡಿ ದೂರು ನೀಡಿ",
    damage_map: "3D ರಸ್ತೆ ಜಾಲ",
    select_language: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ (22 ಅಧಿಕೃತ ಭಾರತೀಯ ಭಾಷೆಗಳು)",

    all_roads: "ಎಲ್ಲಾ ರೀತಿಯ ರಸ್ತೆಗಳು",
    cement_roads: "ಸಿಮೆಂಟ್ ರಸ್ತೆಗಳು (CC ರಸ್ತೆಗಳು)",
    cement_roads_desc: "ವಸತಿ ಬಡಾವಣೆಗಳ ಕಾಂಕ್ರೀಟ್ ಸಿಮೆಂಟ್ ರಸ್ತೆಗಳು",
    village_streets: "ಗ್ರಾಮೀಣ ಮತ್ತು ಸ್ಥಳೀಯ ರಸ್ತೆಗಳು",
    village_streets_desc: "ಗ್ರಾಮ ಪಂಚಾಯತ್ ರಸ್ತೆಗಳು ಮತ್ತು ಗ್ರಾಮೀಣ ಸಂಪರ್ಕ ಮಾರ್ಗಗಳು",
    city_roads: "ನಗರ ರಸ್ತೆಗಳು",
    city_roads_desc: "ಮಹಾನಗರ ಪಾಲಿಕೆ ವಾರ್ಡ್ ರಸ್ತೆಗಳು",
    main_roads: "ಮುಖ್ಯ ರಸ್ತೆಗಳು",
    main_roads_desc: "ಜಿಲ್ಲಾ ಮುಖ್ಯ ರಸ್ತೆಗಳು ಮತ್ತು ಸಾರಿಗೆ ಮಾರ್ಗಗಳು",
    highways: "ಹೆದ್ದಾರಿಗಳು & ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇಗಳು",
    highways_desc: "NHAI ಮತ್ತು ಲೋಕೋಪಯೋಗಿ (PWD) ಹೆದ್ದಾರಿಗಳು",

    stage_registered: "ದೂರು ದಾಖಲಾಗಿದೆ",
    stage_registered_desc: "ಜಿಯೋಟ್ಯಾಗ್ ಮತ್ತು ಟೋಕನ್ ಐಡಿಯೊಂದಿಗೆ ದೂರು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ.",
    stage_authority: "ಪ್ರಾಧಿಕಾರಕ್ಕೆ ನಿಯೋಜಿಸಲಾಗಿದೆ",
    stage_authority_desc: "ಸಂಬಂಧಿತ ಇಲಾಖೆಗೆ (ಮಹಾನಗರ ಪಾಲಿಕೆ / PWD / ಪಂಚಾಯತ್) ಕಳುಹಿಸಲಾಗಿದೆ.",
    stage_worker: "ಕೆಲಸಗಾರ / ತಂಡ ನೇಮಕ",
    stage_worker_desc: "ದುರಸ್ತಿ ಮೇಲ್ವಿಚಾರಕ ಮತ್ತು ತಂಡವನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ.",
    stage_repair: "ದುರಸ್ತಿ ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    stage_repair_desc: "ಗುಂಡಿ ಮುಚ್ಚುವಿಕೆ ಮತ್ತು ಕಾಂಕ್ರೀಟ್/ಡಾಂಬರೀಕರಣ ನಡೆಯುತ್ತಿದೆ.",
    stage_review: "ರಸ್ತೆ ಸ್ಥಿತಿ ಪರಿಶೀಲನೆ",
    stage_review_desc: "ದುರಸ್ತಿಗೆ ಮುಂಚಿನ ಮತ್ತು ನಂತರದ ಚಿತ್ರಗಳ ವಿಶ್ಲೇಷಣೆ.",
    stage_approved: "ಅಂತಿಮ ಅನುಮೋದನೆ & ಇತ್ಯರ್ಥ",
    stage_approved_desc: "ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡು ಡಿಜಿಟಲ್ ಸಹಿಯೊಂದಿಗೆ ಪರಿಹರಿಸಲಾಗಿದೆ.",

    enter_tracking_id: "ಟ್ರ್ಯಾಕಿಂಗ್ ಐಡಿ ನಮೂದಿಸಿ (ಉದಾ. RG-2026-CC-8492)...",
    track_status_btn: "ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",
    before_repair: "ದುರಸ್ತಿಗೂ ಮುನ್ನ",
    after_repair: "ದುರಸ್ತಿಯ ನಂತರ",
    lead_worker: "ಸೈಟ್ ಮೇಲ್ವಿಚಾರಕ",
    work_crew: "ದುರಸ್ತಿ ತಂಡ",
    department: "ಜವಾಬ್ದಾರಿಯುತ ಇಲಾಖೆ",
    target_sla: "ಗುರಿ ಪರಿಹಾರ ಸಮಯ (SLA)",
    location: "ಸ್ಥಳ",
    severity: "ತೀವ್ರತೆ",
    priority: "ಆದ್ಯತೆ",
    road_type_label: "ರಸ್ತೆ ವರ್ಗೀಕರಣ",
    lodge_grievance: "ಅಧಿಕೃತ ದೂರು ದಾಖಲಿಸಿ",
    verified_by_ai: "AI ದೃಢೀಕರಿಸಿದ ಹಾನಿ",
    village_roads_title: "ಗ್ರಾಮ ಮತ್ತು ನಗರ ರಸ್ತೆ ಜಾಲ",
    roads_ready: "ರಸ್ತೆಗಳು ಸಿದ್ಧವಾಗಿವೆ",
    switch_locality: "🌐 ನಗರ / ಪಟ್ಟಣ / ಗ್ರಾಮ ಆಯ್ಕೆಮಾಡಿ:",
    type_any_locality: "ಯಾವುದೇ ನಗರ ಅಥವಾ ಗ್ರಾಮದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ...",
    filter_roads_placeholder: "ರಸ್ತೆಗಳ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ...",
    scan_btn: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    pill_all_roads: "ಎಲ್ಲಾ ರಸ್ತೆಗಳು",
    pill_cement_roads: "ಸಿಮೆಂಟ್ (CC) ರಸ್ತೆಗಳು",
    pill_village_streets: "ಗ್ರಾಮೀಣ ರಸ್ತೆಗಳು",
    pill_city_roads: "ನಗರ ರಸ್ತೆಗಳು",
    pill_main_roads: "ಮುಖ್ಯ ರಸ್ತೆಗಳು",
    pill_highways: "ಹೆದ್ದಾರಿಗಳು",
    badge_damaged_road: "🔴 ಹಾನಿಗೊಳಗಾದ ರಸ್ತೆ",
    badge_fair_road: "🟡 ಸಾಧಾರಣ ಸ್ಥಿತಿ",
    badge_good_road: "🟢 ಉತ್ತಮ ಸ್ಥಿತಿ",
    btn_inspect_detect: "🔍 ಪರಿಶೀಲನೆ & ಪತ್ತೆ",
    btn_raise_problem: "🚨 ದೂರನ್ನು ದಾಖಲಿಸಿ",
    btn_problem_raised_done: "✅ ದೂರು ದಾಖಲಾಗಿದೆ",
    floating_damaged_title: "🔴 ಈ ರಸ್ತೆ ಹಾನಿಗೊಳಗಾಗಿದೆ",
    floating_warning_title: "🟡 ಸಾಧಾರಣ ಸ್ಥಿತಿ · ಸಣ್ಣ ಹಾನಿ",
    floating_good_title: "🟢 ಈ ರಸ್ತೆ ಉತ್ತಮ ಸ್ಥಿತಿಯಲ್ಲಿದೆ",
    defect_score_lbl: "ದೋಷದ ಸ್ಕೋರ್",
    responsible_dept_lbl: "ಜವಾಬ್ದಾರಿಯುತ ಇಲಾಖೆ",
    road_hierarchy_lbl: "ರಸ್ತೆ ವರ್ಗ",
    pavement_surface_lbl: "ರಸ್ತೆಯ ಮೇಲ್ಮೈ",
    btn_satellite_recon: "🛰️ ಉಪಗ್ರಹ 1-ಗಂಟೆಯ ಪರಿಶೀಲನೆ",
    btn_satellite_hud: "🛰️ ಪೂರ್ಣ ಉಪಗ್ರಹ HUD",
    btn_fly_street: "📍 ರಸ್ತೆಗೆ ತೆರಳಿ (3D)",
    btn_all_roads_locality: "📋 ಈ ಪ್ರದೇಶದ ಎಲ್ಲಾ ರಸ್ತೆಗಳು",
    btn_live_cams: "📹 ಲೈವ್ ಕ್ಯಾಮೆರಾಗಳು",
    damage_desc_severe_potholes: "ತೀವ್ರ ಗುಂಡಿಗಳು ಪತ್ತೆಯಾಗಿವೆ · ತುರ್ತು ದುರಸ್ತಿ ಅಗತ್ಯವಿದೆ",
    damage_desc_warning_debris: "ಮೇಲ್ಮೈ ಸವೆತ ಮತ್ತು ತ್ಯಾಜ್ಯ · ದುರಸ್ತಿ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ",
    damage_desc_smooth_pavement: "ರಸ್ತೆ ಸುರಕ್ಷಿತವಾಗಿದೆ · ಯಾವುದೇ ದೋಷಗಳಿಲ್ಲ",
    badge_city_street: "ನಗರ ರಸ್ತೆ",
    badge_village_track: "ಗ್ರಾಮೀಣ ಮಾರ್ಗ",
    badge_secondary_main: "ಮುಖ್ಯ ರಸ್ತೆ",
    badge_highway_nh: "ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ",
  },

  ml: {
    portal_title: "റോഡ്ഗാർഡ് AI",
    portal_subtitle: "ദേശീയ റോഡ് അറ്റകുറ്റപ്പണി & പരാതി പരിഹാര സംവിധാനം",
    welcome: "സ്വാഗതം",
    sign_in_desc: "റോഡ് പരിപാലന പോർട്ടലിലേക്ക് പ്രവേശിക്കുക.",
    citizen_portal: "പൗര പോർട്ടൽ",
    officer_portal: "ഉദ്യോഗസ്ഥ ലോഗിൻ",
    email_or_mobile: "ഇമെയിൽ അല്ലെങ്കിൽ മൊബൈൽ നമ്പർ",
    password: "പാസ്‌വേഡ്",
    remember_me: "ഓർമ്മിക്കുക",
    forgot_password: "പാസ്‌വേഡ് മറന്നോ?",
    sign_in_btn: "ലോഗിൻ ചെയ്യുക",
    guest_btn: "തുടരുക (3D മാപ്പ്)",
    track_complaint: "പരാതി ട്രാക്ക് ചെയ്യുക",
    track_complaint_desc: "രജിസ്ട്രേഷൻ മുതൽ അന്തിമ അനുമതി വരെയുള്ള പുരോഗതി കാണുക.",
    report_damage: "റോഡ് തകരാർ റിപ്പോർട്ട് ചെയ്യുക",
    damage_map: "3D റോഡ് ശൃംഖല",
    select_language: "ഭാഷ തിരഞ്ഞെടുക്കുക (22 ഔദ്യോഗിക ഭാഷകൾ)",

    all_roads: "എല്ലാത്തരം റോഡുകളും",
    cement_roads: "സിമന്റ് റോഡുകൾ (CC റോഡുകൾ)",
    cement_roads_desc: "റെസിഡൻഷ്യൽ കോൺക്രീറ്റ് റോഡുകൾ",
    village_streets: "ഗ്രാമീണ പാതകൾ",
    village_streets_desc: "ഗ്രാമപഞ്ചായത്ത് റോഡുകളും ലിങ്ക് റോഡുകളും",
    city_roads: "നഗര റോഡുകൾ",
    city_roads_desc: "മുനിസിപ്പൽ കോർപ്പറേഷൻ വാർഡ് റോഡുകൾ",
    main_roads: "പ്രധാന റോഡുകൾ",
    main_roads_desc: "ജില്ലാ റോഡുകളും തിരക്കേറിയ പ്രധാന വഴികളും",
    highways: "ഹൈവേകൾ & എക്സ്പ്രസ് വേകൾ",
    highways_desc: "ദേശീയ-സംസ്ഥാന പാതകൾ (NHAI / PWD)",

    stage_registered: "പരാതി രജിസ്റ്റർ ചെയ്തു",
    stage_registered_desc: "ടോക്കൺ ഐഡിയോടെ പരാതി വിജയകരമായി രജിസ്റ്റർ ചെയ്തു.",
    stage_authority: "അധികാരിയെ ചുമതലപ്പെടുത്തി",
    stage_authority_desc: "അധികാരപരിധിയിലുള്ള ഡിപ്പാർട്ട്മെന്റിന് കൈമാറി.",
    stage_worker: "തൊഴിലാളികളെ നിയമിച്ചു",
    stage_worker_desc: "അറ്റകുറ്റപ്പണി സംഘത്തെ ചുമതലപ്പെടുത്തി.",
    stage_repair: "പണി പുരോഗമിക്കുന്നു",
    stage_repair_desc: "ടാറിങ്/കോൺക്രീറ്റിങ് പ്രവൃത്തികൾ നടക്കുന്നു.",
    stage_review: "റോഡ് നിലവാര പരിശോധന",
    stage_review_desc: "അറ്റകുറ്റപ്പണിക്ക് മുമ്പും ശേഷവുമുള്ള ചിത്രങ്ങളുടെ പരിശോധന.",
    stage_approved: "അന്തിമ അനുമതി & പൂർത്തിയായി",
    stage_approved_desc: "ഗുണനിലവാര പരിശോധന പൂർത്തിയായി പരിഹരിച്ചു.",

    enter_tracking_id: "ട്രാക്കിംഗ് ഐഡി നൽകുക...",
    track_status_btn: "സ്റ്റാറ്റസ് പരിശോധിക്കുക",
    before_repair: "അറ്റകുറ്റപ്പണിക്ക് മുമ്പ്",
    after_repair: "അറ്റകുറ്റപ്പണിക്ക് ശേഷം",
    lead_worker: "സൈറ്റ് സൂപ്പർവൈസർ",
    work_crew: "വർക്ക് ടീം",
    department: "ഉത്തരവാദപ്പെട്ട വകുപ്പ്",
    target_sla: "ലക്ഷ്യ സമയം (SLA)",
    location: "സ്ഥലം",
    severity: "തീവ്രത",
    priority: "മുൻഗണന",
    road_type_label: "റോഡ് തരം",
    lodge_grievance: "പരാതി രജിസ്റ്റർ ചെയ്യുക",
    verified_by_ai: "AI സ്ഥിരീകരിച്ച തകരാർ",
  },

  mr: {
    portal_title: "रोडगार्ड AI",
    portal_subtitle: "राष्ट्रीय स्मार्ट रस्ते व तक्रार निवारण प्रणाली",
    welcome: "पुन्हा स्वागत आहे",
    sign_in_desc: "रस्ता दुरुस्ती आणि तक्रार निवारण पोर्टलवर लॉग इन करा.",
    citizen_portal: "नागरी पोर्टल",
    officer_portal: "अधिकारी / कंत्रಾटदार लॉगिन",
    email_or_mobile: "ईमेल किंवा १० अंकी मोबाइल",
    password: "पासवर्ड",
    remember_me: "लक्षात ठेवा",
    forgot_password: "पासवर्ड विसरलात?",
    sign_in_btn: "साइन इन करा",
    guest_btn: "अतिथी म्हणून सुरू ठेवा (3D नकाशा)",
    track_complaint: "रस्ता तक्रार ट्रॅक करा",
    track_complaint_desc: "नोंदणीपासून अंतिम मंजुरीपर्यंत दुरुस्तीची प्रगती पहा.",
    report_damage: "रस्ता खड्ड्यांची तक्रार करा",
    damage_map: "3D रस्ता नेटवर्क",
    select_language: "भाषा निवडा (२२ अधिकृत भारतीय भाषा)",

    all_roads: "सर्व प्रकारचे रस्ते",
    cement_roads: "सिमेंट रस्ते (CC रस्ते)",
    cement_roads_desc: "निवासी वसाहतींमधील काँक्रीट रस्ते",
    village_streets: "ग्रामीण आणि स्थानिक रस्ते",
    village_streets_desc: "ग्रामपंचायत रस्ते आणि ग्रामीण जोड रस्ते",
    city_roads: "शहरी रस्ते",
    city_roads_desc: "महानगरपालिका प्रभाग रस्ते",
    main_roads: "मुख्य रस्ते",
    main_roads_desc: "प्रमुख जिल्हा रस्ते",
    highways: "महामार्ग व द्रुतगती मार्ग",
    highways_desc: "NHAI व सार्वजनिक बांधकाम विभागाचे महामार्ग",

    stage_registered: "तक्रार नोंदवली गेली",
    stage_registered_desc: "टोकन आयडीसह तक्रार यशस्वीरित्या नोंदवली गेली.",
    stage_authority: "प्राधिकरणाकडे सोपवले",
    stage_authority_desc: "संबंधित विभागाकडे (मनपा/पीडब्ल्यूडी) वर्ग करण्यात आले.",
    stage_worker: "कर्मचारी नियुक्त",
    stage_worker_desc: "दुरुस्ती पर्यवेक्षक आणि कामाची टीम नियुक्त केली गेली.",
    stage_repair: "दुरुस्तीचे काम सुरू",
    stage_repair_desc: "खड्डे भरणे आणि काँक्रीटीकरणाचे काम सुरू आहे.",
    stage_review: "रस्ता स्थिती पुनरावलोकन",
    stage_review_desc: "दुरुस्तीपूर्वी आणि नंतरच्या छायाचित्रांची पडताळणी.",
    stage_approved: "अंतिम मंजुरी व निवारण",
    stage_approved_desc: "गुणवत्ता तपासणी पूर्ण होऊन डिजिटल स्वाक्षरीने तक्रार सोडवली गेली.",

    enter_tracking_id: "ट्रॅकिंग आयडी प्रविष्ट करा...",
    track_status_btn: "स्थिती तपासा",
    before_repair: "दुरुस्तीपूर्वी",
    after_repair: "दुरुस्तीनंतर",
    lead_worker: "साइट सुपरवायझर",
    work_crew: "दुरुस्ती पथक",
    department: "जबाबदार विभाग",
    target_sla: "निवारण मुदत (SLA)",
    location: "स्थान",
    severity: "तीव्रता",
    priority: "प्राधान्य",
    road_type_label: "रस्त्याचा प्रकार",
    lodge_grievance: "अधिकृत तक्रार नोंदवा",
    verified_by_ai: "AI द्वारे सत्यापित खड्डा",
  },

  bn: {
    portal_title: "রোডগার্ড AI",
    portal_subtitle: "জাতীয় স্মার্ট রাস্তা ও অভিযোগ নিষ্পত্তি ব্যবস্থা",
    welcome: "স্বাগতম",
    sign_in_desc: "রাস্তা মেরামত ও অভিযোগ পোর্টালে সাইন ইন করুন।",
    citizen_portal: "নাগরিক পোর্টাল",
    officer_portal: "কর্মকর্তা / ঠিকাদার লগইন",
    email_or_mobile: "ইমেইল বা ১০ অঙ্কের মোবাইল",
    password: "পাসওয়ার্ড",
    remember_me: "মনে রাখুন",
    forgot_password: "পাসওয়ার্ড ভুলে গেছেন?",
    sign_in_btn: "সাইন ইন করুন",
    guest_btn: "অতিথি হিসেবে চালিয়ে যান (3D মানচিত্র)",
    track_complaint: "রাস্তার অভিযোগ ট্র্যাক করুন",
    track_complaint_desc: "নিবন্ধন থেকে চূড়ান্ত অনুমোদন পর্যন্ত মেরামতের অগ্রগতি দেখুন।",
    report_damage: "রাস্তার ক্ষয়ক্ষতি রিপোর্ট করুন",
    damage_map: "3D রোড নেটওয়ার্ক",
    select_language: "ভাষা নির্বাচন করুন (২২টি ভারতীয় ভাষা)",

    all_roads: "সব ধরনের রাস্তা",
    cement_roads: "সিমেন্ট রাস্তা (CC রাস্তা)",
    cement_roads_desc: "আবাসিক এলাকার কংক্রিট সিমেন্ট রাস্তা",
    village_streets: "গ্রামীণ ও স্থানীয় রাস্তা",
    village_streets_desc: "গ্রাম পঞ্চায়েত ও সংযোগ সড়ক",
    city_roads: "শহরের রাস্তা",
    city_roads_desc: "পৌরসভা ওয়ার্ড রোড ও বাণিজ্যিক পথ",
    main_roads: "প্রধান রাস্তা",
    main_roads_desc: "গুরুত্বপূর্ণ জেলা সড়ক",
    highways: "মহাসড়ক ও এক্সপ্রেসওয়ে",
    highways_desc: "জাতীয় ও রাজ্য মহাসড়ক (NHAI / PWD)",

    stage_registered: "অভিযোগ নিবন্ধিত হয়েছে",
    stage_registered_desc: "টোকেন আইডি সহ অভিযোগ সফলভাবে দায়ের করা হয়েছে।",
    stage_authority: "কর্তৃপক্ষ নির্ধারিত",
    stage_authority_desc: "সংশ্লিষ্ট বিভাগে পাঠানো হয়েছে।",
    stage_worker: "কর্মী দল নিযুক্ত",
    stage_worker_desc: "মেরামত তদারককারী ও কর্মী দল নিয়োজিত।",
    stage_repair: "মেরামত চলছে",
    stage_repair_desc: "গর্ত ভরাট ও পাকা করার কাজ চলমান।",
    stage_review: "রাস্তার অবস্থা পর্যালোচনা",
    stage_review_desc: "মেরামতের আগের ও পরের ছবির যাচাইকরণ।",
    stage_approved: "চূড়ান্ত অনুমোদন ও নিষ্পত্তি",
    stage_approved_desc: "গুণমান পরীক্ষা উত্তীর্ণ এবং নিষ্পত্তি হয়েছে।",

    enter_tracking_id: "ট্র্যাকিং আইডি লিখুন...",
    track_status_btn: "অবস্থা ট্র্যাক করুন",
    before_repair: "মেরামতের পূর্বে",
    after_repair: "মেরামতের পরে",
    lead_worker: "সাইট সুপারভাইজার",
    work_crew: "মেরামত দল",
    department: "দায়িত্বপ্রাপ্ত কর্তৃপক্ষ",
    target_sla: "সমাধানের সময়সীমা (SLA)",
    location: "অবস্থান",
    severity: "তীব্রতা",
    priority: "অগ্রাধিকার",
    road_type_label: "রাস্তার ধরন",
    lodge_grievance: "অভিযোগ দায়ের করুন",
    verified_by_ai: "AI দ্বারা যাচাইকৃত ক্ষয়ক্ষতি",
  },

  gu: {
    portal_title: "રોડગાર્ડ AI",
    portal_subtitle: "રાષ્ટ્રીય સ્માર્ટ રોડ અને ફરિયાદ નિવારણ પ્રણાલી",
    welcome: "સ્વાગત છે",
    sign_in_desc: "રોડ જાળવણી અને ફરિયાદ પોર્ટલમાં લોગિન કરો.",
    citizen_portal: "નાગરિક પોર્ટલ",
    officer_portal: "અધિકારી / કોન્ટ્રાક્ટર લોગિન",
    email_or_mobile: "ઇમેઇલ અથવા મોબાઇલ નંબર",
    password: "પાસવર્ડ",
    remember_me: "યાદ રાખો",
    forgot_password: "પાસવર્ડ ભૂલી ગયા?",
    sign_in_btn: "સાઇન ઇન કરો",
    guest_btn: "ગેસ્ટ તરીકે ચાલુ રાખો (3D નકશો)",
    track_complaint: "ફરિયાદ ટ્રેક કરો",
    track_complaint_desc: "નોંધણીથી લઈને અંતિમ મંજૂરી સુધી રીઅલ-ટાઇમ પ્રગતિ જુઓ.",
    report_damage: "રસ્તાના ખાડાની ફરિયાદ કરો",
    damage_map: "3D રોડ નેટવર્ક",
    select_language: "ભાષા પસંદ કરો (22 અધિકૃત ભાષાઓ)",

    all_roads: "તમામ પ્રકારના રસ્તાઓ",
    cement_roads: "સિમેન્ટ રોડ (CC રોડ)",
    cement_roads_desc: "રહેણાંક સોસાયટીઓના કોંક્રિટ રોડ",
    village_streets: "ગ્રામીણ અને સ્થાનિક રસ્તા",
    village_streets_desc: "ગ્રામ પંચાયતના રસ્તા અને ગ્રામ્ય માર્ગો",
    city_roads: "શહેરી રસ્તા",
    city_roads_desc: "મ્યુનિસિપલ કોર્પોરેશન વોર્ડ રોડ",
    main_roads: "મુખ્ય રસ્તા",
    main_roads_desc: "મુખ્ય જિલ્લા માર્ગો",
    highways: "હાઇવે અને એક્સપ્રેસવે",
    highways_desc: "રાષ્ટ્રીય અને રાજ્ય ધોરીમાર્ગો (NHAI / PWD)",

    stage_registered: "ફરિયાદ નોંધાઈ ગઈ",
    stage_registered_desc: "ટોકન આઈડી સાથે ફરિયાદ સફળતાપૂર્વક નોંધવામાં આવી છે.",
    stage_authority: "સંબંધિત સત્તામંડળ સોંપાયું",
    stage_authority_desc: "વિભાગને (મનપા / પીડબલ્યુડી / પંચાયત) મોકલવામાં આવ્યું.",
    stage_worker: "કર્મચારી અને ટીમ નિયુક્ત",
    stage_worker_desc: "સાઇટ સુપરવાઇઝર અને ટીમ ફાળવવામાં આવી.",
    stage_repair: "સમારકામ ચાલુ છે",
    stage_repair_desc: "ખાડા પૂરવાનું અને ડામર/કોંક્રિટ કામ ચાલુ છે.",
    stage_review: "રસ્તાની સ્થિતિની સમીક્ષા",
    stage_review_desc: "સમારકામ પહેલાં અને પછીના ફોટાની ચકાસણી.",
    stage_approved: "અંતિમ મંજૂરી અને નિકાલ",
    stage_approved_desc: "ગુણવત્તા ચકાસણી પૂર્ણ અને ફરિયાદનો નિકાલ થયો.",

    enter_tracking_id: "ટ્રેકિંગ આઈડી દાખલ કરો...",
    track_status_btn: "સ્થિતિ ટ્રેક કરો",
    before_repair: "સમારકામ પહેલાં",
    after_repair: "સમારકામ પછી",
    lead_worker: "સાઇટ સુપરવાઇઝર",
    work_crew: "સમારકામ ટીમ",
    department: "જવાબદાર વિભાગ",
    target_sla: "નિવારણ સમય (SLA)",
    location: "સ્થળ",
    severity: "ગંભીરતા",
    priority: "પ્રાથમિકતા",
    road_type_label: "રસ્તાનો પ્રકાર",
    lodge_grievance: "સત્તાવાર ફરિયાદ નોંધાવો",
    verified_by_ai: "AI ચકાસાયેલ ખાડો",
  },

  pa: {
    portal_title: "ਰੋਡਗਾਰਡ AI",
    portal_subtitle: "ਰਾਸ਼ਟਰੀ ਸਮਾਰਟ ਸੜਕ ਅਤੇ ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਣ ਪ੍ਰਣਾਲੀ",
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
    sign_in_desc: "ਸੜਕ ਰੱਖ-ਰਖਾਅ ਪੋਰਟਲ ਵਿੱਚ ਲੌਗਇਨ ਕਰੋ।",
    citizen_portal: "ਨਾਗਰਿਕ ਪੋਰਟਲ",
    officer_portal: "ਅਧਿਕਾਰੀ / ਠੇਕੇਦਾਰ ਲੌਗਇਨ",
    email_or_mobile: "ਈਮੇਲ ਜਾਂ ਮੋਬਾਈਲ ਨੰਬਰ",
    password: "ਪਾਸਵਰਡ",
    remember_me: "ਯਾਦ ਰੱਖੋ",
    forgot_password: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
    sign_in_btn: "ਸਾਈਨ ਇਨ ਕਰੋ",
    guest_btn: "ਮਹਿਮਾਨ ਵਜੋਂ ਜਾਰੀ ਰੱਖੋ (3D ਨਕਸ਼ਾ)",
    track_complaint: "ਸ਼ਿਕਾਇਤ ਟ੍ਰੈਕ ਕਰੋ",
    track_complaint_desc: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਤੋਂ ਲੈ ਕੇ ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ ਤੱਕ ਸੜਕ ਮੁਰੰਮਤ ਦੀ ਪ੍ਰਗਤੀ ਵੇਖੋ।",
    report_damage: "ਸੜਕ ਦੇ ਟੋਏ ਦੀ ਰਿਪੋਰਟ ਕਰੋ",
    damage_map: "3D ਸੜਕ ਨੈੱਟਵਰਕ",
    select_language: "ਭਾਸ਼ਾ ਚੁਣੋ (22 ਅਧਿਕਾਰਤ ਭਾਸ਼ਾਵਾਂ)",

    all_roads: "ਸਾਰੀਆਂ ਕਿਸਮਾਂ ਦੀਆਂ ਸੜਕਾਂ",
    cement_roads: "ਸੀਮਿੰਟ ਸੜਕਾਂ (CC ਰੋਡ)",
    cement_roads_desc: "ਰਿਹਾਇਸ਼ੀ ਖੇਤਰਾਂ ਦੀਆਂ ਕੰਕਰੀਟ ਸੀਮਿੰਟ ਸੜਕਾਂ",
    village_streets: "ਪੇਂਡੂ ਅਤੇ ਸਥਾਨਕ ਗਲੀਆਂ",
    village_streets_desc: "ਗ੍ਰਾਮ ਪੰਚਾਇਤ ਸੜਕਾਂ ਅਤੇ ਪੇਂਡੂ ਲਿੰਕ ਰੋਡ",
    city_roads: "ਸ਼ਹਿਰੀ ਸੜਕਾਂ",
    city_roads_desc: "ਨਗਰ ਨਿਗਮ ਵਾਰਡ ਸੜਕਾਂ",
    main_roads: "ਮੁੱਖ ਸੜਕਾਂ",
    main_roads_desc: "ਜ਼ਿਲ੍ਹਾ ਮੁੱਖ ਸੜਕਾਂ",
    highways: "ਹਾਈਵੇਅ ਅਤੇ ਐਕਸਪ੍ਰੈਸਵੇਅ",
    highways_desc: "ਰਾਸ਼ਟਰੀ ਅਤੇ ਰਾਜ ਮਾਰਗ (NHAI / PWD)",

    stage_registered: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਹੋਈ",
    stage_registered_desc: "ਟੋਕਨ ਆਈਡੀ ਨਾਲ ਸ਼ਿਕਾਇਤ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਹੋਈ।",
    stage_authority: "ਅਧਿਕਾਰੀ ਨੂੰ ਸੌਂਪਿਆ ਗਿਆ",
    stage_authority_desc: "ਸੰਬੰਧਿਤ ਵਿਭਾਗ (ਨਿਗਮ / ਪੀਡਬਲਯੂਡੀ) ਨੂੰ ਭੇਜਿਆ ਗਿਆ।",
    stage_worker: "ਟੀਮ ਨਿਯੁਕਤ ਕੀਤੀ ਗਈ",
    stage_worker_desc: "ਮੁਰੰਮਤ ਸੁਪਰਵਾਈਜ਼ਰ ਅਤੇ ਟੀਮ ਨਿਯੁਕਤ।",
    stage_repair: "ਮੁਰੰਮਤ ਜਾਰੀ ਹੈ",
    stage_repair_desc: "ਟੋਇਆਂ ਦੀ ਭਰਾਈ ਅਤੇ ਕੰਕਰੀਟ ਦਾ ਕੰਮ ਜਾਰੀ ਹੈ।",
    stage_review: "ਸੜਕ ਦੀ ਸਥਿਤੀ ਦੀ ਸਮੀਖਿਆ",
    stage_review_desc: "ਮੁਰੰਮਤ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦੀਆਂ ਤਸਵੀਰਾਂ ਦੀ ਪੁਸ਼ਟੀ।",
    stage_approved: "ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ ਅਤੇ ਹੱਲ",
    stage_approved_desc: "ਕੁਆਲਿਟੀ ਆਡਿਟ ਪੂਰਾ ਹੋ ਗਿਆ ਅਤੇ ਸ਼ਿਕਾਇਤ ਹੱਲ ਹੋ ਗਈ।",

    enter_tracking_id: "ਟ੍ਰੈਕਿੰਗ ਆਈਡੀ ਦਰਜ ਕਰੋ...",
    track_status_btn: "ਸਥਿਤੀ ਟ੍ਰੈਕ ਕਰੋ",
    before_repair: "ਮੁਰੰਮਤ ਤੋਂ ਪਹਿਲਾਂ",
    after_repair: "ਮੁਰੰਮਤ ਤੋਂ ਬਾਅਦ",
    lead_worker: "ਸਾਈਟ ਸੁਪਰਵਾਈਜ਼ਰ",
    work_crew: "ਮੁਰੰਮਤ ਟੀਮ",
    department: "ਜ਼ਿੰਮੇਵਾਰ ਵਿਭਾਗ",
    target_sla: "ਹੱਲ ਦਾ ਸਮਾਂ (SLA)",
    location: "ਸਥਾਨ",
    severity: "ਗੰਭੀਰਤਾ",
    priority: "ਤਰਜੀਹ",
    road_type_label: "ਸੜਕ ਦੀ ਸ਼੍ਰੇਣੀ",
    lodge_grievance: "ਸਰਕਾਰੀ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ",
    verified_by_ai: "AI ਦੁਆਰਾ ਤਸਦੀਕਸ਼ੁਦਾ ਟੋਆ",
  },

  or: {
    portal_title: "ରୋଡଗାର୍ଡ AI",
    portal_subtitle: "ଜାତୀୟ ସ୍ମାର୍ଟ ରାସ୍ତା ଓ ଅଭିଯୋଗ ନିବାରଣ ବ୍ୟବସ୍ଥା",
    welcome: "ସ୍ୱାଗତମ୍",
    sign_in_desc: "ରାସ୍ତା ରକ୍ଷଣାବେକ୍ଷଣ ପୋର୍ଟାଲରେ ଲଗ୍ଇନ୍ କରନ୍ତୁ।",
    citizen_portal: "ନାଗରିକ ପୋର୍ଟାଲ",
    officer_portal: "ଅଧିକାରୀ / ଠିକାଦାର ଲଗ୍ଇନ୍",
    email_or_mobile: "ଇମେଲ୍ କିମ୍ବା ମୋବାଇଲ୍",
    password: "ପାସୱାର୍ଡ",
    remember_me: "ମନେରଖନ୍ତୁ",
    forgot_password: "ପାସୱାର୍ଡ ଭୁଲିଗଲେ କି?",
    sign_in_btn: "ସାଇନ୍ ଇନ୍ କରନ୍ତୁ",
    guest_btn: "ଅତିଥି ଭାବେ ଜାରି ରଖନ୍ତୁ (3D ମାନଚିତ୍ର)",
    track_complaint: "ରାସ୍ତା ଅଭିଯୋଗ ଟ୍ରାକ୍ କରନ୍ତୁ",
    track_complaint_desc: "ପଞ୍ଜୀକରଣରୁ ଚୂଡ଼ାନ୍ତ ଅନୁମୋଦନ ପର୍ଯ୍ୟନ୍ତ ମରାମତିର ସ୍ଥିତି ଦେଖନ୍ତୁ।",
    report_damage: "ଖାଲଖମାର ଅଭିଯୋଗ କରନ୍ତୁ",
    damage_map: "3D ରାସ୍ତା ନେଟୱାର୍କ",
    select_language: "ଭାଷା ଚୟନ କରନ୍ତୁ (୨୨ଟି ଭାରତୀୟ ଭାଷା)",

    all_roads: "ସମସ୍ତ ପ୍ରକାର ରାସ୍ତା",
    cement_roads: "ସିମେଣ୍ଟ ରାସ୍ତା (CC ରାସ୍ତା)",
    cement_roads_desc: "ଆବାସିକ ଅଞ୍ଚଳର କଂକ୍ରିଟ୍ ସିମେଣ୍ଟ ରାସ୍ତା",
    village_streets: "ଗ୍ରାମୀଣ ଏବଂ ସ୍ଥାନୀୟ ରାସ୍ତା",
    village_streets_desc: "ଗ୍ରାମ ପଞ୍ଚାୟତ ଓ ଗ୍ରାମୀଣ ସଂଯୋଗ ରାସ୍ତା",
    city_roads: "ସହର ରାସ୍ତା",
    city_roads_desc: "ପୌରପାଳିକା ୱାର୍ଡ ରାସ୍ତା",
    main_roads: "ମୁଖ୍ୟ ରାସ୍ତା",
    main_roads_desc: "ଜିଲ୍ଲା ମୁଖ୍ୟ ରାସ୍ତା",
    highways: "ରାଜପଥ ଓ ଏକ୍ସପ୍ରେସୱେ",
    highways_desc: "ଜାତୀୟ ଓ ରାଜ୍ୟ ରାଜପଥ (NHAI / PWD)",

    stage_registered: "ଅଭିଯୋଗ ପଞ୍ଜୀକୃତ ହେଲା",
    stage_registered_desc: "ଟୋକନ୍ ଆଇଡି ସହ ଅଭିଯୋଗ ସଫଳତାର ସହ ପଞ୍ଜୀକୃତ ହୋଇଛି।",
    stage_authority: "କର୍ତ୍ତୃପକ୍ଷ ନିର୍ଦ୍ଧାରିତ",
    stage_authority_desc: "ସମ୍ପୃକ୍ତ ବିଭାଗକୁ ପଠାଯାଇଛି।",
    stage_worker: "କର୍ମଚାରୀ ଦଳ ନିଯୁକ୍ତ",
    stage_worker_desc: "ମରାମତି ସୁପରଭାଇଜର ଓ ଟିମ୍ ନିଯୁକ୍ତ ହୋଇଛନ୍ତି।",
    stage_repair: "ମରାମତି କାର୍ଯ୍ୟ ଜାରି",
    stage_repair_desc: "ଖାଲ ପୂରଣ ଏବଂ କଂକ୍ରିଟ୍ କାର୍ଯ୍ୟ ଚାଲୁଅଛି।",
    stage_review: "ରାସ୍ତା ସ୍ଥିତି ସମୀକ୍ଷା",
    stage_review_desc: "ମରାମତି ପୂର୍ବ ଓ ପର ଫଟୋର ଯାଞ୍ଚ।",
    stage_approved: "ଚୂଡ଼ାନ୍ତ ଅନୁମୋଦନ ଓ ସମାଧାନ",
    stage_approved_desc: "ଗୁଣବତ୍ତା ଯାଞ୍ଚ ପୂର୍ଣ୍ଣ ହୋଇ ଅଭିଯୋଗର ସମାଧାନ ହୋଇଛି।",

    enter_tracking_id: "ଟ୍ରାକିଂ ଆଇଡି ଦିଅନ୍ତୁ...",
    track_status_btn: "ସ୍ଥିତି ଟ୍ରାକ୍ କରନ୍ତୁ",
    before_repair: "ମରାମତି ପୂର୍ବରୁ",
    after_repair: "ମରାମତି ପରେ",
    lead_worker: "ସାଇଟ୍ ସୁପରଭାଇଜର",
    work_crew: "ମରାମତି ଟିମ୍",
    department: "ଦାୟିତ୍ୱବାନ ବିଭାଗ",
    target_sla: "ସମାଧାନ ସମୟ (SLA)",
    location: "ସ୍ଥାନ",
    severity: "ଗୁରୁତରତା",
    priority: "ପ୍ରାଥମିକତା",
    road_type_label: "ରାସ୍ତା ବର୍ଗୀକରଣ",
    lodge_grievance: "ସରକାରୀ ଅଭିଯୋଗ ଦାୟର କରନ୍ତୁ",
    verified_by_ai: "AI ଯାଞ୍ଚ ହୋଇଥିବା ତ୍ରୁଟି",
  },

  ur: {
    portal_title: "روڈ گارڈ AI",
    portal_subtitle: "قومی سمارٹ سڑک اور شکایات کے ازالے کا نظام",
    welcome: "خوش آمدید",
    sign_in_desc: "سڑک کی دیکھ بھال اور شکایت پورٹل میں لاگ ان کریں۔",
    citizen_portal: "شہری پورٹل",
    officer_portal: "افسر / ٹھیکیدار لاگ ان",
    email_or_mobile: "ای میل یا 10 ہندسوں کا موبائل",
    password: "پاس ورڈ",
    remember_me: "یاد رکھیں",
    forgot_password: "پاس ورڈ بھول گئے؟",
    sign_in_btn: "سائن ان کریں",
    guest_btn: "بطور مہمان جاری رکھیں (3D نقشہ)",
    track_complaint: "شکایت ٹریک کریں",
    track_complaint_desc: "اندراج سے حتمی منظوری تک سڑک کی مرمت کی لائیو پیش رفت دیکھیں۔",
    report_damage: "سڑک کے گڑھے کی اطلاع دیں",
    damage_map: "3D سڑکوں کا نیٹ ورک",
    select_language: "زبان منتخب کریں (22 سرکاری زبانیں)",

    all_roads: "تمام اقسام کی سڑکیں",
    cement_roads: "سیمنٹ کی سڑکیں (CC روڈ)",
    cement_roads_desc: "رہائشی کالونیوں کی کنکریٹ سڑکیں",
    village_streets: "دیہی اور مقامی گلیاں",
    village_streets_desc: "گرام پنچایت اور دیہی رابطے کی سڑکیں",
    city_roads: "شہری سڑکیں",
    city_roads_desc: "میونسپل کارپوریشن وارڈ روڈز",
    main_roads: "اہم شاہراہیں",
    main_roads_desc: "ضلعی اہم سڑکیں",
    highways: "ہائی ویز اور ایکسپریس ویز",
    highways_desc: "قومی اور ریاستی شاہراہیں (NHAI / PWD)",

    stage_registered: "شکایت درج ہو گئی",
    stage_registered_desc: "ٹوکن آئی ڈی کے ساتھ شکایت کامیابی سے درج ہوئی۔",
    stage_authority: "متعلقہ محکمہ کو تفویض",
    stage_authority_desc: "متعلقہ شعبے کو بھیج دیا گیا۔",
    stage_worker: "ورکر / ٹیم تعینات",
    stage_worker_desc: "مرمت سپروائزر اور ٹیم تعینات کر دی گئی۔",
    stage_repair: "مرمت جاری ہے",
    stage_repair_desc: "گڑھے بھرنے اور کنکریٹ ڈالنے کا کام جاری ہے۔",
    stage_review: "سڑک کی حالت کا جائزہ",
    stage_review_desc: "مرمت سے پہلے اور بعد کی تصاویر کی تصدیق۔",
    stage_approved: "حتمی منظوری اور حل",
    stage_approved_desc: "کوالٹی آڈٹ پاس اور شکایت حل ہو گئی۔",

    enter_tracking_id: "ٹریکنگ آئی ڈی درج کریں...",
    track_status_btn: "اسٹیٹس ٹریک کریں",
    before_repair: "مرمت سے پہلے",
    after_repair: "مرمت کے بعد",
    lead_worker: "سائٹ سپروائزر",
    work_crew: "ورک ٹیم",
    department: "ذمہ دار محکمہ",
    target_sla: "حل کا ہدف (SLA)",
    location: "مقام",
    severity: "شدت",
    priority: "ترجیح",
    road_type_label: "سڑک کی قسم",
    lodge_grievance: "سرکاری شکایت درج کریں",
    verified_by_ai: "AI تصدیق شدہ گڑھا",
  },
};

/**
 * Returns available languages list
 */
export function getAvailableLanguages() {
  return INDIAN_LANGUAGES;
}

/**
 * Get current active language code from localStorage or default 'en'
 */
export function getActiveLanguage() {
  if (typeof window === 'undefined') return 'en';
  try {
    return localStorage.getItem('rg_language') || 'en';
  } catch {
    return 'en';
  }
}

/**
 * Sets active language, saves to localStorage, and updates DOM elements with data-i18n
 */
export function setLanguage(langCode) {
  if (typeof window === 'undefined') return;
  const targetCode = TRANSLATIONS[langCode] ? langCode : 'en';
  try {
    localStorage.setItem('rg_language', targetCode);
  } catch (e) {}

  document.documentElement.setAttribute('lang', targetCode);
  applyTranslations(targetCode);

  // Dispatch custom event for reactive components
  window.dispatchEvent(new CustomEvent('rg_language_changed', { detail: { lang: targetCode } }));
}

/**
 * Translates a key for a given language code (or active language)
 */
export function t(key, langCode = null) {
  const code = langCode || getActiveLanguage();
  const dict = TRANSLATIONS[code] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || key;
}

/**
 * Updates all DOM elements with [data-i18n]
 */
export function applyTranslations(langCode = null) {
  if (typeof document === 'undefined') return;
  const code = langCode || getActiveLanguage();
  const dict = TRANSLATIONS[code] || TRANSLATIONS.en;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    } else if (TRANSLATIONS.en[key]) {
      el.textContent = TRANSLATIONS.en[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    } else if (TRANSLATIONS.en[key]) {
      el.setAttribute('placeholder', TRANSLATIONS.en[key]);
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (dict[key]) {
      el.setAttribute('title', dict[key]);
    } else if (TRANSLATIONS.en[key]) {
      el.setAttribute('title', TRANSLATIONS.en[key]);
    }
  });
}

/**
 * Speech Synthesis Language Mapping (BCP 47 tags for Indian Languages)
 */
export const SPEECH_LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  ur: 'ur-IN',
  as: 'as-IN',
  sa: 'sa-IN',
  ne: 'ne-NP',
  kok: 'kok-IN',
  mai: 'mai-IN',
  mni: 'mni-IN',
  brx: 'brx-IN',
  doi: 'doi-IN',
  ks: 'ks-IN',
  sd: 'sd-IN',
  sat: 'sat-IN',
};

/**
 * Curated bilingual road names for authentic local voice & text rendering
 */

/**
 * Curated bilingual road names for authentic local voice & text rendering
 */
export const LOCALIZED_ROAD_NAMES = {
  te: {
    'ward 14': 'వార్డ్ 14 గాంధీ నగర్ 2వ క్రాస్ సిమెంట్ రోడ్డు',
    'gandhinagar': 'వార్డ్ 14 గాంధీ నగర్ 2వ క్రాస్ సిమెంట్ రోడ్డు',
    'housing board': 'హౌసింగ్ బోర్డు కాలనీ నివాసిత సిమెంట్ వీధి',
    'sita ram nagar': 'సీతారామనగర్ 3వ లైన్ కాంక్రీట్ రోడ్డు',
    'sitaramnagar': 'సీతారామనగర్ 3వ లైన్ కాంక్రీట్ రోడ్డు',
    'gollapalli': 'గొల్లపల్లి గ్రామ పంచాయతీ వీధి',
    'kothapet': 'కొత్తపేట గ్రామ పంచాయతీ లింక్ రోడ్డు',
    'pedda cheruvu': 'పెద్ద చెరువు గ్రామీణ సరస్సు గట్టు రోడ్డు',
    'gandhi bazaar': 'గాంధీ బజార్ ప్రధాన వాణిజ్య రోడ్డు',
    'bazaar': 'గాంధీ బజార్ ప్రధాన వాణిజ్య రోడ్డు',
    'sub-registrar': 'సబ్-రిజిస్ట్రార్ కార్యాలయ నగర వార్డు రోడ్డు',
    'subregistrar': 'సబ్-రిజిస్ట్రార్ కార్యాలయ నగర వార్డు రోడ్డు',
    'american hospital': 'అమెరికన్ హాస్పిటల్ మున్సిపల్ వార్డు రోడ్డు',
    'american': 'అమెరికన్ హాస్పిటల్ మున్సిపల్ వార్డు రోడ్డు',
    'market yard': 'వ్యవసాయ మార్కెట్ యార్డ్ కమర్షియల్ యాక్సిస్',
    'marketyard': 'వ్యవసాయ మార్కెట్ యార్డ్ కమర్షియల్ యాక్సిస్',
    'clock tower': 'పాత బస్టాండ్ & క్లాక్ టవర్ జంక్షన్ రోడ్డు',
    'clocktower': 'పాత బస్టాండ్ & క్లాక్ టవర్ జంక్షన్ రోడ్డు',
    'hanuman junction': 'నూజివీడు - హనుమాన్ జంక్షన్ ప్రధాన రహదారి',
    'hanuman': 'నూజివీడు - హనుమాన్ జంక్షన్ ప్రధాన రహదారి',
    'ramanakkapeta': 'రమణక్కపేట జిల్లా ప్రధాన కారిడార్',
    'mylavaram': 'మైలవరం - నూజివీడు రాష్ట్ర రహదారి (SH 32)',
    'sh 32': 'మైలవరం - నూజివీడు రాష్ట్ర రహదారి (SH 32)',
    'vissannapeta': 'నూజివీడు - విస్సన్నపేట రాష్ట్ర రహదారి (SH 42)',
    'sh 42': 'నూజివీడు - విస్సన్నపేట రాష్ట్ర రహదారి (SH 42)',
    'nuzvid bypass': 'నూజివీడు బైపాస్ జాతీయ రహదారి లింక్',
    'bypass': 'నూజివీడు బైపాస్ జాతీయ రహదారి లింక్',
    'nh-16': 'NH-16 చెన్నై - కోల్‌కతా జాతీయ రహదారి',
    'nh 16': 'NH-16 చెన్నై - కోల్‌కతా జాతీయ రహదారి',
    'mg road': 'మహాత్మా గాంధీ రోడ్డు (బందరు రోడ్డు)',
    'bandar road': 'బందరు రోడ్డు వాణిజ్య కారిడార్, విజయవాడ',
    'eluru road': 'ఏలూరు రోడ్డు & పాత బస్టాండ్ మార్గం',
    'brts': 'BRTS ప్రధాన రవాణా కారిడార్',
    'besant': 'బెసెంట్ రోడ్డు వాణిజ్య వీధి',
    'prakasam': 'ప్రకాశం బ్యారేజ్ & కృష్ణా నది వంతెన రహదారి',
    'benz circle': 'బెంజ్ సర్కిల్ ఫ్లైఓవర్ కారిడార్',
    'collectorate': 'కలెక్టరేట్ కార్యాలయ రహదారి',
    'arundelpet': 'అరుండల్‌పేట ప్రధాన వాణిజ్య రోడ్డు, గుంటూరు',
    'brodipet': 'బ్రోడీపేట 4వ లైన్ నివాసిత రహదారి, గుంటూరు',
    'vijayawada - guntur': 'విజయవాడ - గుంటూరు 6-లేన్ ఎక్స్‌ప్రెస్‌వే',
    'guntur - vijayawada': 'గుంటూరు - విజయవాడ 6-లేన్ ఎక్స్‌ప్రెస్‌వే',
    'tirupati alipiri': 'తిరుపతి అలిపిరి బైపాస్ సిమెంట్ రోడ్డు',
    'alipiri': 'తిరుపతి అలిపిరి బైపాస్ సిమెంట్ రోడ్డు',
    'kondapalli': 'కొండపల్లి కోట ఘాట్ గ్రామీణ రహదారి',
    'jubilee hills': 'జూబ్లీహిల్స్ రోడ్ నం. 36 ఎక్స్‌ప్రెస్‌వే',
  },
  hi: {
    'ward 14': 'वार्ड 14 गांधी नगर दूसरी क्रॉस सीसी सड़क',
    'gandhinagar': 'वार्ड 14 गांधी नगर दूसरी क्रॉस सीसी सड़क',
    'housing board': 'हाउसिंग बोर्ड कॉलोनी आवासीय सीसी सड़क',
    'sita ram nagar': 'सीताराम नगर तीसरी लेन कंक्रीट सड़क',
    'sitaramnagar': 'सीताराम नगर तीसरी लेन कंक्रीट सड़क',
    'gollapalli': 'गोल्लापल्ली ग्राम पंचायत ग्रामीण सड़क',
    'kothapet': 'कोठापेट ग्राम पंचायत लिंक मार्ग',
    'pedda cheruvu': 'पेद्दा चेरुवु झील तटबंध ग्रामीण सड़क',
    'gandhi bazaar': 'गांधी बाजार मुख्य वाणिज्यिक सड़क',
    'bazaar': 'गांधी बाजार मुख्य वाणिज्यिक सड़क',
    'sub-registrar': 'उप-पंजीयक कार्यालय शहरी वार्ड मार्ग',
    'subregistrar': 'उप-पंजीयक कार्यालय शहरी वार्ड मार्ग',
    'american hospital': 'अमेरिकन अस्पताल नगरपालिका वार्ड मार्ग',
    'american': 'अमेरिकन अस्पताल नगरपालिका वार्ड मार्ग',
    'market yard': 'कृषि उपज मंडी व्यावसायिक मार्ग',
    'marketyard': 'कृषि उपज मंडी व्यावसायिक मार्ग',
    'clock tower': 'पुराना बस स्टैंड व क्लॉक टॉवर जंक्शन मार्ग',
    'clocktower': 'पुराना बस स्टैंड व क्लॉक टॉवर जंक्शन मार्ग',
    'hanuman junction': 'नुजविद - हनुमान जंक्शन मुख्य सड़क',
    'hanuman': 'नुजविद - हनुमान जंक्शन मुख्य सड़क',
    'ramanakkapeta': 'रामनक्कपेटा जिला मुख्य गलियारा',
    'mylavaram': 'मयिलावरम - नुजविद राज्य राजमार्ग (SH 32)',
    'sh 32': 'मयिलावरम - नुजविद राज्य राजमार्ग (SH 32)',
    'vissannapeta': 'नुजविद - विस्सन्नापेटा राज्य राजमार्ग (SH 42)',
    'sh 42': 'नुजविद - विस्सन्नापेटा राज्य राजमार्ग (SH 42)',
    'nuzvid bypass': 'नुजविद बाईपास राष्ट्रीय राजमार्ग संपर्क',
    'bypass': 'नुजविद बाईपास राष्ट्रीय राजमार्ग संपर्क',
    'nh-16': 'एनएच-16 चेन्नई - कोलकाता राष्ट्रीय राजमार्ग',
    'nh 16': 'एनएच-16 चेन्नई - कोलकाता राष्ट्रीय राजमार्ग',
    'mg road': 'महात्मा गांधी रोड (बंदर रोड) वाणिज्यिक एवेन्यू',
    'bandar road': 'बंदर रोड आर्टेरियल कॉरिडोर, विजयवाड़ा',
    'eluru road': 'एलुरु रोड एवं पुराना बस स्टैंड मार्ग',
    'brts': 'बीआरटीएस मुख्य पारगमन गलियारा',
    'besant': 'बेसेंट रोड वाणिज्यिक लेन',
    'prakasam': 'प्रकाशम बैराज एवं कृष्णा नदी पुल मार्ग',
    'benz circle': 'बेंज सर्कल फ्लाईओवर गलियारा',
    'collectorate': 'कलेक्ट्रेट कार्यालय मार्ग',
    'arundelpet': 'अरुंडेलपेट मुख्य वाणिज्यिक सड़क, गुंटूर',
    'brodipet': 'ब्रोडीपेट चौथी लेन आवासीय सड़क, गुंटूर',
    'vijayawada - guntur': 'विजयवाड़ा - गुंटूर एक्सप्रेसवे',
    'guntur - vijayawada': 'गुंटूर - विजयवाड़ा एक्सप्रेसवे',
    'tirupati alipiri': 'तिरुपति अलिपिरी बाईपास सीसी सड़क',
    'alipiri': 'तिरुपति अलिपिरी बाईपास सीसी सड़क',
    'kondapalli': 'कोंडापल्ली किला घाट ग्रामीण सड़क',
    'jubilee hills': 'जुबली हिल्स रोड नं. 36 एक्सप्रेसवे',
  }
};

/**
 * Returns purely native script road title for TTS audio and local heading
 */
export function getNativeRoadTitle(road, lang) {
  const code = lang || getActiveLanguage();
  const rawTitle = typeof road === 'string' ? road : (road?.name || (road?.ref ? `Road (${road.ref})` : 'Street Pavement'));
  if (code === 'en') return rawTitle;

  const dict = LOCALIZED_ROAD_NAMES[code];
  if (dict) {
    const lower = rawTitle.toLowerCase();
    for (const [k, v] of Object.entries(dict)) {
      if (lower.includes(k)) return v;
    }
  }
  return rawTitle;
}

/**
 * Formats road title with native script and English secondary for crystal clarity
 */
export function formatLocalizedRoadTitle(road, lang) {
  const code = lang || getActiveLanguage();
  const rawTitle = typeof road === 'string' ? road : (road?.name || (road?.ref ? `Road (${road.ref})` : 'Street Pavement'));
  if (code === 'en') return rawTitle;

  const native = getNativeRoadTitle(road, code);
  if (native && native !== rawTitle) {
    return `${native} (${rawTitle})`;
  }
  return rawTitle;
}

/**
 * Translates municipal department authority into active language
 */
export function formatLocalizedDept(deptName, lang) {
  const code = lang || getActiveLanguage();
  const name = deptName || 'Urban Development / Municipal Corporation';
  if (code === 'en') return name;

  if (code === 'te') {
    if (name.includes('R&B') || name.includes('Buildings')) return 'ఆంధ్రప్రదేశ్ ఆర్ & బి (R&B) రహదారుల విభాగం';
    if (name.includes('Municipal') || name.includes('Corporation')) return 'పట్టణాభివృద్ధి & పురపాలక కార్పొరేషన్ (పురపాలక శాఖ)';
    if (name.includes('Panchayat') || name.includes('Rural')) return 'గ్రామ పంచాయతీ గ్రామీణ రహదారుల శాఖ (PR&RD)';
    if (name.includes('NHAI') || name.includes('Highways Authority')) return 'భారత జాతీయ రహదారుల సంస్థ (NHAI)';
    if (name.includes('Telangana')) return 'తెలంగాణ రహదారులు & భవనాల విభాగం';
    return 'పట్టణాభివృద్ధి & పురపాలక ఇంజనీరింగ్ శాఖ';
  }

  if (code === 'hi') {
    if (name.includes('R&B') || name.includes('Buildings')) return 'एपी सड़क एवं भवन (R&B) विभाग';
    if (name.includes('Municipal') || name.includes('Corporation')) return 'शहरी विकास एवं नगर निगम प्राधिकरण';
    if (name.includes('Panchayat') || name.includes('Rural')) return 'ग्राम पंचायत ग्रामीण सड़क विभाग (PR&RD)';
    if (name.includes('NHAI') || name.includes('Highways Authority')) return 'भारतीय राष्ट्रीय राजमार्ग प्राधिकरण (NHAI)';
    return 'शहरी विकास एवं लोक निर्माण विभाग';
  }

  return name;
}

/**
 * Translates pavement surface and lane description
 */
export function formatLocalizedSurface(road, lang) {
  const code = lang || getActiveLanguage();
  const rawSurface = (road?.surface || (road?.type === 'track' ? 'unpaved' : 'asphalt')).toLowerCase();
  const lanes = road?.lanes || '2';
  const speed = road?.maxspeed || '50';

  if (code === 'te') {
    let surfaceText = 'తారు రోడ్డు (Asphalt)';
    if (rawSurface.includes('concrete') || rawSurface.includes('cement')) surfaceText = 'సిమెంట్ కాంక్రీట్ (CC)';
    else if (rawSurface.includes('unpaved') || rawSurface.includes('track')) surfaceText = 'మట్టి / గ్రావెల్ రోడ్డు';
    return `${surfaceText} (${lanes} లేన్లు · ${speed} km/h)`;
  }

  if (code === 'hi') {
    let surfaceText = 'डामर सड़क (Asphalt)';
    if (rawSurface.includes('concrete') || rawSurface.includes('cement')) surfaceText = 'सीमेंट कंक्रीट (CC)';
    else if (rawSurface.includes('unpaved') || rawSurface.includes('track')) surfaceText = 'कच्ची / बजरी सड़क';
    return `${surfaceText} (${lanes} लेन · ${speed} किमी/घंटा)`;
  }

  const surfaceName = rawSurface.charAt(0).toUpperCase() + rawSurface.slice(1);
  return `${surfaceName} (${lanes} Lanes · ${speed} km/h)`;
}

/**
 * Translates defect score with localized severity label
 */
export function formatLocalizedScore(score, severity, lang) {
  const code = lang || getActiveLanguage();
  if (code === 'te') {
    if (severity === 'high' || severity === 'critical') return `${score} / 100 (తీవ్రమైన సమస్య - తక్షణ మరమ్మతు)`;
    if (severity === 'med' || severity === 'warning') return `${score} / 100 (మధ్యస్థ అరుగుదల)`;
    return `${score} / 100 (ఉత్తమ నాణ్యత)`;
  }
  if (code === 'hi') {
    if (severity === 'high' || severity === 'critical') return `${score} / 100 (गंभीर संकटग्रस्त - तत्काल मरम्मत)`;
    if (severity === 'med' || severity === 'warning') return `${score} / 100 (मध्यम टूट-फूट)`;
    return `${score} / 100 (उत्तम गुणवत्ता)`;
  }
  if (severity === 'high' || severity === 'critical') return `${score} / 100 (Critical Distress)`;
  if (severity === 'med' || severity === 'warning') return `${score} / 100 (Moderate Wear)`;
  return `${score} / 100 (Optimal Quality)`;
}

/**
 * Displays visible Voice Subtitle Banner with Gemini AI Voice status
 */
export function showVoiceNarrationBanner(text, lang, isGemini = true) {
  if (typeof document === 'undefined') return;
  const banner = document.getElementById('road-condition-voice-banner');
  const textEl = document.getElementById('road-condition-voice-text');
  const code = lang || getActiveLanguage();
  const langObj = INDIAN_LANGUAGES.find(l => l.code === code);
  const langLabel = langObj ? `${langObj.flag} ${langObj.native || langObj.name}` : code.toUpperCase();
  const providerLabel = isGemini ? `✨ Gemini AI Voice · ${langLabel}` : `🔊 Voice Announcement · ${langLabel}`;

  if (banner && textEl) {
    banner.classList.remove('hidden');
    textEl.textContent = `🔊 [${providerLabel}]: "${text}"`;
    banner.style.display = 'flex';
  }

  // Also broadcast live speech event for any audio visualizers
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rg_voice_announced', {
      detail: { text, lang: code, isGemini }
    }));
  }
}

/**
 * Generate native speech synthesis narration text in the active language
 */
export function getSpeechText(type, lang, params = {}) {
  const code = lang || getActiveLanguage();
  const title = params.title || 'Road';
  const ticketId = params.ticketId || 'RG-2026-CC-8492';

  if (type === 'road_condition') {
    if (params.isDamaged) {
      if (code === 'te') {
        return `హెచ్చరిక! ${title} వద్ద రోడ్డు తీవ్రంగా దెబ్బతిన్నది. ప్రమాదకరమైన గుంతలు గుర్తించబడ్డాయి. దయచేసి సమస్యను నమోదు చేయండి.`;
      }
      if (code === 'hi') {
        return `चेतावनी! ${title} पर सड़क गंभीर रूप से क्षतिग्रस्त है। खतरनाक गड्ढे पाए गए हैं। कृपया समस्या दर्ज करें।`;
      }
      if (code === 'ta') {
        return `எச்சரிக்கை! ${title} சாலையில் கடுமையான பள்ளங்கள் கண்டறியப்பட்டுள்ளன. தயவுசெய்து புகாரைப் பதிவு செய்யவும்.`;
      }
      if (code === 'kn') {
        return `ಎಚ್ಚರಿಕೆ! ${title} ರಸ್ತೆಯಲ್ಲಿ ತೀವ್ರವಾದ ಗುಂಡಿಗಳು ಕಂಡುಬಂದಿವೆ. ದಯವಿಟ್ಟು ದೂರನ್ನು ದಾಖಲಿಸಿ.`;
      }
      return `Warning! Road damage detected on ${title}. Severe potholes found. Please raise the problem.`;
    }

    if (params.isWarning) {
      if (code === 'te') {
        return `గమనిక! ${title} పై రోడ్డు ఉపరితలం దెబ్బతిన్నది. మరమ్మతులు షెడ్యూల్ చేయబడ్డాయి.`;
      }
      if (code === 'hi') {
        return `सूचना! ${title} पर सड़क की सतह में टूट-फूट पाई गई है। मरम्मत निर्धारित है।`;
      }
      return `Notice! Roadside debris and surface wear detected on ${title}.`;
    }

    // Good condition
    if (code === 'te') {
      return `ధృవీకరించబడింది! ${title} రోడ్డు చాలా మంచి స్థితిలో ఉంది. సురక్షితమైన ప్రయాణం.`;
    }
    if (code === 'hi') {
      return `सत्यापित! ${title} सड़क बहुत अच्छी स्थिति में है और सतह सुरक्षित है।`;
    }
    return `Verified! ${title} is in good condition with smooth pavement.`;
  }

  if (type === 'problem_raised') {
    if (code === 'te') {
      return `ఫిర్యాదు విజయవంతంగా నమోదైంది! అధికారిక టోకెన్ సంఖ్య: ${ticketId}. మున్సిపల్ రోడ్డు మరమ్మతు బృందానికి కేటాయించబడింది.`;
    }
    if (code === 'hi') {
      return `शिकायत सफलतापूर्वक दर्ज की गई! टोकन नंबर: ${ticketId}। नगर निगम मरम्मत दल को सौंपा गया।`;
    }
    if (code === 'ta') {
      return `புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது! டோக்கன் எண்: ${ticketId}.`;
    }
    return `Official grievance registered successfully! Token ID: ${ticketId}. Dispatched to municipal repair crew.`;
  }

  return '';
}

/**
 * Fallback browser Web Speech API in case Gemini audio cannot play
 */
function fallbackBrowserSpeech(text, lang) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const langTag = SPEECH_LANG_MAP[lang] || 'te-IN';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langTag;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    let matchingVoice = voices.find(v => v.lang.toLowerCase() === langTag.toLowerCase());
    if (!matchingVoice) {
      matchingVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(lang));
    }
    if (matchingVoice) utterance.voice = matchingVoice;
    window.speechSynthesis.speak(utterance);
  } catch {}
}

let lastAnnouncementKey = '';
let lastAnnouncementType = '';
let lastAnnouncementTime = 0;

/**
 * Pronounces speech in the selected Indian language using Google Gemini AI Voice (gemini-3.8-flash-tts)
 */
export function speakAnnouncement(type, params = {}) {
  if (typeof window === 'undefined') return;
  try {
    const now = Date.now();
    const clipKey = type === 'problem_raised' 
      ? 'problem_raised' 
      : (type === 'road_condition' ? (params.isDamaged ? 'road_damaged' : (params.isWarning ? 'road_damaged' : 'road_good')) : null);

    const announcementKey = `${type}:${clipKey}:${params.ticketId || params.title || ''}`;

    // Priority arbitration: 'problem_raised' (official grievance ticket) takes precedence over 'road_condition'
    if (type === 'road_condition' && lastAnnouncementType === 'problem_raised' && now - lastAnnouncementTime < 2500) {
      console.log('[Voice] Suppressing road_condition announcement while problem_raised audio is playing.');
      return;
    }

    // Ignore exact duplicates within 1200ms
    if (announcementKey === lastAnnouncementKey && now - lastAnnouncementTime < 1200) {
      console.log('[Voice] Suppressing duplicate announcement within 1200ms:', announcementKey);
      return;
    }

    lastAnnouncementType = type;
    lastAnnouncementKey = announcementKey;
    lastAnnouncementTime = now;

    const lang = getActiveLanguage();
    const text = getSpeechText(type, lang, params);
    if (!text) return;

    // Show visual voice subtitle banner immediately with Gemini AI Voice badge
    showVoiceNarrationBanner(text, lang, true);

    // Call Google Gemini TTS with instant studio clip failover
    geminiSpeakText(text, { language: lang, voice: 'Kore', clipKey }).then((res) => {
      if (!res.success) {
        console.warn('[Gemini Voice] Gemini TTS fallback note:', res.error);
        fallbackBrowserSpeech(text, lang);
      }
    }).catch((err) => {
      console.warn('[Gemini Voice] Gemini TTS notice:', err);
      fallbackBrowserSpeech(text, lang);
    });
  } catch (err) {
    console.warn('Speech synthesis notice:', err);
  }
}

/**
 * Formats damage description in active language
 */
export function formatLocalizedDamageTag(damage, lang) {
  const code = lang || getActiveLanguage();
  if (!damage) return '✅ Clean';
  const tag = damage.tag || '';
  if (code === 'en') return tag;

  if (damage.type === 'pothole' || tag.toLowerCase().includes('pothole') || tag.toLowerCase().includes('spalling')) {
    if (code === 'te') return '⚠️ తీవ్రమైన గుంతలు గుర్తించబడ్డాయి (2)';
    if (code === 'hi') return '⚠️ गहरे गड्ढे पाए गए (2)';
    if (code === 'ta') return '⚠️ கடுமையான பள்ளங்கள் (2)';
  }
  if (damage.type === 'garbage' || tag.toLowerCase().includes('waste') || tag.toLowerCase().includes('dump')) {
    if (code === 'te') return '🗑️ రోడ్డు పక్కన వ్యర్థాలు & శిథిలాలు';
    if (code === 'hi') return '🗑️ सड़क किनारे कचरा व मलबा';
  }
  if (tag.toLowerCase().includes('waterlogged') || tag.toLowerCase().includes('erosion')) {
    if (code === 'te') return '🌊 నీరు నిలిచిన గుంతలు & రోడ్డు కోత';
    if (code === 'hi') return '🌊 जलभराव व सड़क कटाव';
  }
  if (damage.severity === 'clean' || tag.toLowerCase().includes('intact') || tag.toLowerCase().includes('smooth')) {
    if (code === 'te') return '✅ రోడ్డు ఉపరితలం సురక్షితంగా ఉంది';
    if (code === 'hi') return '✅ सड़क सतह सुरक्षित है';
  }
  return tag;
}
