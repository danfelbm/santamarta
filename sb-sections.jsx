/* Santa & Beyond — secciones (hero, presupuesto, tiquetes) */
const { useState, useEffect, useRef } = React;
const SB = window.SB;
const fmt = SB.fmt;

/* ---------- helpers ---------- */
function useCountUp(target, dur = 900) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const from = prev.current, to = target, start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (to - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return val;
}

function Switch({ on, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={on}
      style={{
        width: 46, height: 27, borderRadius: 999, border: "none",
        cursor: disabled ? "not-allowed" : "pointer", padding: 3, flex: "0 0 auto",
        background: on ? "linear-gradient(180deg,#ff5a2c,#e23c12)" : "rgba(44,33,26,.16)",
        opacity: disabled ? .5 : 1, transition: "background .25s",
        boxShadow: on ? "0 4px 12px rgba(226,60,18,.35)" : "none",
      }}>
      <span style={{
        display: "block", width: 21, height: 21, borderRadius: 999, background: "#fff",
        transform: on ? "translateX(19px)" : "translateX(0)",
        transition: "transform .28s cubic-bezier(.2,.9,.2,1)", boxShadow: "0 1px 3px rgba(0,0,0,.2)",
      }} />
    </button>
  );
}

/* ========================= HERO ========================= */
function Hero() {
  const target = new Date("2026-06-21T06:25:00-05:00").getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const Unit = ({ v, l }) => (
    <div style={{ textAlign: "center", minWidth: 58 }}>
      <div className="money" style={{ fontSize: "clamp(30px,5vw,46px)", fontWeight: 800, color: "var(--ink)", lineHeight: 1, letterSpacing: "-.02em" }}>
        {String(v).padStart(2, "0")}
      </div>
      <div style={{ fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--ink-soft)", fontWeight: 700, marginTop: 7 }}>{l}</div>
    </div>
  );

  return (
    <header style={{ position: "relative", overflow: "hidden", paddingTop: 18 }}>
      {/* dreamy grainy gradient bg */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <div style={{ position: "absolute", inset: "-20%",
          background:
            "radial-gradient(40% 38% at 22% 26%, rgba(255,170,120,.95), transparent 60%)," +
            "radial-gradient(34% 40% at 80% 18%, rgba(127,176,221,.75), transparent 62%)," +
            "radial-gradient(46% 46% at 72% 72%, rgba(255,90,44,.85), transparent 60%)," +
            "radial-gradient(40% 40% at 30% 84%, rgba(255,111,145,.7), transparent 62%)," +
            "radial-gradient(50% 50% at 50% 40%, rgba(255,244,235,.6), transparent 70%)",
          filter: "blur(36px) saturate(1.15)", animation: "drift 22s ease-in-out infinite alternate" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, var(--paper) 99%)" }} />
      </div>
      <style>{`
        @keyframes drift { 0%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.08) translate(2%,-1.5%)} 100%{transform:scale(1.04) translate(-2%,1%)} }
        .hero-word { animation: rise .9s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes rise { from{transform:translateY(22px)} to{transform:none} }
      `}</style>

      <div className="wrap" style={{ position: "relative", zIndex: 1, textAlign: "center",
        minHeight: "min(94vh, 860px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 70, paddingBottom: 40 }}>
        <div className="hero-word" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: "rgba(255,255,255,.5)", border: "1px solid rgba(255,255,255,.7)", backdropFilter: "blur(8px)", marginBottom: 30 }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--coral)" }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--coral-deep)" }}>21 — 24 Junio 2026 · Santa Marta</span>
        </div>

        <h1 className="hero-word" style={{ margin: 0, fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 800, color: "var(--coral)", letterSpacing: "-.04em", lineHeight: .82,
          fontSize: "clamp(78px, 19vw, 230px)", textShadow: "0 2px 40px rgba(255,90,44,.25)", animationDelay: ".05s" }}>
          SANTA
        </h1>
        <div className="hero-word" style={{ marginTop: -2, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 500, fontStyle: "italic", color: "var(--ink)", fontSize: "clamp(28px,6vw,58px)", letterSpacing: "-.01em", animationDelay: ".12s" }}>
          &amp; beyond
        </div>

        <p className="hero-word" style={{ maxWidth: 540, margin: "26px auto 0", color: "var(--ink-soft)", fontWeight: 500, fontSize: "clamp(14px,1.7vw,17px)", lineHeight: 1.65, letterSpacing: ".01em", animationDelay: ".2s" }}>
          Aquí las flores son más que regalos — son pequeñas chispas de conexión.
          Entre la fiesta que enciende la noche y la calma que sana el alma.
        </p>

        {/* countdown */}
        <div className="hero-word" style={{ marginTop: 40, display: "inline-flex", alignItems: "center", gap: "clamp(10px,3vw,26px)", padding: "20px clamp(18px,4vw,34px)", borderRadius: 24, background: "rgba(255,255,255,.55)", border: "1px solid rgba(255,255,255,.75)", backdropFilter: "blur(14px)", boxShadow: "var(--shadow-md)", animationDelay: ".28s" }}>
          <Unit v={d} l="Días" />
          <span style={{ color: "var(--coral)", fontSize: 26, fontWeight: 300, marginTop: -14 }}>:</span>
          <Unit v={h} l="Horas" />
          <span style={{ color: "var(--coral)", fontSize: 26, fontWeight: 300, marginTop: -14 }}>:</span>
          <Unit v={m} l="Min" />
          <span style={{ color: "var(--coral)", fontSize: 26, fontWeight: 300, marginTop: -14 }}>:</span>
          <Unit v={s} l="Seg" />
        </div>

        <div className="hero-word" style={{ marginTop: 34, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", animationDelay: ".34s" }}>
          <a href="#presupuesto" className="btn btn-coral">Ver presupuesto ↓</a>
          <a href="#itinerario" className="btn btn-ghost">Ver itinerario</a>
        </div>
      </div>
    </header>
  );
}

/* ===================== BUDGET DASHBOARD ===================== */
function Budget({ active, setActive }) {
  const cats = SB.budget;
  const perPerson = cats.filter(c => active[c.key]).reduce((a, c) => a + c.perPerson, 0);
  const group = cats.filter(c => active[c.key]).reduce((a, c) => a + c.group, 0);
  const aPP = useCountUp(perPerson);
  const aGroup = useCountUp(group);

  const palette = { vuelos: "#ff5a2c", hospedaje: "#7fb0dd", tayrona: "#ffb15a", transporte: "#ff6f91", mercado: "#e2a04d", colchon: "#b08968" };
  const incl = cats.filter(c => active[c.key] && c.group > 0);
  const totalForBar = incl.reduce((a, c) => a + c.group, 0) || 1;

  return (
    <section id="presupuesto" className="section-pad">
      <div className="wrap">
        <div className="reveal" style={{ marginBottom: 40 }}>
          <div className="eyebrow">El número que importa</div>
          <h2 className="sec-title">Presupuesto central</h2>
          <p className="sec-sub">Todo el costo del viaje en un solo lugar. Activa o desactiva cada rubro para ver al instante cuánto pone cada una y el total del grupo.</p>
        </div>

        <div className="reveal budget-grid">
          {/* total card */}
          <div className="budget-total" style={{ borderRadius: "var(--r-lg)", position: "relative", overflow: "hidden", color: "#fff",
            background: "linear-gradient(150deg,#ff7a4d 0%, #ff5a2c 42%, #e23c12 100%)", boxShadow: "0 30px 70px rgba(226,60,18,.32)" }}>
            <div style={{ position: "absolute", inset: 0, opacity: .5, background: "radial-gradient(50% 50% at 80% 10%, rgba(255,210,170,.6), transparent 60%), radial-gradient(40% 40% at 10% 100%, rgba(255,120,150,.5), transparent 60%)" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", fontWeight: 800, opacity: .92 }}>Por persona</div>
              <div className="money budget-num" style={{ fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1, marginTop: 8 }}>{fmt(aPP)}</div>
              <div style={{ height: 1, background: "rgba(255,255,255,.28)", margin: "26px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 800, opacity: .92 }}>Total grupo · 5 viajeras</div>
                  <div className="money" style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 800, letterSpacing: "-.02em", marginTop: 6 }}>{fmt(aGroup)}</div>
                </div>
                <div style={{ textAlign: "right", fontSize: 12, fontWeight: 600, opacity: .9 }}>COP</div>
              </div>
              {/* composition bar */}
              <div style={{ marginTop: 26, display: "flex", height: 12, borderRadius: 99, overflow: "hidden", background: "rgba(255,255,255,.22)" }}>
                {incl.map(c => (
                  <div key={c.key} title={c.label} style={{ width: (c.group / totalForBar * 100) + "%", background: palette[c.key], transition: "width .5s" }} />
                ))}
              </div>
              <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
                {incl.map(c => (
                  <span key={c.key} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, opacity: .95 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: palette[c.key] }} />
                    {c.label.split(" ").slice(0, 2).join(" ")}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* toggle list */}
          <div className="card" style={{ padding: "10px 10px" }}>
            {cats.map((c, i) => (
              <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px",
                borderBottom: i < cats.length - 1 ? "1px solid var(--line-soft)" : "none",
                opacity: active[c.key] ? 1 : .5, transition: "opacity .25s" }}>
                <span style={{ width: 11, height: 11, borderRadius: 99, background: palette[c.key], flex: "0 0 auto" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{c.label}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{c.detail}</div>
                </div>
                <div className="money" style={{ textAlign: "right", flex: "0 0 auto" }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: c.included ? "var(--blue)" : "var(--coral-deep)" }}>
                    {c.included ? "Incluido" : fmt(c.perPerson)}
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--ink-faint)", fontWeight: 600 }}>{c.included ? "hospedaje" : "/ persona"}</div>
                </div>
                <Switch on={!!active[c.key]} onClick={() => setActive(p => ({ ...p, [c.key]: !p[c.key] }))} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================= TIQUETES ========================= */
function Leg({ leg }) {
  return (
    <div style={{ flex: 1, minWidth: 260, padding: "22px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--coral-deep)" }}>{leg.date}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)" }}>{leg.code}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.02em", color: "var(--ink)" }}>{leg.from.iata}</div>
          <div className="money" style={{ fontSize: 14, fontWeight: 700, color: "var(--coral-deep)" }}>{leg.from.time}</div>
        </div>
        <div style={{ flex: 1, position: "relative", height: 24 }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: "repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 12px)" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--paper)", padding: "0 6px", fontSize: 15, color: "var(--coral)" }}>✈</div>
          <div style={{ position: "absolute", top: "calc(50% + 12px)", left: "50%", transform: "translateX(-50%)", fontSize: 10.5, color: "var(--ink-faint)", fontWeight: 600, whiteSpace: "nowrap" }}>{leg.dur}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.02em", color: "var(--ink)" }}>{leg.to.iata}</div>
          <div className="money" style={{ fontSize: 14, fontWeight: 700, color: "var(--coral-deep)" }}>{leg.to.time}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 11.5, color: "var(--ink-soft)" }}>
        <span>{leg.from.airport} → {leg.to.airport}</span>
        <span className="money" style={{ fontWeight: 800, color: "var(--ink)" }}>{fmt(leg.fare)}</span>
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: "var(--ink-faint)" }}>{leg.tariff}</div>
    </div>
  );
}

function BoardingPass({ p, flights }) {
  const grad = {
    coral: "linear-gradient(135deg,#ff7a4d,#e23c12)", rose: "linear-gradient(135deg,#ff9bb0,#ff5a78)",
    blue: "linear-gradient(135deg,#aecdea,#5f93c7)", peach: "linear-gradient(135deg,#ffd0ad,#ff9d63)",
    amber: "linear-gradient(135deg,#ffcf8a,#f0992f)",
  }[p.color];
  const initials = p.nick.slice(0, 2).toUpperCase();
  return (
    <div style={{ flex: "0 0 300px", scrollSnapAlign: "start", borderRadius: 20, overflow: "hidden", background: "var(--paper)", border: "1px solid var(--line-soft)", boxShadow: "var(--shadow-md)" }}>
      <div style={{ background: grad, padding: "16px 18px", color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,.25)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 15, backdropFilter: "blur(4px)" }}>{initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1 }}>{p.nick}</div>
          <div style={{ fontSize: 10.5, opacity: .9, marginTop: 3, textTransform: "uppercase", letterSpacing: ".08em" }}>{p.full}</div>
        </div>
        <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: ".1em" }}>AV</div>
      </div>
      <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-.02em" }}>{flights.out.from.iata}</div>
          <div className="money" style={{ fontSize: 12, fontWeight: 700, color: "var(--coral-deep)" }}>{flights.out.from.time}</div>
        </div>
        <div style={{ color: "var(--coral)", fontSize: 14 }}>✈</div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-.02em" }}>{flights.out.to.iata}</div>
          <div className="money" style={{ fontSize: 12, fontWeight: 700, color: "var(--coral-deep)" }}>{flights.out.to.time}</div>
        </div>
      </div>
      <div style={{ position: "relative", height: 1, margin: "0 14px", borderTop: "2px dashed var(--line)" }}>
        <span style={{ position: "absolute", left: -20, top: -8, width: 16, height: 16, borderRadius: 99, background: "var(--paper-2)", border: "1px solid var(--line-soft)" }} />
        <span style={{ position: "absolute", right: -20, top: -8, width: 16, height: 16, borderRadius: 99, background: "var(--paper-2)", border: "1px solid var(--line-soft)" }} />
      </div>
      <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: 18 }}>
          <div><div style={{ fontSize: 9.5, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", fontWeight: 700 }}>Silla</div><div style={{ fontWeight: 800, fontSize: 15 }}>{p.seatOut}</div></div>
          <div><div style={{ fontSize: 9.5, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-faint)", fontWeight: 700 }}>Reserva</div><div className="money" style={{ fontWeight: 800, fontSize: 15 }}>{p.pnr}</div></div>
        </div>
        <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 30 }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} style={{ width: i % 3 === 0 ? 3 : 1.5, height: (i % 4 === 0 ? 30 : i % 2 ? 22 : 26), background: "var(--ink)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Tiquetes() {
  const f = SB.flights;
  return (
    <section id="tiquetes" className="section-pad" style={{ background: "linear-gradient(180deg, var(--paper) 0%, var(--paper-2) 100%)" }}>
      <div className="wrap">
        <div className="reveal" style={{ marginBottom: 40 }}>
          <div className="eyebrow">Vuelos · Avianca</div>
          <h2 className="sec-title">Tiquetes</h2>
          <p className="sec-sub">Resumen del vuelo grupal ida y vuelta más el pasabordo individual de cada viajera. Todo en uno.</p>
        </div>

        {/* group flight summary */}
        <div className="reveal card" style={{ overflow: "hidden", marginBottom: 30 }}>
          <div className="tk-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "16px 24px", borderBottom: "1px solid var(--line-soft)", background: "rgba(255,90,44,.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 900, color: "var(--coral)", letterSpacing: ".04em", fontSize: 17 }}>AVIANCA</span>
              <span style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 600 }}>Reserva grupal · 5 pasajeras</span>
            </div>
            <div className="money tk-price" style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-faint)", fontWeight: 700 }}>Ida y vuelta / persona</div>
              <div style={{ fontWeight: 900, fontSize: 22, color: "var(--coral-deep)" }}>{fmt(f.perPerson)}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <Leg leg={f.out} />
            <div style={{ width: 1, background: "var(--line-soft)" }} />
            <Leg leg={f.back} />
          </div>
        </div>

        {/* boarding passes */}
        <div className="reveal">
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 14 }}>Pasabordo individual</div>
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 14, scrollSnapType: "x mandatory" }}>
            {SB.crew.map(p => <BoardingPass key={p.id} p={p} flights={f} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, Budget, Tiquetes, Switch, useCountUp });
