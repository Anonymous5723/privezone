from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

doc = Document()

# Styles
style = doc.styles['Normal']
style.font.name = 'Calibri'
style.font.size = Pt(11)

def add_title(doc, text):
    p = doc.add_heading(text, level=0)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.runs[0]
    run.font.color.rgb = RGBColor(0x1F, 0x4E, 0x79)
    return p

def add_h1(doc, text):
    p = doc.add_heading(text, level=1)
    run = p.runs[0]
    run.font.color.rgb = RGBColor(0x2E, 0x74, 0xB5)
    return p

def add_h2(doc, text):
    p = doc.add_heading(text, level=2)
    run = p.runs[0]
    run.font.color.rgb = RGBColor(0x2E, 0x74, 0xB5)
    return p

def add_field(doc, label, value):
    p = doc.add_paragraph()
    run_label = p.add_run(f"{label} : ")
    run_label.bold = True
    run_label.font.color.rgb = RGBColor(0x1F, 0x4E, 0x79)
    p.add_run(value)
    return p

def add_bullet(doc, text):
    p = doc.add_paragraph(text, style='List Bullet')
    return p

def add_separator(doc):
    doc.add_paragraph("─" * 60)

# ==============================
# TITLE PAGE
# ==============================
add_title(doc, "Produits SUTERRA")
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("Distribués par De Sangosse (France)")
run.font.size = Pt(13)
run.font.italic = True
run.font.color.rgb = RGBColor(0x40, 0x40, 0x40)

doc.add_paragraph()
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("Source : www.desangosse.fr | ephy.anses.fr")
run.font.size = Pt(10)
run.font.color.rgb = RGBColor(0x80, 0x80, 0x80)

doc.add_page_break()

# ==============================
# PRODUCT 1: PUFFER LB
# ==============================
add_h1(doc, "1. CHECKMATE® PUFFER® LB")
add_field(doc, "Catégorie", "Insecticide biocontrôle – Confusion sexuelle")
add_field(doc, "Culture", "Vigne")
add_field(doc, "Ravageur cible", "Eudémis (Lobesia botrana)")
add_field(doc, "Formulation", "Aérosol générateur (AE)")
add_field(doc, "N° AMM", "2160423")
add_field(doc, "Titulaire AMM", "Suterra Europe Biocontrol SL")
add_field(doc, "Agriculture biologique", "Oui – autorisé")
doc.add_paragraph()
add_h2(doc, "Matière active")
add_bullet(doc, "(E,Z)-7,9-Dodécadien-1-yl acétate : 87,77 g/L (phéromone lépidoptères à chaîne linéaire)")
doc.add_paragraph()
add_h2(doc, "Points clés")
add_bullet(doc, "Temps de pose : ~15 min/ha en moyenne")
add_bullet(doc, "Diffusion nocturne – libération uniquement quand les papillons sont actifs")
add_bullet(doc, "Capteur de température intégré")
add_bullet(doc, "Nouvelle cabine : plus légère, compacte, 100% hermétique")
add_bullet(doc, "Efficacité comparable aux diffuseurs traditionnels")
add_field(doc, "Page produit", "https://www.desangosse.fr/produit/checkmate-i-puffer-i-lb-1/")
add_separator(doc)

