
import { useState, useEffect } from "react";

const MENU = [
  { id: 1, name: "Turkey", desc: "Oven-roasted turkey breast, crisp lettuce, fresh tomato, light and lean", price: 8.99, tag: "CLASSIC", color: "#00ACC1", cal: 280 },
  { id: 2, name: "Turkey & Ham", desc: "Double protein — roasted turkey and smoked ham with Swiss cheese", price: 9.99, tag: "BESTSELLER", color: "#8D6E63", cal: 360 },
  { id: 3, name: "BMT", desc: "Genoa salami, spicy pepperoni and ham — the big one", price: 10.49, tag: "FAN FAV", color: "#FF6B35", cal: 490 },
  { id: 4, name: "Veggie Love", desc: "Avocado, roasted peppers, cucumber, spinach and herb tahini", price: 8.49, tag: "VEGAN", color: "#43A047", cal: 260 },
  { id: 5, name: "Teriyaki Sub", desc: "Tender teriyaki chicken, sesame slaw, pickled daikon and sriracha aioli", price: 10.99, tag: "SPICY", color: "#C62828", cal: 430 },
  { id: 6, name: "The Midnight", desc: "Spicy salami, black olive tapenade, roasted peppers, smoked provolone", price: 11.49, tag: "NEW", color: "#7B1FA2", cal: 520 },
];

const SALADS = [
  { id: 101, name: "Garden Fresh", desc: "Mixed greens, tomato, cucumber, red onion, olives, croutons", price: 7.49, tag: "VEGAN", color: "#43A047", cal: 180 },
  { id: 102, name: "Chicken Caesar", desc: "Grilled chicken, romaine, parmesan, croutons, Caesar dressing", price: 9.49, tag: "CLASSIC", color: "#00ACC1", cal: 320 },
  { id: 103, name: "Teriyaki Bowl", desc: "Teriyaki chicken, edamame, shredded cabbage, carrot, sesame dressing", price: 9.99, tag: "NEW", color: "#C62828", cal: 380 },
];

const BREADS = ["White", "Vollkorn", "Sesame", "Cheese Oregano"];
const SIZES = [{ label: '6"', note: "Half", price: 0 }, { label: '12"', note: "Full", price: 3.5 }];
const CHEESES = ["Provolone", "Aged Cheddar", "Fresh Mozzarella", "Swiss", "Pepper Jack", "None"];
const VEGGIES = ["Arugula", "Tomato", "Red Onion", "Cucumber", "Roasted Peppers", "Jalapenos", "Olives", "Pickles", "Spinach", "Avocado"];
const SAUCES = ["Garlic Aioli", "Honey Dijon", "Chipotle Mayo", "Herb Tahini", "Sriracha", "Pesto", "Balsamic Glaze", "Classic Mayo"];
const STEPS = ["Bread", "Cheese", "Veggies", "Sauce", "Toast", "Review"];

