#!/usr/bin/env python3
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"downloads"/"GSA_Free_Teacher_Starter_Pack.pdf"
OUT.parent.mkdir(parents=True,exist_ok=True)

W,H=A4
NAVY=colors.HexColor("#061D2D"); NAVY2=colors.HexColor("#0A3041")
TEAL=colors.HexColor("#0D6F72"); GOLD=colors.HexColor("#C79A45")
GOLD2=colors.HexColor("#E2C474"); CREAM=colors.HexColor("#F6ECD7")
PAPER=colors.HexColor("#FBF4E4"); INK=colors.HexColor("#15303B")
MUTED=colors.HexColor("#587076"); LIGHT=colors.HexColor("#EEF3ED")
RED=colors.HexColor("#923936")

c=canvas.Canvas(str(OUT),pagesize=A4)
c.setTitle("Gaia's Secret Agents - Free Teacher Starter Pack")
c.setAuthor("Gaia's Secret Agents")
c.setSubject("Screen-free outdoor learning starter pack for primary teachers, ages 6-11")
margin=18*mm; content_w=W-2*margin

def footer(page_no,dark=False):
    c.setFont("Helvetica",8.5); c.setFillColor(GOLD2 if dark else MUTED)
    c.drawString(margin,9*mm,"Gaia's Secret Agents · Free Teacher Starter Pack · Ages 6-11")
    c.drawRightString(W-margin,9*mm,f"{page_no} / 8")

def header_band(label,page_no):
    c.setFillColor(NAVY); c.rect(0,H-27*mm,W,27*mm,fill=1,stroke=0)
    c.setFillColor(GOLD2); c.setFont("Helvetica-Bold",9)
    c.drawString(margin,H-12*mm,"GAIA'S SECRET AGENTS")
    c.setFont("Helvetica",8); c.drawRightString(W-margin,H-12*mm,label.upper())
    footer(page_no)

def para(text,x,y,w,size=12.5,leading=None,color=INK,bold=False,align=TA_LEFT):
    if leading is None: leading=size*1.38
    style=ParagraphStyle("p",fontName=("Helvetica-Bold" if bold else "Helvetica"),
        fontSize=size,leading=leading,textColor=color,alignment=align,spaceAfter=0)
    p=Paragraph(text,style); _,h=p.wrap(w,H); p.drawOn(c,x,y-h); return y-h

def heading(text,x,y,size=24,color=NAVY):
    c.setFillColor(color); c.setFont("Times-Bold",size); c.drawString(x,y,text)
    return y-size*1.15

def box(x,y_top,w,h,fill=PAPER,stroke=GOLD,radius=7):
    c.setFillColor(fill); c.setStrokeColor(stroke)
    c.roundRect(x,y_top-h,w,h,radius,fill=1,stroke=1)

def bullets(items,x,y,w,size=12,gap=4,color=INK):
    for item in items:
        c.setFillColor(TEAL); c.circle(x+3,y-4,1.7,fill=1,stroke=0)
        y=para(item,x+10,y+2,w-10,size=size,color=color); y-=gap
    return y