# ==============================
# PRODUCT 2: PUFFER LB/EA
# ==============================
add_h1(doc, "2. CHECKMATE® PUFFER® LB/EA")
add_field(doc, "Catégorie", "Insecticide biocontrôle – Confusion sexuelle")
add_field(doc, "Culture", "Vigne")
add_field(doc, "Ravageurs ciblés", "Eudémis (Lobesia botrana) + Cochylis (Eupoecilia ambiguella)")
add_field(doc, "Formulation", "Aérosol générateur (AE)")
add_field(doc, "N° AMM", "2200389")
add_field(doc, "Titulaire AMM", "Suterra Europe Biocontrol SL")
add_field(doc, "Agriculture biologique", "Oui – autorisé")
doc.add_paragraph()
add_h2(doc, "Matières actives")
add_bullet(doc, "(E-Z)-7,9-Dodécadien-1-yl acétate : 91,1 g/L")
add_bullet(doc, "(Z)-9-dodécen-1-yl acétate : 104,2 g/L")
add_bullet(doc, "Total phéromones : 195,3 g/kg")
doc.add_paragraph()
add_h2(doc, "Points clés")
add_bullet(doc, "Homologué depuis août 2020")
add_bullet(doc, "Solution double action : Eudémis ET Cochylis en un seul diffuseur")
add_bullet(doc, "Temps de pose : ~15 min/ha en moyenne")
add_bullet(doc, "Capteur de température – diffusion optimisée")
add_bullet(doc, "100% recyclable, design nouvelle génération")
add_field(doc, "Page produit", "https://www.desangosse.fr/produit/insecticide-biocontrole-checkmate-puffer-lb-ea-vigne/")
add_separator(doc)

# ==============================
# PRODUCT 3: PUFFER CM-PRO
# ==============================
add_h1(doc, "3. CHECKMATE® PUFFER® CM PRO")
add_field(doc, "Catégorie", "Insecticide biocontrôle – Confusion sexuelle")
add_field(doc, "Cultures", "Pommier, Poirier, Noyer")
add_field(doc, "Ravageur cible", "Carpocapse (Cydia pomonella)")
add_field(doc, "Formulation", "Aérosol générateur (AE)")
add_field(doc, "N° AMM", "2200388")
add_field(doc, "Titulaire AMM", "Suterra Europe Biocontrol SL")
add_field(doc, "Agriculture biologique", "Oui – autorisé")
doc.add_paragraph()
add_h2(doc, "Matière active")
add_bullet(doc, "(E,E)-8,10-dodécadiénol : 90,3 g/kg (phéromone lépidoptères à chaîne linéaire)")
doc.add_paragraph()
add_h2(doc, "Points clés")
add_bullet(doc, "Temps de pose : ~20 min/ha en moyenne")
add_bullet(doc, "Diffusion vespérale/nocturne uniquement")
add_bullet(doc, "Capteur de température – émission pheromone optimisée")
add_bullet(doc, "Retirage possible pendant l'hiver")
add_bullet(doc, "Design hermétique, recyclable")
add_bullet(doc, "Efficacité comparable aux diffuseurs classiques")
add_field(doc, "Page produit", "https://www.desangosse.fr/produit/insecticide-biocontrole-checkmate-puffer-cm-pro-arboriculture/")
add_separator(doc)

# ==============================
# PRODUCT 4: BIOMAGNET RUBY
# ==============================
add_h1(doc, "4. BIOMAGNET™ RUBY")
add_field(doc, "Catégorie", "Insecticide biocontrôle – Piège attractif")
add_field(doc, "Cultures", "Cassissier, Cerisier, Fraisier, Framboisier, Vigne")
add_field(doc, "Ravageur cible", "Drosophile à ailes tachetées (Drosophila suzukii / SWD)")
add_field(doc, "Formulation", "Appât prêt à l'emploi en piège (RB)")
add_field(doc, "N° AMM", "2230600")
add_field(doc, "Titulaire AMM", "Suterra Europe Biocontrol SL")
add_field(doc, "Date autorisation", "6 novembre 2023")
add_field(doc, "Usage professionnel", "Oui")
doc.add_paragraph()
add_h2(doc, "Matière active")
add_bullet(doc, "Deltaméthrine : 10 mg/piège (0,31 g/kg) – insecticide de contact")
doc.add_paragraph()
add_h2(doc, "Dose maximale")
add_bullet(doc, "150 pièges/ha")
add_bullet(doc, "Intervalle minimum entre applications : 120 jours")
doc.add_paragraph()
add_h2(doc, "Nombre max d'applications par culture")
add_bullet(doc, "Cassissier : 2 applications")
add_bullet(doc, "Cerisier : 1 application")
add_bullet(doc, "Fraisier : 2 applications")
add_bullet(doc, "Framboisier : 2 applications")
add_bullet(doc, "Vigne : 1 application")
doc.add_paragraph()
add_h2(doc, "Points clés")
add_bullet(doc, "Attractif alimentaire attire la drosophile – contact avec l'insecticide = mort avant la ponte")
add_bullet(doc, "Protection longue durée : 4 mois")
add_bullet(doc, "Piège à usage unique")
add_bullet(doc, "Retirer les pièges avant récolte pour protéger les pollinisateurs")
add_field(doc, "Source réglementaire", "https://ephy.anses.fr/ppp/biomagnet-ruby")
p = doc.add_paragraph()
run = p.add_run("Note : La fiche produit sur desangosse.fr n'est pas encore disponible publiquement au moment de la rédaction (données issues de l'ANSES/Ephy).")
run.font.italic = True
run.font.color.rgb = RGBColor(0x80, 0x80, 0x80)
add_separator(doc)

