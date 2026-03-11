import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiMail, FiLinkedin, FiGithub, FiMapPin, FiSend, FiCheck } from 'react-icons/fi'
import styles from './Contact.module.css'

export default function Contact() {
  const [ref, inView] = useInView()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const body = encodeURIComponent(`Hi Sambhav,\n\n${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`)
    window.location.href = `mailto:sambhav.sehgal.007@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="contact" className="section" ref={ref} style={{ background: 'rgba(13,13,26,0.5)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.88, rotateX: 18 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 1200, textAlign: 'center' }}
        >
          <span className="tag">// contact</span>
          <h2 className="section-title" style={{ marginTop: 16 }}>Let's Build Together</h2>
          <p className="section-subtitle" style={{ maxWidth: 500, margin: '0 auto 60px' }}>
            Have a project in mind or an opportunity to share? I'd love to connect.
          </p>
        </motion.div>

        <div className={styles.layout}>
          <motion.div
            className={styles.left}
            initial={{ opacity: 0, x: -65, rotateY: -20, scale: 0.88 }}
            animate={inView ? { opacity: 1, x: 0, rotateY: 0, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1200 }}
          >
            <h3 className={styles.contactHeading}>Get in Touch</h3>
            <p className={styles.contactText}>
              Currently open to freelance projects, full-time opportunities, and interesting collaborations.
              Reach out and let's make something great together.
            </p>

            <div className={styles.contactItems}>
              <a href="mailto:sambhav.sehgal.007@gmail.com" className={styles.contactItem}>
                <div className={styles.contactIcon}><FiMail /></div>
                <div>
                  <div className={styles.contactLabel}>Email</div>
                  <div className={styles.contactValue}>sambhav.sehgal.007@gmail.com</div>
                </div>
              </a>
              <a href="https://linkedin.com/in/sambhav-sehgal-35896a334" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                <div className={styles.contactIcon}><FiLinkedin /></div>
                <div>
                  <div className={styles.contactLabel}>LinkedIn</div>
                  <div className={styles.contactValue}>sambhav-sehgal-35896a334</div>
                </div>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                <div className={styles.contactIcon}><FiGithub /></div>
                <div>
                  <div className={styles.contactLabel}>GitHub</div>
                  <div className={styles.contactValue}>@sambhavsehgal</div>
                </div>
              </a>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><FiMapPin /></div>
                <div>
                  <div className={styles.contactLabel}>Location</div>
                  <div className={styles.contactValue}>Ambala, Haryana, India</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.right}
            initial={{ opacity: 0, x: 65, rotateY: 20, scale: 0.88 }}
            animate={inView ? { opacity: 1, x: 0, rotateY: 0, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1200 }}
          >
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Tell me about your project..."
                  rows={5}
                  required
                />
              </div>

              <motion.button
                type="submit"
                className={styles.submitBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {sent ? (
                  <><FiCheck /> Message sent!</>
                ) : (
                  <><FiSend /> Send Message</>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
