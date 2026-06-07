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

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
