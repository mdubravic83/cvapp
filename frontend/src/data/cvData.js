// CV Data - Bilingual (Croatian / English)
// This is the default data structure - can be overridden by database

export const defaultCvData = {
  // Personal Info (shared)
  name: "Mediha Dubravić",
  dateOfBirth: "30/05/1986",
  email: "mediha.dubravic@gmail.com",
  phone: "(+385) 976483495",
  website: "https://sos-english.hr/en/",
  linkedin: "https://www.linkedin.com/in/mediha-dubravi",
  whatsapp: "00385976483495",
  drivingLicense: "B",
  profileImage: "https://images.unsplash.com/photo-1758685848147-e1e149bf2603?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc29yfGVufDB8fHx8MTc3MDA2MDExOXww&ixlib=rb-4.1.0&q=85",
  
  // Language-specific fields
  title_hr: "Magistra edukacije engleskog jezika i književnosti",
  title_en: "MA of English Language and Literature",
  
  citizenship_hr: "Hrvatsko",
  citizenship_en: "Croatian",
  
  gender_hr: "Žensko",
  gender_en: "Female",
  
  address_hr: "Zlatarska ulica 23, 10000 Zagreb, Hrvatska",
  address_en: "Zlatarska ulica 23, 10000 Zagreb, Croatia",
  
  maritalStatus_hr: "Udana",
  maritalStatus_en: "Married",
  
  children_hr: "Majka jedne kćeri",
  children_en: "Mother of one daughter",
  
  about_hr: "Magistra engleskog jezika i književnosti s iskustvom u poučavanju, instrukcijama, prevođenju i pisanju raznih sadržaja s engleskog na hrvatski i obrnuto. Samozaposlena posljednjih nekoliko godina u vlastitoj tvrtki S.O.S English, gdje je glavni fokus bio content marketing. Prethodna iskustva: rad u osnovnoj školi, rad u administraciji, te koordinacija edukativnog projekta. Živi u Zagrebu. Udana i majka jedne kćeri.",
  about_en: "MA of English language and literature with experience in teaching, instruction, translation, and writing various content from English to Croatian and vice versa. Last experience: self-employed in her own company S.O.S English, where content marketing was the main focus. Previously worked as a teacher in primary school, as an administrator, and as a project coordinator. Lives in Zagreb. Married and mother of one daughter.",
  
  // Experience HR
  experience_hr: [
    {
      dates: "01/01/2021 – 20/8/2025",
      location: "Zagreb, Hrvatska",
      position: "Vlasnica i direktorica, Prevoditeljica, Profesorica, Content writer",
      company: "S.O.S English j.d.o.o.",
      description: "Osnovala vlastitu tvrtku i bila zaposlena u istoj. Tvrtka je pružala usluge content marketinga i prevođenja sadržaja s engleskog na hrvatski i obrnuto. Također je nudila instrukcije za sve dobne skupine.",
      sector: "Obrazovanje",
      website: "https://sos-english.hr"
    },
    {
      dates: "2018 – 2021",
      location: "Opatija, Hrvatska",
      position: "Content writer",
      company: "MegaBooker d.o.o.",
      description: "Pisanje i prevođenje za potrebe tvrtke, održavanje bloga, rad na sadržaju."
    },
    {
      dates: "2016 – 2018",
      location: "Opatija, Hrvatska",
      position: "Content writer i prevoditeljica",
      company: "Adriaday turistička agencija",
      description: "Pisanje tekstova za potrebe turističke agencije. Prevođenje s engleskog na hrvatski i obrnuto."
    },
    {
      dates: "2008 – 2012",
      location: "Lukavac, Bosna i Hercegovina",
      position: "Učiteljica u osnovnoj školi - engleski jezik",
      company: "Osnovna škola \"Turija\"",
      description: "Rad s djecom svih uzrasta. Kreativna i empatična učiteljica. Radila 3 godine, položila stažistički ispit."
    },
    {
      dates: "01/07/2013 – 01/04/2014",
      location: "Rijeka, Hrvatska",
      position: "Tajnica vijeća, administrativni i tehnički poslovi",
      company: "Vijeće bošnjačke nacionalne manjine Grada Rijeke",
      description: "Tajnica vijeća, administrativni i tehnički poslovi vezani uz vođenje sjednica vijeća i organizaciju događanja."
    },
    {
      dates: "2005 – 2008",
      location: "Lukavac, Bosna i Hercegovina",
      position: "Koordinatorica obrazovnog projekta, Predavačica engleskog jezika, Prevoditeljica",
      company: "Volonterski rad",
      description: "Organiziranje i provođenje tečajeva. Prevođenje dokumenata. Suradnja s lokalnim tijelima vlasti i građanima. Suradnja sa Faith Regen Foundation London, nositeljem ovog obrazovnog projekta."
    }
  ],
  
  // Experience EN
  experience_en: [
    {
      dates: "01/01/2021 – present",
      location: "Zagreb, Croatia",
      position: "Owner and Director, Translator, Professor, Content Writer",
      company: "S.O.S English j.d.o.o.",
      description: "Founded her own company where she is employed. The company provides content marketing services and translation of content from English to Croatian and vice versa. Also offers tutoring for all age groups.",
      sector: "Education",
      website: "https://sos-english.hr"
    },
    {
      dates: "2018 – 2021",
      location: "Opatija, Croatia",
      position: "Content Writer",
      company: "MegaBooker d.o.o.",
      description: "Writing and translating for the company's needs, maintaining the blog, working on content."
    },
    {
      dates: "2016 – 2018",
      location: "Opatija, Croatia",
      position: "Content Writer and Translator",
      company: "Adriaday Travel Agency",
      description: "Writing texts for the needs of the tourist agency. Translating from English to Croatian and vice versa."
    },
    {
      dates: "2008 – 2012",
      location: "Lukavac, Bosnia and Herzegovina",
      position: "Primary School Teacher - English Language",
      company: "Primary School \"Turija\"",
      description: "Worked with children of all ages. Creative and empathetic teacher. Worked for 1 year and 8 months, completed the probationary exam."
    },
    {
      dates: "01/07/2013 – 01/04/2014",
      location: "Rijeka, Croatia",
      position: "Council Secretary, Administrative and Technical Tasks",
      company: "Council of the Bosniak National Minority of the City of Rijeka",
      description: "Council secretary, administrative and technical tasks related to managing council meetings and organizing events."
    },
    {
      dates: "2005 – 2008",
      location: "Lukavac, Bosnia and Herzegovina",
      position: "Educational Program Coordinator, English Language Lecturer, Translator",
      company: "Volunteer Work",
      description: "Organizing and conducting courses. Translating documents. Collaboration with local government bodies and citizens."
    }
  ],
  
  // Education HR
  education_hr: [
    {
      dates: "2015 – 2017",
      location: "Tuzla, Bosna i Hercegovina",
      degree: "Sveučilišni prvostupnik (baccalaureus/baccalaurea) ranog i predškolskog odgoja",
      institution: "Europsko sveučilište Kallos",
      website: "https://eukallos.edu.ba/"
    },
    {
      dates: "2004 – 2010",
      location: "Tuzla, Bosna i Hercegovina",
      degree: "Magistra engleskog jezika i književnosti",
      institution: "Sveučilište u Tuzli, Filozofski fakultet, BiH",
      website: "http://www.ff.untz.ba/"
    }
  ],
  
  // Education EN
  education_en: [
    {
      dates: "2015 – 2017",
      location: "Tuzla, Bosnia and Herzegovina",
      degree: "University Undergraduate (Baccalaureus/Baccalaurea) in Early and Preschool Education",
      institution: "European University Kallos",
      website: "https://eukallos.edu.ba/"
    },
    {
      dates: "2004 – 2010",
      location: "Tuzla, Bosnia and Herzegovina",
      degree: "Master of Arts in English Language and Literature",
      institution: "University of Tuzla, Faculty of Philosophy, BiH",
      website: "http://www.ff.untz.ba/"
    }
  ],
  
  // Languages
  motherTongues_hr: ["Bosanski", "Hrvatski"],
  motherTongues_en: ["Bosnian", "Croatian"],
  
  otherLanguages: [
    { name: "Engleski / English", level: "C2", listening: "C2", speaking: "C2", reading: "C2", writing: "C2" },
    { name: "Talijanski / Italian", level: "B1", listening: "B1", speaking: "B1", reading: "B1", writing: "B1" },
    { name: "Njemački / German", level: "B1", listening: "B1", speaking: "B1", reading: "B1", writing: "B1" },
    { name: "Francuski / French", level: "A2", listening: "A2", speaking: "A2", reading: "A2", writing: "A2" },
    { name: "Španjolski / Spanish", level: "A2", listening: "A2", speaking: "A2", reading: "A2", writing: "A2" },
    { name: "Arapski / Arabic", level: "A2", listening: "A2", speaking: "A2", reading: "A2", writing: "A2" }
  ],
  
  // Skills
  skills_hr: [
    "Content marketing",
    "Prevođenje",
    "Pisanje sadržaja",
    "Poučavanje engleskog jezika",
    "Instrukcije",
    "SEO optimizacija",
    "Blog pisanje",
    "Komunikacijske vještine",
    "Organizacija događanja"
  ],
  skills_en: [
    "Content Marketing",
    "Translation",
    "Content Writing",
    "English Language Teaching",
    "Tutoring",
    "SEO Optimization",
    "Blog Writing",
    "Communication Skills",
    "Event Organization"
  ],
  
  // Custom Sections (empty by default)
  customSections: [],
  
  // QR Code settings (for future use)
  enableQRCode: false,
  qrCodeUrl: null
};

