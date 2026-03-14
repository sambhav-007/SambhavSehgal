import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './VendingMachine.module.css'

export const SNACKS = [
  { id: 'lays',        name: 'Chips',           price: 20,  emoji: '🫓' },
  { id: 'coke-zero',   name: 'Soda',            price: 30,  emoji: '🥤' },
  { id: 'waffle',      name: 'Waffle',          price: 150, emoji: '🧇' },
  { id: 'burger',      name: 'Burger',          price: 50,  emoji: '🍔' },
  { id: 'chocolate',   name: 'Chocolate',       price: 100, emoji: '🍫' },
  { id: 'oreo',        name: 'Oreo Pack',       price: 40,  emoji: '🍪' },
  { id: 'fries',       name: 'Fries',           price: 80,  emoji: '🍟' },
  { id: 'cold-coffee', name: 'Cold Coffee',     price: 90,  emoji: '☕' },
  { id: 'donut',       name: 'Donut',           price: 70,  emoji: '🍩' },
  { id: 'brownie',     name: 'Brownie',         price: 120, emoji: '🟫' },
  { id: 'pizza-slice', name: 'Pizza Slice',     price: 110, emoji: '🍕' },
  { id: 'energy-drink',name: 'Energy Drink',    price: 95,  emoji: '⚡' },
]

const SLOT_CODES = ['A1','A2','A3','B1','B2','B3','C1','C2','C3','D1','D2','D3']
const QR_IMAGE_SRC = '/Gpay-QR.jpg'
const PAYMENT_HANDLE = 'UPI ID: sambhav.sehgal.007@okhdfcbank'

