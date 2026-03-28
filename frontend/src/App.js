import React, { useState, useEffect } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body { background: #0a0a0a; }

  .app {
    min-height: 100vh;
    background: #0a0a0a;
    font-family: 'Syne', sans-serif;
    color: #fff;
  }

  .header {
    background: rgba(10,10,10,0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid #1f1f1f;
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    animation: slideDown 0.6s ease;
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .logo-area { display: flex; align-items: center; gap: 14px; }
  .logo-img { height: 52px; object-fit: contain; }

  .status-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #0d1f0d;
    border: 1px solid #1a3d1a;
    padding: 6px 16px;
    border-radius: 30px;
    font-size: 12px;
    color: #4caf50;
    font-family: 'Space Mono', monospace;
    animation: fadeIn 1s ease 0.5s both;
  }

  .pulse {
    width: 8px; height: 8px;
    background: #4caf50;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .hero {
    text-align: center;
    padding: 60px 24px 40px;
    position: relative;
    overflow: hidden;
    animation: fadeIn 0.8s ease 0.2s both;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -100px; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 400px;
    background: radial-gradient(ellipse, rgba(76,175,80,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-badge {
    display: inline-block;
    background: #0d1f0d;
    border: 1px solid #1a3d1a;
    color: #4caf50;
    padding: 6px 18px;
    border-radius: 30px;
    font-size: 12px;
    font-family: 'Space Mono', monospace;
    margin-bottom: 20px;
    letter-spacing: 1px;
  }

  .hero-title {
    font-size: 42px;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 12px;
    letter-spacing: -1px;
  }

  .hero-title .green { color: #4caf50; }
  .hero-title .yellow { color: #ffc107; }

  .hero-sub {
    font-size: 15px;
    color: #555;
    font-family: 'Space Mono', monospace;
    margin-bottom: 8px;
  }

  .tabs {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 24px;
    animation: fadeIn 0.8s ease 0.4s both;
  }

  .tab-btn {
    padding: 12px 32px;
    border-radius: 30px;
    border: 1px solid #2a2a2a;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Syne', sans-serif;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    letter-spacing: 0.5px;
  }

  .tab-btn.active-voice {
    background: #4caf50;
    border-color: #4caf50;
    color: #000;
    box-shadow: 0 0 30px rgba(76,175,80,0.3);
    transform: scale(1.05);
  }

  .tab-btn.active-contact {
    background: #ffc107;
    border-color: #ffc107;
    color: #000;
    box-shadow: 0 0 30px rgba(255,193,7,0.3);
    transform: scale(1.05);
  }

  .tab-btn.inactive {
    background: #111;
    color: #555;
  }

  .tab-btn:hover.inactive {
    border-color: #444;
    color: #aaa;
    transform: scale(1.02);
  }

  .content {
    max-width: 780px;
    margin: 0 auto;
    padding: 8px 24px 40px;
    animation: fadeIn 0.8s ease 0.5s both;
  }

  .card {
    background: #111;
    border: 1px solid #1f1f1f;
    border-radius: 20px;
    padding: 32px;
    transition: all 0.4s ease;
  }

  .card:hover {
    border-color: #2a2a2a;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .card-header { margin-bottom: 24px; }

  .card-icon-circle {
    width: 64px; height: 64px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 0 16px 0;
    font-size: 26px;
  }

  .green-circle { background: #0d1f0d; border: 1px solid #1a3d1a; }
  .yellow-circle { background: #1f1a00; border: 1px solid #3d3400; }

  .card-title { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .card-desc { font-size: 13px; color: #555; font-family: 'Space Mono', monospace; }

  .widget-box {
    background: #0a0a0a;
    border: 1px solid #1f1f1f;
    border-radius: 14px;
    padding: 24px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
  }

  .course-tags { display: flex; flex-wrap: wrap; gap: 8px; }

  .course-tag {
    background: #0d1f0d;
    color: #4caf50;
    border: 1px solid #1a3d1a;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    transition: all 0.2s;
    cursor: default;
  }

  .course-tag:hover { background: #4caf50; color: #000; transform: translateY(-2px); }

  .form-input {
    width: 100%;
    padding: 13px 16px;
    background: #0a0a0a;
    border: 1px solid #1f1f1f;
    border-radius: 12px;
    color: #fff;
    font-size: 14px;
    font-family: 'Syne', sans-serif;
    margin-bottom: 12px;
    outline: none;
    transition: border-color 0.3s;
  }

  .form-input:focus { border-color: #ffc107; }
  .form-input::placeholder { color: #333; }

  .form-textarea {
    width: 100%;
    padding: 13px 16px;
    background: #0a0a0a;
    border: 1px solid #1f1f1f;
    border-radius: 12px;
    color: #fff;
    font-size: 14px;
    font-family: 'Syne', sans-serif;
    margin-bottom: 16px;
    outline: none;
    height: 120px;
    resize: none;
    transition: border-color 0.3s;
  }

  .form-textarea:focus { border-color: #ffc107; }
  .form-textarea::placeholder { color: #333; }

  .submit-btn {
    width: 100%;
    padding: 14px;
    background: #ffc107;
    color: #000;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255,193,7,0.3);
  }

  .submit-btn:disabled { background: #333; color: #666; cursor: not-allowed; }

  .alert {
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 16px;
    font-family: 'Space Mono', monospace;
  }

  .alert-success { background: #0d1f0d; border: 1px solid #1a3d1a; color: #4caf50; }
  .alert-error { background: #1f0d0d; border: 1px solid #3d1a1a; color: #f44336; }

  .divider { height: 1px; background: #1f1f1f; margin: 20px 0; }

  .footer {
    text-align: center;
    padding: 24px;
    color: #2a2a2a;
    font-size: 12px;
    font-family: 'Space Mono', monospace;
    border-top: 1px solid #111;
  }

  .right-widget-label {
    font-size: 11px;
    color: #333;
    margin-top: 8px;
    font-family: 'Space Mono', monospace;
    text-align: center;
  }
`;

function App() {
  const [activeTab, setActiveTab] = useState('voice');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.status === 'success') {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo-area">
          <img src="/xploreitcorp_logo.webp" alt="Xplore IT Corp" className="logo-img" />
        </div>
        <div className="status-pill">
          <div className="pulse"></div>
          AI ONLINE
        </div>
      </header>

      <div className="hero">
        <div className="hero-badge">SOFTWARE TRAINING INSTITUTE</div>
        <h1 className="hero-title">
          <span className="green">Design</span> Your<br />
          <span className="yellow">Desire</span> ™
        </h1>
        <p className="hero-sub">// Coimbatore's Premier IT Training</p>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'voice' ? 'active-voice' : 'inactive'}`} onClick={() => setActiveTab('voice')}>
          🎙️ Voice Assistant
        </button>
        <button className={`tab-btn ${activeTab === 'contact' ? 'active-contact' : 'inactive'}`} onClick={() => setActiveTab('contact')}>
          📩 Contact Us
        </button>
      </div>

      <div className="content">
        {activeTab === 'voice' && (
          <div className="card" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

            {/* Left side - info */}
            <div style={{ flex: 1 }}>
              <div className="card-header">
                <div className="card-icon-circle green-circle">🎙️</div>
                <div className="card-title">AI Voice Assistant</div>
                <div className="card-desc">// ask anything about our programs</div>
              </div>
              <div className="divider"></div>
              <div className="course-tags">
                {['Python', 'Java', 'Web Dev', 'Data Science', 'Digital Marketing', 'UI/UX'].map(c => (
                  <span key={c} className="course-tag">{c}</span>
                ))}
              </div>
            </div>

            {/* Right side - widget */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '180px' }}>
              <div className="widget-box" style={{ width: '100%' }}>
                <elevenlabs-convai agent-id="agent_8601kmqm4pwpevh8kke1km7gmxp8"></elevenlabs-convai>
              </div>
              <p className="right-widget-label">click to speak</p>
            </div>

          </div>
        )}

        {activeTab === 'contact' && (
          <div className="card">
            <div className="card-header" style={{ textAlign: 'center' }}>
              <div className="card-icon-circle yellow-circle" style={{ margin: '0 auto 16px' }}>📩</div>
              <div className="card-title">Get In Touch</div>
              <div className="card-desc">// we'll respond within 24 hours</div>
            </div>

            {status === 'success' && <div className="alert alert-success">✓ Message sent! We'll get back to you soon.</div>}
            {status === 'error' && <div className="alert alert-error">✗ Something went wrong. Please try again!</div>}

            <input className="form-input" placeholder="Your name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <input className="form-input" placeholder="Your email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <textarea className="form-textarea" placeholder="Your message..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Sending...' : '→ Send Message'}
            </button>
          </div>
        )}
      </div>

      <div className="footer">
        © 2024 XPLORE IT CORP | COIMBATORE, TAMIL NADU
      </div>
    </div>
  );
}

export default App;