# 1 Cover
c.setFillColor(NAVY); c.rect(0,0,W,H,fill=1,stroke=0)
c.setFillColor(TEAL); c.circle(W-20*mm,H-30*mm,38*mm,fill=1,stroke=0)
c.setStrokeColor(colors.Color(1,1,1,alpha=0.04))
for r in [28,40,52]: c.circle(W-20*mm,H-30*mm,r*mm,fill=0,stroke=1)
c.setFillColor(GOLD2); c.setFont("Helvetica-Bold",10)
c.drawString(margin,H-38*mm,"CLASSROOM FIELD FILE · FREE TEACHER RESOURCE")
c.setFillColor(CREAM); c.setFont("Times-Bold",31)
c.drawString(margin,H-61*mm,"Free Teacher"); c.drawString(margin,H-74*mm,"Starter Pack")
c.setFillColor(colors.HexColor("#DCE8E3")); c.setFont("Helvetica",15)
c.drawString(margin,H-90*mm,"Screen-free environmental learning for ages 6-11")
c.setStrokeColor(GOLD); c.line(margin,H-100*mm,W-margin,H-100*mm)
y=H-116*mm; y=para("<b>Inside this pack:</b>",margin,y,content_w,size=14,color=GOLD2); y-=5
y=bullets(["A 20-minute ready-to-run outdoor mission","A student evidence sheet",
"Teacher discussion and extension prompts","A sustainability decision challenge",
"A reusable GSA lesson-planning template"],margin,y,content_w,size=13,color=CREAM); y-=10
box(margin,y,content_w,35*mm,fill=NAVY2,stroke=GOLD)
para("<b>Designed for teachers, homeschoolers and other adults leading learning.</b><br/>No student email address is needed. Follow your own supervision, weather, site-safety and school requirements.",
margin+8*mm,y-8*mm,content_w-16*mm,size=11.5,color=CREAM)
footer(1,True); c.showPage()

# 2 Quick start
header_band("Teacher Quick Start",2); y=H-42*mm
y=heading("The GSA lesson structure",margin,y,25)
y=para("Gaia's Secret Agents works best when children are given a clear role and a real question to investigate. The adult leads the session; the story simply gives the learning a purpose.",margin,y-3,content_w,size=12.5); y-=10
steps=[("1 · OBJECTIVE","Give one clear mission: what are students trying to find out?"),
("2 · OBSERVE","Look closely at a real place, object or system before explaining it."),
("3 · EVIDENCE","Record something concrete: a count, sketch, comparison, measurement or observation."),
("4 · REPORT BACK","Ask students to explain what the evidence suggests and what they would investigate next.")]
for t,d in steps:
    box(margin,y,content_w,29*mm,fill=LIGHT,stroke=colors.HexColor("#B9C9C0"))
    c.setFillColor(TEAL); c.setFont("Helvetica-Bold",10); c.drawString(margin+7*mm,y-8*mm,t)
    para(d,margin+7*mm,y-14*mm,content_w-14*mm,size=11.5); y-=34*mm
y-=2; c.setFillColor(NAVY); c.setFont("Times-Bold",20); c.drawString(margin,y,"Before you go outside"); y-=8*mm
bullets(["Choose a safe, clearly bounded observation area.","Set the regrouping point and time before students move.",
"Observe living things without handling, moving rocks/logs, disturbing nests or feeding wildlife.",
"Adapt for weather, accessibility, allergies and local site conditions.",
"One focused task is enough. You do not need to fill the whole lesson with activities."],margin,y,content_w,size=11.2)
footer(2); c.showPage()

