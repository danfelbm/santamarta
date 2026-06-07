/* Santa & Beyond — Mercado: checklist de compras persistente (Supabase) */
const { useState: mkS, useEffect: mkE } = React;
const MSB = window.SB;
const mfmt = MSB.fmt;

function Mercado() {
  const [bought, setBought] = mkS({});   // { item_id: true }
  const [ready, setReady] = mkS(false);
  const [dbErr, setDbErr] = mkS(false);

  const groups = MSB.mercadoList;
  const all = groups.flatMap(g => g.items);
  const totalMoney = all.reduce((a, i) => a + i.price, 0);
  const checked = all.filter(i => bought[i.id]);
  const checkedMoney = checked.reduce((a, i) => a + i.price, 0);
  const pct = totalMoney ? Math.round((checkedMoney / totalMoney) * 100) : 0;

  const load = async () => {
    if (!window.SB_DB) { setDbErr(true); setReady(true); return; }
    try {
      const rows = await window.SB_DB.mercadoList();
      const map = {};
      rows.forEach(r => { if (r.bought) map[r.item_id] = true; });
      setBought(map); setDbErr(false);
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
    setBought(p => ({ ...p, [id]: next }));          // optimista
    if (!window.SB_DB) return;
    try { await window.SB_DB.mercadoSet(id, next); }
    catch (e) { setBought(p => ({ ...p, [id]: !next })); setDbErr(true); }  // revierte
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
              <div className="money" style={{ fontWeight: 900, fontSize: 22, color: "var(--ink)" }}>{checked.length}/{all.length}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-soft)", fontWeight: 600 }}>ítems listos</div>
            </div>
          </div>
          <div style={{ marginTop: 14, height: 10, borderRadius: 99, background: "rgba(44,33,26,.08)", overflow: "hidden" }}>
            <div style={{ width: pct + "%", height: "100%", borderRadius: 99, transition: "width .4s",
              background: "linear-gradient(90deg,#ff7a4d,#e23c12)" }} />
          </div>
        </div>

        {/* listas por grupo */}
        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, opacity: ready ? 1 : .5, transition: "opacity .3s" }}>
          {groups.map(g => {
            const gItems = g.items;
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
                    <label key={it.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", cursor: "pointer",
                      borderRadius: 12, transition: "background .15s", background: on ? "rgba(255,90,44,.05)" : "transparent" }}>
                      <input type="checkbox" checked={on} onChange={() => toggle(it.id)}
                        style={{ width: 19, height: 19, accentColor: "#ff5a2c", cursor: "pointer", flex: "0 0 auto" }} />
                      <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 600, color: on ? "var(--ink-faint)" : "var(--ink)",
                        textDecoration: on ? "line-through" : "none" }}>{it.name}</span>
                      <span className="money" style={{ fontSize: 13.5, fontWeight: 700, color: on ? "var(--ink-faint)" : "var(--ink-soft)",
                        textDecoration: on ? "line-through" : "none" }}>{mfmt(it.price)}</span>
                    </label>
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
