#!/usr/bin/env python3
import json

EN_KEYS = {
    "village_roads_title": "Village & City Road Network",
    "roads_ready": "Roads Ready",
    "switch_locality": "🌐 SWITCH CITY / TOWN / VILLAGE:",
    "type_any_locality": "Or type ANY town, city, or village... (e.g. Eluru, Warangal, Jaipur)",
    "filter_roads_placeholder": "Filter streets & roads of selected town by name...",
    "scan_btn": "SCAN",
    "pill_all_roads": "ALL ROADS",
    "pill_cement_roads": "CEMENT (CC) ROADS",
    "pill_village_streets": "VILLAGE STREETS",
    "pill_city_roads": "CITY ROADS",
    "pill_main_roads": "MAIN ROADS",
    "pill_highways": "HIGHWAYS",
    "badge_damaged_road": "🔴 DAMAGED ROAD",
    "badge_fair_road": "🟡 FAIR CONDITION",
    "badge_good_road": "🟢 GOOD CONDITION",
    "btn_inspect_detect": "🔍 INSPECT & DETECT",
    "btn_raise_problem": "🚨 RAISE THE PROBLEM",
    "btn_problem_raised_done": "✅ PROBLEM RAISED",
    "floating_damaged_title": "🔴 THIS ROAD IS DAMAGED",
    "floating_warning_title": "🟡 FAIR CONDITION · MODERATE WEAR",
    "floating_good_title": "🟢 THIS ROAD IS IN GOOD CONDITION",
    "defect_score_lbl": "Defect Score",
    "responsible_dept_lbl": "Responsible Dept",
    "road_hierarchy_lbl": "Road Hierarchy",
    "pavement_surface_lbl": "Pavement Surface",
    "btn_satellite_recon": "🛰️ SATELLITE 1-HR RECON",
    "btn_satellite_hud": "🛰️ FULL SATELLITE HUD",
    "btn_fly_street": "📍 FLY TO STREET (3D)",
    "btn_all_roads_locality": "📋 ALL ROADS IN LOCALITY",
    "btn_live_cams": "📹 LIVE CAMS",
    "damage_desc_severe_potholes": "Severe Potholes Detected · Surface Milling & Restoration Needed",
    "damage_desc_warning_debris": "Roadside Waste & Surface Fissures · Maintenance Scheduled",
    "damage_desc_smooth_pavement": "Surface Intact · Smooth Asphalt Pavement · Zero Defects",
    "badge_city_street": "CITY STREET",
    "badge_village_track": "VILLAGE TRACK",
    "badge_secondary_main": "SECONDARY MAIN",
    "badge_highway_nh": "NATIONAL HIGHWAY",
}

TE_KEYS = {
    "village_roads_title": "గ్రామ & నగర రోడ్డు నెట్‌వర్క్",
    "roads_ready": "రోడ్లు సిద్ధంగా ఉన్నాయి",
    "switch_locality": "🌐 నగరం / పట్టణం / గ్రామం ఎంచుకోండి:",
    "type_any_locality": "ఏదైనా నగరం లేదా గ్రామం పేరు నమోదు చేయండి... (ఉదా: ఏలూరు, వరంగల్, జైపూర్)",
    "filter_roads_placeholder": "రోడ్ల పేరుతో శోధించండి...",
    "scan_btn": "స్కాన్ చేయండి",
    "pill_all_roads": "అన్ని రోడ్లు",
    "pill_cement_roads": "సిమెంట్ (CC) రోడ్లు",
    "pill_village_streets": "గ్రామ వీధులు",
    "pill_city_roads": "నగర రోడ్లు",
    "pill_main_roads": "ప్రధాన రోడ్లు",
    "pill_highways": "హైవేలు",
    "badge_damaged_road": "🔴 దెబ్బతిన్న రోడ్డు",
    "badge_fair_road": "🟡 సాధారణ స్థితి",
    "badge_good_road": "🟢 మంచి స్థితి",
    "btn_inspect_detect": "🔍 తనిఖీ & పరిశీలన",
    "btn_raise_problem": "🚨 సమస్యను నమోదు చేయండి",
    "btn_problem_raised_done": "✅ సమస్య నమోదైంది",
    "floating_damaged_title": "🔴 ఈ రోడ్డు దెబ్బతిన్నది",
    "floating_warning_title": "🟡 సాధారణ స్థితి · కొద్దిగా దెబ్బతిన్నది",
    "floating_good_title": "🟢 ఈ రోడ్డు మంచి స్థితిలో ఉంది",
    "defect_score_lbl": "లోపం స్కోరు",
    "responsible_dept_lbl": "బాధ్యతాయుత విభాగం",
    "road_hierarchy_lbl": "రోడ్డు వర్గం",
    "pavement_surface_lbl": "రోడ్డు ఉపరితలం",
    "btn_satellite_recon": "🛰️ ఉపగ్రహ 1-గంట రీకాన్",
    "btn_satellite_hud": "🛰️ పూర్తి ఉపగ్రహ HUD",
    "btn_fly_street": "📍 వీధికి వెళ్లండి (3D)",
    "btn_all_roads_locality": "📋 స్థానిక అన్ని రోడ్లు",
    "btn_live_cams": "📹 లైవ్ కెమెరాలు",
    "damage_desc_severe_potholes": "తీవ్రమైన గుంతలు గుర్తించబడ్డాయి · తక్షణ మరమ్మతులు అవసరం",
    "damage_desc_warning_debris": "రోడ్డు ఉపరితలం దెబ్బతిన్నది · మరమ్మతులు షెడ్యూల్ చేయబడ్డాయి",
    "damage_desc_smooth_pavement": "రోడ్డు సురక్షితంగా ఉంది · నునుపైన తారు రోడ్డు · ఎటువంటి లోపాలు లేవు",
    "badge_city_street": "నగర వీధి",
    "badge_village_track": "గ్రామ రహదారి",
    "badge_secondary_main": "ప్రధాన రోడ్డు",
    "badge_highway_nh": "జాతీయ రహదారి",
}

