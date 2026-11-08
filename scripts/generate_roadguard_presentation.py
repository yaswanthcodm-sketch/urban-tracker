"""
Generator script for Urban Tracker & RoadGuard AI Municipal Presentation
Creates a high-impact, widescreen (16:9) PowerPoint presentation (.pptx)
tailored for Municipal Corporations, Smart City Missions, State PWD & NHAI.
"""

import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml import parse_xml

# ── Color Palette (High-Tech Cyber Dark) ──
BG_DARK = RGBColor(3, 12, 22)        # #030C16
CARD_BG = RGBColor(9, 26, 46)        # #091A2E
CARD_BORDER = RGBColor(26, 59, 92)   # #1A3B5C
CYAN = RGBColor(0, 240, 255)         # #00F0FF (Tech, Satellite, Precision)
AMBER = RGBColor(255, 153, 0)        # #FF9900 (Roads, Warnings, Hazards)
GREEN = RGBColor(16, 185, 129)       # #10B981 (Intact, Solved, Ticketed)
RED = RGBColor(239, 68, 68)          # #EF4444 (Critical Cavity, Danger)
WHITE = RGBColor(255, 255, 255)      # #FFFFFF
SLATE = RGBColor(148, 163, 184)      # #94A3B8 (Subtitle / Body)
MUTED = RGBColor(100, 116, 139)      # #64748B
NAVY_HEADER = RGBColor(15, 35, 60)   # #0F233C

# Asset paths
ARTIFACT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16'
IMG_ALL_CITIES = os.path.join(ARTIFACT_DIR, 'urban_tracker_all_cities_dark.png')
IMG_POTHOLE = os.path.join(ARTIFACT_DIR, 'urban_tracker_ai_pothole_detection.png')
IMG_GARBAGE = os.path.join(ARTIFACT_DIR, 'urban_tracker_ai_garbage_detection.png')
IMG_GRIEVANCE = os.path.join(ARTIFACT_DIR, 'urban_tracker_grievance_lodged.png')
IMG_SATELLITE = os.path.join(ARTIFACT_DIR, 'nuzvid_satellite_frame_raw.jpg')

def set_slide_background(slide, prs):
    """Sets a solid dark background on the slide."""
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_DARK
    bg.line.fill.background()
    return bg

def add_transition(slide, transition_xml_tag='fade'):
    """Injects OpenXML slide transition for native PowerPoint animation."""
    if transition_xml_tag == 'push_left':
        xml = '<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" spd="med"><p:push dir="l"/></p:transition>'
    elif transition_xml_tag == 'wipe_right':
        xml = '<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" spd="med"><p:wipe dir="r"/></p:transition>'
    elif transition_xml_tag == 'wheel':
        xml = '<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" spd="med"><p:wheel/></p:transition>'
    else:
        xml = '<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" spd="med"><p:fade/></p:transition>'
    
    transition = parse_xml(xml)
    slide._element.append(transition)

def add_header(slide, tag_text, title_text, tag_color=CYAN):
    """Adds a standard high-tech presentation header."""
    # Top decorative cyber line
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.03))
    line.fill.solid()
    line.fill.fore_color.rgb = tag_color
    line.line.fill.background()

    # Pill Tag
    tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.55), Inches(6.0), Inches(0.35))
    tf = tag_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.text = tag_text.upper()
    p.font.name = 'Consolas'
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = tag_color

    # Main Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.733), Inches(0.6))
    tf2 = title_box.text_frame
    tf2.word_wrap = True
    tf2.margin_left = tf2.margin_top = tf2.margin_right = tf2.margin_bottom = 0
    p2 = tf2.paragraphs[0]
    p2.text = title_text
    p2.font.name = 'Arial'
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = WHITE

def add_footer(slide, current_idx, total_slides=10):
    """Adds subtle operational footer with telemetry tag and slide number."""
    # Bottom separator line
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.95), Inches(11.733), Inches(0.015))
    line.fill.solid()
    line.fill.fore_color.rgb = CARD_BORDER
    line.line.fill.background()

    # Left telemetry
    box_l = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(8.0), Inches(0.3))
    tf_l = box_l.text_frame
    tf_l.margin_left = tf_l.margin_top = tf_l.margin_right = tf_l.margin_bottom = 0
    p_l = tf_l.paragraphs[0]
    p_l.text = "URBAN TRACKER & ROADGUARD AI  |  MUNICIPAL CIVIC INTELLIGENCE DECK  |  CONFIDENTIAL"
    p_l.font.name = 'Consolas'
    p_l.font.size = Pt(8.5)
    p_l.font.color.rgb = MUTED

    # Right slide number
    box_r = slide.shapes.add_textbox(Inches(10.5), Inches(7.0), Inches(2.0), Inches(0.3))
    tf_r = box_r.text_frame
    tf_r.margin_left = tf_r.margin_top = tf_r.margin_right = tf_r.margin_bottom = 0
    p_r = tf_r.paragraphs[0]
    p_r.alignment = PP_ALIGN.RIGHT
    p_r.text = f"{current_idx:02d} / {total_slides:02d}"
    p_r.font.name = 'Consolas'
    p_r.font.size = Pt(9)
    p_r.font.bold = True
    p_r.font.color.rgb = CYAN

