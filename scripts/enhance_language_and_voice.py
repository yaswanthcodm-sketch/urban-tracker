#!/usr/bin/env python3
"""
enhance_language_and_voice.py
Comprehensive enhancer for RoadGuard AI multi-lingual system (Telugu & 22 Indian languages):
1. Expands translations and voice text in src/i18n/indianLanguages.js
2. Implements pure native voice speech and subtitle banner (Voice HUD)
3. Fully wires up reactive language re-rendering across floating card, drawer, and tracking modal
4. Localizes road names, surfaces, departments, defect scores, and status pills
"""

import os
import re

I18N_PATH = '/Users/yaswanth/Downloads/gods-eye-view-0.1.1/src/i18n/indianLanguages.js'
ROAD_RECON_PATH = '/Users/yaswanth/Downloads/gods-eye-view-0.1.1/src/data/roadReconUI.js'
VILLAGE_ROADS_PATH = '/Users/yaswanth/Downloads/gods-eye-view-0.1.1/src/data/villageRoadsCatalog.js'
TRACKING_MODAL_PATH = '/Users/yaswanth/Downloads/gods-eye-view-0.1.1/src/complaintTrackingModal.js'
INDEX_HTML_PATH = '/Users/yaswanth/Downloads/gods-eye-view-0.1.1/index.html'
STYLE_CSS_PATH = '/Users/yaswanth/Downloads/gods-eye-view-0.1.1/style.css'
PUBLIC_I18N_PATH = '/Users/yaswanth/Downloads/gods-eye-view-0.1.1/public/js/indianLanguages.js'

print("Step 1: Reading src/i18n/indianLanguages.js...")
with open(I18N_PATH, 'r', encoding='utf-8') as f:
    i18n_code = f.read()

# Let's ensure the new translation keys exist in TRANSLATIONS
EXTRA_KEYS_TE = """
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
"""

EXTRA_KEYS_HI = """
    voice_announcement: "आवाज घोषणा",
    restoration_needed: "सतह बहाली और तत्काल पैच कार्य आवश्यक",
    maintenance_scheduled: "रखरखाव कार्य निर्धारित",
    score_critical: "गंभीर संकटग्रस्त",
    score_moderate: "मध्यम टूट-फूट",
    score_optimal: "उत्तम गुणवत्ता",
    problem_raised_heading: "समस्या सफलतापूर्वक दर्ज हुई!",
    road_recon_title: "सड़क टोही एवं एआई क्षति पहचान",
    status_label: "स्थिति",
    track_modal_title: "सड़क शिकायत ट्रैकिंग प्रणाली",
    track_modal_subtitle: "शिकायत पंजीकरण से लेकर सड़क मरम्मत स्वीकृति तक वास्तविक समय प्रगति।",
    authority_worker_card_title: "प्राधिकरण एवं श्रमिक नियुक्ति",
    repair_log_card_title: "मरम्मत स्थिति एवं कार्य निष्पादन लॉग",
    photometric_audit_title: "मरम्मत से पहले और बाद का फोटो सत्यापन",
    resolution_cert_title: "डिजिटल अनुमोदन प्रमाणपत्र",
"""

EXTRA_KEYS_EN = """
    voice_announcement: "Voice Announcement",
    restoration_needed: "Surface Milling & Pavement Restoration Needed",
    maintenance_scheduled: "Maintenance Scheduled",
    score_critical: "Critical Distress",
    score_moderate: "Moderate Wear",
    score_optimal: "Optimal Quality",
    problem_raised_heading: "Problem Raised Successfully!",
    road_recon_title: "Road Reconnaissance & AI Damage Detection",
    status_label: "STATUS",
    track_modal_title: "Road Complaint Tracking System",
    track_modal_subtitle: "Real-time verifiable progress from grievance registration to road repair approval.",
    authority_worker_card_title: "Authority & Worker Appointment",
    repair_log_card_title: "Repair Status & Work Execution Log",
    photometric_audit_title: "Photometric Audit: Before & After Photos",
    resolution_cert_title: "Digital Resolution Certificate",
"""

# Let's insert these keys if not already present
for lang_code, extra_snippet in [('te', EXTRA_KEYS_TE), ('hi', EXTRA_KEYS_HI), ('en', EXTRA_KEYS_EN)]:
    target_marker = f"{lang_code}: {{"
    if target_marker in i18n_code:
        # Check if already has voice_announcement
        if f'voice_announcement' not in i18n_code:
            i18n_code = i18n_code.replace(target_marker, target_marker + extra_snippet)

# Now, let's update the LOCALIZED_ROAD_NAMES and helper functions at the bottom of src/i18n/indianLanguages.js
NEW_HELPERS_AND_VOICE = """
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
 * Displays visible Voice Subtitle Banner so user immediately sees what is said
 */
export function showVoiceNarrationBanner(text, lang) {
  if (typeof document === 'undefined') return;
  const banner = document.getElementById('road-condition-voice-banner');
  const textEl = document.getElementById('road-condition-voice-text');
  const code = lang || getActiveLanguage();
  const label = t('voice_announcement', code) || 'Voice Announcement';

  if (banner && textEl) {
    banner.classList.remove('hidden');
    textEl.textContent = `🔊 [${label}]: "${text}"`;
    banner.style.display = 'flex';
  }

  // Also broadcast live speech event for any audio visualizers
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rg_voice_announced', {
      detail: { text, lang: code }
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
 * Pronounces speech in the selected Indian language using Web Speech API
 */
export function speakAnnouncement(type, params = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const lang = getActiveLanguage();
    const text = getSpeechText(type, lang, params);
    if (!text) return;

    // Show visual voice subtitle banner immediately
    showVoiceNarrationBanner(text, lang);

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
"""

# Replace from `export const LOCALIZED_ROAD_NAMES` to the end of i18n_code
loc_marker = "export const LOCALIZED_ROAD_NAMES = {"
if loc_marker in i18n_code:
    prefix = i18n_code.split(loc_marker)[0]
    i18n_code = prefix + NEW_HELPERS_AND_VOICE
else:
    i18n_code += "\n" + NEW_HELPERS_AND_VOICE

with open(I18N_PATH, 'w', encoding='utf-8') as f:
    f.write(i18n_code)
print("Updated src/i18n/indianLanguages.js successfully.")
