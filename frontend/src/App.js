import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';

const EMAILJS_SERVICE_ID = 'service_pc06xoe';
const EMAILJS_TEMPLATE_ID = 'template_b9eq63o';
const EMAILJS_PUBLIC_KEY = '1FUVeR-EoOZ1mjOi4';
const BACKEND_URL = 'http://localhost:5000';

function App() {
  const [activeTab, setActiveTab] = useState('voice');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const downloadExcel = () => {
    const wsData = [
      ['Name', 'Email', 'Phone', 'Course', 'Message', 'Date'],
      [name, email, phone, course, message, new Date().toLocaleString()]
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Enquiries');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `enquiry_${name}_${Date.now()}.xlsx`);
  };

  const handleSubmit = async () => {
    console.log('Form values:', { name, email, phone, course });
    if (!name.trim() || !email.trim() || !phone.trim() || !course) {
      setStatus('error');
      return;
    }
    setLoading(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          phone: phone,
          course: course,
          message: message || 'No message provided',
        },
        EMAILJS_PUBLIC_KEY
      );
      downloadExcel();
      await axios.post(`${BACKEND_URL}/call`, {
        name: name,
        phone: phone,
        course: course,
      });
      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setCourse('');
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif', color: '#fff' }}>
      <header style={{ background: '#111', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src="/xploreitcorp_logo.webp" alt="Xplore IT Corp" style={{ height: '52px' }} />
        <span style={{ color: '#4caf50', fontSize: '12px' }}>● AI ONLINE</span>
      </header>

      <div style={{ textAlign: 'center', padding: '40px 24px 20px' }}>
        <div style={{ color: '#4caf50', fontSize: '12px', marginBottom: '12px' }}>SOFTWARE TRAINING INSTITUTE</div>
        <h1 style={{ fontSize: '42px', fontWeight: '800' }}>
          <span style={{ color: '#4caf50' }}>Design</span> Your <span style={{ color: '#ffc107' }}>Desire</span> ™
        </h1>
        <p style={{ color: '#555', marginTop: '8px' }}>// Coimbatore's Premier IT Training</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', padding: '20px' }}>
        <button onClick={() => setActiveTab('voice')} style={{ padding: '12px 32px', borderRadius: '30px', border: 'none', cursor: 'pointer', background: activeTab === 'voice' ? '#4caf50' : '#222', color: activeTab === 'voice' ? '#000' : '#888', fontWeight: '600', fontSize: '14px' }}>🎙️ Voice Assistant</button>
        <button onClick={() => setActiveTab('contact')} style={{ padding: '12px 32px', borderRadius: '30px', border: 'none', cursor: 'pointer', background: activeTab === 'contact' ? '#ffc107' : '#222', color: activeTab === 'contact' ? '#000' : '#888', fontWeight: '600', fontSize: '14px' }}>📩 Enquire Now</button>
      </div>

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '8px 24px 40px' }}>
        {activeTab === 'voice' && (
          <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '20px', padding: '32px', display: 'flex', gap: '32px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>AI Voice Assistant</div>
              <div style={{ color: '#555', fontSize: '13px', marginBottom: '20px' }}>// ask anything about our programs</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Python', 'Java', 'Web Dev', 'Data Science', 'Digital Marketing', 'UI/UX'].map(c => (
                  <span key={c} style={{ background: '#0d1f0d', color: '#4caf50', border: '1px solid #1a3d1a', padding: '6px 16px', borderRadius: '20px', fontSize: '12px' }}>{c}</span>
                ))}
              </div>
            </div>
            <div style={{ minWidth: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '24px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <elevenlabs-convai agent-id="agent_8601kmqm4pwpevh8kke1km7gmxp8"></elevenlabs-convai>
              </div>
              <p style={{ color: '#333', fontSize: '11px', marginTop: '8px' }}>click to speak</p>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '20px', padding: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '22px', fontWeight: '700' }}>Enquire Now</div>
              <div style={{ color: '#555', fontSize: '13px' }}>// fill the form, we'll reach out to you!</div>
            </div>

            {status === 'success' && (
              <div style={{ background: '#0d1f0d', border: '1px solid #1a3d1a', color: '#4caf50', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
                ✓ Enquiry submitted! Email sent, Excel downloaded & AI call initiated! 📞
              </div>
            )}
            {status === 'error' && (
              <div style={{ background: '#1f0d0d', border: '1px solid #3d1a1a', color: '#f44336', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
                ✗ Please fill all required fields!
              </div>
            )}

            <input style={{ width: '100%', padding: '13px 16px', background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', color: '#fff', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }} placeholder="Your Name *" value={name} onChange={e => setName(e.target.value)} />
            <input style={{ width: '100%', padding: '13px 16px', background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', color: '#fff', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }} placeholder="Your Email *" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={{ width: '100%', padding: '13px 16px', background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', color: '#fff', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }} placeholder="Phone Number * (e.g. +91 98765 43210)" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />

            <select
              style={{ width: '100%', padding: '13px 16px', background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', color: course ? '#fff' : '#555', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
              value={course}
              onChange={e => setCourse(e.target.value)}
            >
              <option value="">Select Course *</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="Web Dev">Web Dev</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="UI/UX">UI/UX</option>
              <option value="Data Science">Data Science</option>
            </select>

            <textarea style={{ width: '100%', padding: '13px 16px', background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', color: '#fff', fontSize: '14px', marginBottom: '16px', outline: 'none', height: '100px', resize: 'none', boxSizing: 'border-box' }} placeholder="Any message? (optional)" value={message} onChange={e => setMessage(e.target.value)} />

            <button
              style={{ width: '100%', padding: '14px', background: loading ? '#333' : '#ffc107', color: loading ? '#666' : '#000', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting...' : '→ Submit Enquiry'}
            </button>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', padding: '24px', color: '#2a2a2a', fontSize: '12px', borderTop: '1px solid #111' }}>
        © 2024 XPLORE IT CORP | COIMBATORE, TAMIL NADU
      </div>
    </div>
  );
}

export default App;