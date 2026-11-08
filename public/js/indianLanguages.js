/**
 * Vanilla JS version of official 22 Indian Languages for static pages (login.html, track.html)
 */
(function(window) {
  const INDIAN_LANGUAGES = [
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
    { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্', flag: '🇮🇳' },
    { code: 'brx', name: 'Bodo', native: 'बड़ो', flag: '🇮🇳' },
    { code: 'doi', name: 'Dogri', native: 'डोगरी', flag: '🇮🇳' },
    { code: 'ks', name: 'Kashmiri', native: 'कॉशुर', flag: '🇮🇳' },
    { code: 'sd', name: 'Sindhi', native: 'सिन्धी', flag: '🇮🇳' },
    { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', flag: '🇮🇳' },
  ];

  const TRANSLATIONS = {
    en: {
      portal_title: "RoadGuard AI",
      portal_tagline: "National Smart Road & Grievance Redressal Portal",
      gov_badge: "Government of India · Smart Cities Mission Compliant",
      welcome: "Welcome Back",
      sign_in_desc: "Sign in to access your road maintenance operations and complaint records.",
      citizen_portal: "Citizen Access",
      officer_portal: "Officer & Contractor Login",
      email_or_mobile: "Email Address or 10-Digit Mobile",
      password: "Password",
      remember_me: "Remember this device",
      forgot_password: "Forgot Password?",
      sign_in_btn: "Sign In to Portal",
      guest_btn: "Quick Guest Access · Open 3D Map",
      track_complaint: "Track Road Complaint",
      track_desc: "Full tracking process from registration to road repair verification.",
      enter_tracking_id: "Enter Tracking ID (e.g. RG-2026-CC-8492)...",
      track_status_btn: "Track Status",
      all_roads_title: "Supported Road Classifications",
      cement_roads: "Cement Roads (CC Roads)",
      cement_roads_sub: "Residential streets & concrete colony lanes",
      village_streets: "Village & Local Streets",
      village_streets_sub: "Gram Panchayat lanes & rural link roads",
      city_roads: "City Roads",
      city_roads_sub: "Municipal corporation wards & avenues",
      main_roads: "Main Roads",
      main_roads_sub: "Major district arterial corridors",
      highways: "Highways & Expressways",
      highways_sub: "NHAI National & State Expressways",
      sla_title: "Official Redressal Guarantee",
      sla_desc: "24 to 48 Hours Resolution SLA with Before vs After photometric audit",
    },
    hi: {
      portal_title: "रोडगार्ड एआई",
      portal_tagline: "राष्ट्रीय स्मार्ट सड़क एवं शिकायत निवारण पोर्टल",
      gov_badge: "भारत सरकार · स्मार्ट सिटीज मिशन अनुपालन",
      welcome: "वापसी पर स्वागत है",
      sign_in_desc: "सड़क रखरखाव एवं शिकायत निवारण पोर्टल में लॉगिन करें।",
      citizen_portal: "नागरिक पोर्टल",
      officer_portal: "अधिकारी / ठेकेदार लॉगिन",
      email_or_mobile: "ईमेल या 10-अंकों का मोबाइल नंबर",
      password: "पासवर्ड",
      remember_me: "इस डिवाइस को याद रखें",
      forgot_password: "पासवर्ड भूल गए?",
      sign_in_btn: "पोर्टल में साइन इन करें",
      guest_btn: "अतिथि के रूप में जारी रखें · 3D मैप खोलें",
      track_complaint: "सड़क शिकायत ट्रैक करें",
      track_desc: "पंजीकरण से लेकर मरम्मत सत्यापन तक की पूर्ण प्रक्रिया देखें।",
      enter_tracking_id: "ट्रैकिंग आईडी दर्ज करें (उदा. RG-2026-CC-8492)...",
      track_status_btn: "स्थिति ट्रैक करें",
      all_roads_title: "समर्थित सड़क श्रेणियां",
      cement_roads: "सीमेंट सड़कें (सीसी रोड)",
      cement_roads_sub: "आवासीय कॉलोनियों एवं गलियों की कंक्रीट सड़कें",
      village_streets: "ग्रामीण एवं स्थानीय सड़कें",
      village_streets_sub: "ग्राम पंचायत की सड़कें एवं ग्रामीण संपर्क मार्ग",
      city_roads: "शहरी सड़कें",
      city_roads_sub: "नगर निगम वार्ड सड़कें और मुख्य गलियारे",
      main_roads: "मुख्य सड़कें",
      main_roads_sub: "प्रमुख जिला सड़कें और भारी यातायात वाले मार्ग",
      highways: "राजमार्ग एवं एक्सप्रेसवे",
      highways_sub: "एनएचएआई और राज्य पीडब्ल्यूडी राजमार्ग",
      sla_title: "आधिकारिक निवारण गारंटी",
      sla_desc: "मरम्मत से पहले और बाद के फोटो सत्यापन के साथ 24 से 48 घंटे में समाधान",
    },
    te: {
      portal_title: "రోడ్‌గార్డ్ AI",
      portal_tagline: "జాతీయ స్మార్ట్ రోడ్డు మరమ్మతులు & ఫిర్యాదుల పరిష్కార పోర్టల్",
      gov_badge: "భారత ప్రభుత్వం · స్మార్ట్ సిటీస్ మిషన్ ప్రమాణాలు",
      welcome: "పునఃస్వాగతం",
      sign_in_desc: "రోడ్డు నిర్వహణ మరియు ఫిర్యాదుల పరిష్కార పోర్టల్‌లోకి లాగిన్ అవ్వండి.",
      citizen_portal: "పౌర వేదిక (Citizen)",
      officer_portal: "అధికారి / కాంట్రాక్టర్ లాగిన్",
      email_or_mobile: "ఈమెయిల్ లేదా 10 అంకెల మొబైల్ నంబర్",
      password: "పాస్‌వర్డ్",
      remember_me: "గుర్తుంచుకో",
      forgot_password: "పాస్‌వర్డ్ మర్చిపోయారా?",
      sign_in_btn: "పోర్టల్‌లోకి సైన్ ఇన్ చేయండి",
      guest_btn: "గెస్ట్‌గా ప్రవేశించండి · 3D మ్యాప్ తెరవండి",
      track_complaint: "రోడ్డు ఫిర్యాదును ట్రాక్ చేయండి",
      track_desc: "రిజిస్ట్రేషన్ నుండి రోడ్డు మరమ్మతు పూర్తి అయ్యే వరకు ప్రతి దశను ట్రాక్ చేయండి.",
      enter_tracking_id: "ట్రాకింగ్ ఐడీ నమోదు చేయండి (ఉదా. RG-2026-CC-8492)...",
      track_status_btn: "స్టేటస్ చూడండి",
      all_roads_title: "అన్ని రకాల రోడ్ల వర్గీకరణ",
      cement_roads: "సిమెంట్ రోడ్లు (CC రోడ్లు)",
      cement_roads_sub: "కాలనీలు & నివాస ప్రాంతాల కాంక్రీట్ సీసీ రోడ్లు",
      village_streets: "గ్రామీణ మరియు స్థానిక వీధులు",
      village_streets_sub: "గ్రామ పంచాయతీ వీధులు మరియు గ్రామీణ అనుసంధాన రహదారులు",
      city_roads: "నగర రోడ్లు",
      city_roads_sub: "మున్సిపల్ కార్పొరేషన్ వార్డు రోడ్లు మరియు వాణిజ్య వీధులు",
      main_roads: "ప్రధాన రోడ్లు",
      main_roads_sub: "ముఖ్య జిల్లా రోడ్లు మరియు భారీ ట్రాఫిక్ ధమనులు",
      highways: "హైవేలు & ఎక్స్‌ప్రెస్‌వేలు",
      highways_sub: "NHAI జాతీయ మరియు రాష్ట్ర రహదారులు",
      sla_title: "అధికారిక పరిష్కార గ్యారెంటీ",
      sla_desc: "ముందు & తర్వాత ఫోటోల తనిఖీతో 24 నుండి 48 గంటల్లో పరిష్కారం",
    },
    ta: {
      portal_title: "ரோட்கார்ட் AI",
      portal_tagline: "தேசிய சாலைப் பராமரிப்பு மற்றும் குறைதீர்க்கும் தளம்",
      gov_badge: "இந்திய அரசு · ஸ்மார்ட் சிட்டிஸ் மிஷன்",
      welcome: "மீண்டும் வருக",
      sign_in_desc: "சாலைப் பராமரிப்பு மற்றும் குறைதீர்க்கும் போர்ட்டலில் உள்நுழையவும்.",
      citizen_portal: "குடிமக்கள் தளம்",
      officer_portal: "அதிகாரி / ஒப்பந்ததாரர் உள்நுழைவு",
      email_or_mobile: "மின்னஞ்சல் அல்லது 10 இலக்க மொபைல்",
      password: "கடவுச்சொல்",
      remember_me: "நினைவில் கொள்க",
      forgot_password: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
      sign_in_btn: "போர்ட்டலில் உள்நுழைக",
      guest_btn: "விருந்தினராக தொடர்க · 3D வரைபடம்",
      track_complaint: "சாலைப் புகாரைக் கண்காணிக்கவும்",
      track_desc: "பதிவு முதல் இறுதி ஒப்புதல் வரை முழு செயல்முறையையும் கண்காணிக்கவும்.",
      enter_tracking_id: "கண்காணிப்பு ஐடியை உள்ளிடவும்...",
      track_status_btn: "நிலையைக் காண்க",
      all_roads_title: "ஆதரிக்கப்படும் சாலை வகைகள்",
      cement_roads: "சிமெண்ட் சாலைகள் (CC சாலைகள்)",
      cement_roads_sub: "குடியிருப்புப் பகுதி கான்கிரீட் தெருக்கள்",
      village_streets: "கிராமப்புற மற்றும் உள்ளூர் தெருக்கள்",
      village_streets_sub: "கிராம ஊராட்சி சாலைகள் மற்றும் இணைப்புப் பாதைகள்",
      city_roads: "நகர சாலைகள்",
      city_roads_sub: "மாநகராட்சி வார்டு சாலைகள்",
      main_roads: "முக்கிய சாலைகள்",
      main_roads_sub: "மாவட்ட முக்கிய சாலைகள்",
      highways: "நெடுஞ்சாலைகள் & விரைவுச்சாலைகள்",
      highways_sub: "NHAI மற்றும் மாநில நெடுஞ்சாலைகள்",
      sla_title: "அதிகாரப்பூர்வ தீர்வு உத்தரவாதம்",
      sla_desc: "முந்தைய மற்றும் பிந்தைய படங்களின் சரிபார்ப்புடன் 24-48 மணிநேர தீர்வு",
    }
  };

  window.RoadGuardI18n = {
    languages: INDIAN_LANGUAGES,
    translations: TRANSLATIONS,
    getActiveLanguage: function() {
      try {
        return localStorage.getItem('rg_language') || 'en';
      } catch(e) {
        return 'en';
      }
    },
    setLanguage: function(code) {
      try {
        localStorage.setItem('rg_language', code);
      } catch(e) {}
      document.documentElement.setAttribute('lang', code);
      this.apply(code);
      window.dispatchEvent(new CustomEvent('rg_language_changed', { detail: { lang: code } }));
    },
    t: function(key, code) {
      const c = code || this.getActiveLanguage();
      const dict = TRANSLATIONS[c] || TRANSLATIONS.en;
      return dict[key] || TRANSLATIONS.en[key] || key;
    },
    apply: function(code) {
      const c = code || this.getActiveLanguage();
      const dict = TRANSLATIONS[c] || TRANSLATIONS.en;
      document.querySelectorAll('[data-i18n]').forEach(function(el) {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
          el.textContent = dict[key];
        } else if (TRANSLATIONS.en[key]) {
          el.textContent = TRANSLATIONS.en[key];
        }
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
          el.setAttribute('placeholder', dict[key]);
        } else if (TRANSLATIONS.en[key]) {
          el.setAttribute('placeholder', TRANSLATIONS.en[key]);
        }
      });
    }
  };
})(window);