# ==============================
# PRODUCT 5: SUBVERT
# ==============================
add_h1(doc, "5. SUBVERT®")
add_field(doc, "Catégorie", "Insecticide biocontrôle – Confusion sexuelle liquide")
add_field(doc, "Culture", "Vigne")
add_field(doc, "Ravageur cible", "Eudémis (Lobesia botrana)")
add_field(doc, "Formulation", "Suspension de capsules (CS) – confusion liquide")
add_field(doc, "N° AMM", "2250259")
add_field(doc, "Titulaire AMM", "Suterra Europe Biocontrol SL")
add_field(doc, "Agriculture biologique", "Oui – autorisé")
doc.add_paragraph()
add_h2(doc, "Matière active")
add_bullet(doc, "(E,Z)-7,9-Dodécadien-1-yl acétate : 185,5 g/L (phéromone à chaîne linéaire)")
doc.add_paragraph()
add_h2(doc, "Points clés")
add_bullet(doc, "Nouvelle génération de confusion liquide – technologie microencapsulation")
add_bullet(doc, "Microcapsules d'origine naturelle, de tailles variées – SANS microplastiques")
add_bullet(doc, "Chaque microcapsule agit comme un micro-diffuseur sur feuilles et grappes")
add_bullet(doc, "Libération progressive et homogène de la phéromone : 2 à 4 semaines")
add_bullet(doc, "Application par pulvérisation – s'intègre dans les programmes fongicides")
add_bullet(doc, "Aucune pose ni retrait de matériel nécessaire")
add_bullet(doc, "Respecte la faune auxiliaire")
add_field(doc, "Page produit", "https://www.desangosse.fr/produit/subvert-insecticide-biocontrole-vigne/")
add_separator(doc)

# ==============================
# PRODUCT 6: BIOMAGNET AMBER
# ==============================
add_h1(doc, "6. BIOMAGNET™ AMBER")
add_field(doc, "Catégorie", "Insecticide biocontrôle – Piège attractif")
add_field(doc, "Cultures", "Arboriculture : pommier, poirier, pêcher, abricotier, cerisier, prunier, agrumes, kiwi, figuier, kaki")
add_field(doc, "Ravageur cible", "Mouche méditerranéenne des fruits (Ceratitis capitata)")
add_field(doc, "Formulation", "Appât prêt à l'emploi en piège (RB) – dispositif à usage unique")
add_field(doc, "N° AMM", "2230599")
add_field(doc, "Titulaire AMM", "Suterra Europe Biocontrol SL")
add_field(doc, "Agriculture biologique", "Oui – liste biocontrôle")
doc.add_paragraph()
add_h2(doc, "Matière active")
add_bullet(doc, "Deltaméthrine : 10 mg/piège (0,31 g/kg) – insecticide de contact")
doc.add_paragraph()
add_h2(doc, "Points clés")
add_bullet(doc, "Dispositif avec plaquette + crochet intégré pour fixation sur branches")
add_bullet(doc, "Attractif alimentaire : la mouche est attirée, se pose, contacte l'insecticide et meurt avant la ponte")
add_bullet(doc, "Durée d'action : 6 mois")
add_bullet(doc, "Installation rapide et facile")
add_bullet(doc, "Piège à usage unique – pas de maintenance")
add_field(doc, "Page produit", "https://www.desangosse.fr/produit/insecticide-biocontrole-biomagnet-amber-arboriculture/")
add_separator(doc)