HI_KEYS = {
    "village_roads_title": "ग्रामीण एवं शहरी सड़क नेटवर्क",
    "roads_ready": "सड़कें उपलब्ध",
    "switch_locality": "🌐 शहर / कस्बा / गाँव चुनें:",
    "type_any_locality": "किसी भी शहर या गाँव का नाम लिखें... (उदा. एलुरु, वारंगल, जयपुर)",
    "filter_roads_placeholder": "नाम से सड़कें खोजें...",
    "scan_btn": "स्कैन करें",
    "pill_all_roads": "सभी सड़कें",
    "pill_cement_roads": "सीमेंट (सीसी) सड़कें",
    "pill_village_streets": "ग्रामीण सड़कें",
    "pill_city_roads": "शहरी सड़कें",
    "pill_main_roads": "मुख्य सड़कें",
    "pill_highways": "राजमार्ग",
    "badge_damaged_road": "🔴 क्षतिग्रस्त सड़क",
    "badge_fair_road": "🟡 सामान्य स्थिति",
    "badge_good_road": "🟢 अच्छी स्थिति",
    "btn_inspect_detect": "🔍 निरीक्षण व जांच",
    "btn_raise_problem": "🚨 समस्या दर्ज करें",
    "btn_problem_raised_done": "✅ समस्या दर्ज हुई",
    "floating_damaged_title": "🔴 यह सड़क क्षतिग्रस्त है",
    "floating_warning_title": "🟡 सामान्य स्थिति · हल्का नुकसान",
    "floating_good_title": "🟢 यह सड़क अच्छी स्थिति में है",
    "defect_score_lbl": "दोष स्कोर",
    "responsible_dept_lbl": "जिम्मेदार विभाग",
    "road_hierarchy_lbl": "सड़क श्रेणी",
    "pavement_surface_lbl": "सड़क की सतह",
    "btn_satellite_recon": "🛰️ उपग्रह 1-घंटे का स्कैन",
    "btn_satellite_hud": "🛰️ पूर्ण उपग्रह HUD",
    "btn_fly_street": "📍 सड़क पर जाएं (3D)",
    "btn_all_roads_locality": "📋 क्षेत्र की सभी सड़कें",
    "btn_live_cams": "📹 लाइव कैमरे",
    "damage_desc_severe_potholes": "गहरे गड्ढे पाए गए · सतह का पुनर्निर्माण आवश्यक",
    "damage_desc_warning_debris": "सड़क पर टूट-फूट एवं मलबा · मरम्मत निर्धारित",
    "damage_desc_smooth_pavement": "सड़क सुरक्षित है · चिकनी डामर सतह · कोई दोष नहीं",
    "badge_city_street": "शहरी सड़क",
    "badge_village_track": "ग्रामीण मार्ग",
    "badge_secondary_main": "मुख्य मार्ग",
    "badge_highway_nh": "राष्ट्रीय राजमार्ग",
}

