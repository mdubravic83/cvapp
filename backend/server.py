from fastapi import FastAPI, APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from io import BytesIO
import base64
import urllib.request

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class PDFExportRequest(BaseModel):
    language: str
    cvData: Dict[str, Any]

class ExperienceItem(BaseModel):
    dates: str = ""
    location: str = ""
    position: str = ""
    company: str = ""
    description: str = ""
    sector: Optional[str] = None
    website: Optional[str] = None

class EducationItem(BaseModel):
    dates: str = ""
    location: str = ""
    degree: str = ""
    institution: str = ""
    website: Optional[str] = None

class LanguageSkill(BaseModel):
    name: str = ""
    level: str = ""
    listening: str = ""
    speaking: str = ""
    reading: str = ""
    writing: str = ""

class CustomSection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title_hr: str = ""
    title_en: str = ""
    content_hr: str = ""
    content_en: str = ""
    order: int = 0

class CVDataUpdate(BaseModel):
    name: str = ""
    title_hr: str = ""
    title_en: str = ""
    dateOfBirth: str = ""
    citizenship_hr: str = ""
    citizenship_en: str = ""
    gender_hr: str = ""
    gender_en: str = ""
    address_hr: str = ""
    address_en: str = ""
    maritalStatus_hr: str = ""
    maritalStatus_en: str = ""
    children_hr: str = ""
    children_en: str = ""
    email: str = ""
    phone: str = ""
    website: str = ""
    linkedin: str = ""
    whatsapp: str = ""
    drivingLicense: str = ""
    profileImage: Optional[str] = None
    about_hr: str = ""
    about_en: str = ""
    experience_hr: List[ExperienceItem] = []
    experience_en: List[ExperienceItem] = []
    education_hr: List[EducationItem] = []
    education_en: List[EducationItem] = []
    motherTongues_hr: List[str] = []
    motherTongues_en: List[str] = []
    otherLanguages: List[LanguageSkill] = []
    skills_hr: List[str] = []
    skills_en: List[str] = []
    customSections: List[CustomSection] = []
    enableQRCode: bool = False
    qrCodeUrl: Optional[str] = None


@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

@api_router.get("/cv-data")
async def get_cv_data():
    cv_data = await db.cv_data.find_one({"type": "main_cv"}, {"_id": 0})
    return cv_data

@api_router.post("/cv-data")
async def save_cv_data(data: CVDataUpdate):
    cv_dict = data.model_dump()
    cv_dict["type"] = "main_cv"
    cv_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.cv_data.update_one({"type": "main_cv"}, {"$set": cv_dict}, upsert=True)
    return {"success": True, "message": "CV data saved successfully"}

@api_router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        base64_image = base64.b64encode(contents).decode('utf-8')
        mime_type = file.content_type or 'image/jpeg'
        data_url = f"data:{mime_type};base64,{base64_image}"
        return {"success": True, "imageUrl": data_url}
    except Exception as e:
        logging.error(f"Image upload error: {e}")
        return {"success": False, "error": str(e)}


