import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

msg = MIMEMultipart()
msg['From'] = 'aruarun142004@gmail.com'
msg['To'] = 'aruarun142004@gmail.com'
msg['Subject'] = 'Test Email'
msg.attach(MIMEText('Test message from ExploreIT!', 'plain'))

s = smtplib.SMTP('smtp.gmail.com', 587)
s.starttls()
s.login('aruarun142004@gmail.com', 'clrj zzai tybu sryq')
s.send_message(msg)
s.quit()
print('Email sent successfully!')
