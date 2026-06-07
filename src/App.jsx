import React, { useState, useEffect, useRef } from 'react'
import { api } from './api'

// ─── ICONS ────────────────────────────────────────────────────
const Icons = {
  Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  FileText: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Upload: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  BarChart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Shield: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Mail: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>,
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
  const [emailSent, setEmailSent] = useState(false)

  const validate = () => {
    const e = {}
    if (!email || !email.includes('@')) e.email = 'Enter a valid email address'
    if (password.length < 6) e.password = 'Password must be at least 6 characters'
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

      // Supabase requires email confirmation — no token returned yet
      if (!data.access_token) {
        setEmailSent(true)
        setLoading(false)
        return
      }
      onLogin({ name: data.user.name || name || email, email: data.user.email, id: data.user.id }, data.access_token)
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  const clearError = (key) => setErrors(p => { const n = {...p}; delete n[key]; return n })

  if (emailSent) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, position:'relative' }}>
        <div className="bg-mesh" />
        <div className="scale-in glass" style={{ padding:40, maxWidth:420, width:'100%', textAlign:'center', position:'relative', zIndex:1 }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(0,201,177,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <Icons.Mail />
          </div>
          <h2 style={{ fontSize:22, fontWeight:700, marginBottom:10 }}>Check your email</h2>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:14, marginBottom:24, lineHeight:1.6 }}>
            We sent a confirmation link to <strong style={{ color:'var(--teal)' }}>{email}</strong>.<br/>
            Click the link in the email to activate your account, then come back to sign in.
          </p>
          <button className="btn-secondary" style={{ width:'100%' }} onClick={() => { setEmailSent(false); setMode('login') }}>
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-wrapper" style={{ minHeight:'100vh', display:'flex', position:'relative', overflow:'hidden' }}>
      <div className="bg-mesh" />
      <div className="orb" style={{ width:400, height:400, background:'rgba(0,201,177,0.08)', top:-100, left:-100, animation:'orbFloat1 8s ease-in-out infinite' }} />
      <div className="orb" style={{ width:300, height:300, background:'rgba(30,58,138,0.3)', bottom:-80, right:-60, animation:'orbFloat2 10s ease-in-out infinite' }} />

      {/* Left hero */}
      <div className="hide-mobile" style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px 72px', position:'relative', zIndex:1 }}>
        <div className="fade-up" style={{ maxWidth:480 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:'linear-gradient(135deg,var(--teal),var(--teal2))', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icons.Home />
            </div>
            <span style={{ fontSize:18, fontWeight:700, letterSpacing:'.3px' }}>RentReady</span>
          </div>
          <h1 style={{ fontSize:50, fontWeight:800, marginBottom:20, fontFamily:'Sora,sans-serif', lineHeight:1.1, letterSpacing:'-1px' }}>
            Rental applications,{' '}
            <span style={{ background:'linear-gradient(135deg,#00C9B1,#00E5CC)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              simplified.
            </span>
          </h1>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.65)', marginBottom:32, lineHeight:1.7 }}>
            Build your rental profile once. Apply to properties with confidence. Get approved faster.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {['One-click applications', 'Trusted by property agents', 'Secure & encrypted documents'].map(f => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(0,201,177,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icons.Check />
                </div>
                <span style={{ fontSize:14, color:'rgba(255,255,255,0.75)' }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:36, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.08)', fontSize:12, color:'rgba(255,255,255,0.4)' }}>
            Privacy-first design &nbsp;·&nbsp; Australian-compliant &nbsp;·&nbsp; End-to-end encrypted
          </div>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="login-form-panel" style={{ width:'100%', maxWidth:460, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 40px', position:'relative', zIndex:1 }}>
        <div style={{ width:'100%' }}>
          {/* Mobile logo */}
          <div className="hide-desktop" style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ fontSize:22, fontWeight:700 }}>RentReady</div>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginTop:4 }}>Australia's rental application platform</p>
          </div>

          <div style={{ marginBottom:28, textAlign:'center' }}>
            <h2 style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13 }}>
              {mode === 'login' ? 'Sign in to access your rental profile' : 'Get started with RentReady today'}
            </p>
          </div>

          <div className="glass" style={{ padding:28, borderRadius:16 }}>
            {mode === 'signup' && (
              <div style={{ marginBottom:16 }}>
                <label className="inp-label">Full Name</label>
                <input className="inp" placeholder="e.g. Alex Johnson" value={name}
                  onChange={e => { setName(e.target.value); clearError('name') }} />
                {errors.name && <div className="error-msg">{errors.name}</div>}
              </div>
            )}
            <div style={{ marginBottom:16 }}>
              <label className="inp-label">Email Address</label>
              <input className="inp" type="email" placeholder="your@email.com" value={email}
                onChange={e => { setEmail(e.target.value); clearError('email') }} />
              {errors.email && <div className="error-msg">{errors.email}</div>}
            </div>
            <div style={{ marginBottom:24 }}>
              <label className="inp-label">Password</label>
              <input className="inp" type="password" placeholder="••••••••" value={password}
                onChange={e => { setPassword(e.target.value); clearError('password') }} />
              {errors.password && <div className="error-msg">{errors.password}</div>}
            </div>

            {errors.submit && (
              <div style={{ marginBottom:16, padding:'10px 14px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, color:'#EF4444', fontSize:13 }}>
                {errors.submit}
              </div>
            )}

            <button className="btn-primary" style={{ width:'100%', marginBottom:16 }} onClick={handleSubmit} disabled={loading}>
              {loading ? <Icons.Loader /> : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div style={{ textAlign:'center', color:'rgba(255,255,255,0.55)', fontSize:13 }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button style={{ background:'none', border:'none', color:'var(--teal)', fontWeight:600, cursor:'pointer', fontSize:13 }}
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrors({}) }}>
                {mode === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </div>
          </div>

          <div className="info-notice" style={{ marginTop:20 }}>
            <Icons.Shield />
            <p><strong>Privacy Protected:</strong> Your data is encrypted end-to-end. We only share what you explicitly approve with property agents.</p>
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
    visaStatus: '', weeklyIncome: '', rentalBudget: '', suburb: '', phone: '', bio: '',
  })
  const [errors, setErrors] = useState({})

  const steps = [
    { label:'Personal',       icon:'👤' },
    { label:'Employment',     icon:'💼' },
    { label:'Rental Prefs',   icon:'🏠' },
  ]

  const upd = (k, v) => { setData(p => ({...p, [k]:v})); if (errors[k]) setErrors(p => { const n={...p}; delete n[k]; return n }) }

  const validate = () => {
    const e = {}
    if (!data.fullName.trim()) e.fullName = 'Name is required'
    if (step === 0 && !data.phone.trim()) e.phone = 'Phone number is required'
    if (step === 1 && !data.occupation.trim()) e.occupation = 'Occupation is required'
    if (step === 1 && !data.employmentStatus) e.employmentStatus = 'Select your employment status'
    if (step === 1 && !data.weeklyIncome) e.weeklyIncome = 'Weekly income is required'
    if (step === 2 && !data.visaStatus) e.visaStatus = 'Select your visa status'
    if (step === 2 && !data.rentalBudget) e.rentalBudget = 'Rental budget is required'
    return e
  }

  const handleNext = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    if (step < steps.length - 1) { setStep(s => s + 1); return }
    setSaving(true)
    try {
      await api.saveProfile({
        full_name: data.fullName, phone: data.phone,
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

  const pct = ((step + 1) / steps.length) * 100

  return (
    <div className="page">
      <div className="bg-mesh" />
      <div className="page-inner fade-up">
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <h1 style={{ fontSize:26, fontWeight:700, marginBottom:6 }}>Build Your Rental Profile</h1>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14 }}>Complete all steps to start applying for properties</p>
        </div>

        {/* Steps */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:14 }}>
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                  <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize:10, fontWeight:600, color: i <= step ? 'var(--teal)' : 'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'.5px', whiteSpace:'nowrap' }}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} style={{ marginBottom:20 }} />}
              </React.Fragment>
            ))}
          </div>
          <div className="prog-bar">
            <div className="prog-fill" style={{ width:`${pct}%` }} />
          </div>
        </div>

        {/* Form card */}
        <div className="glass" style={{ padding:28, marginBottom:20 }}>
          <h2 style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>{steps[step].icon} {steps[step].label} Details</h2>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, marginBottom:24 }}>Step {step+1} of {steps.length}</p>

          {step === 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label className="inp-label">Full Name *</label>
                <input className="inp" value={data.fullName} onChange={e => upd('fullName', e.target.value)} placeholder="Alex Johnson" />
                {errors.fullName && <div className="error-msg">{errors.fullName}</div>}
              </div>
              <div>
                <label className="inp-label">Age</label>
                <input className="inp" type="number" min="18" max="120" value={data.age} onChange={e => upd('age', e.target.value)} placeholder="e.g. 28" />
              </div>
              <div>
                <label className="inp-label">Phone Number *</label>
                <input className="inp" value={data.phone} onChange={e => upd('phone', e.target.value)} placeholder="+61 4XX XXX XXX" />
                {errors.phone && <div className="error-msg">{errors.phone}</div>}
              </div>
              <div>
                <label className="inp-label">Short Bio (optional)</label>
                <textarea className="inp" rows="3" value={data.bio} onChange={e => upd('bio', e.target.value)}
                  placeholder="A brief note about yourself for landlords..." style={{ resize:'none', lineHeight:1.6 }} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label className="inp-label">Occupation *</label>
                <input className="inp" value={data.occupation} onChange={e => upd('occupation', e.target.value)} placeholder="e.g. Software Engineer" />
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
                <label className="inp-label">Weekly Income (AUD) *</label>
                <input className="inp" type="number" value={data.weeklyIncome} onChange={e => upd('weeklyIncome', e.target.value)} placeholder="e.g. 1200" />
                {errors.weeklyIncome && <div className="error-msg">{errors.weeklyIncome}</div>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label className="inp-label">Visa / Residency Status *</label>
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
                <input className="inp" type="number" value={data.rentalBudget} onChange={e => upd('rentalBudget', e.target.value)} placeholder="e.g. 550" />
                {errors.rentalBudget && <div className="error-msg">{errors.rentalBudget}</div>}
              </div>
              <div>
                <label className="inp-label">Preferred Suburbs</label>
                <input className="inp" value={data.suburb} onChange={e => upd('suburb', e.target.value)} placeholder="e.g. Carlton, Fitzroy, Melbourne CBD" />
              </div>
            </div>
          )}
        </div>

        <div className="info-notice" style={{ marginBottom:20 }}>
          <Icons.Shield />
          <p><strong>Data minimization:</strong> We collect only what's necessary. You control exactly what gets shared with landlords.</p>
        </div>

        {errors.submit && (
          <div style={{ marginBottom:16, padding:'10px 14px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, color:'#EF4444', fontSize:13 }}>
            {errors.submit}
          </div>
        )}

        <div className="btn-row" style={{ display:'flex', gap:12 }}>
          <button className="btn-secondary" onClick={() => setStep(s => Math.max(0, s-1))} disabled={step === 0} style={{ flex:1 }}>
            Back
          </button>
          <button className="btn-primary" onClick={handleNext} disabled={saving} style={{ flex:2 }}>
            {saving ? <Icons.Loader /> : step === steps.length-1 ? 'Save & Continue' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── UPLOAD CARD ──────────────────────────────────────────────
function UploadCard({ doc, uploaded, progress, onFileChosen, onRemove }) {
  const inputRef = useRef(null)
  const isUploading = progress !== undefined && progress < 100

  const handleFiles = (files) => { if (files?.[0]) onFileChosen(doc.id, files[0]) }
  const handleDrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }

  return (
    <div className="card-hover">
      <input ref={inputRef} type="file" onChange={e => handleFiles(e.target.files)} style={{ display:'none' }} />
      <div
        className={`drop-zone ${uploaded ? 'uploaded' : ''}`}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !uploaded && !isUploading && inputRef.current?.click()}
        style={{ display:'flex', alignItems:'center', gap:14, textAlign:'left', cursor: uploaded ? 'default' : 'pointer' }}
      >
        <div style={{ fontSize:28, flexShrink:0 }}>{doc.icon}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:600, marginBottom:3, fontSize:14 }}>
            {doc.label}
            {doc.required && <span style={{ color:'var(--teal)', marginLeft:4, fontSize:11 }}>*</span>}
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:6 }}>{doc.desc}</div>
          {uploaded ? (
            <div style={{ display:'flex', alignItems:'center', gap:6, color:'var(--success)' }}>
              <Icons.Check />
              <span style={{ fontSize:12, fontWeight:600 }}>Uploaded successfully</span>
              <button onClick={e => { e.stopPropagation(); onRemove(doc.id) }}
                style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:12 }}>
                Remove
              </button>
            </div>
          ) : isUploading ? (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ flex:1 }}>
                <div className="prog-bar"><div className="prog-fill" style={{ width:`${progress}%` }} /></div>
              </div>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', flexShrink:0 }}>{Math.round(progress)}%</span>
            </div>
          ) : (
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>Click to upload or drag & drop</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── DOCUMENTS PAGE ───────────────────────────────────────────
function DocumentsPage({ onComplete }) {
  const docs = [
    { id:'passport',   icon:'🛂', label:'Passport / Photo ID',   desc:'Clear photo of your passport or driver licence', required:true },
    { id:'payslips',   icon:'💰', label:'Payslips',               desc:'Last 3 months of payslips',                      required:true },
    { id:'bank',       icon:'🏦', label:'Bank Statements',        desc:'Last 3 months of bank statements',               required:true },
    { id:'employment', icon:'📋', label:'Employment Letter',      desc:'Letter from current employer confirming position', required:false },
    { id:'studentid',  icon:'🎓', label:'Student ID',             desc:'If applicable — current enrolment',              required:false },
  ]

  const [uploads, setUploads] = useState({})
  const [progress, setProgress] = useState({})

  const handleFileChosen = (id, file) => {
    setProgress(p => ({...p, [id]:0}))
    const iv = setInterval(() => {
      setProgress(p => {
        const cur = p[id] || 0
        if (cur >= 100) { clearInterval(iv); setUploads(u => ({...u, [id]:file})); return {...p, [id]:100} }
        return {...p, [id]: Math.min(100, cur + Math.random() * 35)}
      })
    }, 200)
  }

  const handleRemove = (id) => {
    setUploads(u => { const n={...u}; delete n[id]; return n })
    setProgress(p => { const n={...p}; delete n[id]; return n })
  }

  const required = docs.filter(d => d.required)
  const doneCount = required.filter(d => uploads[d.id]).length
  const canSubmit = doneCount === required.length

  return (
    <div className="page">
      <div className="bg-mesh" />
      <div className="page-inner">
        <div className="fade-up" style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:26, fontWeight:700, marginBottom:6 }}>Upload Documents</h1>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:14, marginBottom:14 }}>
            {doneCount} of {required.length} required documents uploaded
          </p>
          <div className="prog-bar">
            <div className="prog-fill" style={{ width:`${(doneCount / required.length) * 100}%` }} />
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
          {docs.map(doc => (
            <UploadCard key={doc.id} doc={doc} uploaded={!!uploads[doc.id]}
              progress={progress[doc.id]} onFileChosen={handleFileChosen} onRemove={handleRemove} />
          ))}
        </div>

        <div className="info-notice" style={{ marginBottom:24 }}>
          <Icons.Shield />
          <p><strong>Secure & Encrypted:</strong> Documents are protected with end-to-end encryption. Agents only see files you explicitly approve for each application.</p>
        </div>

        <button className="btn-primary" style={{ width:'100%' }} onClick={onComplete} disabled={!canSubmit}>
          {canSubmit ? 'Review & Submit Application' : `Upload ${required.length - doneCount} more required document${required.length - doneCount > 1 ? 's' : ''}`}
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
    setSubmitting(true); setError(null)
    try {
      await api.submitApplication({
        full_name: profileData?.fullName || user?.name,
        email: user?.email, phone: profileData?.phone,
        age: profileData?.age ? parseInt(profileData.age) : null,
        occupation: profileData?.occupation || null,
        employment_status: profileData?.employmentStatus || null,
        weekly_income: profileData?.weeklyIncome ? parseFloat(profileData.weeklyIncome) : null,
        visa_status: profileData?.visaStatus || null,
        rental_budget: profileData?.rentalBudget ? parseFloat(profileData.rentalBudget) : null,
        suburb: profileData?.suburb || null,
      }, token)
      onSubmit()
    } catch (err) { setError(err.message) }
    finally { setSubmitting(false) }
  }

  const Field = ({ label, value }) => (
    <div>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:4, textTransform:'uppercase', letterSpacing:'.5px', fontWeight:600 }}>{label}</div>
      <div style={{ fontSize:14, fontWeight:500, color: value ? 'white' : 'rgba(255,255,255,0.3)' }}>{value || '—'}</div>
    </div>
  )

  return (
    <div className="page">
      <div className="bg-mesh" />
      <div className="page-inner">
        <div className="fade-up" style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:26, fontWeight:700, marginBottom:6 }}>Review Your Application</h1>
          <p style={{ color:'rgba(255,255,255,0.55)' }}>Please confirm your details before submitting.</p>
        </div>

        <div className="glass card-hover" style={{ padding:24, marginBottom:16 }}>
          <h3 style={{ fontWeight:700, marginBottom:16, display:'flex', alignItems:'center', gap:8, fontSize:15 }}>
            <Icons.User /> Personal Information
          </h3>
          <div className="info-grid">
            <Field label="Full Name" value={profileData?.fullName || user?.name} />
            <Field label="Email" value={user?.email} />
            <Field label="Phone" value={profileData?.phone} />
            <Field label="Age" value={profileData?.age} />
          </div>
        </div>

        <div className="glass card-hover" style={{ padding:24, marginBottom:16 }}>
          <h3 style={{ fontWeight:700, marginBottom:16, display:'flex', alignItems:'center', gap:8, fontSize:15 }}>
            <Icons.BarChart /> Employment Details
          </h3>
          <div className="info-grid">
            <Field label="Occupation" value={profileData?.occupation} />
            <Field label="Status" value={profileData?.employmentStatus} />
            <Field label="Weekly Income" value={profileData?.weeklyIncome ? `$${profileData.weeklyIncome}/week` : null} />
            <Field label="Visa Status" value={profileData?.visaStatus} />
          </div>
        </div>

        <div className="glass card-hover" style={{ padding:24, marginBottom:20 }}>
          <h3 style={{ fontWeight:700, marginBottom:16, display:'flex', alignItems:'center', gap:8, fontSize:15 }}>
            <Icons.Home /> Rental Preferences
          </h3>
          <div className="info-grid">
            <Field label="Weekly Budget" value={profileData?.rentalBudget ? `$${profileData.rentalBudget}/week` : null} />
            <Field label="Preferred Suburbs" value={profileData?.suburb} />
          </div>
        </div>

        <div className="info-notice" style={{ marginBottom:20, background:'rgba(34,197,94,0.06)', borderColor:'rgba(34,197,94,0.2)' }}>
          <Icons.Shield />
          <p><strong>Consent:</strong> By submitting, you consent to share this verified information with property agents for rental applications only. You can withdraw consent at any time.</p>
        </div>

        {error && (
          <div style={{ marginBottom:16, padding:'10px 14px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, color:'#EF4444', fontSize:13 }}>
            {error}
          </div>
        )}

        <button className="btn-primary" style={{ width:'100%', marginBottom:10 }} onClick={doSubmit} disabled={submitting}>
          {submitting ? <Icons.Loader /> : 'Submit Application'}
        </button>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', textAlign:'center' }}>
          By submitting you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

// ─── SUCCESS PAGE ─────────────────────────────────────────────
function SuccessPage({ user }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCount(c => { if (c >= 100) { clearInterval(t); return 100 } return c + 3 }), 25)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="page" style={{ alignItems:'center', justifyContent:'center' }}>
      <div className="bg-mesh" />
      <div className="scale-in" style={{ position:'relative', zIndex:1, textAlign:'center', maxWidth:480, width:'100%' }}>
        <div style={{ marginBottom:24 }}>
          <div className="success-ring">
            <Icons.Check />
          </div>
        </div>
        <h1 style={{ fontSize:32, fontWeight:800, marginBottom:10, fontFamily:'Sora,sans-serif' }}>
          Application Submitted!
        </h1>
        <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', marginBottom:8, lineHeight:1.6 }}>
          Your rental profile has been created and verified.
        </p>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>
          {Math.round(count)}% profile strength
        </p>
        <div className="prog-bar" style={{ marginBottom:28 }}>
          <div className="prog-fill" style={{ width:`${count}%`, background:'linear-gradient(90deg, var(--success), #4ade80)' }} />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
          {['Identity verified', 'Employment confirmed', 'Documents secured', 'Ready for applications'].map(item => (
            <div key={item} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'rgba(34,197,94,0.08)', borderRadius:10, border:'1px solid rgba(34,197,94,0.2)' }}>
              <div style={{ color:'var(--success)', flexShrink:0 }}><Icons.Check /></div>
              <span style={{ fontSize:13, fontWeight:500 }}>{item}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>
          Your data is secure and only shared with your explicit consent
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

  if (phase === 'login')     return <LoginPage onLogin={handleLogin} />
  if (phase === 'profile')   return <ProfilePage user={user} token={token} onComplete={handleProfileDone} />
  if (phase === 'documents') return <DocumentsPage onComplete={handleDocsDone} />
  if (phase === 'review')    return <ReviewPage user={user} profileData={profileData} token={token} onSubmit={handleSubmit} />
  if (phase === 'success')   return <SuccessPage user={user} />
  return null
}
