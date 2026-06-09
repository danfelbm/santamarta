/* Santa & Beyond — datos del viaje (precios reales 2026, COP) */
window.SB = (function () {
  const fmt = (n) =>
    "$" + n.toLocaleString("es-CO").replace(/ /g, ".") + "";
  const fmtCOP = (n) => fmt(n) + " COP";

  const PEOPLE = 5;

  // ---- Vuelos (Avianca BOG <-> SMR · tiquetes reales) ----
  // Reserva grupal A8R6ML (4 pasajeras) + Melanie en reserva aparte ANKD7X (tarifa más baja).
  const flights = {
    airline: "Avianca",
    bookingRef: "A8R6ML",
    operatedBy: "Avianca Express",
    out: {
      code: "AV4822",
      date: "Dom 21 jun 2026",
      from: { iata: "BOG", city: "Bogotá", airport: "El Dorado · T1", time: "19:00" },
      to: { iata: "SMR", city: "Santa Marta", airport: "Simón Bolívar", time: "20:35" },
      dur: "1h 35m",
      fare: 87500,
      tariff: "Tarifa Basic · sin equipaje de bodega",
    },
    back: {
      code: "AV8507",
      date: "Mié 24 jun 2026",
      from: { iata: "SMR", city: "Santa Marta", airport: "Simón Bolívar", time: "19:20" },
      to: { iata: "BOG", city: "Bogotá", airport: "El Dorado · T1", time: "20:55" },
      dur: "1h 35m",
      fare: 87500,
      tariff: "Tarifa Basic · sin equipaje de bodega",
    },
    taxes: 81650,        // 48.400 (CO) + 33.250 (YS)
    perPerson: 256650,   // tarifa 175.000 + tasas 81.650
  };

  // ---- The Crew (datos reales de los tiquetes Avianca) ----
  const crew = [
    { id: "helen",   nick: "Helen",     full: "Helen Sofía Barón Romero",      pnr: "A8R6ML", ticket: "1342156659802", vuelo: 256650, pdf: "tiquete-helen.pdf",     color: "blue"  },
    { id: "melanie", nick: "Melanie",   full: "Melanie Ariana Barón Romero",   pnr: "ANKD7X", ticket: "1342156689155", vuelo: 194290, pdf: "tiquete-melanie.pdf",   color: "peach" },
    { id: "natalia", nick: "Natalia",   full: "Natalia Gordillo Álvarez",      pnr: "A8R6ML", ticket: "1342156659804", vuelo: 256650, pdf: "tiquete-natalia.pdf",   color: "coral" },
    { id: "aleja",   nick: "Alejandra", full: "Yohany Alejandra Chávez García", pnr: "A8R6ML", ticket: "1342156659803", vuelo: 256650, pdf: "tiquete-alejandra.pdf", color: "rose"  },
    { id: "malena",  nick: "Malena",    full: "Malena Lucía Pérez Watts",      pnr: "A8R6ML", ticket: "1342156659805", vuelo: 256650, pdf: "tiquete-malena.pdf",    color: "amber" },
  ];

  // ---- Presupuesto: categorías por persona (hoja real del grupo) ----
  // Bolsas base por persona. El vuelo estándar es 256.650; Melanie paga 194.290.
  const budget = [
    {
      key: "vuelos",
      label: "Vuelos Avianca",
      detail: "BOG ↔ SMR · AV4822 / AV8507 · tarifa Basic",
      perPerson: 256650,
      group: 256650 * 4 + 194290, // Melanie tarifa más baja
    },
    {
      key: "hospedaje",
      label: "Estadía / hospedaje",
      detail: "Estadía 1 $135.500 + Estadía 2 $40.000 · por persona",
      perPerson: 175500,
      group: 175500 * PEOPLE,
    },
    {
      key: "tayrona",
      label: "Entrada Tayrona",
      detail: "Ingreso al Parque Nacional Natural Tayrona",
      perPerson: 40000,
      group: 40000 * PEOPLE,
    },
    {
      key: "transporte",
      label: "Transporte terrestre",
      detail: "Aeropuerto, compras, bus al Tayrona y regreso",
      perPerson: 50000,
      group: 250000,
    },
    {
      key: "mercado",
      label: "Comida & mercado",
      detail: "$220.000 grupal ÷ 5 viajeras",
      perPerson: 44000,
      group: 220000,
    },
  ];

  // Categorías como "bolsas" para el tracker de gastos de The Crew
  const categories = budget.map(b => ({ key: b.key, label: b.label, perPerson: b.perPerson }));

  // ---- Transporte: desglose por día (hoja real) ----
  const transport = [
    { label: "Aeropuerto SMR → Reserva del Mar 2", sub: "Día 1 · llegada", cost: 60000 },
    { label: "Carro para compras de mercado",       sub: "Día 2",          cost: 40000 },
    { label: "Bus hacia el Parque Tayrona",         sub: "Día 3",          cost: 50000 },
    { label: "Tayrona → Santa Marta → aeropuerto",  sub: "Día 4 · regreso", cost: 100000 },
  ];
  const transportTotal = transport.reduce((a, t) => a + t.cost, 0);

  // ---- Mercado: lista de compras para 3 días (desayunos & cenas) · $220.000 ----
  const mercadoBudget = 220000;
  const mercadoList = [
    { group: "Desayunos", items: [
      { id: "m-huevos",      name: "Huevos (panal × 30)",            price: 14000 },
      { id: "m-pan",         name: "Pan tajado + arepas",            price: 12000 },
      { id: "m-cafe",        name: "Café molido 500 g",              price: 16000 },
      { id: "m-leche",       name: "Leche / leche de almendras (2 L)", price: 11000 },
      { id: "m-fruta",       name: "Fruta (banano, papaya, mango)",  price: 14000 },
      { id: "m-queso",       name: "Queso costeño 500 g",            price: 12000 },
      { id: "m-mantequilla", name: "Mantequilla + mermelada",        price: 9000  },
    ]},
    { group: "Cenas", items: [
      { id: "m-pasta",    name: "Pasta (2 paq.) + salsa de tomate", price: 13000 },
      { id: "m-pollo",    name: "Pollo 1.5 kg",                     price: 22000 },
      { id: "m-arroz",    name: "Arroz 2 lb",                       price: 7000  },
      { id: "m-verduras", name: "Verduras / ensalada",              price: 14000 },
      { id: "m-aguacate", name: "Aguacate + plátano",               price: 9000  },
      { id: "m-alinos",   name: "Aliños (cebolla, tomate, ajo, limón)", price: 10000 },
      { id: "m-atun",     name: "Atún (3 latas)",                   price: 13000 },
    ]},
    { group: "Básicos & bebidas", items: [
      { id: "m-agua",   name: "Agua (2 pacas)",                  price: 15000 },
      { id: "m-aceite", name: "Aceite + sal + panela",           price: 11000 },
      { id: "m-snacks", name: "Snacks (papas, galletas, chocolate)", price: 11000 },
      { id: "m-hielo",  name: "Hielo + sueros / electrolitos",   price: 7000  },
    ]},
  ];

  // ---- Hospedaje ----
  const stays = [
    {
      name: "Reserva del Mar 2",
      role: "Base · 3 noches",
      addr: "Carrera 2 #20-134, Reservas del Mar 2, Gaira, Magdalena 470006",
      note: "Estadía 1 $135.500 + Estadía 2 $40.000 = $175.500 por persona",
      cost: "$175.500 / persona",
    },
    {
      name: "Taquilla El Zaino — P.N.N. Tayrona",
      role: "Excursión · día 2",
      addr: "Vías Parque Nacional Tayrona Km 26+400, Santa Marta, Magdalena 470007",
      note: "Registro de ingreso al parque + traslado terrestre desde Gaira",
      cost: "Día completo",
    },
  ];

  // ---- Itinerario 21–24 jun 2026 ----
  const days = [
    {
      id: "d1",
      dow: "Domingo",
      date: "21 jun",
      title: "Vuelo & llegada a Santa Marta",
      tag: "Llegada",
      stops: [
        { time: "5:00 pm", head: "Llegada al aeropuerto El Dorado", body: "Encuentro en Bogotá para el vuelo." },
        { time: "7:00 pm", head: "Abordaje al avión", body: "" },
        { time: "8–9 pm", head: "Llegada a Santa Marta", body: "" },
        { time: "9–10 pm", head: "Dejar el equipaje en el Airbnb", body: "" },
        { time: "—", head: "Descansar", body: "" },
      ],
    },
    {
      id: "d2",
      dow: "Lunes",
      date: "22 jun",
      title: "Mercado, playa & centro",
      tag: "Ciudad",
      stops: [
        { time: "8–9 am", head: "Arreglarnos", body: "" },
        { time: "9–10 am", head: "Hacer mercado y desayuno por fuera", body: "" },
        { time: "10–3 pm", head: "Día de playa", body: "Almuerzo por fuera." },
        { time: "3–8 pm", head: "Vueltas por el centro de Santa Marta", body: "" },
      ],
    },
    {
      id: "d3",
      dow: "Martes",
      date: "23 jun",
      title: "Piscina, check-out & Tayrona",
      tag: "Tayrona",
      stops: [
        { time: "8–9 am", head: "Alistarnos", body: "Dejar maletas listas para entregar el hotel." },
        { time: "9–11 am", head: "Día de piscina", body: "Aprovechar las zonas comunes del hotel." },
        { time: "11:00 am", head: "Entregar hotel", body: "" },
        { time: "12–1 pm", head: "Almuerzo por fuera", body: "" },
        { time: "—", head: "Traslado a Tayrona", body: "Tentativo: ver el partido en el Tayrona." },
      ],
    },
    {
      id: "d4",
      dow: "Miércoles",
      date: "24 jun",
      title: "Playas, Palomino & regreso",
      tag: "Regreso",
      stops: [
        { time: "8–9 am", head: "Alistarnos", body: "" },
        { time: "9–10 am", head: "Desayunar", body: "" },
        { time: "10–1 pm", head: "Disfrutar las playas", body: "Tentativo: ir a Palomino." },
        { time: "1:00 pm", head: "Almuerzo por fuera", body: "" },
        { time: "2:00 pm", head: "Vuelta a Santa Marta", body: "" },
        { time: "5:00 pm", head: "Abordaje al avión", body: "" },
        { time: "7:00 pm", head: "Llegada a Bogotá", body: "" },
      ],
    },
  ];

  return {
    fmt, fmtCOP, PEOPLE,
    flights, crew, budget, categories, transport, transportTotal,
    mercadoBudget, mercadoList, stays, days,
  };
})();