def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER, border_width=1):
    """Draws a clean modern card shape."""
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    if border_color:
        card.line.color.rgb = border_color
        card.line.width = Pt(border_width)
    else:
        card.line.fill.background()
    return card

def build_presentation(output_path):
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]
    total_slides = 10

    print("🛠️ Generating Slide 1: Executive Title Slide...")
    # ── SLIDE 1: COVER ──
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, prs)
    add_transition(s1, 'fade')

    # Top Mission Status Pill
    status_card = add_card(s1, Inches(0.8), Inches(1.2), Inches(5.8), Inches(0.4), bg_color=RGBColor(0, 30, 45), border_color=CYAN)
    tf_s = status_card.text_frame
    tf_s.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_s = tf_s.paragraphs[0]
    p_s.text = "● LIVE SYSTEM ACTIVE  |  SMART CITY MISSION INITIATIVE"
    p_s.font.name = 'Consolas'
    p_s.font.size = Pt(10)
    p_s.font.bold = True
    p_s.font.color.rgb = CYAN

    # Big Title
    title_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.85), Inches(11.5), Inches(1.8))
    tf1 = title_box.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "URBAN TRACKER & ROADGUARD AI"
    p1.font.name = 'Arial'
    p1.font.size = Pt(40)
    p1.font.bold = True
    p1.font.color.rgb = WHITE

    p1_sub = tf1.add_paragraph()
    p1_sub.text = "Autonomous Satellite & AI-Powered Road Hazard Surveillance and Civic Grievance Automation for Smart Cities"
    p1_sub.font.name = 'Segoe UI'
    p1_sub.font.size = Pt(17)
    p1_sub.font.color.rgb = AMBER
    p1_sub.space_before = Pt(8)

    # Key Pillar Badges
    badges = [
        ("🛰️ SUB-METER SATELLITE OPTICS", CYAN),
        ("🕳️ REAL-TIME POTHOLE DETECTION", AMBER),
        ("🗑️ ROADSIDE GARBAGE SURVEILLANCE", RGBColor(245, 158, 11)),
        ("📝 INSTANT CIVIC GRIEVANCE DISPATCH", GREEN),
    ]
    b_left = Inches(0.8)
    for b_text, b_col in badges:
        card_b = add_card(s1, b_left, Inches(4.2), Inches(2.75), Inches(0.65), bg_color=CARD_BG, border_color=b_col)
        tf_b = card_b.text_frame
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        p_b.text = b_text
        p_b.font.name = 'Consolas'
        p_b.font.size = Pt(9.5)
        p_b.font.bold = True
        p_b.font.color.rgb = b_col
        b_left += Inches(2.95)

    # Executive Bottom Pitch Card
    info_card = add_card(s1, Inches(0.8), Inches(5.15), Inches(11.733), Inches(1.4), bg_color=CARD_BG, border_color=CARD_BORDER)
    tf_info = info_card.text_frame
    tf_info.word_wrap = True
    p_i1 = tf_info.paragraphs[0]
    p_i1.text = "TARGET CIVIC AUTHORITIES & INFRASTRUCTURE AGENCIES:"
    p_i1.font.name = 'Consolas'
    p_i1.font.size = Pt(10)
    p_i1.font.bold = True
    p_i1.font.color.rgb = CYAN

    p_i2 = tf_info.add_paragraph()
    p_i2.text = "• Municipal Corporations & Urban Local Bodies (ULBs)  |  • Smart Cities Mission Command Centers (ICCC)\n• State Roads & Buildings Dept (PWD)  |  • National Highways Authority of India (NHAI)  |  • PMGSY Rural Roads"
    p_i2.font.name = 'Segoe UI'
    p_i2.font.size = Pt(12.5)
    p_i2.font.color.rgb = SLATE
    p_i2.space_before = Pt(4)

    add_footer(s1, 1, total_slides)

    print("🛠️ Generating Slide 2: Problem Statement...")
    # ── SLIDE 2: PROBLEM STATEMENT ──
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, prs)
    add_transition(s2, 'push_left')
    add_header(s2, "🚨 PROBLEM STATEMENT — THE ROAD CRISIS", "The Urgent Crisis in Indian Urban & Rural Road Infrastructure", RED)

    # 3 Stat Cards
    metrics = [
        ("3,500+ Fatalities", "Annual Pothole Deaths in India", "Potholes and unmaintained road surfaces cause thousands of road fatalities and severe vehicle suspension damage every year.", RED),
        ("62M Tonnes Waste", "Roadside Garbage & Drain Clumping", "Unauthorized waste dumping along village tracks and urban corridors blocks stormwater drainage, triggering urban flash floods.", AMBER),
        ("14 - 28 Days Lag", "Manual Reporting & Bureaucracy", "Manual surveys are infrequent, citizen complaint portals lack exact coordinates, and jurisdictional finger-pointing delays repairs.", CYAN),
    ]

    m_left = Inches(0.8)
    for num, subtitle, desc, col in metrics:
        card = add_card(s2, m_left, Inches(1.65), Inches(3.7), Inches(2.6), bg_color=CARD_BG, border_color=col, border_width=1.5)
        tf = card.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = num
        p.font.name = 'Arial'
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = col

        p_sub = tf.add_paragraph()
        p_sub.text = subtitle.upper()
        p_sub.font.name = 'Consolas'
        p_sub.font.size = Pt(10)
        p_sub.font.bold = True
        p_sub.font.color.rgb = WHITE
        p_sub.space_before = Pt(4)

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.name = 'Segoe UI'
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = SLATE
        p_desc.space_before = Pt(8)

        m_left += Inches(4.0)

    # Bottom Synthesis Card
    bot_card = add_card(s2, Inches(0.8), Inches(4.55), Inches(11.733), Inches(2.1), bg_color=CARD_BG, border_color=CARD_BORDER)
    tf_b = bot_card.text_frame
    tf_b.word_wrap = True
    
    p_b1 = tf_b.paragraphs[0]
    p_b1.text = "CRITICAL BOTTLENECKS OF CONVENTIONAL CIVIC ROAD AUDITING:"
    p_b1.font.name = 'Consolas'
    p_b1.font.size = Pt(11)
    p_b1.font.bold = True
    p_b1.font.color.rgb = AMBER

    bullets = [
        "❌ Prohibitive Field Patrolling Costs: Cities cannot physically station inspection vehicles on every ward and village track daily.",
        "❌ Absence of Verifiable Optical Proof: Most citizen complaints provide vague landmarks with zero sub-meter satellite validation.",
        "❌ Fragmented Jurisdiction Confusion: Citizens don't know whether NHAI, PWD, or Municipal Corporation owns a damaged corridor.",
    ]
    for b in bullets:
        p_item = tf_b.add_paragraph()
        p_item.text = b
        p_item.font.name = 'Segoe UI'
        p_item.font.size = Pt(11.5)
        p_item.font.color.rgb = WHITE
        p_item.space_before = Pt(5)

    add_footer(s2, 2, total_slides)

    print("🛠️ Generating Slide 3: Solution Architecture...")
    # ── SLIDE 3: SYSTEM ARCHITECTURE ──
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, prs)
    add_transition(s3, 'push_left')
    add_header(s3, "💡 SYSTEM ARCHITECTURE & WORKFLOW", "Urban Tracker: Autonomous End-to-End Civic Surveillance Pipeline", CYAN)

    steps = [
        ("1. 3D Digital Twin", "CesiumJS Global Globe", "Renders photorealistic geospatial terrain with sub-second street navigation across all Indian administrative boundaries.", CYAN),
        ("2. Satellite Multi-Sensor", "Sub-Meter Optical Pass", "Pulls real-time sub-meter optical imagery and 1h/3h orbital loops from ESRI, ISRO INSAT-3D, and NOAA constellations.", AMBER),
        ("3. YOLOv8 AI Vision", "Dual-Hazard Classifier", "Ultralytics YOLOv8 inference identifies asphalt potholes, alligator cracks, edge breaks, and roadside garbage heaps.", RED),
        ("4. Automated Dispatch", "Civic Grievance Engine", "Instantly lodges official tracking tickets, assigns responsible authority (NHAI/PWD/ULB), and calculates repair priority.", GREEN),
    ]

    s_left = Inches(0.8)
    for title, sub, desc, col in steps:
        card = add_card(s3, s_left, Inches(1.65), Inches(2.75), Inches(4.9), bg_color=CARD_BG, border_color=col, border_width=1.5)
        tf = card.text_frame
        tf.word_wrap = True
        
        # Step header
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = 'Arial'
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = col

        p_sub = tf.add_paragraph()
        p_sub.text = sub.upper()
        p_sub.font.name = 'Consolas'
        p_sub.font.size = Pt(9.5)
        p_sub.font.bold = True
        p_sub.font.color.rgb = WHITE
        p_sub.space_before = Pt(4)

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.name = 'Segoe UI'
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = SLATE
        p_desc.space_before = Pt(12)

        # Tech stack pill at bottom
        p_tech = tf.add_paragraph()
        p_tech.text = "CORE CAPABILITY:"
        p_tech.font.name = 'Consolas'
        p_tech.font.size = Pt(8.5)
        p_tech.font.bold = True
        p_tech.font.color.rgb = col
        p_tech.space_before = Pt(20)

        s_left += Inches(3.0)

    add_footer(s3, 3, total_slides)

    print("🛠️ Generating Slide 4: All Cities & Towns Road Scanner...")
    # ── SLIDE 4: UNIVERSAL LOCALITY ENGINE ──
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, prs)
    add_transition(s4, 'wipe_right')
    add_header(s4, "🌐 PAN-INDIA COVERAGE & LOCALITY SCANNER", "Reading Each & Every Road in Any City, Town, or Village", AMBER)

    # Left text card
    left_card = add_card(s4, Inches(0.8), Inches(1.65), Inches(5.4), Inches(4.9), bg_color=CARD_BG, border_color=AMBER)
    tf_l = left_card.text_frame
    tf_l.word_wrap = True

    p_l1 = tf_l.paragraphs[0]
    p_l1.text = "UNIVERSAL ROAD NETWORK HARVESTING:"
    p_l1.font.name = 'Consolas'
    p_l1.font.size = Pt(11)
    p_l1.font.bold = True
    p_l1.font.color.rgb = AMBER

    bullets_l = [
        ("Instant 0ms Locality Switcher", "Pre-calibrated high-density databases for Tier-1/2 metros (Delhi, Mumbai, Bengaluru, Hyderabad, Vijayawada, Nuzvid, etc.)."),
        ("Procedural Mesh for Any Village", "Dynamic procedural road generator guarantees complete coverage for rural Gram Panchayats (PMGSY roads, agricultural tracks)."),
        ("Live Overpass OSM Sync", "Asynchronous querying merges live OpenStreetMap road network geometry, surface types, lane counts, and speed limits."),
        ("Multi-Tier Road Classification", "Sorts and filters instantly by Highways & Arterials, Residential Streets, Service Lanes, and Village Tracks."),
    ]

    for b_title, b_body in bullets_l:
        p_t = tf_l.add_paragraph()
        p_t.text = f"• {b_title}"
        p_t.font.name = 'Arial'
        p_t.font.size = Pt(12.5)
        p_t.font.bold = True
        p_t.font.color.rgb = WHITE
        p_t.space_before = Pt(10)

        p_b = tf_l.add_paragraph()
        p_b.text = b_body
        p_b.font.name = 'Segoe UI'
        p_b.font.size = Pt(10.5)
        p_b.font.color.rgb = SLATE

    # Right Image Card: Live screenshot
    img_card = add_card(s4, Inches(6.5), Inches(1.65), Inches(6.033), Inches(4.9), bg_color=CARD_BG, border_color=CARD_BORDER)
    if os.path.exists(IMG_ALL_CITIES):
        s4.shapes.add_picture(IMG_ALL_CITIES, Inches(6.55), Inches(1.7), Inches(5.933), Inches(4.4))
        
        cap_box = s4.shapes.add_textbox(Inches(6.55), Inches(6.15), Inches(5.933), Inches(0.35))
        tf_c = cap_box.text_frame
        p_c = tf_c.paragraphs[0]
        p_c.alignment = PP_ALIGN.CENTER
        p_c.text = "Fig 1: Live Road Catalog Drawer with City Switcher Chips & Real Road Defect Tags"
        p_c.font.name = 'Consolas'
        p_c.font.size = Pt(8.5)
        p_c.font.color.rgb = CYAN

    add_footer(s4, 4, total_slides)

    print("🛠️ Generating Slide 5: Dual-Class AI Detection Engine...")
    # ── SLIDE 5: DUAL AI DETECTION ──
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, prs)
    add_transition(s5, 'push_left')
    add_header(s5, "⚡ COMPUTER VISION & HAZARD AUDITING", "Precision AI Classifiers: Pothole Cavities vs. Roadside Waste Dumps", CYAN)

    # Left: Pothole Detection
    c1 = add_card(s5, Inches(0.8), Inches(1.65), Inches(5.7), Inches(4.9), bg_color=CARD_BG, border_color=RED, border_width=1.5)
    tf1 = c1.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "🕳️ POTHOLE & DAMAGE CLASSIFIER"
    p1.font.name = 'Arial'
    p1.font.size = Pt(14)
    p1.font.bold = True
    p1.font.color.rgb = RED

    p1_d = tf1.add_paragraph()
    p1_d.text = "• Identifies asphalt cavities, edge erosion, alligator cracking, and transverse joint fatigue.\n• Determines damage severity grade: Low (cracking) to High (Grade 3 deep cavity).\n• Generates automated engineering repair specs (Cold Patching & Surface Milling).\n• Precision confidence score: 94.2% verified inference."
    p1_d.font.name = 'Segoe UI'
    p1_d.font.size = Pt(10.5)
    p1_d.font.color.rgb = SLATE
    p1_d.space_before = Pt(4)

    if os.path.exists(IMG_POTHOLE):
        s5.shapes.add_picture(IMG_POTHOLE, Inches(0.9), Inches(3.4), Inches(5.5), Inches(2.95))

    # Right: Garbage Track Detection
    c2 = add_card(s5, Inches(6.8), Inches(1.65), Inches(5.7), Inches(4.9), bg_color=CARD_BG, border_color=AMBER, border_width=1.5)
    tf2 = c2.text_frame
    tf2.word_wrap = True
    p2 = tf2.paragraphs[0]
    p2.text = "🗑️ ROADSIDE GARBAGE TRACK DETECTOR"
    p2.font.name = 'Arial'
    p2.font.size = Pt(14)
    p2.font.bold = True
    p2.font.color.rgb = AMBER

    p2_d = tf2.add_paragraph()
    p2_d.text = "• Scans road shoulders and canal bund tracks for unauthorized solid waste accumulation.\n• Distinguishes organic market scatter from hazardous construction debris.\n• Alerts Municipal Sanitation squad before waste dumps clog municipal stormwater lines.\n• Coordinates GPS tracking tag to direct municipal collection trucks."
    p2_d.font.name = 'Segoe UI'
    p2_d.font.size = Pt(10.5)
    p2_d.font.color.rgb = SLATE
    p2_d.space_before = Pt(4)

    if os.path.exists(IMG_GARBAGE):
        s5.shapes.add_picture(IMG_GARBAGE, Inches(6.9), Inches(3.4), Inches(5.5), Inches(2.95))

    add_footer(s5, 5, total_slides)

    print("🛠️ Generating Slide 6: Genuine Satellite Optical Surveillance...")
    # ── SLIDE 6: SATELLITE OPTICS ──
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, prs)
    add_transition(s6, 'fade')
    add_header(s6, "🛰️ SATELLITE RECONNAISSANCE PASS", "Sub-Meter Optical Imagery & 1-Hour/3-Hour Orbital Surveillance", CYAN)

    # Left: Real Satellite Photo
    card_sat = add_card(s6, Inches(0.8), Inches(1.65), Inches(5.6), Inches(4.9), bg_color=CARD_BG, border_color=CYAN)
    if os.path.exists(IMG_SATELLITE):
        s6.shapes.add_picture(IMG_SATELLITE, Inches(0.9), Inches(1.75), Inches(5.4), Inches(4.2))
        
        c_lbl = s6.shapes.add_textbox(Inches(0.9), Inches(6.05), Inches(5.4), Inches(0.4))
        p_cl = c_lbl.text_frame.paragraphs[0]
        p_cl.alignment = PP_ALIGN.CENTER
        p_cl.text = "Sub-Meter Satellite Optical Frame (Mylavaram - Nuzvid Road @ 16.7865° N, 80.8465° E)"
        p_cl.font.name = 'Consolas'
        p_cl.font.size = Pt(8.5)
        p_cl.font.color.rgb = CYAN

    # Right: Technical Satellite Specs
    card_spec = add_card(s6, Inches(6.7), Inches(1.65), Inches(5.833), Inches(4.9), bg_color=CARD_BG, border_color=CARD_BORDER)
    tf_sp = card_spec.text_frame
    tf_sp.word_wrap = True

    p_sp1 = tf_sp.paragraphs[0]
    p_sp1.text = "ZERO SYNTHETIC/STOCK PHOTOS — AUDITABLE FORENSICS:"
    p_sp1.font.name = 'Consolas'
    p_sp1.font.size = Pt(11)
    p_sp1.font.bold = True
    p_sp1.font.color.rgb = CYAN

    sat_points = [
        ("Genuine Sub-Meter Optical Capture", "Direct high-resolution optical exports from ESRI World Imagery centered at the road's exact geographic coordinates."),
        ("1-Hour & 3-Hour Regional Loops", "Selects the optimal regional satellite source automatically based on coordinates (ISRO INSAT-3D for South Asia, NOAA GOES-19 for Americas, NASA VIIRS global swaths)."),
        ("12-Frame Time Scrubbing", "Civic engineers can scrub across 12 distinct orbital passes (-3h, -2h, -1h, LIVE) to observe degradation progression over time."),
        ("Multimodal CCTV Ground Truth", "Cross-checks satellite anomaly detections with real-time municipal traffic CCTV video feeds."),
    ]

    for title_s, desc_s in sat_points:
        p_st = tf_sp.add_paragraph()
        p_st.text = f"✔ {title_s}"
        p_st.font.name = 'Arial'
        p_st.font.size = Pt(12)
        p_st.font.bold = True
        p_st.font.color.rgb = WHITE
        p_st.space_before = Pt(8)

        p_sd = tf_sp.add_paragraph()
        p_sd.text = desc_s
        p_sd.font.name = 'Segoe UI'
        p_sd.font.size = Pt(10.5)
        p_sd.font.color.rgb = SLATE

    add_footer(s6, 6, total_slides)

    print("🛠️ Generating Slide 7: Automated Civic Grievance Redressal...")
    # ── SLIDE 7: CIVIC GRIEVANCE AUTOMATION ──
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, prs)
    add_transition(s7, 'push_left')
    add_header(s7, "🏛️ CIVIC GRIEVANCE & JURISDICTION ROUTING", "Automated Ticketing Engine with Intelligent Authority Auto-Routing", GREEN)

    # Left: Authority Mapping
    card_auth = add_card(s7, Inches(0.8), Inches(1.65), Inches(5.6), Inches(4.9), bg_color=CARD_BG, border_color=GREEN)
    tf_au = card_auth.text_frame
    tf_au.word_wrap = True

    p_au = tf_au.paragraphs[0]
    p_au.text = "INTELLIGENT JURISDICTION AUTO-ROUTING:"
    p_au.font.name = 'Consolas'
    p_au.font.size = Pt(11)
    p_au.font.bold = True
    p_au.font.color.rgb = GREEN

    routes = [
        ("Expressways & Trunks", "National Highways Authority of India (NHAI)", "High-speed asphalt cavities routed directly to NHAI regional project director."),
        ("State Highways & MDRs", "State Roads & Buildings Dept (PWD)", "Major district corridors and state arterial highways dispatched to Divisional PWD engineer."),
        ("Residential Streets & Bazaars", "Municipal Corporation / Urban Local Bodies", "Urban ward roads and commercial bazaar streets routed to City Municipal Commissioner."),
        ("Village Tracks & Panchayats", "Panchayat Raj & PMGSY Engineering", "Rural connectivity roads and farm-to-market tracks routed to PMGSY executive engineer."),
    ]

    for cat_r, ag_r, det_r in routes:
        p_rt = tf_au.add_paragraph()
        p_rt.text = f"📍 {cat_r} ➔ {ag_r}"
        p_rt.font.name = 'Arial'
        p_rt.font.size = Pt(11.5)
        p_rt.font.bold = True
        p_rt.font.color.rgb = WHITE
        p_rt.space_before = Pt(8)

        p_rd = tf_au.add_paragraph()
        p_rd.text = det_r
        p_rd.font.name = 'Segoe UI'
        p_rd.font.size = Pt(10)
        p_rd.font.color.rgb = SLATE

    # Right: Live Grievance Ticket Screenshot
    card_tk = add_card(s7, Inches(6.7), Inches(1.65), Inches(5.833), Inches(4.9), bg_color=CARD_BG, border_color=CARD_BORDER)
    if os.path.exists(IMG_GRIEVANCE):
        s7.shapes.add_picture(IMG_GRIEVANCE, Inches(6.75), Inches(1.75), Inches(5.733), Inches(4.2))
        
        cap_t = s7.shapes.add_textbox(Inches(6.75), Inches(6.05), Inches(5.733), Inches(0.4))
        p_ct = cap_t.text_frame.paragraphs[0]
        p_ct.alignment = PP_ALIGN.CENTER
        p_ct.text = "Official Grievance Registration with Public Tracking Ticket (RG-2026-IN-8821)"
        p_ct.font.name = 'Consolas'
        p_ct.font.size = Pt(8.5)
        p_ct.font.color.rgb = GREEN

    add_footer(s7, 7, total_slides)

    print("🛠️ Generating Slide 8: Dual-Mode Ergonomics...")
    # ── SLIDE 8: DUAL-MODE ERGONOMICS ──
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, prs)
    add_transition(s8, 'wipe_right')
    add_header(s8, "🎨 OPERATIONAL ERGONOMICS & USABILITY", "Dual Interface Modes: Tactical Dark Room vs. Pure White Paper Sunlight", CYAN)

    # Left: High-Tech Tactical Ops Dark Mode
    card_dm = add_card(s8, Inches(0.8), Inches(1.65), Inches(5.7), Inches(4.9), bg_color=CARD_BG, border_color=CYAN, border_width=1.5)
    tf_dm = card_dm.text_frame
    tf_dm.word_wrap = True

    p_dm = tf_dm.paragraphs[0]
    p_dm.text = "🌑 TACTICAL OPS DARK MODE"
    p_dm.font.name = 'Arial'
    p_dm.font.size = Pt(14)
    p_dm.font.bold = True
    p_dm.font.color.rgb = CYAN

    p_dmb = tf_dm.add_paragraph()
    p_dmb.text = "• Optimized for Municipal Command & Control Centers (ICCC).\n• High-contrast neon cyan and amber reduce eye fatigue during 24/7 continuous operations.\n• Deep black space background accentuates glowing road damage markers and live telemetry.\n• Real-time CCTV and satellite video playback seamlessly blend into dark background."
    p_dmb.font.name = 'Segoe UI'
    p_dmb.font.size = Pt(11)
    p_dmb.font.color.rgb = SLATE
    p_dmb.space_before = Pt(8)

    # Right: Pure White Paper Mode
    card_lm = add_card(s8, Inches(6.8), Inches(1.65), Inches(5.7), Inches(4.9), bg_color=RGBColor(248, 250, 252), border_color=RGBColor(203, 213, 225), border_width=1.5)
    tf_lm = card_lm.text_frame
    tf_lm.word_wrap = True

    p_lm = tf_lm.paragraphs[0]
    p_lm.text = "☀️ PURE WHITE PAPER SUNLIGHT MODE"
    p_lm.font.name = 'Arial'
    p_lm.font.size = Pt(14)
    p_lm.font.bold = True
    p_lm.font.color.rgb = RGBColor(15, 23, 42)

    p_lmb = tf_lm.add_paragraph()
    p_lmb.text = "• Engineered specifically for field engineers and municipal inspection officers on mobile tablets.\n• Pure paper white (#FFFFFF) across the entire screen and Cesium 3D background.\n• High-contrast slate typography (#0F172A) remains 100% glare-free under direct Indian sunlight.\n• Print-ready export format for official civic reports, audit dossiers, and municipal tenders."
    p_lmb.font.name = 'Segoe UI'
    p_lmb.font.size = Pt(11)
    p_lmb.font.color.rgb = RGBColor(71, 85, 105)
    p_lmb.space_before = Pt(8)

    add_footer(s8, 8, total_slides)

    print("🛠️ Generating Slide 9: Measurable Civic Impact & ROI...")
    # ── SLIDE 9: CIVIC IMPACT & ROI ──
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, prs)
    add_transition(s9, 'push_left')
    add_header(s9, "📈 CIVIC IMPACT, METRICS & MUNICIPAL ROI", "Delivering 80% Cost Reduction & Proactive Road Asset Protection", GREEN)

    kpis = [
        ("80% Cost Reduction", "Survey & Patrol Overhead", "Replaces manual road inspection convoys with continuous satellite & AI automated sweeps.", GREEN),
        ("3.5x Capital Savings", "Proactive vs. Reactive Repairs", "Detects micro-cracks before monsoon ingress destroys the underlying road sub-base.", CYAN),
        ("< 200ms Latency", "Real-Time AI Inference Speed", "Ultralytics YOLOv8 backend delivers instantaneous defect localization without lagging municipal systems.", AMBER),
        ("100% Auditable", "Forensic Transparency", "Every grievance is permanently indexed with exact GPS coordinates, timestamp, and raw satellite frames.", WHITE),
    ]

    k_left = Inches(0.8)
    for num, lbl, det, col in kpis:
        card = add_card(s9, k_left, Inches(1.65), Inches(2.75), Inches(3.2), bg_color=CARD_BG, border_color=col, border_width=1.5)
        tf = card.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = num
        p.font.name = 'Arial'
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = col

        p_lbl = tf.add_paragraph()
        p_lbl.text = lbl.upper()
        p_lbl.font.name = 'Consolas'
        p_lbl.font.size = Pt(9.5)
        p_lbl.font.bold = True
        p_lbl.font.color.rgb = WHITE
        p_lbl.space_before = Pt(4)

        p_det = tf.add_paragraph()
        p_det.text = det
        p_det.font.name = 'Segoe UI'
        p_det.font.size = Pt(10.5)
        p_det.font.color.rgb = SLATE
        p_det.space_before = Pt(10)

        k_left += Inches(3.0)

    # Bottom Benchmarking Card
    bench_card = add_card(s9, Inches(0.8), Inches(5.1), Inches(11.733), Inches(1.55), bg_color=CARD_BG, border_color=CARD_BORDER)
    tf_bn = bench_card.text_frame
    tf_bn.word_wrap = True

    p_bn1 = tf_bn.paragraphs[0]
    p_bn1.text = "BENCHMARK: MANUAL INSPECTION vs. URBAN TRACKER AUTONOMOUS PIPELINE"
    p_bn1.font.name = 'Consolas'
    p_bn1.font.size = Pt(10)
    p_bn1.font.bold = True
    p_bn1.font.color.rgb = CYAN

    p_bn2 = tf_bn.add_paragraph()
    p_bn2.text = "• Traditional Process: Citizen encounters pothole ➔ Files complaint ➔ Field officer inspects after 7-14 days ➔ Approval lag ➔ Patching done after 30+ days.\n• Urban Tracker Process: Satellite/AI flags pothole at 00:00 ➔ Auto-routed to PWD/ULB instantly ➔ Contractor notified with GPS coordinates within minutes."
    p_bn2.font.name = 'Segoe UI'
    p_bn2.font.size = Pt(10.5)
    p_bn2.font.color.rgb = WHITE
    p_bn2.space_before = Pt(4)

    add_footer(s9, 9, total_slides)

    print("🛠️ Generating Slide 10: Deployment Roadmap & Conclusion...")
    # ── SLIDE 10: DEPLOYMENT ROADMAP ──
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, prs)
    add_transition(s10, 'fade')
    add_header(s10, "🚀 DEPLOYMENT ROADMAP & NEXT STEPS", "Phased Smart City Rollout & Institutional Integration Plan", CYAN)

    phases = [
        ("PHASE 1: PILOT LAUNCH", "Months 1 - 2", [
            "Deploy Urban Tracker in 5 high-density municipal wards.",
            "Baseline high-resolution satellite scan of all arterial roads.",
            "Calibrate YOLOv8 AI models to local asphalt textures and waste types.",
        ], CYAN),
        ("PHASE 2: MUNICIPAL INTEGRATION", "Months 3 - 4", [
            "Direct API integration with PWD & Municipal grievance databases.",
            "Automated dispatch routing to sanitation and road repair contractor crews.",
            "Rollout of field engineer tablet application in Pure White Paper mode.",
        ], AMBER),
        ("PHASE 3: STATE-WIDE EXPANSION", "Months 5+", [
            "Integration into State Integrated Command & Control Center (ICCC).",
            "Public transparency portal for citizens to track road repair SLAs.",
            "Predictive asphalt fatigue analytics using multi-temporal satellite data.",
        ], GREEN),
    ]

    p_left = Inches(0.8)
    for p_title, p_time, items, col in phases:
        card = add_card(s10, p_left, Inches(1.65), Inches(3.7), Inches(3.4), bg_color=CARD_BG, border_color=col, border_width=1.5)
        tf = card.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = p_title
        p.font.name = 'Arial'
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col

        p_t = tf.add_paragraph()
        p_t.text = p_time.upper()
        p_t.font.name = 'Consolas'
        p_t.font.size = Pt(9.5)
        p_t.font.bold = True
        p_t.font.color.rgb = WHITE
        p_t.space_before = Pt(2)

        for it in items:
            p_it = tf.add_paragraph()
            p_it.text = f"• {it}"
            p_it.font.name = 'Segoe UI'
            p_it.font.size = Pt(10.5)
            p_it.font.color.rgb = SLATE
            p_it.space_before = Pt(6)

        p_left += Inches(4.0)

    # Bottom Call to Action Card
    cta_card = add_card(s10, Inches(0.8), Inches(5.25), Inches(11.733), Inches(1.4), bg_color=RGBColor(0, 30, 48), border_color=CYAN, border_width=1.5)
    tf_cta = cta_card.text_frame
    tf_cta.word_wrap = True

    p_c1 = tf_cta.paragraphs[0]
    p_c1.text = "JOIN US IN TRANSFORMING INDIA'S ROADS INTO SAFE, CLEAN, AUTONOMOUS CORRIDORS"
    p_c1.font.name = 'Arial'
    p_c1.font.size = Pt(12)
    p_c1.font.bold = True
    p_c1.font.color.rgb = CYAN

    p_c2 = tf_cta.add_paragraph()
    p_c2.text = "Urban Tracker & RoadGuard AI gives municipal administrators an unblinking, continuous eye over every kilometer of civic infrastructure.\nReady for immediate deployment across Municipal Corporations, Smart City Missions, and State Highway Networks."
    p_c2.font.name = 'Segoe UI'
    p_c2.font.size = Pt(11)
    p_c2.font.color.rgb = WHITE
    p_c2.space_before = Pt(4)

    add_footer(s10, 10, total_slides)

    # Save presentation
    prs.save(output_path)
    print(f"✅ PowerPoint Presentation successfully saved to: {output_path}")

if __name__ == '__main__':
    dest = '/Users/yaswanth/Downloads/gods-eye-view-0.1.1/Urban_Tracker_RoadGuard_Smart_City_Presentation.pptx'
    build_presentation(dest)