export default function VendingMachine({ onClose }) {
  const [cart, setCart]             = useState([])
  const [dispensing, setDispensing] = useState(null)
  const [checkout, setCheckout]     = useState(false)
  const [paid, setPaid]             = useState(false)

  const addToCart = (snack) => {
    setDispensing(snack.id)
    setTimeout(() => setDispensing(null), 900)
    setCart(prev => {
      const ex = prev.find(i => i.id === snack.id)
      return ex
        ? prev.map(i => i.id === snack.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...snack, qty: 1 }]
    })
  }

  const removeOne = (id) =>
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0)
    )

  const addOneFromCart = (id) => {
    const snack = SNACKS.find(item => item.id === id)
    if (snack) addToCart(snack)
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const total     = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const handleConfirm = () => { setPaid(true); setCart([]) }
  const handleClose   = () => { setPaid(false); setCheckout(false); onClose() }

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.88, opacity: 0, y: 50 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit   ={{ scale: 0.88, opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        {/* Banner */}
        <div className={styles.topBanner}>
          <span className={styles.bannerTitle}>🎰 Sambhav's Snack Station</span>
          <span className={styles.bannerSub}>Pick something tasty &amp; fuel the dev.</span>
        </div>

        <div className={styles.layout}>

          {/* ── 3D VENDING MACHINE ── */}
          <div className={styles.machineScene}>
            <div className={`${styles.machine} ${dispensing ? styles.machineActive : ''}`}>
              <div className={styles.machineAura} />
              <div className={styles.powerRail}>
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              {/* Illuminated header strip */}
              <div className={styles.machineHeader}>
                <div className={styles.machineHeaderText}>
                  CYBER<span>VENDOR</span>
                </div>
                <div className={styles.headerLights}>
                  {[...Array(8)].map((_, i) => (
                    <span
                      key={i}
                      className={styles.headerLight}
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </div>
              </div>

              {/* Glass panel with snack grid */}
              <div className={styles.glassPanel}>
                <div className={styles.scanline} />
                <div className={styles.glassGlare} />
                <div className={styles.glassReflection} />
                <div className={styles.snackGrid}>
                  {SNACKS.map((snack, i) => (
                    <motion.button
                      key={snack.id}
                      className={`${styles.snackSlot} ${dispensing === snack.id ? styles.dispensing : ''}`}
                      onClick={() => addToCart(snack)}
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.93 }}
                      title={snack.name}
                    >
                      <span className={styles.slotCodeSmall}>{SLOT_CODES[i]}</span>
                      <span className={styles.snackEmoji}>{snack.emoji}</span>
                      <span className={styles.snackName}>{snack.name}</span>
                      <span className={styles.snackPrice}>₹{snack.price}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Control panel */}
              <div className={styles.controlPanel}>
                <div className={styles.displayScreen}>
                  <span className={styles.displayCursor} />
                  {dispensing
                    ? '⚡  DISPENSING...'
                    : cartCount > 0
                      ? `🛒  ${cartCount} ITEM${cartCount !== 1 ? 'S' : ''} IN CART`
                      : '▸   SELECT AN ITEM'}
                </div>
                <div className={styles.ctrlRight}>
                  <div className={styles.systemTag}>SYS ONLINE</div>
                  <div className={styles.coinSlot}>
                    <span className={styles.coinLabel}>INSERT</span>
                    <div className={styles.coinSlit} />
                  </div>
                  <div className={styles.keypad}>
                    {['1','2','3','4','5','6','7','8','9','*','0','#'].map(k => (
                      <div key={k} className={styles.key}>{k}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dispense tray */}
              <div className={styles.dispenseTray}>
                <div className={`${styles.trayOpening} ${dispensing ? styles.trayOpeningActive : ''}`}>
                  <AnimatePresence>
                    {dispensing && (
                      <motion.span
                        className={styles.traySpark}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28 }}
                      />
                    )}
                    {dispensing && (
                      <motion.span
                        className={styles.trayItem}
                        initial={{ y: -28, opacity: 0, scale: 0.82 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 14 }}
                      >
                        {SNACKS.find(s => s.id === dispensing)?.emoji ?? '🍬'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>

          {/* ── CART PANEL ── */}
          <div className={styles.cartPanel}>
            <div className={styles.cartHeader}>
              <span>Your Cart</span>
              {cartCount > 0 && (
                <motion.span
                  className={styles.cartBadge}
                  key={cartCount}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </div>

            <div className={styles.cartBody}>
              <AnimatePresence initial={false}>
                {cart.length === 0 ? (
                  <motion.div
                    className={styles.emptyCart}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className={styles.emptyIcon}>🛒</div>
                    <p>Nothing added yet</p>
                    <p className={styles.emptyHint}>← Select from the machine</p>
                  </motion.div>
                ) : (
                  cart.map(item => (
                    <motion.div
                      key={item.id}
                      className={styles.cartItem}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0  }}
                      exit   ={{ opacity: 0, x: 24 }}
                      layout
                    >
                      <span className={styles.cartEmoji}>{item.emoji}</span>
                      <div className={styles.cartInfo}>
                        <div className={styles.cartName}>{item.name}</div>
                        <div className={styles.cartMeta}>₹{item.price} × {item.qty}</div>
                      </div>
                      <div className={styles.cartRight}>
                        <span className={styles.cartSubtotal}>₹{item.price * item.qty}</span>
                        <div className={styles.qtyControls}>
                          <button className={styles.qtyBtn} onClick={() => removeOne(item.id)} aria-label={`Remove one ${item.name}`}>−</button>
                          <span className={styles.qtyValue}>{item.qty}</span>
                          <button className={styles.qtyBtn} onClick={() => addOneFromCart(item.id)} aria-label={`Add one ${item.name}`}>+</button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className={styles.cartFooter}>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalAmt}>₹{total.toFixed(0)}</span>
              </div>
              <motion.button
                className={styles.payBtn}
                disabled={cart.length === 0}
                whileHover={cart.length > 0 ? { scale: 1.03 } : undefined}
                whileTap  ={cart.length > 0 ? { scale: 0.97 } : undefined}
                onClick={() => setCheckout(true)}
              >
                💳 &nbsp;Pay Now
              </motion.button>
              <p className={styles.poweredBy}>100% goes to snacks for Sambhav 🙏</p>
            </div>
          </div>

        </div>
      </motion.div>

      {/* ── CHECKOUT OVERLAY ── */}
      <AnimatePresence>
        {checkout && !paid && (
          <motion.div
            className={styles.checkoutOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setCheckout(false)}
          >
            <motion.div
              className={styles.checkoutBox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit   ={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className={styles.checkoutTitle}>Confirm Your Order 🧾</h2>

              <div className={styles.orderList}>
                {cart.map(i => (
                  <div key={i.id} className={styles.orderRow}>
                    <span>{i.emoji} {i.name} × {i.qty}</span>
                    <span>₹{i.price * i.qty}</span>
                  </div>
                ))}
              </div>

              <div className={styles.orderTotalRow}>
                <span>Total</span>
                <span className={styles.orderTotalAmt}>₹{total.toFixed(0)}</span>
              </div>

              <div className={styles.qrSection}>
                <div className={styles.qrFrame}>
                  <img className={styles.qrImage} src={QR_IMAGE_SRC} alt="Payment QR code for Sambhav" />
                </div>
                <div className={styles.paymentNote}>
                  <p>Scan and pay using any UPI app</p>
                  <p>{PAYMENT_HANDLE}</p>
                </div>
                <div className={styles.paymentMeta}>
                  <div className={styles.paymentMetaRow}>
                    <span>Amount</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                  <div className={styles.paymentMetaRow}>
                    <span>Items</span>
                    <span>{cartCount}</span>
                  </div>
                </div>
              </div>

              <div className={styles.checkoutActions}>
                <button className={styles.cancelBtn} onClick={() => setCheckout(false)}>← Back</button>
                <button className={styles.confirmBtn} onClick={handleConfirm}>I&apos;ve Paid</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {paid && (
          <motion.div
            className={styles.checkoutOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.checkoutBox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
            >
              <div className={styles.successIcon}>🎉</div>
              <h2 className={styles.checkoutTitle}>Thank You!</h2>
              <p className={styles.successMsg}>
                Snacks are on their way to Sambhav.<br />
                He'll build something awesome for you! 🚀
              </p>
              <button className={styles.confirmBtn} onClick={handleClose}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
