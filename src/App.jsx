import React, { useState, useEffect, useRef } from 'react'
import { api } from './api'

// ─── ICONS ────────────────────────────────────────────────────
const Icons = {
  Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  FileText: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Upload: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  BarChart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Shield: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Loader: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:'spin 1s linear infinite'}}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>,
}

// ─── LOGIN PAGE ───────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!email || !email.includes('@')) e.email = 'Enter a valid email'
    if (password.length < 6) e.password = 'Password must be 6+ characters'
    if (mode === 'signup' && name.trim().length < 2) e.name = 'Enter your full name'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const data = mode === 'login'
        ? await api.login(email, password)
        : await api.signup(email, password, name)
      onLogin({ name: data.user.name || name || email, email: data.user.email, id: data.user.id }, data.access_token)
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <div className="bg-mesh" />
      <div className="orb" style={{ width: 400, height: 400, background: 'rgba(0,201,177,0.08)', top: -100, left: -100, animation: 'orbFloat1 8s ease-in-out infinite' }} />
      <div className="orb" style={{ width: 300, height: 300, background: 'rgba(30,58,138,0.3)', bottom: -80, right: -60, animation: 'orbFloat2 10s ease-in-out infinite' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', position: 'relative', zIndex: 1 }} className="hide-mobile">
        <div className="fade-up" style={{ maxWidth: 500 }}>
          <h1 style={{ fontSize: 56, fontWeight: 800, marginBottom: 20, fontFamily: 'Sora,sans-serif', lineHeight: 1.1 }}>
            Rental applications, <span style={{ background: 'linear-gradient(135deg, #00C9B1, #00E5CC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>simplified.</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', marginBottom: 28 }}>
            Build your rental profile once. Apply to properties with confidence. Get approved faster.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icons.Check />
              <span style={{ fontSize: 14 }}>One-click applications</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icons.Check />
              <span style={{ fontSize: 14 }}>Trusted by agents</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            ✓ Privacy-first design • ✓ Australian-compliant • ✓ Secure & encrypted
          </div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>RentReady</div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</p>
          </div>

          <div className="glass" style={{ padding: 32, borderRadius: 16 }}>
            {mode === 'signup' && (
              <div style={{ marginBottom: 16 }}>
                <label className="inp-label">Full Name</label>
                <input className="inp" placeholder="e.g., Alex Johnson" value={name} onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => { const n = {...p}; delete n.name; return n }) }} />
                {errors.name && <div className="error-msg">{errors.name}</div>}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label className="inp-label">Email Address</label>
              <input className="inp" type="email" placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => { const n = {...p}; delete n.email; return n }) }} />
              {errors.email && <div className="error-msg">{errors.email}</div>}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="inp-label">Password</label>
              <input className="inp" type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => { const n = {...p}; delete n.password; return n }) }} />
              {errors.password && <div className="error-msg">{errors.password}</div>}
            </div>

            {errors.submit && <div className="error-msg" style={{ marginBottom: 12 }}>{errors.submit}</div>}
            <button className="btn-primary" style={{ width: '100%', marginBottom: 16 }} onClick={handleSubmit} disabled={loading}>
              {loading ? <Icons.Loader /> : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 600, cursor: 'pointer' }} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrors({}) }}>
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>

          <div style={{ marginTop: 24, padding: 12, background: 'rgba(0,201,177,0.06)', borderRadius: 10, border: '1px solid rgba(0,201,177,0.15)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Icons.Shield />
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
              <strong>Privacy Protected:</strong> Your data is encrypted end-to-end. We only share what you approve with property agents.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PROFILE SETUP PAGE ───────────────────────────────────────
function ProfilePage({ user, token, onComplete }) {
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    fullName: user?.name || '', age: '', occupation: '', employmentStatus: '',
    visaStatus: '', weeklyIncome: '', rentalBudget: '', suburb: '',
    phone: '', bio: '',
  })
  const [errors, setErrors] = useState({})

  const steps = [
    { label: 'Personal', fields: ['fullName','age','phone','bio'] },
    { label: 'Employment', fields: ['occupation','employmentStatus','weeklyIncome'] },
    { label: 'Rental Prefs', fields: ['visaStatus','rentalBudget','suburb'] },
  ]

  const upd = (k, v) => { setData(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => { const n = {...p}; delete n[k]; return n }) }

  const validate = () => {
    const e = {}
    if (!data.fullName.trim()) e.fullName = 'Name is required'
    if (step === 0 && !data.phone.trim()) e.phone = 'Phone is required'
    if (step === 1 && !data.occupation.trim()) e.occupation = 'Occupation is required'
    if (step === 1 && !data.employmentStatus) e.employmentStatus = 'Select employment status'
    if (step === 1 && !data.weeklyIncome) e.weeklyIncome = 'Weekly income is required'
    if (step === 2 && !data.visaStatus) e.visaStatus = 'Select visa status'
    if (step === 2 && !data.rentalBudget) e.rentalBudget = 'Rental budget is required'
    return e
  }

  const handleNext = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    if (step < steps.length - 1) setStep(s => s + 1)
    else {
      setSaving(true)
      try {
        await api.saveProfile({
          full_name: data.fullName,
          phone: data.phone,
          age: data.age ? parseInt(data.age) : null,
          bio: data.bio || null,
          occupation: data.occupation || null,
          employment_status: data.employmentStatus || null,
          weekly_income: data.weeklyIncome ? parseFloat(data.weeklyIncome) : null,
          visa_status: data.visaStatus || null,
          rental_budget: data.rentalBudget ? parseFloat(data.rentalBudget) : null,
          suburb: data.suburb || null,
        }, token)
        onComplete(data)
      } catch (err) {
        setErrors({ submit: err.message })
      } finally {
        setSaving(false)
      }
    }
  }

  const progressPercent = ((step + 1) / steps.length) * 100

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
      <div className="bg-mesh" />
      <div style={{ width: '100%', maxWidth: 560, position: 'relative', zIndex: 1 }} className="fade-up">
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>{i < step ? '✓' : i + 1}</div>
                {i < steps.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>
          <div className="prog-bar">
            <div className="prog-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="glass" style={{ padding: 32, borderRadius: 16, marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{steps[step].label} Details</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 24 }}>Step {step + 1} of {steps.length}</p>

          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="inp-label">Full Name *</label>
                <input className="inp" value={data.fullName} onChange={e => upd('fullName', e.target.value)} placeholder="Alex Johnson" />
                {errors.fullName && <div className="error-msg">{errors.fullName}</div>}
              </div>
              <div>
                <label className="inp-label">Age</label>
                <input className="inp" type="number" min="18" max="120" value={data.age} onChange={e => upd('age', e.target.value)} placeholder="e.g., 28" />
              </div>
              <div>
                <label className="inp-label">Phone Number *</label>
                <input className="inp" value={data.phone} onChange={e => upd('phone', e.target.value)} placeholder="+61 4XX XXX XXX" />
                {errors.phone && <div className="error-msg">{errors.phone}</div>}
              </div>
              <div>
                <label className="inp-label">Short Bio (optional)</label>
                <textarea className="inp" rows="3" value={data.bio} onChange={e => upd('bio', e.target.value)} placeholder="A brief note about yourself for landlords..." style={{ resize: 'none' }} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="inp-label">Occupation *</label>
                <input className="inp" value={data.occupation} onChange={e => upd('occupation', e.target.value)} placeholder="e.g., Software Engineer" />
                {errors.occupation && <div className="error-msg">{errors.occupation}</div>}
              </div>
              <div>
                <label className="inp-label">Employment Status *</label>
                <select className="inp" value={data.employmentStatus} onChange={e => upd('employmentStatus', e.target.value)}>
                  <option value="">Select employment status</option>
                  <option value="Full-time employed">Full-time employed</option>
                  <option value="Part-time employed">Part-time employed</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Contractor">Contractor</option>
                  <option value="Student">Student</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
                {errors.employmentStatus && <div className="error-msg">{errors.employmentStatus}</div>}
              </div>
              <div>
                <label className="inp-label">Weekly Income *</label>
                <input className="inp" type="number" value={data.weeklyIncome} onChange={e => upd('weeklyIncome', e.target.value)} placeholder="e.g., 1200" />
                {errors.weeklyIncome && <div className="error-msg">{errors.weeklyIncome}</div>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="inp-label">Visa Status *</label>
                <select className="inp" value={data.visaStatus} onChange={e => upd('visaStatus', e.target.value)}>
                  <option value="">Select visa status</option>
                  <option value="Australian Citizen">Australian Citizen</option>
                  <option value="Permanent Resident">Permanent Resident</option>
                  <option value="Temporary Graduate Visa (485)">Temporary Graduate Visa (485)</option>
                  <option value="Student Visa">Student Visa</option>
                  <option value="Working Holiday Visa">Working Holiday Visa</option>
                  <option value="Other">Other</option>
                </select>
                {errors.visaStatus && <div className="error-msg">{errors.visaStatus}</div>}
              </div>
              <div>
                <label className="inp-label">Weekly Rental Budget (AUD) *</label>
                <input className="inp" type="number" value={data.rentalBudget} onChange={e => upd('rentalBudget', e.target.value)} placeholder="e.g., 550" />
                {errors.rentalBudget && <div className="error-msg">{errors.rentalBudget}</div>}
              </div>
              <div>
                <label className="inp-label">Preferred Suburbs</label>
                <input className="inp" value={data.suburb} onChange={e => upd('suburb', e.target.value)} placeholder="e.g., Carlton, Fitzroy, Melbourne" />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, background: 'rgba(0,201,177,0.06)', borderRadius: 10, border: '1px solid rgba(0,201,177,0.15)', marginBottom: 24 }}>
          <Icons.Shield />
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
            <strong>Data minimization:</strong> We collect only what's necessary for your application. You control exactly what gets shared with landlords.
          </p>
        </div>

        {errors.submit && <div className="error-msg" style={{ marginBottom: 12 }}>{errors.submit}</div>}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
          <button className="btn-secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{ flex: 1 }}>Back</button>
          <button className="btn-primary" onClick={handleNext} disabled={saving} style={{ flex: 1 }}>
            {saving ? <Icons.Loader /> : step === steps.length - 1 ? 'Complete Profile' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── UPLOAD CARD COMPONENT ────────────────────────────────────
function UploadCard({ doc, uploaded, progress, onFileChosen, onRemove }) {
  const inputRef = useRef(null)
  const isUploading = progress !== undefined && progress < 100

  const handleFiles = (files) => {
    if (!files || !files[0]) return
    onFileChosen(doc.id, files[0])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="fade-up card-hover">
      <input ref={inputRef} type="file" onChange={e => handleFiles(e.target.files)} style={{ display: 'none' }} />
      <div
        className={`drop-zone ${uploaded ? 'uploaded' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !uploaded && !isUploading && inputRef.current?.click()}
        style={{ display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', cursor: uploaded ? 'default' : 'pointer' }}
      >
        <div style={{ fontSize: 32, flexShrink: 0 }}>{doc.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{doc.label}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{doc.desc}</div>
          {uploaded ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--teal)' }}>
              <Icons.Check />
              <span style={{ fontSize: 12 }}>Uploaded</span>
              <button onClick={(e) => { e.stopPropagation(); onRemove(doc.id) }} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                Remove
              </button>
            </div>
          ) : isUploading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{Math.round(progress)}%</span>
            </div>
          ) : (
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Click to upload or drag and drop</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── DOCUMENTS PAGE ───────────────────────────────────────────
function DocumentsPage({ onComplete }) {
  const docs = [
    { id: 'passport', icon: '🛂', label: 'Passport/ID', desc: 'Photo ID page', required: true },
    { id: 'payslips', icon: '💰', label: 'Payslips', desc: 'Last 3 months', required: true },
    { id: 'bank', icon: '🏦', label: 'Bank Statements', desc: 'Last 3 months', required: true },
    { id: 'employment', icon: '📋', label: 'Employment Letter', desc: 'Current employer', required: false },
    { id: 'studentid', icon: '🎓', label: 'Student ID', desc: 'If applicable', required: false },
  ]

  const [uploads, setUploads] = useState({})
  const [progress, setProgress] = useState({})

  const handleFileChosen = (id, file) => {
    setProgress(p => ({ ...p, [id]: 0 }))
    const interval = setInterval(() => {
      setProgress(p => {
        const cur = p[id] || 0
        if (cur >= 100) { clearInterval(interval); setUploads(u => ({ ...u, [id]: file })); return { ...p, [id]: 100 } }
        return { ...p, [id]: cur + Math.random() * 40 }
      })
    }, 200)
  }

  const handleRemove = (id) => {
    setUploads(u => { const n = {...u}; delete n[id]; return n })
    setProgress(p => { const n = {...p}; delete n[id]; return n })
  }

  const requiredDocs = docs.filter(d => d.required)
  const uploadedRequired = requiredDocs.filter(d => uploads[d.id]).length
  const canSubmit = uploadedRequired === requiredDocs.length

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px', position: 'relative' }}>
      <div className="bg-mesh" />
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Upload Documents</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 16 }}>
            Upload required documents to strengthen your rental application. {uploadedRequired}/{requiredDocs.length} required documents uploaded.
          </p>
          <div className="prog-bar">
            <div className="prog-fill" style={{ width: `${(uploadedRequired / requiredDocs.length) * 100}%` }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {docs.map(doc => (
            <UploadCard key={doc.id} doc={doc} uploaded={!!uploads[doc.id]} progress={progress[doc.id]} onFileChosen={handleFileChosen} onRemove={handleRemove} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, background: 'rgba(0,201,177,0.06)', borderRadius: 10, border: '1px solid rgba(0,201,177,0.15)', marginBottom: 24 }}>
          <Icons.Shield />
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
            <strong>Secure & Encrypted:</strong> Your documents are protected with end-to-end encryption. Agents only see files you explicitly approve for each application.
          </p>
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={onComplete} disabled={!canSubmit}>
          {canSubmit ? 'Continue to Review' : 'Upload Required Documents'}
        </button>
      </div>
    </div>
  )
}

// ─── REVIEW PAGE ──────────────────────────────────────────────
function ReviewPage({ user, profileData, token, onSubmit }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const doSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await api.submitApplication({
        full_name: profileData?.fullName || user?.name,
        email: user?.email,
        phone: profileData?.phone,
        age: profileData?.age ? parseInt(profileData.age) : null,
        occupation: profileData?.occupation || null,
        employment_status: profileData?.employmentStatus || null,
        weekly_income: profileData?.weeklyIncome ? parseFloat(profileData.weeklyIncome) : null,
        visa_status: profileData?.visaStatus || null,
        rental_budget: profileData?.rentalBudget ? parseFloat(profileData.rentalBudget) : null,
        suburb: profileData?.suburb || null,
      }, token)
      onSubmit()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px', position: 'relative' }}>
      <div className="bg-mesh" />
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Review Your Application</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Confirm your details before submission.</p>
        </div>

        <div className="glass card-hover" style={{ padding: 24, marginBottom: 20, borderRadius: 16 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icons.User /> Personal Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 600 }}>Name</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{profileData?.fullName || user?.name}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 600 }}>Email</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user?.email}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 600 }}>Phone</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{profileData?.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 600 }}>Age</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{profileData?.age || 'Not provided'}</div>
            </div>
          </div>
        </div>

        <div className="glass card-hover" style={{ padding: 24, marginBottom: 20, borderRadius: 16 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icons.BarChart /> Employment Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 600 }}>Occupation</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{profileData?.occupation}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 600 }}>Status</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{profileData?.employmentStatus}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 600 }}>Weekly Income</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>${profileData?.weeklyIncome}/week</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, background: 'rgba(34,197,94,0.06)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.15)', marginBottom: 24 }}>
          <Icons.Shield />
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
            <strong>Consent:</strong> By submitting, you consent to share this verified information with property agents for rental applications only. You can withdraw consent at any time.
          </p>
        </div>

        {error && <div className="error-msg" style={{ marginBottom: 12 }}>{error}</div>}
        <button className="btn-primary" style={{ width: '100%', marginBottom: 12 }} onClick={doSubmit} disabled={submitting}>
          {submitting ? <Icons.Loader /> : 'Submit Application'}
        </button>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          By submitting, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

// ─── SUCCESS PAGE ─────────────────────────────────────────────
function SuccessPage() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCount(c => { if (c >= 100) { clearInterval(t); return 100 } return c + 4 }), 30)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, position: 'relative' }}>
      <div className="bg-mesh" />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 500 }} className="scale-in">
        <div style={{ marginBottom: 24 }}>
          <div className="success-ring" style={{ margin: '0 auto' }}>
            <Icons.Check />
          </div>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, fontFamily: 'Sora,sans-serif' }}>
          Application Submitted!
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
          Your rental profile has been created and verified.
        </p>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, marginBottom: 24, overflow: 'hidden' }}>
          <div className="prog-fill" style={{ width: `${count}%`, background: 'linear-gradient(90deg, var(--success), #4ade80)' }} />
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>
          {Math.round(count)}% profile strength - Ready to apply to properties
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'rgba(34,197,94,0.1)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.2)' }}>
            <Icons.Check />
            <span style={{ fontSize: 13 }}>Identity verified</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'rgba(34,197,94,0.1)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.2)' }}>
            <Icons.Check />
            <span style={{ fontSize: 13 }}>Employment confirmed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'rgba(34,197,94,0.1)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.2)' }}>
            <Icons.Check />
            <span style={{ fontSize: 13 }}>Ready for applications</span>
          </div>
        </div>

        <p style={{ marginTop: 28, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
          ✓ Your data is secure and only shared with your explicit consent
        </p>
      </div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState('login')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [profileData, setProfileData] = useState(null)

  const handleLogin = (u, t) => { setUser(u); setToken(t); setPhase('profile') }
  const handleProfileDone = (data) => { setProfileData(data); setPhase('documents') }
  const handleDocsDone = () => { setPhase('review') }
  const handleSubmit = () => { setPhase('success') }

  if (phase === 'login') return <LoginPage onLogin={handleLogin} />
  if (phase === 'profile') return <ProfilePage user={user} token={token} onComplete={handleProfileDone} />
  if (phase === 'documents') return <DocumentsPage onComplete={handleDocsDone} />
  if (phase === 'review') return <ReviewPage user={user} profileData={profileData} token={token} onSubmit={handleSubmit} />
  if (phase === 'success') return <SuccessPage />

  return null
}