# 3 Mission
header_band("Ready-to-run Mission",3); y=H-42*mm
c.setFillColor(RED); c.setFont("Helvetica-Bold",9); c.roundRect(margin,y-7*mm,48*mm,9*mm,3*mm,fill=0,stroke=1)
c.drawCentredString(margin+24*mm,y-4.5*mm,"FIELD MISSION"); y-=15*mm
y=heading("Operation: Hidden Habitat",margin,y,27)
y=para("<b>Mission objective:</b> Compare two small outdoor zones and use evidence to decide which one appears to provide more useful habitat features for small living things.",margin,y-2,content_w,size=13); y-=8
box(margin,y,content_w,34*mm,fill=LIGHT,stroke=colors.HexColor("#B9C9C0"))
para("<b>Time:</b> 20-30 minutes &nbsp;&nbsp; <b>Materials:</b> one field sheet and pencil per student/pair &nbsp;&nbsp; <b>Location:</b> school grounds, yard or park",margin+7*mm,y-8*mm,content_w-14*mm,size=11.5)
para("<b>Do not:</b> move rocks or logs, pull plants, touch wildlife, disturb nests, enter drains/water, or collect living things.",margin+7*mm,y-20*mm,content_w-14*mm,size=10.8,color=RED); y-=43*mm
y=heading("Briefing",margin,y,19)
y=para("Agents, Headquarters needs a habitat report. Two places can be only a few metres apart and still offer very different conditions for living things. Your job is to compare two small zones and report what the evidence shows.",margin,y-2,content_w,size=12); y-=8
y=heading("Run the mission",margin,y,19)
bullets(["<b>Choose Zone A.</b> Mark a small observation area roughly one metre across. Do not disturb it.",
"<b>Choose Zone B.</b> Pick a nearby area that looks different - for example, sunnier/shadier, lawn/garden edge, dry/damp, open/sheltered.",
"<b>Observe for five minutes.</b> Record visible habitat features and signs of life. Signs may include insects seen, bird activity, webbing, holes, leaf damage, tracks or other evidence - without touching.",
"<b>Compare.</b> Use the field sheet to identify at least three differences.",
"<b>Report back.</b> Decide which zone appears to provide more habitat features and support the answer with evidence."],margin,y,content_w,size=11.4)
footer(3); c.showPage()

# 4 Student sheet - minimum 16pt child-facing text
header_band("Student Field Sheet",4); y=H-42*mm
y=heading("Operation: Hidden Habitat - Evidence Sheet",margin,y,22); y-=2*mm
c.setFillColor(INK); c.setFont("Helvetica",16)
c.drawString(margin,y,"Agent / group: ____________________"); c.drawString(W/2+5*mm,y,"Date: __________"); y-=12*mm
gap=6*mm; col_w=(content_w-gap)/2; zone_h=88*mm
for idx,label in enumerate(["ZONE A","ZONE B"]):
    x=margin+idx*(col_w+gap); box(x,y,col_w,zone_h,fill=colors.white,stroke=GOLD)
    c.setFillColor(NAVY); c.setFont("Helvetica-Bold",17); c.drawString(x+6*mm,y-10*mm,label)
    c.setFont("Helvetica",16); c.setFillColor(MUTED); c.drawString(x+6*mm,y-20*mm,"Describe this place:")
    c.setStrokeColor(colors.HexColor("#C7C7C7"))
    c.line(x+6*mm,y-30*mm,x+col_w-6*mm,y-30*mm); c.line(x+6*mm,y-39*mm,x+col_w-6*mm,y-39*mm)
    cy=y-50*mm; c.setFont("Helvetica",16); c.setFillColor(INK)
    for item in ["Shade","Plants","Shelter","Leaf litter","Moisture","Signs of life"]:
        c.rect(x+6*mm,cy-3.5*mm,4.5*mm,4.5*mm,fill=0,stroke=1); c.drawString(x+14*mm,cy-1*mm,item); cy-=7.3*mm
y-=zone_h+11*mm; c.setFillColor(NAVY); c.setFont("Times-Bold",18); c.drawString(margin,y,"Three differences we noticed"); y-=9*mm
for n in range(1,4):
    c.setFillColor(TEAL); c.setFont("Helvetica-Bold",16); c.drawString(margin,y,f"{n}.")
    c.setStrokeColor(colors.HexColor("#A7A7A7")); c.line(margin+9*mm,y-1*mm,W-margin,y-1*mm); y-=11*mm
box(margin,y,content_w,45*mm,fill=LIGHT,stroke=colors.HexColor("#B9C9C0"))
c.setFillColor(NAVY); c.setFont("Helvetica-Bold",16); c.drawString(margin+7*mm,y-10*mm,"OUR REPORT TO HEADQUARTERS")
c.setFont("Helvetica",16); c.drawString(margin+7*mm,y-20*mm,"Which zone seems to offer more useful habitat features?")
c.setStrokeColor(colors.HexColor("#9E9E9E")); c.line(margin+7*mm,y-31*mm,W-margin-7*mm,y-31*mm); c.line(margin+7*mm,y-40*mm,W-margin-7*mm,y-40*mm)
footer(4); c.showPage()