TA_KEYS = {
    "village_roads_title": "கிராம மற்றும் நகர சாலை வலைப்பின்னல்",
    "roads_ready": "சாலைகள் தயார்",
    "switch_locality": "🌐 நகரம் / கிராமம் தேர்ந்தெடுக்கவும்:",
    "type_any_locality": "நகரம் அல்லது கிராமத்தின் பெயரை உள்ளிடவும்...",
    "filter_roads_placeholder": "சாலைகளின் பெயர் மூலம் தேடுங்கள்...",
    "scan_btn": "ஸ்கேன் செய்க",
    "pill_all_roads": "அனைத்து சாலைகள்",
    "pill_cement_roads": "சிமெண்ட் (CC) சாலைகள்",
    "pill_village_streets": "கிராம சாலைகள்",
    "pill_city_roads": "நகர சாலைகள்",
    "pill_main_roads": "முக்கிய சாலைகள்",
    "pill_highways": "நெடுஞ்சாலைகள்",
    "badge_damaged_road": "🔴 சேதமடைந்த சாலை",
    "badge_fair_road": "🟡 சாதாரண நிலை",
    "badge_good_road": "🟢 நல்ல நிலை",
    "btn_inspect_detect": "🔍 ஆய்வு & கண்டறிதல்",
    "btn_raise_problem": "🚨 புகாரைப் பதிவு செய்யவும்",
    "btn_problem_raised_done": "✅ புகார் பதிவு செய்யப்பட்டது",
    "floating_damaged_title": "🔴 இந்த சாலை சேதமடைந்துள்ளது",
    "floating_warning_title": "🟡 சாதாரண நிலை · சிறிய சேதம்",
    "floating_good_title": "🟢 இந்த சாலை நல்ல நிலையில் உள்ளது",
    "defect_score_lbl": "சேதக் குறியீடு",
    "responsible_dept_lbl": "பொறுப்பான துறை",
    "road_hierarchy_lbl": "சாலை வகை",
    "pavement_surface_lbl": "சாலை மேற்பரப்பு",
    "btn_satellite_recon": "🛰️ செயற்கைக்கோள் 1-மணி நேர ஆய்வு",
    "btn_satellite_hud": "🛰️ முழு செயற்கைக்கோள் HUD",
    "btn_fly_street": "📍 சாலைக்குச் செல்லவும் (3D)",
    "btn_all_roads_locality": "📋 இப்பகுதியின் அனைத்து சாலைகள்",
    "btn_live_cams": "📹 நேரலைக் கேமராக்கள்",
    "damage_desc_severe_potholes": "கடுமையான பள்ளங்கள் கண்டறியப்பட்டன · உடனடி பழுது தேவை",
    "damage_desc_warning_debris": "மேற்பரப்பு சேதம் மற்றும் குப்பைகள் · பழுது திட்டமிடப்பட்டது",
    "damage_desc_smooth_pavement": "சாலை பாதுகாப்பாக உள்ளது · குறைபாடுகள் இல்லை",
    "badge_city_street": "நகர சாலை",
    "badge_village_track": "கிராமப் பாதை",
    "badge_secondary_main": "முதன்மை சாலை",
    "badge_highway_nh": "தேசிய நெடுஞ்சாலை",
}