# ==============================
# PRODUCT 7: PUFFER FRUIT MULTI
# ==============================
add_h1(doc, "7. CHECKMATE® PUFFER® FRUIT MULTI")
add_field(doc, "Catégorie", "Insecticide biocontrôle – Confusion sexuelle")
add_field(doc, "Cultures", "Pommier, Poirier, Pêcher")
add_field(doc, "Ravageurs ciblés", "Carpocapse (Cydia pomonella) + Tordeuse orientale du pêcher (Grapholita molesta)")
add_field(doc, "Formulation", "Aérosol générateur (AE)")
add_field(doc, "N° AMM", "2190561")
add_field(doc, "Titulaire AMM", "Suterra Europe Biocontrol SL")
add_field(doc, "Agriculture biologique", "Oui – autorisé")
doc.add_paragraph()
add_h2(doc, "Matières actives")
add_bullet(doc, "(E,E)-8,10-dodécadiénol : 18,05% (180,5 g/kg)")
add_bullet(doc, "(E/Z)-8-dodécényl acétate + (Z)-8-dodécénol : 12,5% (125 g/kg)")
add_bullet(doc, "Total phéromones : 305,5 g/kg")
doc.add_paragraph()
add_h2(doc, "Points clés")
add_bullet(doc, "Double action : carpocapse ET tordeuse orientale du pêcher")
add_bullet(doc, "Temps de pose : ~20 min/ha en moyenne")
add_bullet(doc, "Diffusion vespérale/nocturne uniquement")
add_bullet(doc, "Capteur de température – optimisation des émissions")
add_bullet(doc, "Technologie retirale en hiver")
add_bullet(doc, "100% recyclable")
add_field(doc, "Page produit", "https://www.desangosse.fr/produit/insecticide-checkmate-puffer-fruit-multi-arboriculture/")
add_separator(doc)

# ==============================
# PRODUCT 8: PUFFER OFM
# ==============================
add_h1(doc, "8. CHECKMATE® PUFFER® OFM")
add_field(doc, "Catégorie", "Confusion sexuelle – Insecticide biocontrôle")
add_field(doc, "Cultures", "Abricotier, Pêcher, Prunier")
add_field(doc, "Ravageurs ciblés", "Tordeuse orientale du pêcher (Grapholita molesta) – Abricotier, Pêcher | Carpocapse des prunes (Cydia funebrana) – Prunier")
add_field(doc, "Formulation", "Aérosol générateur (AE)")
add_field(doc, "N° AMM", "2220429")
add_field(doc, "Titulaire AMM", "Suterra Europe Biocontrol SL")
add_field(doc, "Agriculture biologique", "Oui – autorisé")
doc.add_paragraph()
add_h2(doc, "Matières actives (125 g/kg total)")
add_bullet(doc, "(E)-8-dodécényl acétate")
add_bullet(doc, "(Z)-8-dodécényl acétate")
add_bullet(doc, "(Z)-8-dodécénol")
doc.add_paragraph()
add_h2(doc, "Points clés")
add_bullet(doc, "Temps de pose : ~20 min/ha en moyenne")
add_bullet(doc, "Diffusion optimisée par capteur de température")
add_bullet(doc, "Nouvelle cabine : plus légère, durable, 100% recyclable")
add_bullet(doc, "Efficacité comparable aux diffuseurs classiques")
add_field(doc, "Page produit", "https://www.desangosse.fr/produit/confusion-sexuelle-checkmate-puffer-ofm-arboriculture/")
add_separator(doc)

