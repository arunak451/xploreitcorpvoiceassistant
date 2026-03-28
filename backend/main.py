from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactForm(BaseModel):
    name: str
    email: str
    message: str

@app.post("/contact")
def send_contact(form: ContactForm):
    try:
        msg = MIMEMultipart()
        msg["From"] = os.getenv("GMAIL_USER")
        msg["To"] = os.getenv("GMAIL_USER")
        msg["Subject"] = f"New Enquiry from {form.name}"

        body = f"""
        Name: {form.name}
        Email: {form.email}
        Message: {form.message}
        """
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(os.getenv("GMAIL_USER"), os.getenv("GMAIL_PASSWORD"))
        server.send_message(msg)
        server.quit()

        return {"status": "success", "message": "Email sent!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}