KN_KEYS = {
    "village_roads_title": "ಗ್ರಾಮ ಮತ್ತು ನಗರ ರಸ್ತೆ ಜಾಲ",
    "roads_ready": "ರಸ್ತೆಗಳು ಸಿದ್ಧವಾಗಿವೆ",
    "switch_locality": "🌐 ನಗರ / ಪಟ್ಟಣ / ಗ್ರಾಮ ಆಯ್ಕೆಮಾಡಿ:",
    "type_any_locality": "ಯಾವುದೇ ನಗರ ಅಥವಾ ಗ್ರಾಮದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ...",
    "filter_roads_placeholder": "ರಸ್ತೆಗಳ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ...",
    "scan_btn": "ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    "pill_all_roads": "ಎಲ್ಲಾ ರಸ್ತೆಗಳು",
    "pill_cement_roads": "ಸಿಮೆಂಟ್ (CC) ರಸ್ತೆಗಳು",
    "pill_village_streets": "ಗ್ರಾಮೀಣ ರಸ್ತೆಗಳು",
    "pill_city_roads": "ನಗರ ರಸ್ತೆಗಳು",
    "pill_main_roads": "ಮುಖ್ಯ ರಸ್ತೆಗಳು",
    "pill_highways": "ಹೆದ್ದಾರಿಗಳು",
    "badge_damaged_road": "🔴 ಹಾನಿಗೊಳಗಾದ ರಸ್ತೆ",
    "badge_fair_road": "🟡 ಸಾಧಾರಣ ಸ್ಥಿತಿ",
    "badge_good_road": "🟢 ಉತ್ತಮ ಸ್ಥಿತಿ",
    "btn_inspect_detect": "🔍 ಪರಿಶೀಲನೆ & ಪತ್ತೆ",
    "btn_raise_problem": "🚨 ದೂರನ್ನು ದಾಖಲಿಸಿ",
    "btn_problem_raised_done": "✅ ದೂರು ದಾಖಲಾಗಿದೆ",
    "floating_damaged_title": "🔴 ಈ ರಸ್ತೆ ಹಾನಿಗೊಳಗಾಗಿದೆ",
    "floating_warning_title": "🟡 ಸಾಧಾರಣ ಸ್ಥಿತಿ · ಸಣ್ಣ ಹಾನಿ",
    "floating_good_title": "🟢 ಈ ರಸ್ತೆ ಉತ್ತಮ ಸ್ಥಿತಿಯಲ್ಲಿದೆ",
    "defect_score_lbl": "ದೋಷದ ಸ್ಕೋರ್",
    "responsible_dept_lbl": "ಜವಾಬ್ದಾರಿಯುತ ಇಲಾಖೆ",
    "road_hierarchy_lbl": "ರಸ್ತೆ ವರ್ಗ",
    "pavement_surface_lbl": "ರಸ್ತೆಯ ಮೇಲ್ಮೈ",
    "btn_satellite_recon": "🛰️ ಉಪಗ್ರಹ 1-ಗಂಟೆಯ ಪರಿಶೀಲನೆ",
    "btn_satellite_hud": "🛰️ ಪೂರ್ಣ ಉಪಗ್ರಹ HUD",
    "btn_fly_street": "📍 ರಸ್ತೆಗೆ ತೆರಳಿ (3D)",
    "btn_all_roads_locality": "📋 ಈ ಪ್ರದೇಶದ ಎಲ್ಲಾ ರಸ್ತೆಗಳು",
    "btn_live_cams": "📹 ಲೈವ್ ಕ್ಯಾಮೆರಾಗಳು",
    "damage_desc_severe_potholes": "ತೀವ್ರ ಗುಂಡಿಗಳು ಪತ್ತೆಯಾಗಿವೆ · ತುರ್ತು ದುರಸ್ತಿ ಅಗತ್ಯವಿದೆ",
    "damage_desc_warning_debris": "ಮೇಲ್ಮೈ ಸವೆತ ಮತ್ತು ತ್ಯಾಜ್ಯ · ದುರಸ್ತಿ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ",
    "damage_desc_smooth_pavement": "ರಸ್ತೆ ಸುರಕ್ಷಿತವಾಗಿದೆ · ಯಾವುದೇ ದೋಷಗಳಿಲ್ಲ",
    "badge_city_street": "ನಗರ ರಸ್ತೆ",
    "badge_village_track": "ಗ್ರಾಮೀಣ ಮಾರ್ಗ",
    "badge_secondary_main": "ಮುಖ್ಯ ರಸ್ತೆ",
    "badge_highway_nh": "ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ",
}

with open('src/i18n/indianLanguages.js', 'r', encoding='utf-8') as f:
    text = f.read()

def inject_dict_keys(lang_code, keys_dict, code_text):
    pattern = rf'({lang_code}:\s*\{{[^}}]*)(verified_by_ai:[^\n]*\n)'
    replacement = r'\1\2'
    for k, v in keys_dict.items():
        val_escaped = json.dumps(v, ensure_ascii=False)
        replacement += f'    {k}: {val_escaped},\n'
    import re
    return re.sub(pattern, replacement, code_text, count=1)

text = inject_dict_keys('en', EN_KEYS, text)
text = inject_dict_keys('te', TE_KEYS, text)
text = inject_dict_keys('hi', HI_KEYS, text)
text = inject_dict_keys('ta', TA_KEYS, text)
text = inject_dict_keys('kn', KN_KEYS, text)