# 5 Discuss
header_band("Discuss & Extend",5); y=H-42*mm
y=heading("Turn observations into thinking",margin,y,25)
y=para("The mission is not finished when the field sheet is full. Use the report-back conversation to help students separate what they <i>observed</i> from what they <i>inferred</i>.",margin,y-3,content_w,size=12.5); y-=12
questions=["What did you actually observe, and what did you infer from it?","Which piece of evidence most influenced your conclusion?",
"Did the zone with more plants always show more signs of life? Why might that vary?","What could change the result at a different time of day, season or weather condition?",
"What evidence would you collect next if you had another ten minutes?","How could we improve habitat without disturbing the organisms already using the space?"]
for i,q in enumerate(questions,1):
    box(margin,y,content_w,21*mm,fill=PAPER,stroke=colors.HexColor("#D3BE8A"))
    c.setFillColor(TEAL); c.setFont("Helvetica-Bold",11); c.drawString(margin+6*mm,y-7*mm,f"Q{i}")
    para(q,margin+17*mm,y-5*mm,content_w-23*mm,size=11.5); y-=25*mm
y-=4; c.setFillColor(NAVY); c.setFont("Times-Bold",18); c.drawString(margin,y,"Optional curriculum extensions"); y-=7*mm
bullets(["<b>Science:</b> classify habitat features and discuss needs of living things.",
"<b>Maths:</b> repeat observations using tally counts, simple proportions or measurements.",
"<b>English:</b> write a short evidence-based field report using 'I observed...' and 'This suggests...'.",
"<b>HASS / Geography:</b> map habitat-rich and habitat-poor areas around the school grounds."],margin,y,content_w,size=11)
footer(5); c.showPage()

# 6 Sustainability
header_band("Sustainability Challenge",6); y=H-42*mm
y=heading("The Evidence-to-Action Challenge",margin,y,25)
y=para("Sustainability works better when students investigate first and act second. This short challenge can follow Operation: Hidden Habitat or stand alone.",margin,y-3,content_w,size=12.5); y-=12
box(margin,y,content_w,40*mm,fill=LIGHT,stroke=colors.HexColor("#B9C9C0"))
para("<b>Challenge:</b> Choose one small school-ground area. Identify one evidence-based improvement that could make the space more useful for people, plants or wildlife - without creating a new safety problem.",margin+7*mm,y-8*mm,content_w-14*mm,size=12); y-=50*mm
prompts=[("1. NOTICE","What is happening now? Record two observations before proposing anything."),
("2. NAME THE NEED","What specific problem or opportunity does the evidence suggest?"),
("3. COMPARE OPTIONS","List two possible improvements. What are the benefits and trade-offs of each?"),
("4. CHOOSE","Which option is realistic for this place, and why?"),
("5. CHECK","What would you measure later to know whether the change helped?")]
for t,d in prompts:
    c.setFillColor(NAVY); c.setFont("Helvetica-Bold",11); c.drawString(margin,y,t)
    y=para(d,margin+34*mm,y+2,content_w-34*mm,size=11.3)
    c.setStrokeColor(colors.HexColor("#B8B8B8")); c.line(margin+34*mm,y-4*mm,W-margin,y-4*mm); y-=13*mm
box(margin,y+4*mm,content_w,30*mm,fill=PAPER,stroke=GOLD)
para("<b>Teacher note:</b> An acceptable outcome can be 'we need more information.' Students do not need to complete an environmental action every lesson. Understanding a system, evaluating evidence and identifying uncertainty are meaningful learning outcomes.",margin+7*mm,y-4*mm,content_w-14*mm,size=10.8)
footer(6); c.showPage()