const DEFAULT_DEAL = { menuId: 5, price: "6.99", save: "Save up to $6", drinkImg: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=180&q=80" };

const SANDY_FLOW = [
  { id: "welcome", msg: "Hey! I'm Sandy! What kind of sub are you feeling today?", options: ["Meaty", "Veggie", "Spicy", "Light and healthy"], next: (a) => ({ "Meaty": "meaty", "Veggie": "veggie", "Spicy": "spicy", "Light and healthy": "light" })[a] },
  { id: "meaty", msg: "Love it! Classic deli or bold and hearty?", options: ["Classic deli", "Bold and hearty"], next: (a) => a === "Classic deli" ? "rec_turkey" : "rec_bmt" },
  { id: "veggie", msg: "Great! Strictly vegan or just love veggies?", options: ["Strictly vegan", "Just love veggies"], next: () => "rec_veggie" },
  { id: "spicy", msg: "Living on the edge! Medium or extra hot?", options: ["Medium spicy", "Extra hot"], next: () => "rec_teriyaki" },
  { id: "light", msg: "Smart choice! Watching calories or just prefer lighter?", options: ["Watching calories", "Lighter taste"], next: () => "rec_turkey" },
  { id: "rec_turkey", msg: "I recommend the Turkey! Lean, fresh and delicious. Want to add it?", options: ["Yes, add it!", "Just browsing"], rec: 1, next: (a) => a === "Yes, add it!" ? "added" : "browse" },
  { id: "rec_bmt", msg: "The BMT is your sub! Salami, pepperoni and ham. Want to try it?", options: ["Yes, add it!", "Just browsing"], rec: 3, next: (a) => a === "Yes, add it!" ? "added" : "browse" },
  { id: "rec_veggie", msg: "You will love Veggie Love! Avocado, roasted peppers, herb tahini. Add it?", options: ["Yes, add it!", "Just browsing"], rec: 4, next: (a) => a === "Yes, add it!" ? "added" : "browse" },
  { id: "rec_teriyaki", msg: "Teriyaki Sub is calling your name! Sriracha aioli and sesame slaw. Want it?", options: ["Yes, add it!", "Just browsing"], rec: 5, next: (a) => a === "Yes, add it!" ? "added" : "browse" },
  { id: "added", msg: "Awesome! Opening the customizer for you. Enjoy your sub!", options: ["Thanks Sandy!"], next: () => "done" },
  { id: "browse", msg: "No worries! Browse and tap any sub to customize. I am here if you need me!", options: ["Thanks!"], next: () => "done" },
];

function SandyAvatar({ onRecommend }) {
  const [minimized, setMinimized] = useState(false);
  const [stepId, setStepId] = useState("welcome");
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const step = SANDY_FLOW.find(s => s.id === stepId);

  useEffect(() => {
    const t = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 120); }, 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (speaking) {
      const t = setInterval(() => setGlowPulse(g => !g), 600);
      return () => clearInterval(t);
    } else setGlowPulse(false);
  }, [speaking]);

  const speak = (text) => {
    if (!text || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    // Calm neutral voice settings
    u.rate = 0.88;
    u.pitch = 1.0;
    u.volume = 1;
    // Try to pick a neutral/calm voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes("Google UK English Female") || v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Moira"));
    if (preferred) u.voice = preferred;
    setSpeaking(true);
    let mt;
    const tog = () => { setMouthOpen(o => !o); mt = setTimeout(tog, 220); };
    mt = setTimeout(tog, 100);
    u.onend = () => { setSpeaking(false); setMouthOpen(false); clearTimeout(mt); };
    window.speechSynthesis.speak(u);
  };

  useEffect(() => { if (step && !minimized) speak(step.msg); }, [stepId, minimized]);

  const handleOption = (opt) => {
    if (!step) return;
    if (step.rec && opt === "Yes, add it!") onRecommend && onRecommend(step.rec);
    const nextId = step.next(opt);
    if (nextId === "done") { setMinimized(true); return; }
    setStepId(nextId);
  };

  const wrap = { position: "fixed", bottom: 24, right: 20, zIndex: 300, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 };
  const chip = { background: "linear-gradient(135deg,#1a1a2e,#0f3460)", border: "1px solid rgba(100,180,255,0.4)", borderRadius: 24, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,100,255,0.2)" };
  const bubble = { background: "linear-gradient(135deg,#0d0d1a,#141428)", border: "1px solid rgba(100,180,255,0.25)", borderRadius: 16, padding: "14px 16px", maxWidth: 250, position: "relative", boxShadow: "0 8px 32px rgba(0,50,200,0.25)" };
  const tail = { position: "absolute", bottom: -8, right: 32, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid rgba(100,180,255,0.25)" };
  const optBtn = { background: "rgba(100,180,255,0.08)", border: "1px solid rgba(100,180,255,0.35)", borderRadius: 20, padding: "7px 13px", color: "#64B4FF", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", margin: "3px 3px 0 0", transition: "all 0.15s" };

  if (minimized) return (
    <div style={wrap}>
      <div style={chip} onClick={() => { setMinimized(false); setStepId("welcome"); }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#1a3a6e,#0a1a3e)", border: "1.5px solid rgba(100,180,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 8, height: 3, background: "#64B4FF", borderRadius: 2, boxShadow: "0 0 6px #64B4FF" }} />
        </div>
        <span style={{ fontSize: 13, color: "#A0C8FF", fontFamily: "DM Sans, sans-serif", fontWeight: 600, letterSpacing: 1 }}>ASK SANDY</span>
      </div>
    </div>
  );

  return (
    <div style={wrap}>
      {/* Speech bubble */}
      <div style={bubble}>
        <p style={{ fontSize: 13, color: "#C8E0FF", lineHeight: 1.6, margin: "0 0 10px", fontFamily: "DM Sans, sans-serif", fontWeight: 300 }}>{step && step.msg}</p>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {step && step.options && step.options.map(opt => (
            <button key={opt} style={optBtn} onClick={() => handleOption(opt)}>{opt}</button>
          ))}
        </div>
        <div style={tail} />
      </div>

      {/* Robot face + minimize */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
        {/* AI Robot Face */}
        <div onClick={() => step && speak(step.msg)} style={{ cursor: "pointer", position: "relative", width: 64, height: 64 }}>
          {/* Outer glow ring */}
          <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "transparent", border: "1.5px solid rgba(100,180,255," + (speaking ? (glowPulse ? "0.8" : "0.3") : "0.2") + ")", boxShadow: speaking ? "0 0 16px rgba(100,180,255,0.4)" : "none", transition: "all 0.4s" }} />
          {/* Head */}
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(160deg,#1a2a4a 0%,#0d1a30 60%,#0a1525 100%)", border: "1.5px solid rgba(100,180,255,0.3)", position: "relative", overflow: "hidden", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.6)" }}>
            {/* Scanline effect */}
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(100,180,255,0.02) 3px, rgba(100,180,255,0.02) 4px)", pointerEvents: "none" }} />
            {/* Top antenna dots */}
            <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: speaking ? "#64B4FF" : "#1a4a8a", boxShadow: speaking ? "0 0 6px #64B4FF" : "none", transition: "all 0.3s" }} />
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: speaking ? "#00E5FF" : "#0a2a4a", boxShadow: speaking ? "0 0 6px #00E5FF" : "none", transition: "all 0.3s", transitionDelay: "0.1s" }} />
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: speaking ? "#64B4FF" : "#1a4a8a", boxShadow: speaking ? "0 0 6px #64B4FF" : "none", transition: "all 0.3s", transitionDelay: "0.2s" }} />
            </div>
            {/* Eyes */}
            <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 12 }}>
              {/* Left eye */}
              <div style={{ width: 14, height: blink ? 2 : 10, borderRadius: blink ? 2 : 4, background: "linear-gradient(180deg,#00E5FF,#0066CC)", boxShadow: "0 0 8px rgba(0,229,255,0.7)", transition: "height 0.08s ease" }} />
              {/* Right eye */}
              <div style={{ width: 14, height: blink ? 2 : 10, borderRadius: blink ? 2 : 4, background: "linear-gradient(180deg,#00E5FF,#0066CC)", boxShadow: "0 0 8px rgba(0,229,255,0.7)", transition: "height 0.08s ease" }} />
            </div>
            {/* Mouth / speaker grille */}
            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", width: 36, height: 10, borderRadius: 5, background: "#0a1a30", border: "1px solid rgba(100,180,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: 3, overflow: "hidden" }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{ width: 2, borderRadius: 1, background: "#64B4FF", height: mouthOpen ? (i % 2 === 0 ? 6 : 3) : 3, boxShadow: "0 0 4px #64B4FF", transition: "height 0.15s ease", transitionDelay: i * 0.03 + "s" }} />
              ))}
            </div>
            {/* Cheek indicators */}
            <div style={{ position: "absolute", top: 26, left: 5, width: 6, height: 6, borderRadius: "50%", background: "rgba(100,180,255,0.15)", border: "1px solid rgba(100,180,255,0.2)" }} />
            <div style={{ position: "absolute", top: 26, right: 5, width: 6, height: 6, borderRadius: "50%", background: "rgba(100,180,255,0.15)", border: "1px solid rgba(100,180,255,0.2)" }} />
          </div>
        </div>
        {/* Minimize button */}
        <button style={{ background: "rgba(10,20,40,0.8)", border: "1px solid rgba(100,180,255,0.2)", borderRadius: "50%", width: 22, height: 22, color: "#4a7aaa", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setMinimized(true)}>—</button>
      </div>
    </div>
  );
}