# Append speech map and helper functions before export functions
append_code = """
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
export const LOCALIZED_ROAD_NAMES = {
  te: {
    'ward 14': 'వార్డ్ 14 గాంధీ నగర్ 2వ క్రాస్ CC రోడ్డు',
    'gollapalli': 'గొల్లపల్లి గ్రామ పంచాయతీ వీధి',
    'gandhi bazaar': 'గాంధీ బజార్ ప్రధాన నగర రోడ్డు',
    'hanuman junction': 'నూజివీడు - హనుమాన్ జంక్షన్ ప్రధాన రహదారి',
    'nh-16': 'NH-16 చెన్నై - కోల్‌కతా జాతీయ రహదారి',
    'vijayawada - guntur': 'విజయవాడ - గుంటూరు ఎక్స్‌ప్రెస్‌వే',
    'tirupati alipiri': 'తిరుపతి అలిపిరి బైపాస్ CC రోడ్డు',
    'kondapalli': 'కొండపల్లి కోట ఘాట్ గ్రామీణ రహదారి',
    'mg road': 'MG రోడ్డు వాణిజ్య వీధి, విజయవాడ',
    'bunder road': 'బందరు రోడ్డు ప్రధాన మార్గం, విజయవాడ',
    'brodipet': 'బ్రోడీపేట ప్రధాన వాణిజ్య రోడ్డు, గుంటూరు',
    'arundelpet': 'అరుండల్‌పేట 4వ లైన్ CC రోడ్డు, గుంటూరు',
    'jubilee hills': 'జూబ్లీహిల్స్ రోడ్ నం. 36 ఎక్స్‌ప్రెస్‌వే',
  },
  hi: {
    'ward 14': 'वार्ड 14 गांधी नगर दूसरी क्रॉस सीसी सड़क',
    'gollapalli': 'गोल्लापल्ली ग्राम पंचायत ग्रामीण सड़क',
    'gandhi bazaar': 'गांधी बाजार मुख्य वाणिज्यिक सड़क',
    'hanuman junction': 'नुजविद - हनुमान जंक्शन मुख्य सड़क',
    'nh-16': 'एनएच-16 चेन्नई - कोलकाता राष्ट्रीय राजमार्ग',
    'vijayawada - guntur': 'विजयवाड़ा - गुंटूर एक्सप्रेसवे',
    'tirupati alipiri': 'तिरुपति अलिपिरी बाईपास सीसी सड़क',
    'kondapalli': 'कोंडापल्ली किला घाट ग्रामीण सड़क',
    'mg road': 'एमजी रोड कमर्शियल एवेन्यू, विजयवाड़ा',
    'bunder road': 'बंदर रोड आर्टेरियल कॉरिडोर, विजयवाड़ा',
    'brodipet': 'ब्रोडीपेट मुख्य वाणिज्यिक सड़क, गुंटूर',
    'arundelpet': 'अरुंडेलपेट चौथी लेन सीसी सड़क, गुंटूर',
    'jubilee hills': 'जुबली हिल्स रोड नं. 36 एक्सप्रेसवे',
  }
};

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
 * Pronounces speech in the selected Indian language using Web Speech API
 */
export function speakAnnouncement(type, params = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const lang = getActiveLanguage();
    const text = getSpeechText(type, lang, params);
    if (!text) return;

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
    if (!matchingVoice) {
      matchingVoice = voices.find(v => v.name.toLowerCase().includes(lang));
    }
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis notice:', err);
  }
}

/**
 * Formats road title with native script if available
 */
export function formatLocalizedRoadTitle(road, lang) {
  const code = lang || getActiveLanguage();
  const rawTitle = typeof road === 'string' ? road : (road?.name || (road?.ref ? `Road (${road.ref})` : 'Street Pavement'));
  if (code === 'en') return rawTitle;

  const dict = LOCALIZED_ROAD_NAMES[code];
  if (dict) {
    const lower = rawTitle.toLowerCase();
    for (const [k, v] of Object.entries(dict)) {
      if (lower.includes(k)) return `${rawTitle} · ${v}`;
    }
  }
  return rawTitle;
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
    if (code === 'te') return '🕳️ తీవ్రమైన గుంతలు గుర్తించబడ్డాయి (2)';
    if (code === 'hi') return '🕳️ गहरे गड्ढे पाए गए (2)';
    if (code === 'ta') return '🕳️ கடுமையான பள்ளங்கள் (2)';
  }
  if (damage.type === 'garbage' || tag.toLowerCase().includes('waste') || tag.toLowerCase().includes('dump')) {
    if (code === 'te') return '🗑️ రోడ్డు పక్కన వ్యర్థాలు';
    if (code === 'hi') return '🗑️ सड़क किनारे कचरा';
  }
  if (tag.toLowerCase().includes('waterlogged') || tag.toLowerCase().includes('erosion')) {
    if (code === 'te') return '🌊 నీరు నిలిచిన గుంతలు & రోడ్డు కోత';
    if (code === 'hi') return '🌊 जलभराव व सड़क कटाव';
  }
  if (damage.severity === 'clean' || tag.toLowerCase().includes('intact') || tag.toLowerCase().includes('smooth')) {
    if (code === 'te') return '✅ రోడ్డు సురక్షితంగా ఉంది';
    if (code === 'hi') return '✅ सड़क सुरक्षित है';
  }
  return tag;
}
"""

text += append_code

with open('src/i18n/indianLanguages.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Successfully updated src/i18n/indianLanguages.js with new keys and speech helpers!")
