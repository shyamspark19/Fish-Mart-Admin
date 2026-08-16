import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'ta' | 'hi'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & General
    'brand.title': 'FISH MART',
    'brand.subtitle': 'Fresh Catch. Fast Delivery.',
    'brand.adminPortal': 'Admin Portal',
    'admin.signIn': 'Admin Sign In',
    'admin.dashboard': 'Admin Dashboard',
    'admin.control': 'Store & Order Control',
    'admin.restricted': 'Restricted to authorized administrators only',
    'admin.liveOps': 'Real-Time Operational Analytics',
    'logout': 'Logout',

    // Landing Page
    'landing.tag': "TAMIL NADU'S #1 FISH MARKETPLACE",
    'landing.heroTitle1': "Tamil Nadu's First Online",
    'landing.heroTitle2': "Fish Selling Application",
    'landing.heroSub': "From the coast to your kitchen — fresh, cleaned & delivered in 90 minutes across Chennai, Coimbatore, Madurai and all major cities.",
    'landing.pioneering': 'PIONEERING SEAFOOD DELIVERY',
    'landing.expressDelivery': '90-MIN EXPRESS DELIVERY',
    'landing.chemFree': '100% CHEMICAL-FREE',
    'landing.adminControl': 'RESTRICTED ADMIN ACCESS',
    'landing.enterAdmin': 'Enter Admin Portal',
    'landing.whyUs': 'Why Fish Mart?',
    'landing.whyUsSub': 'The Gold Standard of Tamil Nadu Seafood Delivery',
    'landing.whyUsDesc': 'We deliver uncompromising freshness, strict temperature-control, and certified hygienic processing.',
    'landing.deliveringAcross': 'DELIVERING ACROSS TAMIL NADU',
    'landing.readyTitle': 'Manage Fish Mart Operations',
    'landing.readySub': 'Access real-time analytics, manage seafood inventory, monitor delivery partners, and control orders.',

    // Stats
    'stat.cities': 'Cities Covered',
    'stat.orders': 'Daily Orders',
    'stat.species': 'Fresh Species',
    'stat.harbours': 'Harbour Partners',
    'stat.avgTime': 'Avg Delivery',
    'stat.rating': 'Customer Rating',

    // Features
    'feat.bayOfBengal': 'Bay of Bengal Fresh',
    'feat.bayOfBengalDesc': 'Sourced daily from Kasimedu, Cuddalore & Rameswaram coastal harbours.',
    'feat.express': '90-Min Fast Delivery',
    'feat.expressDesc': 'Dedicated cold-chain delivery fleet across key urban corridors.',
    'feat.coldChain': '0-4°C Cold Chain',
    'feat.coldChainDesc': 'Continuously chilled to preserve oceanic freshness and nutrients.',
    'feat.expertCleaning': 'Expert Cleaning & Cuts',
    'feat.expertCleaningDesc': 'Descaled, gutted, cleaned, and customized cutting options.',
    'feat.zeroChem': 'Zero Preservatives',
    'feat.zeroChemDesc': '100% natural, formalin-free, chemical-free seafood guaranteed.',
    'feat.liveTracking': 'Real-Time Fleet Tracking',
    'feat.liveTrackingDesc': 'Instant order tracking from fulfillment dock to customer doorstep.',

    // Login
    'login.title': 'Admin Portal Sign In',
    'login.desc': 'Sign in with your verified administrator credentials to access store controls.',
    'login.emailLabel': 'Admin Email Address',
    'login.passLabel': 'Security Password',
    'login.submitBtn': 'Sign In to Admin Portal',
    'login.authenticating': 'Authenticating Credentials...',

    // Dashboard Tabs
    'tab.analytics': 'Financial & Operations Analytics',
    'tab.products': 'Product Catalog',
    'tab.orders': 'Customer Orders',
    'tab.maps': 'Hub Coordinates & Maps',
    'tab.delivery': 'Delivery Partners & Fleet',

    // Admin Dashboard - Stats & Controls
    'stat.grossSales': 'Gross Sales Revenue',
    'stat.netProfit': 'Calculated Net Profit',
    'stat.inventoryUnits': 'Inventory Stock Units',
    'stat.avgOrderValue': 'Average Order Value',
    'btn.addNewProduct': 'Add New Product',
    'btn.refresh': 'Refresh Data',

    // Delivery Partner Tab
    'delivery.title': 'Delivery Fleet & Logistics Management',
    'delivery.subtitle': 'Monitor live order assignments, pickup status, customer feedback, and partner profiles.',
    'delivery.subTab.orders': 'Assigned Orders',
    'delivery.subTab.pickup': 'Pickup Status',
    'delivery.subTab.feedback': 'Customer Feedback',
    'delivery.subTab.profiles': 'Delivery Partner Profiles',

    'delivery.partnerName': 'Partner Name',
    'delivery.orderId': 'Order ID',
    'delivery.customer': 'Customer',
    'delivery.pickupStatus': 'Pickup Status',
    'delivery.deliveryStatus': 'Delivery Status',
    'delivery.eta': 'Estimated Time',
    'delivery.actions': 'Actions',
    'delivery.editProfile': 'Edit Profile',
    'delivery.activePartners': 'Active Partners',
    'delivery.fleetRating': 'Fleet Satisfaction',
    'delivery.onTimeRate': 'On-Time Delivery Rate',
    'delivery.pendingPickups': 'Pending Pickups',

    // Edit Partner Modal
    'modal.editPartner': 'Edit Delivery Partner Profile',
    'modal.name': 'Full Name',
    'modal.phone': 'Phone Number',
    'modal.email': 'Email Address',
    'modal.address': 'Service Address / Base Hub',
    'modal.photo': 'Profile Photo URL',
    'modal.vehicle': 'Vehicle Type & Reg No.',
    'modal.zone': 'Assigned Delivery Zone',
    'modal.save': 'Save Partner Profile',
    'modal.cancel': 'Cancel'
  },
  ta: {
    // Brand & General
    'brand.title': 'ஃபிஷ் மார்ட்',
    'brand.subtitle': 'புதிய மீன்கள். வேகமான டெலிவரி.',
    'brand.adminPortal': 'நிர்வாக போர்டல்',
    'admin.signIn': 'நிர்வாக உள்நுழைவு',
    'admin.dashboard': 'நிர்வாக முகப்பு',
    'admin.control': 'கடை & ஆர்டர்கள் மேலாண்மை',
    'admin.restricted': 'அங்கீகரிக்கப்பட்ட நிர்வாகிகளுக்கு மட்டுமே அனுமதி',
    'admin.liveOps': 'நேரலை செயல்பாட்டு புள்ளிவிவரங்கள்',
    'logout': 'வெளியேறு',

    // Landing Page
    'landing.tag': 'தமிழ்நாட்டின் முதன்மை மீன் விற்பனை தளம்',
    'landing.heroTitle1': 'தமிழ்நாட்டின் முதல் ஆன்லைன்',
    'landing.heroTitle2': 'மீன் விற்பனை செயலி',
    'landing.heroSub': 'கடற்கரையிலிருந்து உங்கள் சமையலறை வரை — புதிய, நறுக்கப்பட்ட மீன்கள் சென்னை, கோவை, மதுரை மற்றும் அனைத்து முக்கிய நகரங்களுக்கும் 90 நிமிடங்களில் டெலிவரி.',
    'landing.pioneering': 'முதன்மையான கடல் உணவு சேவை',
    'landing.expressDelivery': '90 நிமிட விரைவு டெலிவரி',
    'landing.chemFree': '100% ரசாயனம் அற்றது',
    'landing.adminControl': 'பாதுகாக்கப்பட்ட நிர்வாக அணுகல்',
    'landing.enterAdmin': 'நிர்வாக போர்டல் செல்லவும்',
    'landing.whyUs': 'ஏன் ஃபிஷ் மார்ட்?',
    'landing.whyUsSub': 'தமிழ்நாட்டின் மிகச்சிறந்த கடல் உணவு தரம்',
    'landing.whyUsDesc': 'நாங்கள் புதிய, குளிரூட்டப்பட்ட மற்றும் சுத்தமான கடல் உணவுகளை மிக நேர்த்தியாக வழங்குகிறோம்.',
    'landing.deliveringAcross': 'தமிழ்நாடு முழுவதும் டெலிவரி சேவை',
    'landing.readyTitle': 'ஃபிஷ் மார்ட் செயல்பாடுகளை நிர்வகிக்கவும்',
    'landing.readySub': 'நேரலை புள்ளிவிவரங்கள், தயாரிப்பு பட்டியல், டெலிவரி பார்ட்னர்கள் மற்றும் ஆர்டர்களை முழுமையாக நிர்வகியுங்கள்.',

    // Stats
    'stat.cities': 'நகரங்கள்',
    'stat.orders': 'தினசரி ஆர்டர்கள்',
    'stat.species': 'மீன் வகைகள்',
    'stat.harbours': 'துறைமுக கூட்டாளர்கள்',
    'stat.avgTime': 'சராசரி நேரம்',
    'stat.rating': 'வாடிக்கையாளர் மதிப்பீடு',

    // Features
    'feat.bayOfBengal': 'வங்காள விரிகுடா புத்துணர்ச்சி',
    'feat.bayOfBengalDesc': 'காசிமேடு, கடலூர் மற்றும் ராமேஸ்வரம் துறைமுகங்களிலிருந்து தினசரி சேகரிக்கப்படுகிறது.',
    'feat.express': '90 நிமிட விரைவு டெலிவரி',
    'feat.expressDesc': 'நம்பகமான குளிரூட்டப்பட்ட வாகனங்கள் மூலம் விரைவான விநியோகம்.',
    'feat.coldChain': '0-4°C குளிரூட்டப்பட்ட பாதுகாப்பு',
    'feat.coldChainDesc': 'இயற்கையான சத்துக்கள் மாறாமல் இருக்க தொடர்ந்து குளிர்நிலையில் வைக்கப்படுகிறது.',
    'feat.expertCleaning': 'சுத்திகரிப்பு & துல்லிய வெட்டுக்கள்',
    'feat.expertCleaningDesc': 'செதில்கள் நீக்கப்பட்டு, குடல் அகற்றப்பட்டு சுத்தமாக சமையலுக்கு தயார் செய்யப்படுகிறது.',
    'feat.zeroChem': 'ரசாயனம் அற்றது',
    'feat.zeroChemDesc': '100% தூய்மையான, ஃபார்மலின் இல்லாத இயற்கை மீன்கள்.',
    'feat.liveTracking': 'நேரலை வாகன கண்காணிப்பு',
    'feat.liveTrackingDesc': 'ஆர்டர் அனுப்பப்பட்டதிலிருந்து வீடு வந்து சேரும் வரை நேரலை கண்காணிப்பு.',

    // Login
    'login.title': 'நிர்வாக உள்நுழைவு',
    'login.desc': 'கடையை நிர்வகிக்க உங்கள் நிர்வாக மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.',
    'login.emailLabel': 'நிர்வாக மின்னஞ்சல் முகவரி',
    'login.passLabel': 'பாதுகாப்பு கடவுச்சொல்',
    'login.submitBtn': 'நிர்வாக போர்டலில் உள்நுழைக',
    'login.authenticating': 'சரிபார்க்கப்படுகிறது...',

    // Dashboard Tabs
    'tab.analytics': 'வருவாய் & நிதி பகுப்பாய்வு',
    'tab.products': 'தயாரிப்பு பட்டியல்',
    'tab.orders': 'வாடிக்கையாளர் ஆர்டர்கள்',
    'tab.maps': 'மைய இருப்பிடம் & வரைபடம்',
    'tab.delivery': 'டெலிவரி கூட்டாளர்கள்',

    // Admin Dashboard - Stats & Controls
    'stat.grossSales': 'மொத்த விற்பனை வருவாய்',
    'stat.netProfit': 'நிகர லாபம்',
    'stat.inventoryUnits': 'கையிருப்பு அலகுகள்',
    'stat.avgOrderValue': 'சராசரி ஆர்டர் மதிப்பு',
    'btn.addNewProduct': 'புதிய தயாரிப்பை சேர்',
    'btn.refresh': 'புதுப்பிக்கவும்',

    // Delivery Partner Tab
    'delivery.title': 'டெலிவரி & தளவாட மேலாண்மை',
    'delivery.subtitle': 'ஆர்டர் விநியோகம், பிக்கப் நிலை, வாடிக்கையாளர் கருத்துகள் மற்றும் பார்ட்னர் சுயவிவரங்களை நிர்வகிக்கவும்.',
    'delivery.subTab.orders': 'ஒதுக்கப்பட்ட ஆர்டர்கள்',
    'delivery.subTab.pickup': 'பிக்கப் நிலை',
    'delivery.subTab.feedback': 'வாடிக்கையாளர் கருத்துகள்',
    'delivery.subTab.profiles': 'டெலிவரி பார்ட்னர் சுயவிவரம்',

    'delivery.partnerName': 'பார்ட்னர் பெயர்',
    'delivery.orderId': 'ஆர்டர் எண்',
    'delivery.customer': 'வாடிக்கையாளர்',
    'delivery.pickupStatus': 'பிக்கப் நிலை',
    'delivery.deliveryStatus': 'டெலிவரி நிலை',
    'delivery.eta': 'மதிப்பிடப்பட்ட நேரம்',
    'delivery.actions': 'செயல்கள்',
    'delivery.editProfile': 'சுயவிவரத்தை திருத்து',
    'delivery.activePartners': 'செயலில் உள்ள பார்ட்னர்கள்',
    'delivery.fleetRating': 'டெலிவரி திருப்தி',
    'delivery.onTimeRate': 'சரியான நேர டெலிவரி',
    'delivery.pendingPickups': 'நிலுவையில் உள்ள பிக்கப்',

    // Edit Partner Modal
    'modal.editPartner': 'டெலிவரி பார்ட்னர் சுயவிவரத்தை மாற்றுக',
    'modal.name': 'முழு பெயர்',
    'modal.phone': 'தொலைபேசி எண்',
    'modal.email': 'மின்னஞ்சல் முகவரி',
    'modal.address': 'முகவரி / சேவை மையம்',
    'modal.photo': 'புகைப்பட இணைப்பு URL',
    'modal.vehicle': 'வாகனம் & பதிவு எண்',
    'modal.zone': 'ஒதுக்கப்பட்ட சேவை மண்டலம்',
    'modal.save': 'சுயவிவரத்தை சேமி',
    'modal.cancel': 'ரத்துசெய்'
  },
  hi: {
    // Brand & General
    'brand.title': 'फिश मार्ट',
    'brand.subtitle': 'ताजा मछली. तेज डिलीवरी.',
    'brand.adminPortal': 'एडमिन पोर्टल',
    'admin.signIn': 'एडमिन लॉगिन',
    'admin.dashboard': 'एडमिन डैशबोर्ड',
    'admin.control': 'स्टोर एवं ऑर्डर नियंत्रण',
    'admin.restricted': 'केवल अधिकृत व्यवस्थापकों के लिए',
    'admin.liveOps': 'रियल-टाइम परिचालन विश्लेषण',
    'logout': 'लॉग आउट',

    // Landing Page
    'landing.tag': 'तमिलनाडु का नंबर 1 फिश मार्केटप्लेस',
    'landing.heroTitle1': 'तमिलनाडु का पहला ऑनलाइन',
    'landing.heroTitle2': 'मछली बिक्री एप्लिकेशन',
    'landing.heroSub': 'समुद्र तट से आपकी रसोई तक — ताजी, साफ की हुई समुद्री मछली 90 मिनट में चेन्नई, कोयंबटूर, मदुरै और सभी प्रमुख शहरों में डिलीवरी।',
    'landing.pioneering': 'अग्रणी सीफूड डिलीवरी सेवा',
    'landing.expressDelivery': '90 मिनट एक्सप्रेस डिलीवरी',
    'landing.chemFree': '100% रसायन मुक्त',
    'landing.adminControl': 'सुरक्षित एडमिन एक्सेस',
    'landing.enterAdmin': 'एडमिन पोर्टल में जाएं',
    'landing.whyUs': 'फिश मार्ट क्यों?',
    'landing.whyUsSub': 'तमिलनाडु सीफूड डिलीवरी का सर्वोच्च मानक',
    'landing.whyUsDesc': 'हम शून्य रासायनिक मिलावट, सटीक तापमान नियंत्रण और उच्चतम स्वच्छता के साथ मछली प्रदान करते हैं।',
    'landing.deliveringAcross': 'तमिलनाडु भर में सेवारत',
    'landing.readyTitle': 'फिश मार्ट संचालन का प्रबंधन करें',
    'landing.readySub': 'रियल-टाइम एनालिटिक्स, उत्पाद कैटलॉग, डिलीवरी पार्टनर्स और ऑर्डर का पूर्ण नियंत्रण प्राप्त करें।',

    // Stats
    'stat.cities': 'शहर शामिल',
    'stat.orders': 'दैनिक ऑर्डर',
    'stat.species': 'ताजी प्रजातियां',
    'stat.harbours': 'हार्बर पार्टनर्स',
    'stat.avgTime': 'औसत समय',
    'stat.rating': 'ग्राहक रेटिंग',

    // Features
    'feat.bayOfBengal': 'बंगाल की खाड़ी की ताजगी',
    'feat.bayOfBengalDesc': 'कासिमेडु, कुड्डालोर और रामेश्वरम बंदरगाहों से रोजाना सीधे प्राप्त की जाती है।',
    'feat.express': '90 मिनट एक्सप्रेस डिलीवरी',
    'feat.expressDesc': 'विशेष कोल्ड-चेन फ्लीट द्वारा त्वरित और सुरक्षित डोरस्टेप डिलीवरी।',
    'feat.coldChain': '0-4°C कोल्ड चेन',
    'feat.coldChainDesc': 'ताजगी और पोषक तत्वों को सुरक्षित रखने के लिए निरंतर ठंडा तापमान।',
    'feat.expertCleaning': 'विशेषज्ञ सफाई और कटिंग',
    'feat.expertCleaningDesc': 'पपड़ी हटाकर, आंतें साफ कर पकाने के लिए पूरी तरह तैयार टुकड़े।',
    'feat.zeroChem': 'शून्य संरक्षक / रसायन',
    'feat.zeroChemDesc': '100% प्राकृतिक, फॉर्मेलिन रहित और सुरक्षित सीफूड की गारंटी।',
    'feat.liveTracking': 'रियल-टाइम फ्लीट ट्रैकिंग',
    'feat.liveTrackingDesc': 'ऑर्डर निकलने से लेकर ग्राहक के दरवाजे तक लाइव ट्रैकिंग।',

    // Login
    'login.title': 'एडमिन पोर्टल साइन इन',
    'login.desc': 'स्टोर प्रबंधन तक पहुंचने के लिए अपने व्यवस्थापक विवरण के साथ साइन इन करें।',
    'login.emailLabel': 'एडमिन ईमेल पता',
    'login.passLabel': 'सुरक्षा पासवर्ड',
    'login.submitBtn': 'एडमिन पोर्टल में साइन इन करें',
    'login.authenticating': 'प्रमाणीकरण जारी है...',

    // Dashboard Tabs
    'tab.analytics': 'राजस्व एवं लाभ विश्लेषण',
    'tab.products': 'उत्पाद कैटलॉग',
    'tab.orders': 'ग्राहक ऑर्डर',
    'tab.maps': 'डिलीवरी हब और मैप्स',
    'tab.delivery': 'डिलीवरी पार्टनर एवं फ्लीट',

    // Admin Dashboard - Stats & Controls
    'stat.grossSales': 'कुल बिक्री राजस्व',
    'stat.netProfit': 'शुद्ध परिकलित लाभ',
    'stat.inventoryUnits': 'इन्वेंट्री स्टॉक इकाइयां',
    'stat.avgOrderValue': 'औसत ऑर्डर मूल्य',
    'btn.addNewProduct': 'नया उत्पाद जोड़ें',
    'btn.refresh': 'डेटा रीफ्रेश करें',

    // Delivery Partner Tab
    'delivery.title': 'डिलीवरी फ्लीट एवं लॉजिस्टिक्स प्रबंधन',
    'delivery.subtitle': 'सक्रिय ऑर्डर असाइनमेंट, पिकअप स्थिति, ग्राहक समीक्षाएं और पार्टनर प्रोफाइल देखें।',
    'delivery.subTab.orders': 'असाइन किए गए ऑर्डर',
    'delivery.subTab.pickup': 'पिकअप स्थिति',
    'delivery.subTab.feedback': 'ग्राहक प्रतिक्रिया',
    'delivery.subTab.profiles': 'डिलीवरी पार्टनर प्रोफाइल',

    'delivery.partnerName': 'पार्टनर का नाम',
    'delivery.orderId': 'ऑर्डर संख्या',
    'delivery.customer': 'ग्राहक',
    'delivery.pickupStatus': 'पिकअप स्थिति',
    'delivery.deliveryStatus': 'डिलीवरी स्थिति',
    'delivery.eta': 'अनुमानित समय',
    'delivery.actions': 'कार्रवाई',
    'delivery.editProfile': 'प्रोफाइल संपादित करें',
    'delivery.activePartners': 'सक्रिय पार्टनर्स',
    'delivery.fleetRating': 'फ्लीट संतुष्टि',
    'delivery.onTimeRate': 'समय पर डिलीवरी दर',
    'delivery.pendingPickups': 'लंबित पिकअप',

    // Edit Partner Modal
    'modal.editPartner': 'डिलीवरी पार्टनर प्रोफाइल संपादित करें',
    'modal.name': 'पूरा नाम',
    'modal.phone': 'फ़ोन नंबर',
    'modal.email': 'ईमेल पता',
    'modal.address': 'सेवा पता / बेस हब',
    'modal.photo': 'प्रोफ़ाइल फोटो URL',
    'modal.vehicle': 'वाहन का प्रकार एवं पंजीकरण संख्या',
    'modal.zone': 'असाइन किया गया डिलीवरी क्षेत्र',
    'modal.save': 'प्रोफाइल सहेजें',
    'modal.cancel': 'रद्द करें'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('fm_lang') as Language
    return saved && ['en', 'ta', 'hi'].includes(saved) ? saved : 'en'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('fm_lang', lang)
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
