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
    message: str


class CallForm(BaseModel):
    name: str
    phone: str
    course: str


@app.post("/contact")
def send_contact(form: ContactForm):
    try:
        msg = MIMEMultipart()
        msg["From"] = os.getenv("GMAIL_USER")
        msg["To"] = os.getenv("GMAIL_USER")
        msg["Subject"] = f"New Enquiry from {form.name}"
        body = f"Name: {form.name}\nEmail: {form.email}\nMessage: {form.message}"
        msg.attach(MIMEText(body, "plain"))
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(os.getenv("GMAIL_USER"), os.getenv("GMAIL_PASSWORD"))
        server.send_message(msg)
        server.quit()
        return {"status": "success", "message": "Email sent!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/call")
def make_call(form: CallForm):
    try:
        response = requests.post(
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
                },
                "assistantOverrides": {
                    "firstMessage": f"Hello {form.name}! I'm calling from Xplore IT Corp regarding your enquiry about {form.course} course. How can I help you?"
                }
            }
        )
        return {"status": "success", "data": response.json()}
    except Exception as e:
        return {"status": "error", "message": str(e)}