function CustomizeModal({ item, onClose, onAddToCart }) {
  const [step, setStep] = useState(0);
  const [bread, setBread] = useState("White");
  const [size, setSize] = useState(SIZES[0]);
  const [cheese, setCheese] = useState("Provolone");
  const [veggies, setVeggies] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [toasted, setToasted] = useState(true);
  const toggle = (arr, setArr, val) => setArr(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);
  const total = (item.price + size.price).toFixed(2);

  const content = [
    <div key="b">
      <p className="step-title">Choose your bread</p><p className="step-hint">The foundation of your sub</p>
      <div className="pill-grid" style={{ marginBottom: 24 }}>
        {BREADS.map(b => <button key={b} className={"pill" + (bread === b ? " active" : "")} onClick={() => setBread(b)}>{b}</button>)}
      </div>
      <p className="step-title">Choose your size</p><p className="step-hint">Go half or go full</p>
      <div className="size-grid">
        {SIZES.map(s => (
          <div key={s.label} className={"size-card" + (size.label === s.label ? " active" : "")} onClick={() => setSize(s)}>
            <div className="size-big">{s.label}</div>
            <div className="size-note">{s.note}</div>
            <div className="size-price">{s.price > 0 ? "+" + "$" + s.price.toFixed(2) : "included"}</div>
          </div>
        ))}
      </div>
    </div>,
    <div key="c">
      <p className="step-title">Choose your cheese</p><p className="step-hint">Pick one to melt or skip it</p>
      <div className="pill-grid">{CHEESES.map(c => <button key={c} className={"pill" + (cheese === c ? " active" : "")} onClick={() => setCheese(c)}>{c}</button>)}</div>
    </div>,
    <div key="v">
      <p className="step-title">Load up your veggies</p><p className="step-hint">Select as many as you like</p>
      <div className="pill-grid">{VEGGIES.map(v => <button key={v} className={"pill" + (veggies.includes(v) ? " active" : "")} onClick={() => toggle(veggies, setVeggies, v)}>{v}</button>)}</div>
    </div>,
    <div key="s">
      <p className="step-title">Choose your sauces</p><p className="step-hint">Stack them, mix them</p>
      <div className="pill-grid">{SAUCES.map(s => <button key={s} className={"pill" + (sauces.includes(s) ? " active" : "")} onClick={() => toggle(sauces, setSauces, s)}>{s}</button>)}</div>
    </div>,
    <div key="t">
      <p className="step-title">Toasted?</p><p className="step-hint">Warm and crispy or fresh and cold</p>
      <div className="toast-grid">
        <div className={"toast-card" + (toasted ? " active" : "")} onClick={() => setToasted(true)}><div className="toast-emoji">🔥</div><div className="toast-label">Yes, toast it</div></div>
        <div className={"toast-card" + (!toasted ? " active" : "")} onClick={() => setToasted(false)}><div className="toast-emoji">❄️</div><div className="toast-label">Keep it fresh</div></div>
      </div>
    </div>,
    <div key="r" className="review">
      <div className="review-header"><div className="review-name">{item.name}</div><div className="review-total">{"$" + total}</div></div>
      <div className="review-rows">
        {[["Size", size.label + " — " + size.note], ["Bread", bread], ["Cheese", cheese], ["Toasted", toasted ? "Yes" : "No"], ["Veggies", veggies.length ? veggies.join(", ") : "None"], ["Sauces", sauces.length ? sauces.join(", ") : "None"]].map(([k, v]) => (
          <div key={k} className="review-row"><span className="review-key">{k}</span><span className="review-val">{v}</span></div>
        ))}
      </div>
    </div>
  ];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-header" style={{ position: "relative" }}>
          <div className="modal-eyebrow">Customize your order</div>
          <div className="modal-title">{item.name}</div>
          <div className="modal-desc">{item.desc}</div>
          <button className="btn-close" onClick={onClose}>X</button>
        </div>
        <div className="stepper">
          {STEPS.map((label, i) => (
            <div key={i} className={"step-item" + (i === step ? " active" : i < step ? " done" : "")}>
              <div className="step-num">{i < step ? "v" : i + 1}</div>
              <span className="step-name">{label}</span>
            </div>
          ))}
        </div>
        <div className="step-content">{content[step]}</div>
        <div className="modal-footer">
          {step > 0 && <button className="btn-back" onClick={() => setStep(s => s - 1)}>Back</button>}
          {step < 5
            ? <button className="btn-next" onClick={() => setStep(s => s + 1)}>Continue</button>
            : <button className="btn-add" onClick={() => { onAddToCart({ ...item, bread, size, cheese, veggies, sauces, toasted, totalPrice: total }); onClose(); }}>{"Add to Cart · $" + total}</button>
          }
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onRemove, mode, setMode, onPlaceOrder }) {
  const total = cart.reduce((s, i) => s + parseFloat(i.totalPrice), 0).toFixed(2);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="drawer-header">
          <div className="drawer-title">Your Order</div>
          <button className="btn-close" style={{ position: "static" }} onClick={onClose}>X</button>
        </div>
        <div className="mode-toggle" style={{ margin: "16px 24px" }}>
          {["Pickup", "Delivery"].map(m => (
            <button key={m} className={"mode-btn" + (mode === m ? " active" : "")} onClick={() => setMode(m)}>
              {m === "Pickup" ? "🏪 " : "🛵 "}{m}
            </button>
          ))}
        </div>
        <div className="cart-items">
          {cart.length === 0
            ? <div className="empty-cart"><div className="empty-icon">🥪</div><div className="empty-text">Nothing here yet.</div></div>
            : cart.map((item, idx) => (
              <div key={idx} className="cart-item">
                <div style={{ width: 3, borderRadius: 2, flexShrink: 0, background: item.color }} />
                <div className="cart-item-body">
                  <div className="cart-item-name">{item.name} <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 400 }}>{item.size.label}</span></div>
                  <div className="cart-item-detail">{item.bread} · {item.cheese}{item.toasted ? " · Toasted" : ""}</div>
                  {item.veggies.length > 0 && <div className="cart-item-detail">{item.veggies.join(", ")}</div>}
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-price">{"$" + item.totalPrice}</div>
                  <button className="btn-remove" onClick={() => onRemove(idx)}>REMOVE</button>
                </div>
              </div>
            ))
          }
        </div>
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="total-row">
              <span className="total-label">Total</span>
              <span className="total-val">{"$" + total}</span>
            </div>
            <button className="btn-order" onClick={onPlaceOrder}>{"Pay · $" + total}</button>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentScreen({ total, mode, onBack, onPay }) {
  const [cardNum, setCardNum] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const fmtCard = v => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = v => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d; };
  const cardLabel = () => { const n = cardNum.replace(/\s/g, ""); if (n.startsWith("4")) return "Visa"; if (n.startsWith("5")) return "Mastercard"; return "Card"; };
  const valid = cardNum.replace(/\s/g, "").length === 16 && name.length > 2 && expiry.length === 5 && cvv.length >= 3;
  const orderTotal = mode === "Delivery" ? (parseFloat(total) + 1.99).toFixed(2) : total;
  const pay = () => { if (!valid) return; setProcessing(true); setTimeout(() => { setProcessing(false); onPay(); }, 2000); };

  return (
    <div className="payment-screen">
      <div className="payment-wrap">
        <div className="payment-header">
          <button className="btn-back" onClick={onBack}>Back</button>
          <div className="payment-title">CHECKOUT</div>
          <div style={{ width: 60 }} />
        </div>
        <div className="card-visual">
          <div className="card-visual-top"><span className="card-chip">▣</span><span className="card-type">{cardLabel()}</span></div>
          <div className="card-visual-num">{cardNum || "•••• •••• •••• ••••"}</div>
          <div className="card-visual-bottom">
            <div><div className="card-visual-label">Card Holder</div><div className="card-visual-val">{name || "YOUR NAME"}</div></div>
            <div><div className="card-visual-label">Expires</div><div className="card-visual-val">{expiry || "MM/YY"}</div></div>
          </div>
        </div>
        <div className="payment-form">
          <div className="pay-field"><label className="pay-label">Card Number</label><input className="pay-input" value={cardNum} maxLength={19} onChange={e => setCardNum(fmtCard(e.target.value))} placeholder="1234 5678 9012 3456" /></div>
          <div className="pay-field"><label className="pay-label">Cardholder Name</label><input className="pay-input" value={name} onChange={e => setName(e.target.value)} placeholder="Name on card" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="pay-field"><label className="pay-label">Expiry</label><input className="pay-input" value={expiry} maxLength={5} onChange={e => setExpiry(fmtExp(e.target.value))} placeholder="MM/YY" /></div>
            <div className="pay-field"><label className="pay-label">CVV</label><input className="pay-input" value={cvv} maxLength={4} type="password" onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="..." /></div>
          </div>
        </div>
        <div className="pay-summary">
          <div className="pay-summary-row"><span>Order</span><span>{"$" + total}</span></div>
          <div className="pay-summary-row"><span>{mode === "Delivery" ? "Delivery fee" : "Pickup"}</span><span>{mode === "Delivery" ? "$1.99" : "Free"}</span></div>
          <div className="pay-summary-row pay-summary-total"><span>Total</span><span>{"$" + orderTotal}</span></div>
        </div>
        <button className={"pay-btn" + (valid && !processing ? " active" : "")} onClick={pay} disabled={!valid || processing}>
          {processing ? "Processing..." : "Pay $" + orderTotal}
        </button>
        <p className="pay-secure">Secured · Demo mode — no real charge</p>
      </div>
    </div>
  );
}

