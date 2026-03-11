import { FiGithub, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoText}>SS</span>
          <span className={styles.logoDot}>.</span>
        </div>

        <p className={styles.copy}>
          Crafted with <FiHeart className={styles.heart} /> by Sambhav Sehgal · {new Date().getFullYear()}
        </p>

        <div className={styles.socials}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.social}>
            <FiGithub size={18} />
          </a>
          <a href="https://linkedin.com/in/sambhav-sehgal-35896a334" target="_blank" rel="noopener noreferrer" className={styles.social}>
            <FiLinkedin size={18} />
          </a>
          <a href="mailto:sambhav.sehgal.007@gmail.com" className={styles.social}>
            <FiMail size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