# 7 Planning
header_band("Reusable Planning Sheet",7); y=H-42*mm
y=heading("Build your own GSA-style lesson",margin,y,24)
y=para("Use this one-page planning frame to turn an ordinary topic into a focused, screen-free investigation.",margin,y-3,content_w,size=12.2); y-=9
fields=[("MISSION OBJECTIVE","What should students find out, compare, test or explain?"),
("REAL-WORLD TARGET","What place, object, organism, pattern or system will they observe?"),
("EVIDENCE","What will students record - tally, sketch, measurement, map, comparison or written observation?"),
("REPORT-BACK QUESTION","What single question will require students to use their evidence?"),
("SAFETY / ACCESS","What boundaries, weather, accessibility or site conditions need adapting?"),
("NEXT STEP","What would students investigate next, or what proportionate action could follow?")]
for t,p in fields:
    box(margin,y,content_w,31*mm,fill=colors.white,stroke=colors.HexColor("#CDBB91"))
    c.setFillColor(TEAL); c.setFont("Helvetica-Bold",10); c.drawString(margin+6*mm,y-7*mm,t)
    c.setFillColor(MUTED); c.setFont("Helvetica-Oblique",9.5); c.drawString(margin+6*mm,y-13*mm,p)
    c.setStrokeColor(colors.HexColor("#C8C8C8")); c.line(margin+6*mm,y-22*mm,W-margin-6*mm,y-22*mm); c.line(margin+6*mm,y-28*mm,W-margin-6*mm,y-28*mm); y-=35*mm
footer(7); c.showPage()

# 8 Next steps
header_band("Next Steps",8); y=H-42*mm
y=heading("Keep the useful parts free",margin,y,25)
y=para("The public GSA teacher guides stay open so teachers, parents and search/AI systems can find useful material without signing up. This downloadable Starter Pack is the email-gated resource.",margin,y-3,content_w,size=12.3); y-=13
resources=[("Schools & Teachers","gaiassecretagents.com/schools.html","Teacher sample, school-use information and licensing enquiries."),
("Outdoor Learning Guide","gaiassecretagents.com/outdoor-learning-activities-primary-school.html","Eight low-prep primary-school outdoor learning activities."),
("Sustainability Guide","gaiassecretagents.com/sustainability-activities-primary-school.html","Nine sustainability activities built around systems, evidence and action."),
("Free Activities Archive","gaiassecretagents.com/free-activities-guides.html","All current public GSA field guides in one place.")]
for t,u,d in resources:
    box(margin,y,content_w,27*mm,fill=PAPER,stroke=colors.HexColor("#D3BE8A"))
    c.setFillColor(NAVY); c.setFont("Helvetica-Bold",12); c.drawString(margin+6*mm,y-7*mm,t)
    c.setFillColor(TEAL); c.setFont("Helvetica-Bold",9.5); c.drawString(margin+6*mm,y-14*mm,u)
    para(d,margin+6*mm,y-18*mm,content_w-12*mm,size=9.6,color=MUTED); y-=31*mm
y-=3; box(margin,y,content_w,43*mm,fill=NAVY2,stroke=GOLD)
c.setFillColor(GOLD2); c.setFont("Times-Bold",18); c.drawString(margin+7*mm,y-10*mm,"Interested in paid GSA resources for a class or school?")
para("The current A$19 Starter Kit is licensed for personal/household use unless a product page states otherwise. For classroom, multi-class or school use, contact <b>hello@gaiassecretagents.com</b> before reproducing paid files.",margin+7*mm,y-16*mm,content_w-14*mm,size=10.7,color=CREAM)
y-=53*mm; c.setFillColor(NAVY); c.setFont("Times-Bold",17); c.drawCentredString(W/2,y,"Observe · Explore · Protect")
c.setFillColor(MUTED); c.setFont("Helvetica",10); c.drawCentredString(W/2,y-8*mm,"Gaia's Secret Agents · Brisbane, Queensland, Australia")
footer(8); c.save()
print(OUT)