// Labels for both languages
export const labels = {
  HR: {
    about: "O meni",
    experience: "Radno iskustvo",
    education: "Obrazovanje",
    languages: "Jezici",
    skills: "Vještine",
    contact: "Kontakt",
    personalInfo: "Osobni podaci",
    dateOfBirth: "Datum rođenja",
    citizenship: "Državljanstvo",
    gender: "Spol",
    maritalStatus: "Bračni status",
    address: "Adresa",
    drivingLicense: "Vozačka dozvola",
    exportPdf: "Izvezi PDF",
    motherTongue: "Materinski jezik",
    otherLanguages: "Ostali jezici",
    present: "danas",
    editMode: "Uredi",
    viewMode: "Pregled",
    save: "Spremi",
    cancel: "Odustani",
    addExperience: "Dodaj iskustvo",
    addEducation: "Dodaj obrazovanje",
    addSkill: "Dodaj vještinu",
    addLanguage: "Dodaj jezik",
    addSection: "Dodaj sekciju",
    removeItem: "Ukloni",
    uploadPhoto: "Učitaj sliku",
    customSection: "Prilagođena sekcija",
    sectionTitle: "Naslov sekcije",
    sectionContent: "Sadržaj sekcije",
    position: "Pozicija",
    company: "Tvrtka",
    location: "Lokacija",
    dates: "Datum",
    description: "Opis",
    degree: "Diploma/Stupanj",
    institution: "Institucija",
    website: "Web stranica",
    languageName: "Jezik",
    languageLevel: "Razina"
  },
  EN: {
    about: "About Me",
    experience: "Work Experience",
    education: "Education",
    languages: "Languages",
    skills: "Skills",
    contact: "Contact",
    personalInfo: "Personal Information",
    dateOfBirth: "Date of Birth",
    citizenship: "Citizenship",
    gender: "Gender",
    maritalStatus: "Marital Status",
    address: "Address",
    drivingLicense: "Driving License",
    exportPdf: "Export PDF",
    motherTongue: "Mother Tongue",
    otherLanguages: "Other Languages",
    present: "present",
    editMode: "Edit",
    viewMode: "View",
    save: "Save",
    cancel: "Cancel",
    addExperience: "Add Experience",
    addEducation: "Add Education",
    addSkill: "Add Skill",
    addLanguage: "Add Language",
    addSection: "Add Section",
    removeItem: "Remove",
    uploadPhoto: "Upload Photo",
    customSection: "Custom Section",
    sectionTitle: "Section Title",
    sectionContent: "Section Content",
    position: "Position",
    company: "Company",
    location: "Location",
    dates: "Dates",
    description: "Description",
    degree: "Degree",
    institution: "Institution",
    website: "Website",
    languageName: "Language",
    languageLevel: "Level"
  }
};

