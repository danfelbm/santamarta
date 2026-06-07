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

  // ---- Comida & mercado ----
  const mercado = [
    { tag: "Esenciales", items: "Café local, leche de almendras, granola y huevos" },
    { tag: "Vital", items: "Aguas minerales (2 pacas) y sueros post-fiesta" },
    { tag: "Party", items: "Licores para el pre (ginebra / mezcal / cervezas) + hielo" },
    { tag: "Chill", items: "Munchies: chips de plátano, papas, hummus, chocolates" },
  ];
  const mercadoTotal = 220000;

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
      title: "Llegada nocturna a Santa Marta",
      tag: "Check-in",
      stops: [
        { time: "19:00", head: "Despegue desde Bogotá", body: "Vuelo Avianca AV4822 BOG → SMR. Aterrizamos a las 20:35 en el aeropuerto Simón Bolívar." },
        { time: "20:35", head: "Aterrizaje en Santa Marta", body: "Recogemos equipaje en el Simón Bolívar y salimos hacia Gaira." },
        { time: "21:15", head: "Check-in en Reserva del Mar 2", body: "Traslado a la base. Carrera 2 #20-134, Reservas del Mar 2." },
        { time: "22:30", head: "Cena ligera & brindis", body: "Primer brindis del viaje. Que arranque Santa & beyond." },
      ],
    },
    {
      id: "d2",
      dow: "Lunes",
      date: "22 jun",
      title: "El gran día: ruta al Tayrona",
      tag: "Aventura",
      stops: [
        { time: "05:30", head: "Salida de Reserva del Mar 2", body: "Nos subimos a la van privada directo desde el edificio en Gaira." },
        { time: "07:00", head: "Registro en Taquilla El Zaino", body: "Ingreso al Parque Nacional Natural Tayrona. Registro y buseta interna hacia Cañaveral." },
        { time: "07:45", head: "La caminata de las palmeras", body: "Senderismo místico y calma tropical. Risas, senderos verdes y desconexión absoluta." },
        { time: "11:45", head: "El altar de la playa", body: "Almuerzo y tarde en Cabo San Juan. Brisa, mar cristalino y atardecer caribeño." },
        { time: "20:30", head: "Sunsets, beats & drinks", body: "Pre-party & fiesta. Cócteles y buena música para celebrar el viaje juntas." },
      ],
    },
    {
      id: "d3",
      dow: "Martes",
      date: "23 jun",
      title: "Día de calma & ciudad",
      tag: "Free day",
      stops: [
        { time: "10:00", head: "Mañana lenta & brunch", body: "Recuperar energías. Sueros post-fiesta y desayuno tardío junto al mar." },
        { time: "13:00", head: "Centro Histórico de Santa Marta", body: "Paseo por el malecón, Catedral, Parque de los Novios y compras de souvenirs." },
        { time: "16:30", head: "Atardecer en Playa Blanca / Taganga", body: "Opción de bote o tarde tranquila de piscina según la energía del grupo." },
        { time: "21:00", head: "Última noche de fiesta", body: "Cena especial y rumba de despedida. La calma que sana y la fiesta que enciende." },
      ],
    },
    {
      id: "d4",
      dow: "Miércoles",
      date: "24 jun",
      title: "Cierre & regreso",
      tag: "Check-out",
      stops: [
        { time: "10:00", head: "Desayuno & empaque", body: "Mañana sin afán, últimas fotos y check-out de Reserva del Mar 2." },
        { time: "13:00", head: "Últimas compras", body: "Antojos finales, café para el camino y cierre del mercado grupal." },
        { time: "17:30", head: "Traslado al aeropuerto", body: "Salida hacia el Simón Bolívar con tiempo de sobra." },
        { time: "19:20", head: "Regreso a Bogotá", body: "Vuelo Avianca AV8507 SMR → BOG. Aterrizamos a las 20:55 con el alma llena." },
      ],
    },
  ];

  return {
    fmt, fmtCOP, PEOPLE,
    flights, crew, budget, categories, transport, transportTotal,
    mercado, mercadoTotal, stays, days,
  };
})();