# ==============================
# PRODUCT 9: SUTERRA 360
# ==============================
add_h1(doc, "9. SUTERRA 360")
add_field(doc, "Type", "Application digitale / Outil de gestion parcellaire")
add_field(doc, "Développeur", "visualNACert SL (pour Suterra)")
add_field(doc, "Disponible sur", "Google Play Store (Android)")
doc.add_paragraph()
add_h2(doc, "Description")
p = doc.add_paragraph(
    "Suterra 360 est une application mobile qui offre une nouvelle dimension de gestion agronomique. "
    "Elle permet de suivre et gérer les parcelles agricoles sans avoir besoin d'installer un réseau "
    "physique de stations météo. L'outil combine la technologie avancée de Suterra avec son expertise "
    "en protection des cultures pour offrir une gestion complète des risques parasitaires."
)
doc.add_paragraph()
add_h2(doc, "Fonctionnalités principales")
add_bullet(doc, "Suivi des parcelles sans installation de stations météo physiques")
add_bullet(doc, "Optimisation des ressources agricoles")
add_bullet(doc, "Informations précises pour la prise de décision")
add_bullet(doc, "Contrôle de gestion des cultures au bout des doigts")
add_field(doc, "Google Play", "https://play.google.com/store/apps/details?id=com.visualnacert.visualsensor.suterra")
p = doc.add_paragraph()
run = p.add_run(
    "Note : Suterra 360 est un outil digital complémentaire aux produits physiques Suterra. "
    "Il n'existe pas de fiche produit dédiée sur desangosse.fr mais l'outil est référencé dans "
    "l'écosystème De Sangosse / Suterra."
)
run.font.italic = True
run.font.color.rgb = RGBColor(0x80, 0x80, 0x80)

# ==============================
# FOOTER / SOURCES
# ==============================
doc.add_page_break()
add_h1(doc, "Sources")
sources = [
    ("CHECKMATE® PUFFER® LB", "https://www.desangosse.fr/produit/checkmate-i-puffer-i-lb-1/"),
    ("CHECKMATE® PUFFER® LB/EA", "https://www.desangosse.fr/produit/insecticide-biocontrole-checkmate-puffer-lb-ea-vigne/"),
    ("CHECKMATE® PUFFER® CM PRO", "https://www.desangosse.fr/produit/insecticide-biocontrole-checkmate-puffer-cm-pro-arboriculture/"),
    ("BIOMAGNET™ RUBY (ANSES/Ephy)", "https://ephy.anses.fr/ppp/biomagnet-ruby"),
    ("SUBVERT®", "https://www.desangosse.fr/produit/subvert-insecticide-biocontrole-vigne/"),
    ("BIOMAGNET™ AMBER", "https://www.desangosse.fr/produit/insecticide-biocontrole-biomagnet-amber-arboriculture/"),
    ("CHECKMATE® PUFFER® FRUIT MULTI", "https://www.desangosse.fr/produit/insecticide-checkmate-puffer-fruit-multi-arboriculture/"),
    ("CHECKMATE® PUFFER® OFM", "https://www.desangosse.fr/produit/confusion-sexuelle-checkmate-puffer-ofm-arboriculture/"),
    ("SUTERRA 360 (Google Play)", "https://play.google.com/store/apps/details?id=com.visualnacert.visualsensor.suterra&hl=fr"),
]
for name, url in sources:
    p = doc.add_paragraph()
    run = p.add_run(f"• {name} : ")
    run.bold = True
    p.add_run(url)

doc.save("/home/user/privezone/Suterra_Produits_DeSangosse.docx")
print("Document créé avec succès.")