function SuccessScreen({ mode, onReset }) {
  return (
    <div className="success-screen">
      <div className="success-card">
        <span className="success-icon">{mode === "Pickup" ? "🏪" : "🛵"}</span>
        <div className="success-title">ORDER<br />PLACED</div>
        <p className="success-sub">{mode === "Pickup" ? "Your sub will be ready in about 10 minutes." : "On its way! Estimated delivery: 25-35 minutes."}</p>
        <div className="success-num">Order #SC-2847</div>
        <button className="btn-add" style={{ padding: "14px 32px", borderRadius: 12, fontSize: 14 }} onClick={onReset}>Start New Order</button>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --bg:#0A0A0A; --surface:#141414; --surface2:#1E1E1E; --border:#2A2A2A; --text:#F0EDE8; --muted:#666; --accent:#E8D5A3; --accent2:#FF6B35; --font-display:'Bebas Neue',sans-serif; --font-body:'DM Sans',sans-serif; }
  body { background:var(--bg); color:var(--text); font-family:var(--font-body); }
  .app { min-height:100vh; }
  .header { position:sticky; top:0; z-index:100; background:rgba(10,10,10,0.85); backdrop-filter:blur(20px); border-bottom:1px solid var(--border); padding:0 24px; }
  .header-inner { max-width:1000px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; height:64px; }
  .logo { display:flex; align-items:baseline; gap:3px; }
  .logo-dot { width:7px; height:7px; background:var(--accent2); border-radius:50%; margin-bottom:4px; }
  .logo-tag { font-size:9px; font-weight:600; letter-spacing:3px; color:var(--muted); text-transform:uppercase; margin-left:8px; align-self:center; }
  @keyframes logoFlash { 0%{opacity:1;text-shadow:none;} 8%{opacity:0.05;} 10%{opacity:1;text-shadow:0 0 30px rgba(232,213,163,0.9),0 0 60px rgba(232,213,163,0.5);} 12%{opacity:0.1;} 14%{opacity:1;text-shadow:0 0 20px rgba(232,213,163,0.7);} 50%{opacity:1;text-shadow:0 0 8px rgba(232,213,163,0.2);} 100%{opacity:1;text-shadow:none;} }
  .logo-main { font-family:var(--font-display); font-size:32px; letter-spacing:2px; color:var(--text); line-height:1; animation:logoFlash 4s ease-in-out infinite; cursor:default; }
  .cart-btn { display:flex; align-items:center; gap:10px; background:var(--surface2); border:1px solid var(--border); border-radius:100px; padding:10px 18px; color:var(--text); font-family:var(--font-body); font-weight:600; font-size:14px; cursor:pointer; }
  .cart-count { background:var(--accent2); color:#fff; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; }
  .hero { padding:64px 24px 48px; max-width:1000px; margin:0 auto; display:flex; flex-direction:column; }
  .hero-eyebrow { font-size:20px; font-weight:700; letter-spacing:4px; color:var(--accent2); text-transform:uppercase; margin-bottom:16px; }
  .hero-title { font-family:var(--font-display); font-size:clamp(144px,28vw,240px); line-height:0.92; letter-spacing:3px; color:var(--text); margin-bottom:28px; }
  .hero-title span { color:var(--accent); display:block; font-size:clamp(176px,36vw,288px); -webkit-text-stroke:1px rgba(255,107,53,0.4); }
  .hero-sub { font-size:15px; color:var(--text); max-width:500px; line-height:1.5; margin-bottom:40px; font-weight:400; border-left:3px solid var(--accent2); padding-left:18px; }
  .search-wrap { position:relative; max-width:420px; }
  .search-input { width:100%; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:16px 22px 16px 50px; color:var(--text); font-family:var(--font-body); font-size:17px; outline:none; }
  .search-input:focus { border-color:var(--accent); }
  .search-input::placeholder { color:var(--muted); }
  .search-icon { position:absolute; left:18px; top:50%; transform:translateY(-50%); color:var(--muted); font-size:20px; }
  .deal-section { max-width:1000px; margin:0 auto; padding:0 24px 32px; }
  .deal-card { background:linear-gradient(135deg,#1a1000,#2a1800,#1a0a00); border:1px solid #FF6B35; border-radius:16px; padding:28px 32px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:20px; box-shadow:0 0 40px rgba(255,107,53,0.15); }
  .deal-left { display:flex; flex-direction:column; gap:8px; }
  .deal-eyebrow { font-size:13px; font-weight:800; letter-spacing:3px; color:var(--accent2); text-transform:uppercase; }
  .deal-title { font-family:var(--font-display); font-size:56px; letter-spacing:2px; line-height:1; }
  .deal-desc { font-size:16px; color:var(--muted); max-width:300px; line-height:1.5; }
  .deal-btn { margin-top:8px; align-self:flex-start; background:var(--accent2); border:none; border-radius:8px; padding:13px 24px; color:#fff; font-family:var(--font-body); font-weight:700; font-size:16px; cursor:pointer; }
  .deal-images { display:flex; align-items:flex-end; position:relative; flex-shrink:0; }
  .deal-sandwich-placeholder { width:170px; height:150px; border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; transform:rotate(-3deg) translateY(-8px); box-shadow:0 12px 40px rgba(0,0,0,0.5); z-index:2; }
  .deal-drink-img { width:80px; height:120px; object-fit:cover; border-radius:10px; transform:rotate(4deg) translateX(-16px) translateY(4px); box-shadow:0 8px 24px rgba(0,0,0,0.5); }
  .deal-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
  .deal-price { font-family:var(--font-display); font-size:88px; color:var(--accent); line-height:1; }
  .deal-save { font-size:14px; font-weight:700; color:var(--accent2); letter-spacing:2px; text-transform:uppercase; }
  .deal-badge { color:#fff; font-size:12px; font-weight:900; letter-spacing:3px; padding:6px 12px; border-radius:4px; }
  .deal-edit-btn { background:transparent; border:1px solid var(--border); border-radius:8px; padding:10px 14px; color:var(--muted); font-family:var(--font-body); font-size:12px; font-weight:600; cursor:pointer; }
  .deal-editor { background:var(--surface2); border:1px solid var(--border); border-radius:16px; padding:24px; }
  .deal-editor-title { font-size:14px; font-weight:700; color:var(--text); margin-bottom:8px; }
  .deal-picker-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
  .deal-picker-card { background:var(--surface); border:2px solid var(--border); border-radius:10px; overflow:hidden; cursor:pointer; padding-bottom:12px; }
  .deal-picker-bar { height:4px; margin-bottom:10px; }
  .deal-picker-name { font-family:var(--font-display); font-size:20px; padding:0 12px; }
  .deal-picker-desc { font-size:11px; color:var(--muted); padding:4px 12px; line-height:1.4; }
  .deal-picker-price { font-size:13px; font-weight:700; color:var(--accent); padding:6px 12px 0; }
  .deal-editor-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px; }
  .deal-field { display:flex; flex-direction:column; gap:6px; }
  .deal-field-label { font-size:10px; font-weight:700; letter-spacing:2px; color:var(--muted); text-transform:uppercase; }
  .deal-field-input { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:10px 12px; color:var(--text); font-family:var(--font-body); font-size:13px; outline:none; }
  .menu-section { max-width:1000px; margin:0 auto; padding:0 24px 80px; }
  .section-label { font-size:13px; font-weight:700; letter-spacing:4px; color:var(--muted); text-transform:uppercase; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:12px; }
  .section-label::after { content:''; flex:1; height:1px; background:var(--border); }
  .menu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:2px; }
  .menu-card { background:var(--surface); border:1px solid var(--border); border-radius:4px; overflow:hidden; cursor:pointer; transition:all 0.25s; position:relative; display:flex; flex-direction:column; }
  .menu-card:hover { border-color:rgba(232,213,163,0.3); transform:translateY(-2px); box-shadow:0 20px 60px rgba(0,0,0,0.5); }
  .card-color-bar { height:4px; }
  .card-tag { position:absolute; top:16px; right:16px; font-size:11px; font-weight:800; letter-spacing:2px; padding:5px 10px; border-radius:4px; background:rgba(255,255,255,0.08); color:var(--text); text-transform:uppercase; }
  .card-body { padding:22px 22px 16px; flex:1; }
  .card-name { font-family:var(--font-display); font-size:38px; letter-spacing:1px; margin-bottom:8px; line-height:1.05; }
  .card-desc { font-size:15px; color:var(--muted); line-height:1.6; margin-bottom:20px; }
  .card-footer { display:flex; align-items:center; justify-content:space-between; }
  .card-price { font-size:24px; font-weight:700; color:var(--accent); }
  .card-cal { font-size:13px; color:var(--muted); }
  .card-cta { margin:0 22px 22px; border:1px solid var(--border); border-radius:8px; padding:12px; text-align:center; font-size:14px; font-weight:700; letter-spacing:2px; color:var(--muted); text-transform:uppercase; }
  .menu-card:hover .card-cta { border-color:var(--accent); color:var(--accent); }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes sandyPulse { 0%,100%{transform:scale(1);opacity:0.6;} 50%{transform:scale(1.15);opacity:0;} }
  .overlay { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.8); backdrop-filter:blur(8px); display:flex; align-items:flex-end; justify-content:center; animation:fadeIn 0.2s ease; }
  .modal { background:var(--surface); border:1px solid var(--border); border-radius:20px 20px 0 0; width:100%; max-width:560px; max-height:92vh; display:flex; flex-direction:column; animation:slideUp 0.3s ease; overflow:hidden; }
  .modal-handle { width:36px; height:4px; background:var(--border); border-radius:2px; margin:12px auto 0; }
  .modal-header { padding:20px 24px 16px; border-bottom:1px solid var(--border); }
  .modal-eyebrow { font-size:12px; font-weight:700; letter-spacing:3px; color:var(--accent2); text-transform:uppercase; margin-bottom:6px; }
  .modal-title { font-family:var(--font-display); font-size:42px; }
  .modal-desc { font-size:15px; color:var(--muted); margin-top:4px; }
  .stepper { display:flex; border-bottom:1px solid var(--border); overflow-x:auto; padding:0 24px; }
  .step-item { display:flex; flex-direction:column; align-items:center; gap:6px; padding:12px 10px; min-width:60px; position:relative; }
  .step-item.done::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:var(--accent); }
  .step-item.active::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:var(--accent2); }
  .step-num { width:28px; height:28px; border-radius:50%; border:1.5px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:var(--muted); }
  .step-item.done .step-num { background:var(--accent); border-color:var(--accent); color:#000; }
  .step-item.active .step-num { border-color:var(--accent2); color:var(--accent2); }
  .step-name { font-size:10px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); font-weight:600; }
  .step-item.active .step-name { color:var(--accent2); }
  .step-content { flex:1; overflow-y:auto; padding:24px; }
  .step-title { font-size:17px; font-weight:700; margin-bottom:4px; }
  .step-hint { font-size:13px; color:var(--muted); margin-bottom:16px; }
  .pill-grid { display:flex; flex-wrap:wrap; gap:10px; }
  .pill { background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:10px 18px; font-size:15px; font-weight:500; color:var(--muted); cursor:pointer; font-family:var(--font-body); }
  .pill.active { background:rgba(232,213,163,0.1); border-color:var(--accent); color:var(--accent); }
  .size-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .size-card { background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:20px; text-align:center; cursor:pointer; font-family:var(--font-body); }
  .size-card.active { background:rgba(232,213,163,0.08); border-color:var(--accent); }
  .size-big { font-family:var(--font-display); font-size:42px; color:var(--text); line-height:1; }
  .size-note { font-size:13px; color:var(--muted); text-transform:uppercase; margin-top:4px; }
  .size-price { font-size:14px; color:var(--accent); margin-top:6px; font-weight:600; }
  .toast-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .toast-card { background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:24px; text-align:center; cursor:pointer; }
  .toast-card.active { background:rgba(232,213,163,0.08); border-color:var(--accent); }
  .toast-emoji { font-size:42px; margin-bottom:10px; }
  .toast-label { font-size:17px; font-weight:600; }
  .review { display:flex; flex-direction:column; gap:0; }
  .review-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .review-name { font-family:var(--font-display); font-size:34px; }
  .review-total { font-size:34px; font-weight:800; color:var(--accent); }
  .review-rows { background:var(--surface2); border-radius:12px; overflow:hidden; }
  .review-row { display:flex; justify-content:space-between; padding:14px 18px; border-bottom:1px solid var(--border); }
  .review-row:last-child { border-bottom:none; }
  .review-key { font-size:12px; font-weight:700; letter-spacing:2px; color:var(--muted); text-transform:uppercase; }
  .review-val { font-size:15px; text-align:right; max-width:60%; line-height:1.5; }
  .modal-footer { display:flex; align-items:center; gap:10px; padding:16px 24px; border-top:1px solid var(--border); }
  .btn-back { background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px 20px; color:var(--muted); font-family:var(--font-body); font-weight:600; font-size:15px; cursor:pointer; }
  .btn-next { flex:1; background:var(--surface2); border:1px solid var(--accent); border-radius:10px; padding:15px; color:var(--accent); font-family:var(--font-body); font-weight:700; font-size:16px; cursor:pointer; }
  .btn-next:hover { background:var(--accent); color:#000; }
  .btn-add { flex:1; background:var(--accent2); border:none; border-radius:10px; padding:15px; color:#fff; font-family:var(--font-body); font-weight:800; font-size:17px; cursor:pointer; }
  .btn-close { position:absolute; top:16px; right:16px; background:var(--surface2); border:1px solid var(--border); border-radius:50%; width:36px; height:36px; color:var(--muted); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .drawer { background:var(--surface); border:1px solid var(--border); border-radius:20px 20px 0 0; width:100%; max-width:480px; max-height:90vh; display:flex; flex-direction:column; animation:slideUp 0.3s ease; overflow:hidden; }
  .drawer-header { padding:20px 24px 16px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .drawer-title { font-family:var(--font-display); font-size:36px; }
  .mode-toggle { display:flex; background:var(--surface2); border-radius:10px; padding:4px; border:1px solid var(--border); }
  .mode-btn { flex:1; padding:12px; border:none; border-radius:8px; background:transparent; color:var(--muted); font-family:var(--font-body); font-weight:600; font-size:16px; cursor:pointer; }
  .mode-btn.active { background:var(--surface); color:var(--text); }
  .cart-items { flex:1; overflow-y:auto; }
  .cart-item { display:flex; gap:14px; padding:18px 24px; border-bottom:1px solid var(--border); }
  .cart-item-body { flex:1; }
  .cart-item-name { font-weight:700; font-size:18px; margin-bottom:4px; }
  .cart-item-detail { font-size:13px; color:var(--muted); line-height:1.6; }
  .cart-item-right { display:flex; flex-direction:column; align-items:flex-end; gap:6px; }
  .cart-item-price { font-size:20px; font-weight:800; color:var(--accent); }
  .btn-remove { background:none; border:1px solid var(--border); border-radius:6px; padding:5px 10px; font-size:12px; color:var(--muted); cursor:pointer; font-family:var(--font-body); font-weight:600; }
  .btn-remove:hover { border-color:#f44336; color:#f44336; }
  .empty-cart { text-align:center; padding:60px 20px; color:var(--muted); }
  .empty-icon { font-size:48px; margin-bottom:12px; opacity:0.3; }
  .empty-text { font-size:14px; }
  .drawer-footer { padding:20px 24px; border-top:1px solid var(--border); }
  .total-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
  .total-label { font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--muted); }
  .total-val { font-family:var(--font-display); font-size:36px; color:var(--accent); }
  .btn-order { width:100%; background:var(--accent2); border:none; border-radius:12px; padding:16px; color:#fff; font-family:var(--font-body); font-weight:800; font-size:16px; cursor:pointer; }
  .payment-screen { min-height:100vh; background:var(--bg); display:flex; justify-content:center; padding:24px; }
  .payment-wrap { width:100%; max-width:420px; display:flex; flex-direction:column; gap:20px; padding-top:16px; }
  .payment-header { display:flex; align-items:center; justify-content:space-between; }
  .payment-title { font-family:var(--font-display); font-size:28px; letter-spacing:2px; }
  .card-visual { background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460); border-radius:18px; padding:28px; color:#fff; border:1px solid rgba(255,255,255,0.1); box-shadow:0 20px 60px rgba(0,0,0,0.6); }
  .card-visual-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:28px; }
  .card-chip { font-size:28px; opacity:0.8; }
  .card-type { font-size:14px; font-weight:700; }
  .card-visual-num { font-family:var(--font-display); font-size:26px; letter-spacing:4px; margin-bottom:24px; }
  .card-visual-bottom { display:flex; justify-content:space-between; }
  .card-visual-label { font-size:9px; letter-spacing:2px; text-transform:uppercase; opacity:0.5; margin-bottom:4px; }
  .card-visual-val { font-size:14px; font-weight:600; letter-spacing:1px; text-transform:uppercase; }
  .payment-form { display:flex; flex-direction:column; gap:14px; }
  .pay-field { display:flex; flex-direction:column; gap:6px; }
  .pay-label { font-size:11px; font-weight:700; letter-spacing:2px; color:var(--muted); text-transform:uppercase; }
  .pay-input { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:14px 16px; color:var(--text); font-family:var(--font-body); font-size:16px; outline:none; }
  .pay-input:focus { border-color:var(--accent); }
  .pay-input::placeholder { color:var(--muted); }
  .pay-summary { background:var(--surface); border-radius:12px; overflow:hidden; }
  .pay-summary-row { display:flex; justify-content:space-between; padding:12px 16px; border-bottom:1px solid var(--border); font-size:15px; color:var(--muted); }
  .pay-summary-row:last-child { border-bottom:none; }
  .pay-summary-total { color:var(--text); font-weight:800; font-size:18px; }
  .pay-btn { width:100%; padding:17px; border:none; border-radius:12px; font-family:var(--font-body); font-weight:800; font-size:17px; cursor:not-allowed; background:var(--surface2); color:var(--muted); }
  .pay-btn.active { background:var(--accent2); color:#fff; cursor:pointer; }
  .pay-btn.active:hover { background:#ff8a5b; }
  .pay-secure { text-align:center; font-size:12px; color:var(--muted); }
  .success-screen { min-height:100vh; background:var(--bg); display:flex; align-items:center; justify-content:center; padding:24px; }
  .success-card { max-width:420px; width:100%; text-align:center; }
  @keyframes bounce { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
  .success-icon { font-size:64px; margin-bottom:24px; display:block; animation:bounce 0.6s ease; }
  .success-title { font-family:var(--font-display); font-size:64px; letter-spacing:2px; line-height:1; margin-bottom:12px; }
  .success-sub { font-size:15px; color:var(--muted); line-height:1.7; margin-bottom:32px; }
  .success-num { display:inline-block; border:1px solid var(--border); border-radius:8px; padding:10px 24px; font-size:11px; font-weight:800; letter-spacing:4px; color:var(--accent); text-transform:uppercase; margin-bottom:32px; }
`;

export default function App() {
  const [activeItem, setActiveItem] = useState(null);
  const [activeSalad, setActiveSalad] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mode, setMode] = useState("Pickup");
  const [ordered, setOrdered] = useState(false);
  const [paying, setPaying] = useState(false);
  const [search, setSearch] = useState("");
  const [deal, setDeal] = useState(DEFAULT_DEAL);
  const [editingDeal, setEditingDeal] = useState(false);
  const [draftDeal, setDraftDeal] = useState(DEFAULT_DEAL);

  const addToCart = (item) => setCart(p => [...p, item]);
  const removeFromCart = (idx) => setCart(p => p.filter((_, i) => i !== idx));
  const filtered = MENU.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.desc.toLowerCase().includes(search.toLowerCase()));
  const featured = MENU.find(m => m.id === deal.menuId) || MENU[0];

  if (ordered) return (<><style>{css}</style><SuccessScreen mode={mode} onReset={() => { setOrdered(false); setCart([]); }} /><SandyAvatar onRecommend={(id) => { const it = MENU.find(m => m.id === id); if (it) setActiveItem(it); }} /></>);
  if (paying) return (<><style>{css}</style><PaymentScreen total={cart.reduce((s, i) => s + parseFloat(i.totalPrice), 0).toFixed(2)} mode={mode} onBack={() => { setPaying(false); setCartOpen(true); }} onPay={() => { setPaying(false); setOrdered(true); }} /></>);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="header">
          <div className="header-inner">
            <div className="logo">
              <span className="logo-main">SUBCITY</span>
              <div className="logo-dot" />
              <span className="logo-tag">Est. 2024</span>
            </div>
            <button className="cart-btn" onClick={() => setCartOpen(true)}>
              Cart {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </button>
          </div>
        </header>

        <div className="hero">
          <p className="hero-eyebrow">Fresh. Made to order.</p>
          <h1 className="hero-title">BUILD<br />YOUR<br /><span>SUB.</span></h1>
          <p className="hero-sub">Handcrafted sandwiches with premium ingredients. Your way, every time.</p>
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search the menu..." />
          </div>
        </div>

        <div className="deal-section">
          {editingDeal ? (
            <div className="deal-editor">
              <div className="deal-editor-title">Edit Deal der Woche</div>
              <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 8 }}>Pick a sandwich to feature this week</p>
              <div className="deal-picker-grid">
                {MENU.map(m => (
                  <div key={m.id} className={"deal-picker-card" + (draftDeal.menuId === m.id ? " active" : "")} style={{ borderColor: draftDeal.menuId === m.id ? m.color : "" }} onClick={() => setDraftDeal(d => ({ ...d, menuId: m.id }))}>
                    <div className="deal-picker-bar" style={{ background: m.color }} />
                    <div className="deal-picker-name">{m.name}</div>
                    <div className="deal-picker-desc">{m.desc}</div>
                    <div className="deal-picker-price">{"$" + m.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="deal-editor-grid">
                <div className="deal-field"><label className="deal-field-label">Deal Price</label><input className="deal-field-input" value={draftDeal.price} onChange={e => setDraftDeal(d => ({ ...d, price: e.target.value }))} placeholder="6.99" /></div>
                <div className="deal-field"><label className="deal-field-label">Save Label</label><input className="deal-field-input" value={draftDeal.save} onChange={e => setDraftDeal(d => ({ ...d, save: e.target.value }))} /></div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button className="deal-btn" onClick={() => { setDeal(draftDeal); setEditingDeal(false); }}>Save Deal</button>
                <button className="btn-back" onClick={() => { setDraftDeal(deal); setEditingDeal(false); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="deal-card">
              <div className="deal-left">
                <div className="deal-eyebrow">Deal der Woche</div>
                <div className="deal-title" style={{ color: featured.color }}>{featured.name}</div>
                <div className="deal-desc">{featured.desc} + Coca-Cola</div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
                  <button className="deal-btn" onClick={() => setActiveItem(featured)}>Grab the Deal</button>
                  <button className="deal-edit-btn" onClick={() => { setDraftDeal(deal); setEditingDeal(true); }}>Edit</button>
                </div>
              </div>
              <div className="deal-images">
                <div className="deal-sandwich-placeholder" style={{ background: "linear-gradient(135deg," + featured.color + "22," + featured.color + "44)", border: "2px solid " + featured.color + "66" }}>
                  <span style={{ fontSize: 64 }}>🥪</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: featured.color, marginTop: 6 }}>{featured.name.toUpperCase()}</span>
                </div>
                <img src={deal.drinkImg} alt="drink" className="deal-drink-img" onError={e => { e.target.style.display = "none"; }} />
              </div>
              <div className="deal-right">
                <div className="deal-price">{"$" + deal.price}</div>
                <div className="deal-save">{deal.save}</div>
                <div className="deal-badge" style={{ background: featured.color }}>WEEKLY DEAL</div>
              </div>
            </div>
          )}
        </div>

        <main className="menu-section">
          <div className="section-label">Menu</div>
          <div className="menu-grid">
            {filtered.map(item => (
              <div key={item.id} className="menu-card" onClick={() => setActiveItem(item)}>
                <div className="card-color-bar" style={{ background: item.color }} />
                <span className="card-tag">{item.tag}</span>
                <div className="card-body">
                  <div className="card-name">{item.name}</div>
                  <div className="card-desc">{item.desc}</div>
                  <div className="card-footer">
                    <div className="card-price">{"$" + item.price.toFixed(2)}</div>
                    <div className="card-cal">{item.cal} kcal</div>
                  </div>
                </div>
                <div className="card-cta">CUSTOMIZE + ADD</div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <p style={{ textAlign: "center", color: "var(--muted)", marginTop: 60 }}>No results for "{search}"</p>}

          <div className="section-label" style={{ marginTop: 48 }}>Salads</div>
          <div className="menu-grid">
            {SALADS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase())).map(item => (
              <div key={item.id} className="menu-card" onClick={() => setActiveSalad(item)}>
                <div className="card-color-bar" style={{ background: item.color }} />
                <span className="card-tag">{item.tag}</span>
                <div className="card-body">
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🥗</div>
                  <div className="card-name">{item.name}</div>
                  <div className="card-desc">{item.desc}</div>
                  <div className="card-footer">
                    <div className="card-price">{"$" + item.price.toFixed(2)}</div>
                    <div className="card-cal">{item.cal} kcal</div>
                  </div>
                </div>
                <div className="card-cta">ADD TO ORDER</div>
              </div>
            ))}
          </div>
        </main>

        {activeItem && <CustomizeModal item={activeItem} onClose={() => setActiveItem(null)} onAddToCart={addToCart} />}

        {activeSalad && (
          <div className="overlay" onClick={() => setActiveSalad(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-handle" />
              <div className="modal-header" style={{ position: "relative" }}>
                <div className="modal-eyebrow" style={{ color: activeSalad.color }}>Salad Bowl</div>
                <div className="modal-title">{activeSalad.name}</div>
                <div className="modal-desc">{activeSalad.desc}</div>
                <button className="btn-close" onClick={() => setActiveSalad(null)}>X</button>
              </div>
              <div className="step-content">
                <div className="review-rows">
                  {[["Calories", activeSalad.cal + " kcal"], ["Price", "$" + activeSalad.price.toFixed(2)], ["Tag", activeSalad.tag]].map(([k, v]) => (
                    <div key={k} className="review-row"><span className="review-key">{k}</span><span className="review-val">{v}</span></div>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 16 }}>Dressing options: Ranch, Caesar, Balsamic, Honey Dijon, Herb Tahini.</p>
              </div>
              <div className="modal-footer">
                <button className="btn-add" style={{ flex: 1 }} onClick={() => { addToCart({ ...activeSalad, bread: "—", size: { label: "Bowl", price: 0 }, cheese: "None", veggies: [], sauces: [], toasted: false, totalPrice: activeSalad.price.toFixed(2) }); setActiveSalad(null); }}>
                  {"Add to Cart · $" + activeSalad.price.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        )}

        {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} mode={mode} setMode={setMode} onPlaceOrder={() => { setCartOpen(false); setPaying(true); }} />}

        <SandyAvatar onRecommend={(id) => { const it = MENU.find(m => m.id === id); if (it) setActiveItem(it); }} />
      </div>
    </>
  );
}