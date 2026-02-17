import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import { defaultCvData, labels, getLocalizedData } from "./data/cvData";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  Mail, Phone, Globe, Linkedin, MapPin, Calendar, Briefcase,
  GraduationCap, User, FileDown, Car, Heart, Flag, Edit, Eye,
  Save, Plus, Trash2, Upload, X, Lock, LogOut
} from "lucide-react";
import html2pdf from "html2pdf.js";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";

// Simple hardcoded password - change this to your desired password
const EDIT_PASSWORD = "mediha2024";

function App() {
  const [language, setLanguage] = useState("HR");
  const [editMode, setEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [cvData, setCvData] = useState(defaultCvData);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const cvRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check if already authenticated (session storage)
  useEffect(() => {
    const auth = sessionStorage.getItem("cv_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Load CV data from localStorage first, then try backend
  useEffect(() => {
    const loadCvData = async () => {
      try {
        // First try localStorage
        const savedData = localStorage.getItem("cv_data");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setCvData({ ...defaultCvData, ...parsed });
          setLoading(false);
          return;
        }
        // Then try backend (for Emergent/dev environment)
        if (BACKEND_URL) {
          const response = await fetch(`${BACKEND_URL}/api/cv-data`);
          if (response.ok) {
            const data = await response.json();
            if (data) {
              setCvData({ ...defaultCvData, ...data });
            }
          }
        }
      } catch (error) {
        console.log("Using default CV data");
      } finally {
        setLoading(false);
      }
    };
    loadCvData();
  }, []);

  // Handle login
  const handleLogin = () => {
    if (password === EDIT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("cv_authenticated", "true");
      setShowLoginModal(false);
      setEditMode(true);
      setPassword("");
      setLoginError("");
    } else {
      setLoginError(language === "HR" ? "Pogrešna šifra!" : "Wrong password!");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setEditMode(false);
    sessionStorage.removeItem("cv_authenticated");
  };

  // Handle edit button click
  const handleEditClick = () => {
    if (isAuthenticated) {
      setEditMode(true);
    } else {
      setShowLoginModal(true);
    }
  };

  // Get localized data
  const localizedData = getLocalizedData(cvData, language);
  const currentLabels = labels[language];

  // Save CV data
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/cv-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cvData),
      });
      if (response.ok) {
        setEditMode(false);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/upload-image`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setCvData(prev => ({ ...prev, profileImage: result.imageUrl }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  // Export PDF
  const handleExportPDF = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/export-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, cvData: localizedData }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Mediha_Dubravic_CV_Europass_${language}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        window.print();
      }
    } catch (error) {
      console.error("PDF export error:", error);
      window.print();
    }
  };

  // Update field
  const updateField = useCallback((field, value) => {
    setCvData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Update array item
  const updateArrayItem = useCallback((arrayName, index, field, value) => {
    setCvData(prev => {
      const newArray = [...(prev[arrayName] || [])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  }, []);

  // Add array item
  const addArrayItem = useCallback((arrayName, defaultItem) => {
    setCvData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), defaultItem]
    }));
  }, []);

  // Remove array item
  const removeArrayItem = useCallback((arrayName, index) => {
    setCvData(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName] || []).filter((_, i) => i !== index)
    }));
  }, []);

  // Add custom section
  const addCustomSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title_hr: "",
      title_en: "",
      content_hr: "",
      content_en: "",
      order: (cvData.customSections || []).length
    };
    setCvData(prev => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSection]
    }));
  };

  // Update custom section
  const updateCustomSection = (index, field, value) => {
    setCvData(prev => {
      const newSections = [...(prev.customSections || [])];
      newSections[index] = { ...newSections[index], [field]: value };
      return { ...prev, customSections: newSections };
    });
  };

  // Remove custom section
  const removeCustomSection = (index) => {
    setCvData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).filter((_, i) => i !== index)
    }));
  };

  const toggleLanguage = () => setLanguage(prev => prev === "HR" ? "EN" : "HR");

  const expArrayName = language === "HR" ? "experience_hr" : "experience_en";
  const eduArrayName = language === "HR" ? "education_hr" : "education_en";
  const skillsArrayName = language === "HR" ? "skills_hr" : "skills_en";

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="cv-app">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md print:hidden" data-testid="header">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl font-bold text-slate-900">{cvData.name}</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleLanguage} className="rounded-full px-4" data-testid="language-toggle">
              {language === "HR" ? "EN" : "HR"}
            </Button>
            {editMode ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  className="rounded-full px-4"
                  disabled={saving}
                  data-testid="save-btn"
                >
                  {saving ? "..." : <><Save className="w-4 h-4 mr-1" />{currentLabels.save}</>}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditMode(false)} className="rounded-full" data-testid="cancel-edit">
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className="rounded-full px-4"
                data-testid="edit-toggle"
              >
                {isAuthenticated ? (
                  <><Edit className="w-4 h-4 mr-1" />{currentLabels.editMode}</>
                ) : (
                  <><Lock className="w-4 h-4 mr-1" />{currentLabels.editMode}</>
                )}
              </Button>
            )}
            {isAuthenticated && !editMode && (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-full" title={language === "HR" ? "Odjava" : "Logout"} data-testid="logout-btn">
                <LogOut className="w-4 h-4" />
              </Button>
            )}
            <Button onClick={handleExportPDF} className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6" data-testid="export-pdf-btn">
              <FileDown className="w-4 h-4 mr-2" />{currentLabels.exportPdf}
            </Button>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              {language === "HR" ? "Prijava za uređivanje" : "Login to Edit"}
            </DialogTitle>
            <DialogDescription>
              {language === "HR" 
                ? "Unesite šifru za pristup uređivanju CV-a." 
                : "Enter the password to access CV editing."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="password"
              placeholder={language === "HR" ? "Šifra" : "Password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full"
              data-testid="password-input"
            />
            {loginError && (
              <p className="text-sm text-red-500" data-testid="login-error">{loginError}</p>
            )}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowLoginModal(false)}>
                {language === "HR" ? "Odustani" : "Cancel"}
              </Button>
              <Button onClick={handleLogin} data-testid="login-submit">
                {language === "HR" ? "Prijava" : "Login"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main ref={cvRef} className="max-w-5xl mx-auto px-4 md:px-8 py-12" id="cv-content">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16" data-testid="hero-section">
          <div className="flex-shrink-0 relative group">
            <img
              src={cvData.profileImage || defaultCvData.profileImage}
              alt={cvData.name}
              className="w-48 h-48 rounded-full object-cover border-4 border-slate-100 shadow-lg"
              data-testid="profile-image"
            />
            {editMode && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-8 h-8 text-white" />
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" data-testid="image-upload" />
              </div>
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            {editMode ? (
              <>
                <Input value={cvData.name} onChange={(e) => updateField("name", e.target.value)} className="font-serif text-3xl font-bold mb-2" placeholder="Ime" data-testid="edit-name" />
                <Input value={cvData[`title_${language.toLowerCase()}`]} onChange={(e) => updateField(`title_${language.toLowerCase()}`, e.target.value)} className="text-lg text-slate-600 mb-4" placeholder="Titula" data-testid="edit-title" />
              </>
            ) : (
              <>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-2">{cvData.name}</h1>
                <p className="text-xl text-slate-600 mb-4">{localizedData.title}</p>
              </>
            )}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-slate-600">
              {editMode ? (
                <>
                  <Input value={cvData.email} onChange={(e) => updateField("email", e.target.value)} className="w-auto" placeholder="Email" data-testid="edit-email" />
                  <Input value={cvData.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-auto" placeholder="Telefon" data-testid="edit-phone" />
                </>
              ) : (
                <>
                  <a href={`mailto:${cvData.email}`} className="flex items-center gap-1 hover:text-slate-900 transition-colors" data-testid="email-link">
                    <Mail className="w-4 h-4" />{cvData.email}
                  </a>
                  <a href={`tel:${cvData.phone}`} className="flex items-center gap-1 hover:text-slate-900 transition-colors" data-testid="phone-link">
                    <Phone className="w-4 h-4" />{cvData.phone}
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Left Column */}
          <aside className="md:col-span-4 space-y-8">
            {/* Contact Card */}
            <Card className="border-slate-200" data-testid="contact-card">
              <CardContent className="pt-6">
                <h2 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">{currentLabels.contact}</h2>
                <div className="space-y-3 text-sm">
                  {editMode ? (
                    <>
                      <Input value={cvData[`address_${language.toLowerCase()}`]} onChange={(e) => updateField(`address_${language.toLowerCase()}`, e.target.value)} placeholder={currentLabels.address} className="text-sm" />
                      <Input value={cvData.website} onChange={(e) => updateField("website", e.target.value)} placeholder="Website" className="text-sm" />
                      <Input value={cvData.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} placeholder="LinkedIn" className="text-sm" />
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" /><span className="text-slate-600">{localizedData.address}</span></div>
                      <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-slate-500 flex-shrink-0" /><a href={`mailto:${cvData.email}`} className="text-slate-600 hover:text-slate-900 transition-colors break-all">{cvData.email}</a></div>
                      <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-slate-500 flex-shrink-0" /><a href={`tel:${cvData.phone}`} className="text-slate-600 hover:text-slate-900 transition-colors">{cvData.phone}</a></div>
                      <div className="flex items-center gap-3"><Globe className="w-4 h-4 text-slate-500 flex-shrink-0" /><a href={cvData.website} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 transition-colors break-all">sos-english.hr</a></div>
                      <div className="flex items-center gap-3"><Linkedin className="w-4 h-4 text-slate-500 flex-shrink-0" /><a href={cvData.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 transition-colors">LinkedIn</a></div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personal Info Card */}
            <Card className="border-slate-200" data-testid="personal-info-card">
              <CardContent className="pt-6">
                <h2 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">{currentLabels.personalInfo}</h2>
                <div className="space-y-3 text-sm">
                  {editMode ? (
                    <>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-500" /><Input value={cvData.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} placeholder={currentLabels.dateOfBirth} className="text-sm flex-1" /></div>
                      <div className="flex items-center gap-2"><Flag className="w-4 h-4 text-slate-500" /><Input value={cvData[`citizenship_${language.toLowerCase()}`]} onChange={(e) => updateField(`citizenship_${language.toLowerCase()}`, e.target.value)} placeholder={currentLabels.citizenship} className="text-sm flex-1" /></div>
                      <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-500" /><Input value={cvData[`gender_${language.toLowerCase()}`]} onChange={(e) => updateField(`gender_${language.toLowerCase()}`, e.target.value)} placeholder={currentLabels.gender} className="text-sm flex-1" /></div>
                      <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-slate-500" /><Input value={cvData[`maritalStatus_${language.toLowerCase()}`]} onChange={(e) => updateField(`maritalStatus_${language.toLowerCase()}`, e.target.value)} placeholder={currentLabels.maritalStatus} className="text-sm flex-1" /></div>
                      <div className="flex items-center gap-2"><Car className="w-4 h-4 text-slate-500" /><Input value={cvData.drivingLicense} onChange={(e) => updateField("drivingLicense", e.target.value)} placeholder={currentLabels.drivingLicense} className="text-sm flex-1" /></div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" /><div><span className="text-slate-500">{currentLabels.dateOfBirth}:</span><span className="text-slate-700 ml-1">{cvData.dateOfBirth}</span></div></div>
                      <div className="flex items-center gap-3"><Flag className="w-4 h-4 text-slate-500 flex-shrink-0" /><div><span className="text-slate-500">{currentLabels.citizenship}:</span><span className="text-slate-700 ml-1">{localizedData.citizenship}</span></div></div>
                      <div className="flex items-center gap-3"><User className="w-4 h-4 text-slate-500 flex-shrink-0" /><div><span className="text-slate-500">{currentLabels.gender}:</span><span className="text-slate-700 ml-1">{localizedData.gender}</span></div></div>
                      <div className="flex items-center gap-3"><Heart className="w-4 h-4 text-slate-500 flex-shrink-0" /><div><span className="text-slate-500">{currentLabels.maritalStatus}:</span><span className="text-slate-700 ml-1">{localizedData.maritalStatus}</span></div></div>
                      <div className="flex items-center gap-3"><Car className="w-4 h-4 text-slate-500 flex-shrink-0" /><div><span className="text-slate-500">{currentLabels.drivingLicense}:</span><span className="text-slate-700 ml-1">{cvData.drivingLicense}</span></div></div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card className="border-slate-200" data-testid="skills-card">
              <CardContent className="pt-6">
                <h2 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">{currentLabels.skills}</h2>
                <div className="flex flex-wrap gap-2">
                  {(cvData[skillsArrayName] || []).map((skill, i) => (
                    <div key={i} className="relative group">
                      <Badge variant="secondary" className="bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100" data-testid={`skill-badge-${i}`}>
                        {editMode ? (
                          <Input value={skill} onChange={(e) => {
                            const newSkills = [...(cvData[skillsArrayName] || [])];
                            newSkills[i] = e.target.value;
                            updateField(skillsArrayName, newSkills);
                          }} className="h-6 w-24 text-xs p-1" />
                        ) : skill}
                      </Badge>
                      {editMode && (
                        <button onClick={() => removeArrayItem(skillsArrayName, i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <Button variant="outline" size="sm" onClick={() => addArrayItem(skillsArrayName, "")} className="h-6 text-xs" data-testid="add-skill-btn">
                      <Plus className="w-3 h-3 mr-1" />{currentLabels.addSkill}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Languages Card */}
            <Card className="border-slate-200" data-testid="languages-card">
              <CardContent className="pt-6">
                <h2 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">{currentLabels.languages}</h2>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">{currentLabels.motherTongue}</h3>
                  <p className="text-slate-600">{(localizedData.motherTongues || []).join(", ")}</p>
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">{currentLabels.otherLanguages}</h3>
                  <div className="space-y-2">
                    {(cvData.otherLanguages || []).map((lang, i) => (
                      <div key={i} className="flex items-center justify-between" data-testid={`language-item-${i}`}>
                        {editMode ? (
                          <>
                            <Input value={lang.name} onChange={(e) => updateArrayItem("otherLanguages", i, "name", e.target.value)} className="w-24 h-6 text-xs mr-2" placeholder={currentLabels.languageName} />
                            <Input value={lang.level} onChange={(e) => updateArrayItem("otherLanguages", i, "level", e.target.value)} className="w-12 h-6 text-xs mr-2" placeholder={currentLabels.languageLevel} />
                            <button onClick={() => removeArrayItem("otherLanguages", i)} className="text-red-500 hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
                          </>
                        ) : (
                          <>
                            <span className="text-slate-600 text-sm">{lang.name.split(" / ")[language === "HR" ? 0 : 1] || lang.name}</span>
                            <Badge variant="outline" className="text-xs font-semibold">{lang.level}</Badge>
                          </>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <Button variant="outline" size="sm" onClick={() => addArrayItem("otherLanguages", { name: "", level: "", listening: "", speaking: "", reading: "", writing: "" })} className="w-full h-6 text-xs mt-2" data-testid="add-language-btn">
                        <Plus className="w-3 h-3 mr-1" />{currentLabels.addLanguage}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Right Column */}
          <div className="md:col-span-8 space-y-12">
            {/* About Section */}
            <section data-testid="about-section">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-6">{currentLabels.about}</h2>
              {editMode ? (
                <Textarea value={cvData[`about_${language.toLowerCase()}`]} onChange={(e) => updateField(`about_${language.toLowerCase()}`, e.target.value)} className="min-h-[120px]" placeholder={currentLabels.about} data-testid="edit-about" />
              ) : (
                <p className="text-slate-600 leading-relaxed text-base">{localizedData.about}</p>
              )}
            </section>

            {/* Experience Section */}
            <section data-testid="experience-section">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6" />{currentLabels.experience}
              </h2>
              <div className="space-y-8">
                {(cvData[expArrayName] || []).map((exp, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-slate-200" data-testid={`experience-item-${i}`}>
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900" />
                    {editMode ? (
                      <div className="space-y-2 relative">
                        <button onClick={() => removeArrayItem(expArrayName, i)} className="absolute top-0 right-0 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                        <div className="grid grid-cols-2 gap-2">
                          <Input value={exp.dates} onChange={(e) => updateArrayItem(expArrayName, i, "dates", e.target.value)} placeholder={currentLabels.dates} className="text-sm" />
                          <Input value={exp.location} onChange={(e) => updateArrayItem(expArrayName, i, "location", e.target.value)} placeholder={currentLabels.location} className="text-sm" />
                        </div>
                        <Input value={exp.position} onChange={(e) => updateArrayItem(expArrayName, i, "position", e.target.value)} placeholder={currentLabels.position} className="font-semibold" />
                        <Input value={exp.company} onChange={(e) => updateArrayItem(expArrayName, i, "company", e.target.value)} placeholder={currentLabels.company} />
                        <Textarea value={exp.description} onChange={(e) => updateArrayItem(expArrayName, i, "description", e.target.value)} placeholder={currentLabels.description} className="text-sm min-h-[60px]" />
                        <Input value={exp.website || ""} onChange={(e) => updateArrayItem(expArrayName, i, "website", e.target.value)} placeholder={currentLabels.website} className="text-sm" />
                      </div>
                    ) : (
                      <>
                        <div className="mb-1">
                          <span className="text-sm text-slate-500">{exp.dates}</span>
                          <span className="text-sm text-slate-400 mx-2">•</span>
                          <span className="text-sm text-slate-500">{exp.location}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">{exp.position}</h3>
                        <p className="text-slate-700 font-medium mb-2">{exp.company}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
                        {exp.website && (
                          <a href={exp.website} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-700 mt-2 inline-flex items-center gap-1">
                            <Globe className="w-3 h-3" />{exp.website}
                          </a>
                        )}
                      </>
                    )}
                  </div>
                ))}
                {editMode && (
                  <Button variant="outline" onClick={() => addArrayItem(expArrayName, { dates: "", location: "", position: "", company: "", description: "", website: "" })} className="w-full" data-testid="add-experience-btn">
                    <Plus className="w-4 h-4 mr-2" />{currentLabels.addExperience}
                  </Button>
                )}
              </div>
            </section>

            {/* Education Section */}
            <section data-testid="education-section">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-6 flex items-center gap-3">
                <GraduationCap className="w-6 h-6" />{currentLabels.education}
              </h2>
              <div className="space-y-6">
                {(cvData[eduArrayName] || []).map((edu, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-slate-200" data-testid={`education-item-${i}`}>
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700" />
                    {editMode ? (
                      <div className="space-y-2 relative">
                        <button onClick={() => removeArrayItem(eduArrayName, i)} className="absolute top-0 right-0 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                        <div className="grid grid-cols-2 gap-2">
                          <Input value={edu.dates} onChange={(e) => updateArrayItem(eduArrayName, i, "dates", e.target.value)} placeholder={currentLabels.dates} className="text-sm" />
                          <Input value={edu.location} onChange={(e) => updateArrayItem(eduArrayName, i, "location", e.target.value)} placeholder={currentLabels.location} className="text-sm" />
                        </div>
                        <Input value={edu.degree} onChange={(e) => updateArrayItem(eduArrayName, i, "degree", e.target.value)} placeholder={currentLabels.degree} className="font-semibold" />
                        <Input value={edu.institution} onChange={(e) => updateArrayItem(eduArrayName, i, "institution", e.target.value)} placeholder={currentLabels.institution} />
                        <Input value={edu.website || ""} onChange={(e) => updateArrayItem(eduArrayName, i, "website", e.target.value)} placeholder={currentLabels.website} className="text-sm" />
                      </div>
                    ) : (
                      <>
                        <div className="mb-1">
                          <span className="text-sm text-slate-500">{edu.dates}</span>
                          <span className="text-sm text-slate-400 mx-2">•</span>
                          <span className="text-sm text-slate-500">{edu.location}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">{edu.degree}</h3>
                        <p className="text-slate-700 font-medium">{edu.institution}</p>
                        {edu.website && (
                          <a href={edu.website} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-700 mt-1 inline-flex items-center gap-1">
                            <Globe className="w-3 h-3" />{edu.website}
                          </a>
                        )}
                      </>
                    )}
                  </div>
                ))}
                {editMode && (
                  <Button variant="outline" onClick={() => addArrayItem(eduArrayName, { dates: "", location: "", degree: "", institution: "", website: "" })} className="w-full" data-testid="add-education-btn">
                    <Plus className="w-4 h-4 mr-2" />{currentLabels.addEducation}
                  </Button>
                )}
              </div>
            </section>

            {/* Custom Sections */}
            {(cvData.customSections || []).map((section, i) => (
              <section key={section.id || i} data-testid={`custom-section-${i}`}>
                {editMode ? (
                  <div className="space-y-4 p-4 border border-dashed border-slate-300 rounded-lg relative">
                    <button onClick={() => removeCustomSection(i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                    <Input value={language === "HR" ? section.title_hr : section.title_en} onChange={(e) => updateCustomSection(i, language === "HR" ? "title_hr" : "title_en", e.target.value)} placeholder={currentLabels.sectionTitle} className="font-serif text-xl font-bold" />
                    <Textarea value={language === "HR" ? section.content_hr : section.content_en} onChange={(e) => updateCustomSection(i, language === "HR" ? "content_hr" : "content_en", e.target.value)} placeholder={currentLabels.sectionContent} className="min-h-[100px]" />
                  </div>
                ) : (
                  <>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-6">
                      {language === "HR" ? section.title_hr : section.title_en}
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-base whitespace-pre-wrap">
                      {language === "HR" ? section.content_hr : section.content_en}
                    </p>
                  </>
                )}
              </section>
            ))}

            {/* Add Custom Section Button */}
            {editMode && (
              <Button variant="outline" onClick={addCustomSection} className="w-full border-dashed" data-testid="add-section-btn">
                <Plus className="w-4 h-4 mr-2" />{currentLabels.addSection}
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-8 mt-16 print:hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} {cvData.name}. Europass CV Format.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