// Helper function to get language-specific data
export const getLocalizedData = (data, language) => {
  const suffix = `_${language.toLowerCase()}`;
  const altSuffix = language === 'HR' ? '_hr' : '_en';
  
  return {
    name: data.name,
    title: data[`title${altSuffix}`] || data.title_hr,
    dateOfBirth: data.dateOfBirth,
    citizenship: data[`citizenship${altSuffix}`] || data.citizenship_hr,
    gender: data[`gender${altSuffix}`] || data.gender_hr,
    address: data[`address${altSuffix}`] || data.address_hr,
    maritalStatus: data[`maritalStatus${altSuffix}`] || data.maritalStatus_hr,
    children: data[`children${altSuffix}`] || data.children_hr,
    email: data.email,
    phone: data.phone,
    website: data.website,
    linkedin: data.linkedin,
    whatsapp: data.whatsapp,
    drivingLicense: data.drivingLicense,
    profileImage: data.profileImage,
    about: data[`about${altSuffix}`] || data.about_hr,
    experience: data[`experience${altSuffix}`] || data.experience_hr || [],
    education: data[`education${altSuffix}`] || data.education_hr || [],
    motherTongues: data[`motherTongues${altSuffix}`] || data.motherTongues_hr || [],
    otherLanguages: data.otherLanguages || [],
    skills: data[`skills${altSuffix}`] || data.skills_hr || [],
    customSections: (data.customSections || []).map(s => ({
      ...s,
      title: language === 'HR' ? s.title_hr : s.title_en,
      content: language === 'HR' ? s.content_hr : s.content_en
    })),
    labels: labels[language],
    enableQRCode: data.enableQRCode,
    qrCodeUrl: data.qrCodeUrl
  };
};

export default defaultCvData;
