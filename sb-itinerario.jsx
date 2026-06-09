/* Santa & Beyond — Itinerario editable (Supabase: overrides + paradas nuevas + ocultas) */
const { useState: itS, useEffect: itE } = React;
const ITSB = window.SB;

function Itinerary() {
  const days = ITSB.days;
  const [sel, setSel] = itS(0);
  const [overrides, setOverrides] = itS({});   // { stop_id: {time, head, body} }
  const [hidden, setHidden] = itS({});          // { stop_id: true } (paradas base ocultas)
  const [custom, setCustom] = itS([]);          // paradas nuevas
  const [dbErr, setDbErr] = itS(false);
  const [editing, setEditing] = itS(null);      // stop_id en edición
  const [eForm, setEForm] = itS({ time: "", head: "", body: "" });
  const [adding, setAdding] = itS(false);
  const [aForm, setAForm] = itS({ time: "", head: "", body: "" });
  const [saving, setSaving] = itS(false);

  const day = days[sel];

  const baseStops = day.stops
    .map((s, i) => ({ id: day.id + "-" + i, time: s.time, head: s.head, body: s.body, custom: false }))
    .filter(s => !hidden[s.id])
    .map(s => {
      const o = overrides[s.id];
      return o ? { ...s, time: o.time != null ? o.time : s.time, head: o.head != null ? o.head : s.head, body: o.body != null ? o.body : s.body } : s;
    });
  const customStops = custom
    .filter(c => c.day_id === day.id)
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .map(c => ({ id: c.stop_id, time: c.time, head: c.head, body: c.body, custom: true }));
  const stops = baseStops.concat(customStops);

  const load = async () => {
    if (!window.SB_DB) { setDbErr(true); return; }
    try {
      const rows = await window.SB_DB.itinerarioList();
      const ov = {}, hid = {}, cust = [];
      rows.forEach(r => {
        if (r.custom) cust.push({ stop_id: r.stop_id, day_id: r.day_id, time: r.hora, head: r.head, body: r.body, position: r.position });
        else if (r.hidden) hid[r.stop_id] = true;
        else if (r.hora != null || r.head != null || r.body != null) ov[r.stop_id] = { time: r.hora, head: r.head, body: r.body };
      });
      setOverrides(ov); setHidden(hid); setCustom(cust); setDbErr(false);
    } catch (e) { setDbErr(true); }
  };

  itE(() => {
    load();
    const off = window.SB_DB ? window.SB_DB.itinerarioOnChange(load) : () => {};
    const onVis = () => { if (!document.hidden) load(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { off(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const startEdit = (s) => { setAdding(false); setEditing(s.id); setEForm({ time: s.time || "", head: s.head || "", body: s.body || "" }); };
  const saveEdit = async () => {
    const head = eForm.head.trim();
    if (!head) return;
    if (!window.SB_DB) { setDbErr(true); return; }
    const id = editing;
    setSaving(true);
    try { await window.SB_DB.itinerarioUpsert(id, { hora: eForm.time.trim(), head, body: eForm.body.trim() }); await load(); setEditing(null); }
    catch (e) { setDbErr(true); }
    finally { setSaving(false); }
  };
  const removeStop = async (s) => {
    if (!window.SB_DB) { setDbErr(true); return; }
    try {
      if (s.custom) { setCustom(c => c.filter(x => x.stop_id !== s.id)); await window.SB_DB.itinerarioRemove(s.id); }
      else { setHidden(h => ({ ...h, [s.id]: true })); await window.SB_DB.itinerarioUpsert(s.id, { hidden: true }); }
    } catch (e) { setDbErr(true); load(); }
  };
  const addStop = async () => {
    const head = aForm.head.trim();
    if (!head) return;
    if (!window.SB_DB) { setDbErr(true); return; }
    setSaving(true);
    try {
      await window.SB_DB.itinerarioAdd({ day_id: day.id, hora: aForm.time.trim(), head, body: aForm.body.trim(), position: Date.now() });
      setAForm({ time: "", head: "", body: "" }); setAdding(false); await load();
    } catch (e) { setDbErr(true); }
    finally { setSaving(false); }
  };

  const inS = { border: "1px solid var(--line)", borderRadius: 10, padding: "9px 10px", fontFamily: "inherit", fontSize: 14, background: "#fff", color: "var(--ink)" };
  const iconBtn = { border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-faint)", lineHeight: 1, padding: "2px 5px" };

  const EditRow = ({ form, setForm, onSave, onCancel }) => (
    <div style={{ background: "var(--paper-2)", border: "1px solid var(--line-soft)", borderRadius: 12, padding: 12, marginBottom: 14 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="Hora (ej. 9–10 am)" style={{ ...inS, flex: "0 1 130px" }} />
        <input value={form.head} onChange={e => setForm(f => ({ ...f, head: e.target.value }))} placeholder="Actividad" style={{ ...inS, flex: "1 1 200px", minWidth: 0 }} />
      </div>
      <input value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Detalle (opcional)" style={{ ...inS, width: "100%", boxSizing: "border-box", marginTop: 8 }} />
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={onSave} disabled={saving} className="btn btn-coral" style={{ padding: "9px 16px", fontSize: 12, opacity: saving ? .6 : 1 }}>{saving ? "Guardando…" : "Guardar"}</button>
        <button onClick={onCancel} className="btn btn-ghost" style={{ padding: "9px 14px", fontSize: 12 }}>Cancelar</button>
      </div>
    </div>
  );

  return (
    <section id="itinerario" className="section-pad" style={{ background: "linear-gradient(180deg, var(--paper-2) 0%, var(--paper) 100%)" }}>
      <div className="wrap">
        <div className="reveal" style={{ marginBottom: 36 }}>
          <div className="eyebrow">21 — 24 de junio · 4 días</div>
          <h2 className="sec-title">Itinerario</h2>
          <p className="sec-sub">El plan día por día. Toca el ✎ para editar una parada o agrega las tuyas — se guarda y sincroniza solo.{dbErr && <b style={{ color: "var(--coral-deep)" }}> · (sin conexión a la base)</b>}</p>
        </div>

        {/* day tabs */}
        <div className="reveal" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          {days.map((d, i) => (
            <button key={d.id} onClick={() => { setSel(i); setEditing(null); setAdding(false); }}
              style={{ cursor: "pointer", border: "1px solid", borderColor: sel === i ? "transparent" : "var(--line)",
                background: sel === i ? "linear-gradient(180deg,#ff5a2c,#e23c12)" : "rgba(255,255,255,.6)",
                color: sel === i ? "#fff" : "var(--ink-soft)", borderRadius: 16, padding: "12px 18px", textAlign: "left",
                transition: "all .25s", boxShadow: sel === i ? "0 10px 24px rgba(226,60,18,.28)" : "none", minWidth: 120, fontFamily: "inherit" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", opacity: .9 }}>{d.dow}</div>
              <div style={{ fontWeight: 800, fontSize: 19, marginTop: 2, letterSpacing: "-.01em" }}>{d.date}</div>
            </button>
          ))}
        </div>

        {/* day panel */}
        <div className="reveal card" style={{ padding: "30px clamp(20px,4vw,40px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(22px,3vw,30px)", letterSpacing: "-.01em" }}>{day.title}</h3>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--coral-deep)", background: "rgba(255,90,44,.1)", padding: "5px 12px", borderRadius: 99 }}>{day.tag}</span>
          </div>

          <div style={{ position: "relative", paddingLeft: 8 }}>
            {stops.map((s, i) => (
              editing === s.id ? (
                <EditRow key={s.id} form={eForm} setForm={setEForm} onSave={saveEdit} onCancel={() => setEditing(null)} />
              ) : (
                <div key={s.id} style={{ display: "grid", gridTemplateColumns: "78px 1fr", gap: 18, paddingBottom: i < stops.length - 1 ? 26 : 0 }}>
                  <div className="money" style={{ fontWeight: 800, fontSize: 15, color: "var(--coral-deep)", textAlign: "right", paddingTop: 1 }}>{s.time}</div>
                  <div style={{ position: "relative", paddingLeft: 26, paddingBottom: 2 }}>
                    <span style={{ position: "absolute", left: 0, top: 4, width: 13, height: 13, borderRadius: 99, background: "#fff", border: "3px solid var(--coral)", zIndex: 1 }} />
                    {i < stops.length - 1 && <span style={{ position: "absolute", left: 6, top: 16, bottom: -26, width: 2, background: "linear-gradient(var(--coral), rgba(255,90,44,.2))" }} />}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 16.5, color: "var(--ink)" }}>{s.head}</div>
                        {s.body && <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 4, lineHeight: 1.55, maxWidth: "62ch" }}>{s.body}</div>}
                      </div>
                      <button onClick={() => startEdit(s)} aria-label="Editar" title="Editar" style={{ ...iconBtn, fontSize: 14 }}>✎</button>
                      <button onClick={() => removeStop(s)} aria-label="Quitar" title="Quitar" style={{ ...iconBtn, fontSize: 18 }}>×</button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* añadir parada */}
          <div style={{ marginTop: 22, paddingLeft: 8 }}>
            {adding
              ? <EditRow form={aForm} setForm={setAForm} onSave={addStop} onCancel={() => setAdding(false)} />
              : <button onClick={() => { setEditing(null); setAdding(true); }} className="btn btn-ghost" style={{ padding: "11px 18px", fontSize: 12.5 }}>+ Añadir parada</button>}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Itinerary });
