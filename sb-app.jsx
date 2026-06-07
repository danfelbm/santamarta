/* Santa & Beyond — app */
const { useState: uS, useEffect: uE } = React;

function Nav({ total }) {
  const [scrolled, setScrolled] = uS(false);
  uE(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["#presupuesto", "Presupuesto"], ["#tiquetes", "Tiquetes"], ["#crew", "Crew"],
    ["#itinerario", "Itinerario"], ["#hospedaje", "Base"], ["#logistica", "Logística"], ["#mercado", "Mercado"],
  ];
  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="wrap nav-inner">
        <a href="#top" className="nav-logo" style={{ textDecoration: "none" }}>SANTA <span>&amp; beyond</span></a>
        <div className="nav-links">
          {links.map(([h, l]) => <a key={h} href={h}>{l}</a>)}
        </div>
        <div className="nav-total">
          <b className="money">{window.SB.fmt(total)}</b>
          <small>/ persona</small>
        </div>
      </div>
    </nav>
  );
}

function App() {
  // central budget state — every rubro toggled on by default
  const [active, setActive] = uS(
    window.SB.budget.reduce((o, c) => ((o[c.key] = true), o), {})
  );
  const perPerson = window.SB.budget.filter(c => active[c.key]).reduce((a, c) => a + c.perPerson, 0);

  // scroll reveal
  uE(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <React.Fragment>
      <span id="top" />
      <Nav total={perPerson} />
      <Hero />
      <Budget active={active} setActive={setActive} />
      <Tiquetes />
      <Crew />
      <Itinerary />
      <Hospedaje />
      <Logistica />
      <Mercado />
      <Footer />
    </React.Fragment>
  );
}

/* ---------- PIN de acceso (compuerta suave, no es seguridad real) ---------- */
const GATE_PIN = "159753456";
function Gate({ children }) {
  const [ok, setOk] = uS(() => { try { return localStorage.getItem("sb_gate") === GATE_PIN; } catch (e) { return false; } });
  const [val, setVal] = uS("");
  const [err, setErr] = uS(false);
  if (ok) return children;
  const submit = (e) => {
    e.preventDefault();
    if (val.trim() === GATE_PIN) {
      try { localStorage.setItem("sb_gate", GATE_PIN); } catch (e) {}
      setOk(true);
    } else { setErr(true); }
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 5000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      background: "radial-gradient(45% 45% at 25% 25%, rgba(255,170,120,.9), transparent 60%), radial-gradient(40% 45% at 80% 20%, rgba(127,176,221,.7), transparent 62%), radial-gradient(46% 46% at 72% 78%, rgba(255,90,44,.8), transparent 60%), var(--paper)" }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 360, background: "rgba(255,255,255,.7)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,.8)",
        borderRadius: "var(--r-lg)", padding: "34px 28px", boxShadow: "var(--shadow-lg)", textAlign: "center" }}>
        <div style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 800, fontSize: 34, color: "var(--coral)", letterSpacing: "-.02em", lineHeight: 1 }}>SANTA</div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontStyle: "italic", fontWeight: 500, fontSize: 18, color: "var(--ink)", marginTop: 2 }}>&amp; beyond</div>
        <div style={{ marginTop: 18, fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" }}>Ingresa el PIN de acceso</div>
        <input type="password" inputMode="numeric" autoFocus value={val} aria-label="PIN"
          onChange={(e) => { setVal(e.target.value); setErr(false); }}
          style={{ width: "100%", boxSizing: "border-box", marginTop: 12, textAlign: "center", letterSpacing: ".3em",
            border: "1px solid " + (err ? "var(--coral-deep)" : "var(--line)"), borderRadius: 12, padding: "13px 14px",
            fontFamily: "inherit", fontSize: 18, background: "#fff", color: "var(--ink)" }} />
        {err && <div style={{ marginTop: 8, fontSize: 12.5, color: "var(--coral-deep)", fontWeight: 600 }}>PIN incorrecto</div>}
        <button type="submit" className="btn btn-coral" style={{ width: "100%", justifyContent: "center", marginTop: 14, padding: "13px" }}>Entrar</button>
      </form>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Gate><App /></Gate>);