@api_router.post("/export-pdf")
async def export_pdf(request: PDFExportRequest):
    """Generate PDF that visually matches the web CV layout"""
    try:
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import ParagraphStyle
        from reportlab.lib.units import cm, mm
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, HRFlowable
        from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY, TA_CENTER
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
        
        # Register fonts
        font_path = "/usr/share/fonts/truetype/dejavu/"
        pdfmetrics.registerFont(TTFont('DejaVu', font_path + 'DejaVuSans.ttf'))
        pdfmetrics.registerFont(TTFont('DejaVu-Bold', font_path + 'DejaVuSans-Bold.ttf'))
        pdfmetrics.registerFont(TTFont('DejaVu-Italic', font_path + 'DejaVuSans.ttf'))
        pdfmetrics.registerFont(TTFont('DejaVuSerif', font_path + 'DejaVuSerif.ttf'))
        pdfmetrics.registerFont(TTFont('DejaVuSerif-Bold', font_path + 'DejaVuSerif-Bold.ttf'))
        
        data = request.cvData
        language = request.language
        labels = data.get('labels', {})
        
        buffer = BytesIO()
        
        doc = SimpleDocTemplate(
            buffer, pagesize=A4,
            rightMargin=1.5*cm, leftMargin=1.5*cm,
            topMargin=1.5*cm, bottomMargin=1.5*cm
        )
        
        # Colors matching web
        slate_900 = colors.HexColor('#0f172a')
        slate_700 = colors.HexColor('#334155')
        slate_600 = colors.HexColor('#475569')
        slate_500 = colors.HexColor('#64748b')
        slate_200 = colors.HexColor('#e2e8f0')
        slate_100 = colors.HexColor('#f1f5f9')
        slate_50 = colors.HexColor('#f8fafc')
        
        # Styles
        name_style = ParagraphStyle('Name', fontName='DejaVuSerif-Bold', fontSize=24, textColor=slate_900, leading=28, spaceAfter=2*mm)
        title_style = ParagraphStyle('Title', fontName='DejaVu', fontSize=12, textColor=slate_600, leading=15, spaceAfter=3*mm)
        section_style = ParagraphStyle('Section', fontName='DejaVuSerif-Bold', fontSize=14, textColor=slate_900, leading=17, spaceBefore=6*mm, spaceAfter=3*mm)
        card_style = ParagraphStyle('Card', fontName='DejaVuSerif-Bold', fontSize=12, textColor=slate_900, leading=15, spaceAfter=2*mm)
        body_style = ParagraphStyle('Body', fontName='DejaVu', fontSize=9, textColor=slate_600, leading=12, alignment=TA_JUSTIFY, spaceAfter=2*mm)
        small_style = ParagraphStyle('Small', fontName='DejaVu', fontSize=8, textColor=slate_500, leading=11, spaceAfter=1*mm)
        value_style = ParagraphStyle('Value', fontName='DejaVu', fontSize=9, textColor=slate_700, leading=12, spaceAfter=1*mm)
        job_style = ParagraphStyle('Job', fontName='DejaVu-Bold', fontSize=10, textColor=slate_900, leading=13, spaceAfter=1*mm)
        company_style = ParagraphStyle('Company', fontName='DejaVu', fontSize=9, textColor=slate_700, leading=12, spaceAfter=1*mm)
        date_style = ParagraphStyle('Date', fontName='DejaVu', fontSize=8, textColor=slate_500, leading=10, spaceAfter=1*mm)
        footer_style = ParagraphStyle('Footer', fontName='DejaVu', fontSize=8, textColor=slate_500, alignment=TA_CENTER)
        
        story = []
        
        # === HEADER ===
        # Helper function to create circular image with border
        def create_circular_image(image_source, size_cm=3.5):
            from PIL import Image as PILImage, ImageDraw, ImageFilter
            
            try:
                # Load image from URL or base64
                if image_source.startswith('data:'):
                    # Base64 image
                    import base64
                    header, encoded = image_source.split(',', 1)
                    img_data = base64.b64decode(encoded)
                    img = PILImage.open(BytesIO(img_data))
                elif image_source.startswith('http'):
                    # URL image
                    img_data = urllib.request.urlopen(image_source, timeout=10).read()
                    img = PILImage.open(BytesIO(img_data))
                else:
                    return None
                
                # Convert to RGBA
                img = img.convert('RGBA')
                
                # Make square by cropping
                min_side = min(img.width, img.height)
                left = (img.width - min_side) // 2
                top = (img.height - min_side) // 2
                img = img.crop((left, top, left + min_side, top + min_side))
                
                # Resize to desired size (300px for good quality)
                size_px = 300
                img = img.resize((size_px, size_px), PILImage.Resampling.LANCZOS)
                
                # Create circular mask
                mask = PILImage.new('L', (size_px, size_px), 0)
                draw = ImageDraw.Draw(mask)
                draw.ellipse((0, 0, size_px, size_px), fill=255)
                
                # Apply mask to image
                output = PILImage.new('RGBA', (size_px, size_px), (255, 255, 255, 0))
                output.paste(img, (0, 0), mask)
                
                # Create larger canvas for border and shadow
                border_width = 8
                shadow_offset = 4
                canvas_size = size_px + border_width * 2 + shadow_offset * 2
                
                # Create canvas with white background
                canvas = PILImage.new('RGBA', (canvas_size, canvas_size), (255, 255, 255, 255))
                
                # Draw shadow (gray circle, slightly offset)
                shadow = PILImage.new('RGBA', (canvas_size, canvas_size), (255, 255, 255, 0))
                shadow_draw = ImageDraw.Draw(shadow)
                shadow_draw.ellipse(
                    (border_width + shadow_offset, border_width + shadow_offset,
                     size_px + border_width + shadow_offset, size_px + border_width + shadow_offset),
                    fill=(200, 200, 200, 100)
                )
                # Blur shadow
                shadow = shadow.filter(ImageFilter.GaussianBlur(radius=3))
                canvas = PILImage.alpha_composite(canvas, shadow)
                
                # Draw border circle (light gray)
                border_draw = ImageDraw.Draw(canvas)
                border_draw.ellipse(
                    (border_width - 2, border_width - 2, 
                     size_px + border_width + 2, size_px + border_width + 2),
                    fill=(241, 245, 249, 255),  # slate-100
                    outline=(226, 232, 240, 255),  # slate-200
                    width=4
                )
                
                # Paste circular image
                canvas.paste(output, (border_width, border_width), output)
                
                # Save to BytesIO
                output_buffer = BytesIO()
                canvas.save(output_buffer, format='PNG')
                output_buffer.seek(0)
                
                return Image(output_buffer, width=size_cm*cm, height=size_cm*cm)
            except Exception as e:
                logging.error(f"Error creating circular image: {e}")
                return None
        
        profile_img = None
        profile_url = data.get('profileImage', '')
        if profile_url:
            profile_img = create_circular_image(profile_url, 3.5)
        
        if profile_img:
            header_table = Table(
                [[profile_img, [
                    Paragraph(data.get('name', ''), name_style),
                    Paragraph(data.get('title', ''), title_style),
                    Paragraph(f"Email: {data.get('email', '')}   |   Tel: {data.get('phone', '')}", small_style),
                ]]],
                colWidths=[4*cm, 13*cm]
            )
            header_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ]))
            story.append(header_table)
        else:
            story.append(Paragraph(data.get('name', ''), name_style))
            story.append(Paragraph(data.get('title', ''), title_style))
            story.append(Paragraph(f"Email: {data.get('email', '')}   |   Tel: {data.get('phone', '')}", small_style))
        
        story.append(Spacer(1, 6*mm))
        story.append(HRFlowable(width="100%", thickness=1, color=slate_200))
        story.append(Spacer(1, 4*mm))
        
        # === CONTACT & PERSONAL INFO (Side by side) ===
        contact_text = f"""<b>{labels.get('contact', 'Kontakt')}</b><br/>
<b>Adresa:</b> {data.get('address', '')}<br/>
<b>Email:</b> {data.get('email', '')}<br/>
<b>Tel:</b> {data.get('phone', '')}<br/>
<b>Web:</b> sos-english.hr<br/>
<b>LinkedIn:</b> linkedin.com/in/mediha-dubravi"""

        personal_text = f"""<b>{labels.get('personalInfo', 'Osobni podaci')}</b><br/>
<b>{labels.get('dateOfBirth', 'Datum rođenja')}:</b> {data.get('dateOfBirth', '')}<br/>
<b>{labels.get('citizenship', 'Državljanstvo')}:</b> {data.get('citizenship', '')}<br/>
<b>{labels.get('gender', 'Spol')}:</b> {data.get('gender', '')}<br/>
<b>{labels.get('maritalStatus', 'Bračni status')}:</b> {data.get('maritalStatus', '')}<br/>
<b>{labels.get('drivingLicense', 'Vozačka dozvola')}:</b> {data.get('drivingLicense', '')}"""

        info_table = Table(
            [[Paragraph(contact_text, value_style), Paragraph(personal_text, value_style)]],
            colWidths=[8.5*cm, 8.5*cm]
        )
        info_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BACKGROUND', (0, 0), (-1, -1), slate_50),
            ('BOX', (0, 0), (-1, -1), 0.5, slate_200),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(info_table)
        
        # === ABOUT ===
        story.append(Paragraph(labels.get('about', 'O meni'), section_style))
        story.append(Paragraph(data.get('about', ''), body_style))
        
        # === EXPERIENCE ===
        story.append(Paragraph(labels.get('experience', 'Radno iskustvo'), section_style))
        
        for exp in data.get('experience', []):
            exp_block = [
                Paragraph(f"<font color='#64748b'>{exp.get('dates', '')} • {exp.get('location', '')}</font>", date_style),
                Paragraph(exp.get('position', ''), job_style),
                Paragraph(exp.get('company', ''), company_style),
                Paragraph(exp.get('description', ''), body_style),
            ]
            if exp.get('website'):
                exp_block.append(Paragraph(f"Web: {exp.get('website')}", small_style))
            exp_block.append(Spacer(1, 2*mm))
            story.append(KeepTogether(exp_block))
        
        # === EDUCATION ===
        story.append(Paragraph(labels.get('education', 'Obrazovanje'), section_style))
        
        for edu in data.get('education', []):
            edu_block = [
                Paragraph(f"<font color='#64748b'>{edu.get('dates', '')} • {edu.get('location', '')}</font>", date_style),
                Paragraph(edu.get('degree', ''), job_style),
                Paragraph(edu.get('institution', ''), company_style),
            ]
            if edu.get('website'):
                edu_block.append(Paragraph(f"Web: {edu.get('website')}", small_style))
            edu_block.append(Spacer(1, 2*mm))
            story.append(KeepTogether(edu_block))
        
        # === SKILLS & LANGUAGES (Side by side) ===
        skills = data.get('skills', [])
        skills_text = f"<b>{labels.get('skills', 'Vještine')}</b><br/>" + ' • '.join(skills) if skills else ""
        
        mother_tongues = data.get('motherTongues', [])
        other_languages = data.get('otherLanguages', [])
        
        lang_text = f"<b>{labels.get('languages', 'Jezici')}</b><br/>"
        if mother_tongues:
            lang_text += f"<b>{labels.get('motherTongue', 'Materinski')}:</b> {', '.join(mother_tongues)}<br/>"
        if other_languages:
            lang_text += f"<b>{labels.get('otherLanguages', 'Ostali')}:</b><br/>"
            for lang in other_languages:
                lang_name = lang.get('name', '').split(' / ')[0] if language == 'HR' else lang.get('name', '').split(' / ')[-1]
                lang_text += f"  {lang_name}: {lang.get('level', '')}<br/>"
        
        story.append(Spacer(1, 4*mm))
        
        skills_lang_table = Table(
            [[Paragraph(skills_text, value_style), Paragraph(lang_text, value_style)]],
            colWidths=[8.5*cm, 8.5*cm]
        )
        skills_lang_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BACKGROUND', (0, 0), (-1, -1), slate_50),
            ('BOX', (0, 0), (-1, -1), 0.5, slate_200),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(skills_lang_table)
        
        # === CUSTOM SECTIONS ===
        for section in data.get('customSections', []):
            title = section.get('title', '')
            content = section.get('content', '')
            if title and content:
                story.append(Paragraph(title, section_style))
                story.append(Paragraph(content, body_style))
        
        # === FOOTER ===
        story.append(Spacer(1, 8*mm))
        story.append(HRFlowable(width="100%", thickness=0.5, color=slate_200))
        story.append(Spacer(1, 3*mm))
        story.append(Paragraph(f"© {datetime.now().year} {data.get('name', '')} • Europass CV", footer_style))
        
        doc.build(story)
        buffer.seek(0)
        
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=Mediha_Dubravic_CV_Europass_{language}.pdf"}
        )
        
    except Exception as e:
        logging.error(f"PDF generation error: {e}")
        import traceback
        traceback.print_exc()
        return {"error": "Failed to generate PDF", "details": str(e)}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
