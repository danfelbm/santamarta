/* Santa & Beyond — secciones 2 (crew, itinerario, hospedaje, logística, mercado, footer) */
const SB2 = window.SB;
const fmt2 = SB2.fmt;

const GRAD = {
  coral: "linear-gradient(135deg,#ff7a4d,#e23c12)", rose: "linear-gradient(135deg,#ff9bb0,#ff5a78)",
  blue: "linear-gradient(135deg,#aecdea,#5f93c7)", peach: "linear-gradient(135deg,#ffd0ad,#ff9d63)",
  amber: "linear-gradient(135deg,#ffcf8a,#f0992f)",
};

/* CREW vive ahora en sb-crew.jsx (interactivo con Supabase: bolsas + gastos) */

/* ITINERARIO vive ahora en sb-itinerario.jsx (editable con Supabase) */

/* ========================= HOSPEDAJE ========================= */
function Hospedaje() {
  return (
    <section id="hospedaje" className="section-pad">
      <div className="wrap">
        <div className="reveal" style={{ marginBottom: 36 }}>
          <div className="eyebrow">Dónde dormimos & a dónde vamos</div>
          <h2 className="sec-title">Base & destino</h2>
          <p className="sec-sub">La casa del viaje en Gaira y el gran punto de encuentro con la naturaleza en el Tayrona.</p>
        </div>
        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 18 }}>
          {SB2.stays.map((st, i) => (
            <div key={i} className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 120, position: "relative", background: i === 0
                ? "radial-gradient(60% 90% at 20% 20%, rgba(255,170,120,.9), transparent), radial-gradient(70% 80% at 90% 80%, rgba(255,90,44,.85), transparent), linear-gradient(120deg,#ffd7c0,#ff8f63)"
                : "radial-gradient(60% 90% at 80% 10%, rgba(127,176,221,.9), transparent), radial-gradient(70% 80% at 10% 90%, rgba(120,200,150,.7), transparent), linear-gradient(120deg,#bfe0c9,#7fb0dd)" }}>
                <span style={{ position: "absolute", left: 18, bottom: 14, color: "#fff", fontWeight: 800, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", textShadow: "0 1px 6px rgba(0,0,0,.25)" }}>{st.role}</span>
              </div>
              <div style={{ padding: "20px 22px", flex: 1 }}>
                <h3 style={{ margin: "0 0 10px", fontWeight: 800, fontSize: 20, color: "var(--coral)", letterSpacing: "-.01em" }}>{st.name}</h3>
                <div style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                  <span style={{ color: "var(--coral)" }}>◍</span>
                  <span>{st.addr}</span>
                </div>
                <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--ink-faint)", lineHeight: 1.5 }}>{st.note}</div>
                <div style={{ marginTop: 16, display: "inline-flex", padding: "6px 14px", borderRadius: 99, background: "rgba(255,90,44,.08)", color: "var(--coral-deep)", fontSize: 12, fontWeight: 800, letterSpacing: ".04em" }}>{st.cost}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================= LOGÍSTICA ========================= */
function Logistica() {
  const t = SB2.transport;
  const total = SB2.transportTotal;
  return (
    <section id="logistica" className="section-pad" style={{ background: "linear-gradient(180deg, var(--paper) 0%, var(--paper-2) 100%)" }}>
      <div className="wrap">
        <div className="reveal" style={{ marginBottom: 36 }}>
          <div className="eyebrow">Cómo nos movemos</div>
          <h2 className="sec-title">Logística & transporte</h2>
          <p className="sec-sub">Todos los traslados del viaje, con valores reales 2026. Se reparte en partes iguales entre las cinco.</p>
        </div>
        <div className="reveal card" style={{ padding: "10px 0", maxWidth: 760 }}>
          {t.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 26px", borderBottom: "1px solid var(--line-soft)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15.5, color: "var(--ink)" }}>{r.label}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 3 }}>{r.sub}</div>
              </div>
              <div className="money" style={{ fontWeight: 800, fontSize: 16, color: "var(--coral-deep)" }}>{fmt2(r.cost)}</div>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 26px" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "var(--ink)" }}>Total transporte</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{fmt2(total / 5)} por persona</div>
            </div>
            <div className="money" style={{ fontWeight: 900, fontSize: 26, color: "var(--coral-deep)" }}>{fmt2(total)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* MERCADO vive ahora en sb-mercado.jsx (checklist persistente con Supabase) */

/* ========================= FOOTER ========================= */
function Footer() {
  return (
    <footer className="footer" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <div style={{ position: "absolute", inset: "-30%", background:
          "radial-gradient(40% 50% at 20% 30%, rgba(255,170,120,.55), transparent 60%)," +
          "radial-gradient(40% 50% at 85% 70%, rgba(255,111,145,.5), transparent 60%)," +
          "radial-gradient(40% 50% at 60% 20%, rgba(127,176,221,.45), transparent 60%)",
          filter: "blur(40px)" }} />
      </div>
      <div className="wrap" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: "clamp(46px,10vw,96px)", color: "var(--coral)", letterSpacing: "-.04em", lineHeight: .9 }}>SANTA</div>
        <div style={{ fontStyle: "italic", fontWeight: 500, fontSize: "clamp(20px,4vw,32px)", color: "var(--ink)", marginTop: -4 }}>&amp; beyond</div>
        <div style={{ marginTop: 18, fontSize: 13, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-soft)" }}>21 — 24 Junio 2026 · Santa Marta · Tayrona</div>
        <div style={{ marginTop: 8, fontSize: 12.5, color: "var(--ink-faint)" }}>Hecho con cariño para las cinco · Precios reales COP 2026</div>
      </div>
    </footer>
  );
}

Object.assign(window, { Hospedaje, Logistica, Footer });
