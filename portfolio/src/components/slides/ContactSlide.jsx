import { useState } from 'react'
import TunnelSlide from '../TunnelSlide'
import s from './slides.module.css'
import { FiMail, FiLinkedin, FiGithub, FiMapPin, FiSend } from 'react-icons/fi'

const CONTACTS = [
  { icon: FiMail,     label: 'Email',    value: 'sambhav.sehgal.007@gmail.com', href: 'mailto:sambhav.sehgal.007@gmail.com' },
  { icon: FiLinkedin, label: 'LinkedIn', value: 'linkedin.com/in/sambhav-sehgal', href: 'https://linkedin.com/in/sambhav-sehgal-35896a334' },
  { icon: FiGithub,   label: 'GitHub',   value: 'github.com/sambhav', href: 'https://github.com' },
  { icon: FiMapPin,   label: 'Location', value: 'Ambala, Haryana, India', href: null },
]

function Left() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 8 }}>
      <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 4 }}>
        Always open to discussing <span className={s.hl}>new projects</span>, freelance opportunities,
        or just geeking out about tech. Let's build something together.
      </p>
      {CONTACTS.map(({ icon: Icon, label, value, href }) =>
        href ? (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={s.contactItem}>
            <div className={s.contactIcon}><Icon size={18} /></div>
            <div>
              <div className={s.contactLabel}>{label}</div>
              <div className={s.contactValue}>{value}</div>
            </div>
          </a>
        ) : (
          <div key={label} className={s.contactItem}>
            <div className={s.contactIcon}><Icon size={18} /></div>
            <div>
              <div className={s.contactLabel}>{label}</div>
              <div className={s.contactValue}>{value}</div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

function Right() {
  const [form, setForm] = useState({ name: '', email: '', msg: '' })

  const handleChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Open mailto with form values — no server required
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.msg}`)
    window.location.href = `mailto:sambhav.sehgal.007@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 8 }}>
      <div className={s.formGroup}>
        <label className={s.formLabel}>Your Name</label>
        <input
          className={s.formInput}
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange('name')}
          required
        />
      </div>
      <div className={s.formGroup}>
        <label className={s.formLabel}>Email Address</label>
        <input
          type="email"
          className={s.formInput}
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange('email')}
          required
        />
      </div>
      <div className={s.formGroup}>
        <label className={s.formLabel}>Message</label>
        <textarea
          className={s.formTextarea}
          rows={4}
          placeholder="Let's talk about your project…"
          value={form.msg}
          onChange={handleChange('msg')}
          required
          style={{ minHeight: 100 }}
        />
      </div>
      <button type="submit" className={s.formSubmit}>
        <FiSend size={15} /> Send Message
      </button>
    </form>
  )
}

export default function ContactSlide() {
  return (
    <TunnelSlide
      tag="// contact"
      title="Let's Build Together"
      left={<Left />}
      right={<Right />}
    />
  )
}
