from pathlib import Path
from fpdf import FPDF, HTMLMixin

from config import APP_CONFIG

###################
# WRITE_PDF STUFF #
###################
class MyFPDF(FPDF, HTMLMixin):
    def header(self):
        self.image(f"{APP_CONFIG['WEB_ASSETS_DIR']}/assets/letter_header.png", 0, 10, 210)
        self.set_font('Arial', 'B', 15)
        self.cell(80)
        self.ln(20)
    def footer(self):
        self.image(f"{APP_CONFIG['WEB_ASSETS_DIR']}/assets/letter_footer.png", 0, 270, 210)
        self.set_y(-15)
    pass


def write_pdf_internal(json):
    try:
        html = f"""{json["html"]}"""
        filename = json["filename"]
        direc = json["directory"]

        pdf = MyFPDF()
        #First page
        pdf.add_page()
        pdf.write_html(html)
        directory = f"{APP_CONFIG['MARIRONG_DIR']}{direc}"
        path = Path(f"{directory}{filename}")
        pdf.output(path, "F")

        response = {
            "status": True,
            "message": "Success",
            "path": path
        }
    except Exception as err:
        print(err)
        response = {
            "status": False,
            "message": "Failed",
            "path": None
        }
        raise

    return response
