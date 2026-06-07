/* Santa & Beyond — The Crew interactivo: bolsas de presupuesto + gastos (Supabase) */
const { useState: cuS, useEffect: cuE } = React;
const CSB = window.SB;
const cfmt = CSB.fmt;

const CR_GRAD = {
  coral: "linear-gradient(135deg,#ff7a4d,#e23c12)", rose: "linear-gradient(135deg,#ff9bb0,#ff5a78)",
  blue: "linear-gradient(135deg,#aecdea,#5f93c7)", peach: "linear-gradient(135deg,#ffd0ad,#ff9d63)",
  amber: "linear-gradient(135deg,#ffcf8a,#f0992f)",
};
const CR_PAL = { hospedaje: "#7fb0dd", vuelos: "#ff5a2c", tayrona: "#ffb15a", transporte: "#ff6f91", mercado: "#e2a04d" };

// Bolsas base por persona (la de vuelos depende de cada tiquete)
const CR_CATS = [
  { key: "hospedaje",  label: "Estadía",    base: () => 175500 },
  { key: "vuelos",     label: "Vuelos",     base: (p) => p.vuelo },
  { key: "tayrona",    label: "Tayrona",    base: () => 40000 },
  { key: "transporte", label: "Transporte", base: () => 50000 },
  { key: "mercado",    label: "Comida",     base: () => 44000 },
];

const cr_spent = (gastos, person, key) =>
  gastos.filter(g => g.person === person && g.category === key).reduce((a, g) => a + Number(g.amount), 0);

