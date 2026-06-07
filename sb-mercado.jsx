/* Santa & Beyond — Mercado: checklist de compras persistente (Supabase) */
const { useState: mkS, useEffect: mkE } = React;
const MSB = window.SB;
const mfmt = MSB.fmt;

function Mercado() {
  const groups = MSB.mercadoList;                 // grupos base (del código)
  const [bought, setBought] = mkS({});            // { id: true }
  const [custom, setCustom] = mkS([]);            // ítems añadidos: { id, name, price, grp }
  const [ready, setReady] = mkS(false);
  const [dbErr, setDbErr] = mkS(false);
  const [adding, setAdding] = mkS(false);
  const [form, setForm] = mkS({ name: "", price: "", grp: groups[0].group });
  const [saving, setSaving] = mkS(false);

  // lista combinada (base + personalizados) para totales
  const itemsOfGroup = (g) => g.items.concat(custom.filter(c => c.grp === g.group));
  const allItems = groups.flatMap(itemsOfGroup);
  const totalMoney = allItems.reduce((a, i) => a + Number(i.price), 0);
  const checked = allItems.filter(i => bought[i.id]);
  const checkedMoney = checked.reduce((a, i) => a + Number(i.price), 0);
  const pct = totalMoney ? Math.round((checkedMoney / totalMoney) * 100) : 0;

  const load = async () => {
    if (!window.SB_DB) { setDbErr(true); setReady(true); return; }
    try {
      const rows = await window.SB_DB.mercadoList();
      const map = {}, cust = [];
      rows.forEach(r => {
        if (r.bought) map[r.item_id] = true;
        if (r.custom) cust.push({ id: r.item_id, name: r.name, price: Number(r.price) || 0, grp: r.grp });
      });
      setBought(map); setCustom(cust); setDbErr(false);
    } catch (e) { setDbErr(true); }
    finally { setReady(true); }
  };

  mkE(() => {
    load();
    const off = window.SB_DB ? window.SB_DB.mercadoOnChange(load) : () => {};
    const onVis = () => { if (!document.hidden) load(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { off(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const toggle = async (id) => {
    const next = !bought[id];
    setBought(p => ({ ...p, [id]: next }));
    if (!window.SB_DB) return;
    try { await window.SB_DB.mercadoSet(id, next); }
    catch (e) { setBought(p => ({ ...p, [id]: !next })); setDbErr(true); }
  };

  const addItem = async () => {
    const name = form.name.trim();
    const price = Number(String(form.price).replace(/[^\d]/g, ""));
    if (!name || !(price > 0)) return;
    if (!window.SB_DB) { setDbErr(true); return; }
    setSaving(true);
    try {
      await window.SB_DB.mercadoAdd({ name, price, grp: form.grp });
      setForm({ name: "", price: "", grp: form.grp });
      setAdding(false);
      await load();
    } catch (e) { setDbErr(true); }
    finally { setSaving(false); }
  };

  const removeItem = async (id) => {
    setCustom(c => c.filter(x => x.id !== id));   // optimista
    if (!window.SB_DB) return;
    try { await window.SB_DB.mercadoRemove(id); } catch (e) { setDbErr(true); load(); }
  };

  return (
    <section id="mercado" className="section-pad">
      <div className="wrap">
        <div className="reveal" style={{ marginBottom: 32 }}>
          <div className="eyebrow">Combustible del viaje</div>
          <h2 className="sec-title">Mercado & snacks</h2>
          <p className="sec-sub">Lista de compras para 3 días, enfocada en desayunos y cenas. Presupuesto de {mfmt(MSB.mercadoBudget)} para las cinco. Chequea lo que ya compraron — se guarda y sincroniza solo.{dbErr && <b style={{ color: "var(--coral-deep)" }}> · (conectando…)</b>}</p>
        </div>

        {/* progreso */}
        <div className="reveal card" style={{ padding: "20px 24px", marginBottom: 22, maxWidth: 820 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-faint)", fontWeight: 800 }}>Comprado</div>
              <div className="money" style={{ fontWeight: 900, fontSize: 28, color: "var(--coral-deep)", letterSpacing: "-.02em", marginTop: 4 }}>
                {mfmt(checkedMoney)} <span style={{ fontSize: 15, color: "var(--ink-faint)", fontWeight: 700 }}>/ {mfmt(totalMoney)}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="money" style={{ fontWeight: 900, fontSize: 22, color: "var(--ink)" }}>{checked.length}/{allItems.length}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-soft)", fontWeight: 600 }}>ítems listos</div>
            </div>
          </div>
          <div style={{ marginTop: 14, height: 10, borderRadius: 99, background: "rgba(44,33,26,.08)", overflow: "hidden" }}>
            <div style={{ width: pct + "%", height: "100%", borderRadius: 99, transition: "width .4s",
              background: "linear-gradient(90deg,#ff7a4d,#e23c12)" }} />
          </div>
        </div>

        {/* añadir ítem */}
        <div className="reveal" style={{ marginBottom: 22, maxWidth: 820 }}>
          {!adding && (
            <button onClick={() => setAdding(true)} className="btn btn-ghost" style={{ padding: "12px 20px" }}>+ Añadir ítem</button>
          )}
          {adding && (
            <div className="card" style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--coral-deep)", marginBottom: 12 }}>Nuevo ítem</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre (ej. Cerveza, Toallas)"
                  style={{ flex: "2 1 200px", minWidth: 0, border: "1px solid var(--line)", borderRadius: 10, padding: "11px 12px", fontFamily: "inherit", fontSize: 14, background: "#fff", color: "var(--ink)" }} />
                <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value.replace(/[^\d]/g, "") }))} inputMode="numeric" placeholder="$0"
                  style={{ flex: "1 1 110px", width: 110, textAlign: "right", border: "1px solid var(--line)", borderRadius: 10, padding: "11px 12px", fontFamily: "inherit", fontSize: 14, background: "#fff", color: "var(--ink)" }} />
                <select value={form.grp} onChange={e => setForm(f => ({ ...f, grp: e.target.value }))}
                  style={{ flex: "1 1 150px", border: "1px solid var(--line)", borderRadius: 10, padding: "11px 12px", fontFamily: "inherit", fontSize: 14, background: "#fff", color: "var(--ink)" }}>
                  {groups.map(g => <option key={g.group} value={g.group}>{g.group}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button onClick={addItem} disabled={saving} className="btn btn-coral" style={{ padding: "11px 20px", opacity: saving ? .6 : 1 }}>{saving ? "Guardando…" : "Agregar"}</button>
                <button onClick={() => { setAdding(false); setForm({ name: "", price: "", grp: groups[0].group }); }} className="btn btn-ghost" style={{ padding: "11px 18px" }}>Cancelar</button>
              </div>
            </div>
          )}
        </div>

        {/* listas por grupo */}
        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, opacity: ready ? 1 : .5, transition: "opacity .3s" }}>
          {groups.map(g => {
            const gItems = itemsOfGroup(g);
            const gDone = gItems.filter(i => bought[i.id]).length;
            return (
              <div key={g.group} className="card" style={{ padding: "8px 8px 12px", alignSelf: "start" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 10px" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--coral-deep)" }}>{g.group}</span>
                  <span className="money" style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-faint)" }}>{gDone}/{gItems.length}</span>
                </div>
                {gItems.map(it => {
                  const on = !!bought[it.id];
                  return (
                    <div key={it.id} style={{ display: "flex", alignItems: "center", borderRadius: 12, background: on ? "rgba(255,90,44,.05)" : "transparent" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", cursor: "pointer", flex: 1, minWidth: 0 }}>
                        <input type="checkbox" checked={on} onChange={() => toggle(it.id)}
                          style={{ width: 19, height: 19, accentColor: "#ff5a2c", cursor: "pointer", flex: "0 0 auto" }} />
                        <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 600, color: on ? "var(--ink-faint)" : "var(--ink)",
                          textDecoration: on ? "line-through" : "none" }}>{it.name}</span>
                        <span className="money" style={{ fontSize: 13.5, fontWeight: 700, color: on ? "var(--ink-faint)" : "var(--ink-soft)",
                          textDecoration: on ? "line-through" : "none" }}>{mfmt(Number(it.price))}</span>
                      </label>
                      {it.custom && (
                        <button onClick={() => removeItem(it.id)} aria-label="Quitar" title="Quitar ítem"
                          style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-faint)", fontSize: 18, lineHeight: 1, padding: "0 12px 0 4px" }}>×</button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Mercado });
