from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os
import requests

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
    phone: str
    message: str


@app.post("/contact")
def send_contact(form: ContactForm):
    # 1. Email send panna
    try:
        msg = MIMEMultipart()
        msg["From"] = os.getenv("GMAIL_USER")
        msg["To"] = os.getenv("GMAIL_USER")
        msg["Subject"] = f"New Enquiry from {form.name}"

        body = f"""
        Name: {form.name}
        Email: {form.email}
        Phone: {form.phone}
        Message: {form.message}
        """
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(os.getenv("GMAIL_USER"), os.getenv("GMAIL_PASSWORD"))
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"Email error: {e}")

    # 2. VAPI Outbound Call
    try:
        vapi_response = requests.post(
            "https://api.vapi.ai/call/phone",
            headers={
                "Authorization": f"Bearer {os.getenv('VAPI_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "assistantId": os.getenv("VAPI_ASSISTANT_ID"),
                "phoneNumberId": os.getenv("VAPI_PHONE_NUMBER_ID"),
                "customer": {
                    "number": form.phone,
                    "name": form.name
                }
            }
        )
        print(f"VAPI response: {vapi_response.json()}")
    except Exception as e:
        print(f"VAPI error: {e}")

    return {"status": "success", "message": "Email sent and call initiated!"}