/* ---------- barra de una bolsa ---------- */
function CrewBolsa({ cat, person, gastos }) {
  const base = cat.base(person);
  const spent = cr_spent(gastos, person.id, cat.key);
  const rem = base - spent;
  const pct = Math.max(0, Math.min(100, base ? (spent / base) * 100 : 0));
  const over = rem < 0;
  return (
    <div style={{ padding: "7px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 13 }}>
        <span style={{ color: "var(--ink-soft)", fontWeight: 600 }}>{cat.label}</span>
        <span className="money" style={{ fontWeight: 700, color: over ? "var(--coral-deep)" : "var(--ink)" }}>
          {over ? "−" + cfmt(-rem) : cfmt(rem)}
        </span>
      </div>
      <div style={{ marginTop: 5, height: 6, borderRadius: 99, background: "rgba(44,33,26,.08)", overflow: "hidden" }}>
        <div style={{ width: pct + "%", height: "100%", borderRadius: 99, transition: "width .4s",
          background: over ? "linear-gradient(90deg,#ff5a2c,#e23c12)" : CR_PAL[cat.key] }} />
      </div>
      <div style={{ marginTop: 3, fontSize: 10.5, color: "var(--ink-faint)" }}>
        gastado <b className="money" style={{ color: "var(--ink-soft)" }}>{cfmt(spent)}</b> de {cfmt(base)}
      </div>
    </div>
  );
}

/* ---------- modal (desktop) / drawer (mobile) ---------- */
function CrewSheet({ person, gastos, mobile, onClose, onChange }) {
  const [checks, setChecks] = cuS({});
  const [amounts, setAmounts] = cuS({});
  const [concept, setConcept] = cuS("");
  const [saving, setSaving] = cuS(false);
  const [err, setErr] = cuS("");

  const mine = gastos.filter(g => g.person === person.id).slice().reverse();
  const totalBase = CR_CATS.reduce((a, c) => a + c.base(person), 0);
  const totalSpent = CR_CATS.reduce((a, c) => a + cr_spent(gastos, person.id, c.key), 0);
  const totalRem = totalBase - totalSpent;

  const toggle = (k) => setChecks(p => ({ ...p, [k]: !p[k] }));
  const setAmt = (k, v) => setAmounts(p => ({ ...p, [k]: v.replace(/[^\d]/g, "") }));

  const save = async () => {
    setErr("");
    const rows = CR_CATS
      .filter(c => checks[c.key] && Number(amounts[c.key]) > 0)
      .map(c => ({ person: person.id, category: c.key, amount: Number(amounts[c.key]), concept: concept.trim() }));
    if (!rows.length) { setErr("Marca al menos una bolsa y escribe un monto."); return; }
    if (!window.SB_DB) { setErr("Sin conexión con la base de datos."); return; }
    setSaving(true);
    try {
      await window.SB_DB.add(rows);
      setChecks({}); setAmounts({}); setConcept("");
      await onChange();
    } catch (e) {
      setErr("No se pudo guardar: " + (e.message || e));
    } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.SB_DB) return;
    try { await window.SB_DB.remove(id); await onChange(); } catch (e) { setErr("No se pudo borrar: " + (e.message || e)); }
  };

  const panel = (
    <div onClick={(e) => e.stopPropagation()} style={{
      background: "var(--paper)", width: "100%",
      maxWidth: mobile ? "100%" : 520, maxHeight: mobile ? "88vh" : "86vh", overflowY: "auto",
      borderRadius: mobile ? "24px 24px 0 0" : "var(--r-lg)",
      boxShadow: "0 -10px 60px rgba(44,33,26,.25)", padding: "0",
      animation: (mobile ? "crUp" : "crIn") + " .32s cubic-bezier(.2,.8,.2,1) both" }}>
      {/* header */}
      <div style={{ position: "sticky", top: 0, zIndex: 2, background: CR_GRAD[person.color], color: "#fff", padding: "20px 22px",
        borderRadius: mobile ? "24px 24px 0 0" : "var(--r-lg) var(--r-lg) 0 0" }}>
        {mobile && <div style={{ width: 40, height: 4, borderRadius: 99, background: "rgba(255,255,255,.6)", margin: "-8px auto 12px" }} />}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: "-.01em" }}>{person.nick}</div>
            <div style={{ fontSize: 11.5, opacity: .92, textTransform: "uppercase", letterSpacing: ".06em", marginTop: 2 }}>{person.full}</div>
          </div>
          <button onClick={onClose} aria-label="Cerrar" style={{ border: "none", cursor: "pointer", width: 34, height: 34, borderRadius: 99,
            background: "rgba(255,255,255,.25)", color: "#fff", fontSize: 18, lineHeight: 1, fontWeight: 700 }}>×</button>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 16 }}>
          <div><div style={{ fontSize: 10, opacity: .85, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>Presupuesto</div>
            <div className="money" style={{ fontWeight: 800, fontSize: 16 }}>{cfmt(totalBase)}</div></div>
          <div><div style={{ fontSize: 10, opacity: .85, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>Gastado</div>
            <div className="money" style={{ fontWeight: 800, fontSize: 16 }}>{cfmt(totalSpent)}</div></div>
          <div><div style={{ fontSize: 10, opacity: .85, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>Saldo</div>
            <div className="money" style={{ fontWeight: 800, fontSize: 16 }}>{totalRem < 0 ? "−" + cfmt(-totalRem) : cfmt(totalRem)}</div></div>
        </div>
      </div>

      <div style={{ padding: "18px 22px" }}>
        {/* bolsas con saldo */}
        <div style={{ marginBottom: 18 }}>
          {CR_CATS.map(c => <CrewBolsa key={c.key} cat={c} person={person} gastos={gastos} />)}
        </div>

        {/* formulario nuevo gasto */}
        <div style={{ background: "var(--paper-2)", border: "1px solid var(--line-soft)", borderRadius: 16, padding: "16px 18px" }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--coral-deep)", marginBottom: 12 }}>Registrar gasto</div>
          <input value={concept} onChange={e => setConcept(e.target.value)} placeholder="¿En qué? (ej. taxi, cena, mercado)"
            style={{ width: "100%", boxSizing: "border-box", border: "1px solid var(--line)", borderRadius: 10, padding: "11px 12px",
              fontFamily: "inherit", fontSize: 14, marginBottom: 12, background: "#fff", color: "var(--ink)" }} />
          {CR_CATS.map(c => (
            <label key={c.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer" }}>
              <input type="checkbox" checked={!!checks[c.key]} onChange={() => toggle(c.key)}
                style={{ width: 18, height: 18, accentColor: "#ff5a2c", cursor: "pointer", flex: "0 0 auto" }} />
              <span style={{ width: 9, height: 9, borderRadius: 99, background: CR_PAL[c.key], flex: "0 0 auto" }} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{c.label}</span>
              <input value={amounts[c.key] || ""} onChange={e => setAmt(c.key, e.target.value)} inputMode="numeric"
                disabled={!checks[c.key]} placeholder="$0"
                style={{ width: 110, textAlign: "right", border: "1px solid var(--line)", borderRadius: 10, padding: "9px 10px",
                  fontFamily: "inherit", fontSize: 14, background: checks[c.key] ? "#fff" : "rgba(44,33,26,.04)",
                  color: "var(--ink)", opacity: checks[c.key] ? 1 : .5 }} />
            </label>
          ))}
          {err && <div style={{ marginTop: 10, fontSize: 12.5, color: "var(--coral-deep)", fontWeight: 600 }}>{err}</div>}
          <button onClick={save} disabled={saving} className="btn btn-coral"
            style={{ width: "100%", justifyContent: "center", marginTop: 14, padding: "13px", opacity: saving ? .6 : 1 }}>
            {saving ? "Guardando…" : "Guardar gasto"}
          </button>
        </div>

        {/* historial */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 8 }}>
            Movimientos ({mine.length})
          </div>
          {mine.length === 0 && <div style={{ fontSize: 13, color: "var(--ink-faint)", padding: "8px 0" }}>Aún no hay gastos registrados.</div>}
          {mine.map(g => {
            const cat = CR_CATS.find(c => c.key === g.category);
            return (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                <span style={{ width: 9, height: 9, borderRadius: 99, background: CR_PAL[g.category] || "var(--ink-faint)", flex: "0 0 auto" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 600 }}>{g.concept || (cat ? cat.label : g.category)}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-faint)" }}>{cat ? cat.label : g.category}</div>
                </div>
                <span className="money" style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{cfmt(Number(g.amount))}</span>
                <button onClick={() => del(g.id)} aria-label="Borrar" style={{ border: "none", cursor: "pointer", background: "transparent",
                  color: "var(--ink-faint)", fontSize: 18, lineHeight: 1, padding: "0 4px" }}>×</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(44,33,26,.45)",
      backdropFilter: "blur(3px)", display: "flex", alignItems: mobile ? "flex-end" : "center", justifyContent: "center",
      padding: mobile ? 0 : 20, animation: "crFade .25s ease both" }}>
      {panel}
    </div>
  );
}

/* ========================= CREW ========================= */
function Crew() {
  const [gastos, setGastos] = cuS([]);
  const [openId, setOpenId] = cuS(null);
  const [mobile, setMobile] = cuS(typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches);
  const [dbErr, setDbErr] = cuS(false);

  const load = async () => {
    if (!window.SB_DB) { setDbErr(true); return; }
    try { setGastos(await window.SB_DB.list()); setDbErr(false); }
    catch (e) { setDbErr(true); }
  };

  cuE(() => {
    load();
    const mq = window.matchMedia("(max-width: 640px)");
    const onMq = (e) => setMobile(e.matches);
    mq.addEventListener("change", onMq);
    const off = window.SB_DB ? window.SB_DB.onChange(load) : () => {};
    const onVis = () => { if (!document.hidden) load(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { mq.removeEventListener("change", onMq); off(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const totalOf = (p) => CR_CATS.reduce((a, c) => a + c.base(p), 0);
  const spentOf = (p) => CR_CATS.reduce((a, c) => a + cr_spent(gastos, p.id, c.key), 0);
  const groupTotal = CSB.crew.reduce((a, p) => a + totalOf(p), 0);
  const groupSpent = CSB.crew.reduce((a, p) => a + spentOf(p), 0);
  const open = CSB.crew.find(p => p.id === openId);

  return (
    <section id="crew" className="section-pad">
      <style>{`
        @keyframes crFade { from{opacity:0} to{opacity:1} }
        @keyframes crUp { from{transform:translateY(100%)} to{transform:none} }
        @keyframes crIn { from{transform:translateY(16px) scale(.98);opacity:0} to{transform:none;opacity:1} }
      `}</style>
      <div className="wrap">
        <div className="reveal" style={{ marginBottom: 40 }}>
          <div className="eyebrow">Las protagonistas</div>
          <h2 className="sec-title">The Crew</h2>
          <p className="sec-sub">Cinco viajeras, un mismo plan. Cada una tiene sus bolsas de presupuesto: registra gastos y mira el saldo bajar en vivo. {dbErr && <b style={{ color: "var(--coral-deep)" }}>· (Conectando con la base…)</b>}</p>
        </div>

        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 18 }}>
          {CSB.crew.map(p => {
            const tb = totalOf(p), ts = spentOf(p), rem = tb - ts;
            return (
              <div key={p.id} className="card" style={{ padding: 22, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: CR_GRAD[p.color], display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 18, boxShadow: "0 8px 20px rgba(226,60,18,.18)" }}>
                    {p.nick.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 19, color: "var(--coral)", letterSpacing: "-.01em" }}>{p.nick}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: ".06em", marginTop: 2 }}>{p.full}</div>
                  </div>
                </div>

                <div style={{ marginTop: 18, padding: "14px 16px", borderRadius: 14, background: "var(--paper-2)", border: "1px solid var(--line-soft)" }}>
                  {CR_CATS.map(c => <CrewBolsa key={c.key} cat={c} person={p} gastos={gastos} />)}
                  <div style={{ height: 1, background: "var(--line)", margin: "10px 0 8px" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-soft)" }}>Saldo total</span>
                    <span className="money" style={{ fontWeight: 900, fontSize: 18, color: rem < 0 ? "var(--coral-deep)" : "var(--ink)" }}>
                      {rem < 0 ? "−" + cfmt(-rem) : cfmt(rem)}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <a href={encodeURI(p.pdf)} download={"Tiquete Avianca - " + p.nick + ".pdf"} style={{ fontSize: 11.5, color: "var(--ink-soft)", fontWeight: 700, textDecoration: "none" }}>Tiquete ↓</a>
                  <button onClick={() => setOpenId(p.id)} className="btn btn-coral" style={{ padding: "10px 16px", fontSize: 11.5 }}>Registrar gasto</button>
                </div>
              </div>
            );
          })}

          {/* group total tile */}
          <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", background: "linear-gradient(150deg,#ff7a4d,#e23c12)", color: "#fff", border: "none" }}>
            <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 800, opacity: .92 }}>Gasto del grupo</div>
            <div className="money" style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-.02em", marginTop: 8 }}>{cfmt(groupSpent)}</div>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: .92, marginTop: 6 }}>de {cfmt(groupTotal)} presupuestado · COP</div>
            <div style={{ marginTop: 16, height: 8, borderRadius: 99, background: "rgba(255,255,255,.25)", overflow: "hidden" }}>
              <div style={{ width: Math.min(100, groupTotal ? groupSpent / groupTotal * 100 : 0) + "%", height: "100%", background: "rgba(255,255,255,.9)", transition: "width .4s" }} />
            </div>
            <div style={{ marginTop: 16, fontSize: 12.5, lineHeight: 1.6, opacity: .9 }}>Cada quien gasta de sus bolsas. Melanie paga menos en vuelo.</div>
          </div>
        </div>
      </div>

      {open && <CrewSheet person={open} gastos={gastos} mobile={mobile} onClose={() => setOpenId(null)} onChange={load} />}
    </section>
  );
}

Object.assign(window, { Crew });
