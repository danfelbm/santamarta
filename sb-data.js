/* Santa & Beyond — datos del viaje (precios reales 2026, COP) */
window.SB = (function () {
  const fmt = (n) =>
    "$" + n.toLocaleString("es-CO").replace(/\u00A0/g, ".") + "";
  const fmtCOP = (n) => fmt(n) + " COP";

  const PEOPLE = 5;

  // ---- Vuelos (Avianca BOG <-> SMR, temporada alta junio 2026) ----
  const flights = {
    airline: "Avianca",
    out: {
      code: "AV 9612",
      date: "Sáb 21 jun 2026",
      from: { iata: "BOG", city: "Bogotá", airport: "El Dorado", time: "06:25" },
      to: { iata: "SMR", city: "Santa Marta", airport: "Simón Bolívar", time: "08:00" },
      dur: "1h 35m",
      fare: 198000,
      tariff: "Tarifa Basic · sin equipaje de bodega",
    },
    back: {
      code: "AV 9645",
      date: "Mar 24 jun 2026",
      from: { iata: "SMR", city: "Santa Marta", airport: "Simón Bolívar", time: "19:10" },
      to: { iata: "BOG", city: "Bogotá", airport: "El Dorado", time: "20:45" },
      dur: "1h 35m",
      fare: 212000,
      tariff: "Tarifa Basic · sin equipaje de bodega",
    },
    perPerson: 410000,
  };

  // ---- The Crew ----
  const crew = [
    { id: "male", nick: "Male", full: "Gordillo Álvarez Natalia", seatOut: "14A", seatBack: "14A", pnr: "TQ7K2M", color: "coral" },
    { id: "aleja", nick: "Aleja", full: "Chávez García Yohany Alejandra", seatOut: "14B", seatBack: "14B", pnr: "QX9P4R", color: "rose" },
    { id: "helen", nick: "Helen", full: "Barón Romero Helen Sofía", seatOut: "14C", seatBack: "14C", pnr: "ZL3D8N", color: "blue" },
    { id: "mela", nick: "Mela", full: "Pasajera 4", seatOut: "15A", seatBack: "15A", pnr: "BK6V1S", color: "peach" },
    { id: "nata", nick: "Nata", full: "Pasajera 5", seatOut: "15B", seatBack: "15B", pnr: "WM2H5J", color: "amber" },
  ];

  // ---- Presupuesto: categorías por persona ----
  const budget = [
    {
      key: "vuelos",
      label: "Vuelos Avianca",
      detail: "BOG ↔ SMR · ida y vuelta · tarifa Basic",
      perPerson: 410000,
      locked: true,
      group: 410000 * PEOPLE,
    },
    {
      key: "hospedaje",
      label: "Hospedaje · Reserva del Mar 2",
      detail: "3 noches en Gaira · cubierto en base previa",
      perPerson: 0,
      included: true,
      group: 0,
    },
    {
      key: "tayrona",
      label: "Entrada Tayrona + seguro",
      detail: "Temp. alta $43.000 + seguro obligatorio $6.000",
      perPerson: 49000,
      group: 49000 * PEOPLE,
    },
    {
      key: "transporte",
      label: "Transporte terrestre",
      detail: "Traslados aeropuerto + van privada + buseta interna",
      perPerson: 80000,
      group: 400000,
    },
    {
      key: "mercado",
      label: "Mercado & snacks",
      detail: "$270.000 grupal ÷ 5 viajeras",
      perPerson: 54000,
      group: 270000,
    },
    {
      key: "colchon",
      label: "Colchón / imprevistos",
      detail: "Fondo de emergencia recomendado",
      perPerson: 50000,
      group: 50000 * PEOPLE,
    },
  ];

  // ---- Transporte: desglose ----
  const transport = [
    {
      label: "Traslado aeropuerto SMR ⇌ Reserva del Mar 2",
      sub: "Ida y vuelta · grupal para las 5",
      cost: 80000,
    },
    {
      label: "Van privada Gaira ⇌ Taquilla El Zaino",
      sub: "Día Tayrona · exclusivo ida y vuelta",
      cost: 280000,
    },
    {
      label: "Buseta interna obligatoria Tayrona",
      sub: "Zaino ⇌ Cañaveral · $4.000 × 2 trayectos × 5",
      cost: 40000,
    },
  ];
  const transportTotal = transport.reduce((a, t) => a + t.cost, 0);

  // ---- Mercado ----
  const mercado = [
    { tag: "Esenciales", items: "Café local, leche de almendras, granola y huevos" },
    { tag: "Vital", items: "Aguas minerales (2 pacas) y sueros post-fiesta" },
    { tag: "Party", items: "Licores para el pre (ginebra / mezcal / cervezas) + hielo" },
    { tag: "Chill", items: "Munchies: chips de plátano, papas, hummus, chocolates" },
  ];
  const mercadoTotal = 270000;

  // ---- Hospedaje ----
  const stays = [
    {
      name: "Reserva del Mar 2",
      role: "Base · 3 noches",
      addr: "Carrera 2 #20-134, Reservas del Mar 2, Gaira, Magdalena 470006",
      note: "Costo de hospedaje cubierto / incluido en la base previa",
      cost: "Incluido",
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
      dow: "Sábado",
      date: "21 jun",
      title: "Llegada & primer atardecer",
      tag: "Check-in",
      stops: [
        { time: "06:25", head: "Despegue desde Bogotá", body: "Vuelo Avianca AV 9612 BOG → SMR. Aterrizamos a las 08:00 en el aeropuerto Simón Bolívar." },
        { time: "09:00", head: "Llegada a Reserva del Mar 2", body: "Traslado a Gaira y check-in en la base. Carrera 2 #20-134, Reservas del Mar 2." },
        { time: "12:30", head: "Almuerzo & playa en Gaira", body: "Primer chapuzón, descanso y aclimatación al ritmo caribe." },
        { time: "07:00", head: "Cena de bienvenida", body: "Brindis de apertura del viaje. Que arranque Santa & beyond." },
      ],
    },
    {
      id: "d2",
      dow: "Domingo",
      date: "22 jun",
      title: "El gran día: ruta al Tayrona",
      tag: "Aventura",
      stops: [
        { time: "05:30", head: "Salida de Reserva del Mar 2", body: "Nos subimos a la van privada directo desde el edificio en Gaira." },
        { time: "07:00", head: "Registro en Taquilla El Zaino", body: "Ingreso al Parque Nacional Natural Tayrona. Registro y buseta interna hacia Cañaveral." },
        { time: "07:45", head: "La caminata de las palmeras", body: "Senderismo místico y calma tropical. Risas, senderos verdes y desconexión absoluta." },
        { time: "11:45", head: "El altar de la playa", body: "Almuerzo y tarde en Cabo San Juan. Brisa, mar cristalino y atardecer caribeño." },
        { time: "08:30", head: "Sunsets, beats & drinks", body: "Pre-party & fiesta. Cócteles y buena música para celebrar el viaje juntas." },
      ],
    },
    {
      id: "d3",
      dow: "Lunes",
      date: "23 jun",
      title: "Día de calma & ciudad",
      tag: "Free day",
      stops: [
        { time: "10:00", head: "Mañana lenta & brunch", body: "Recuperar energías. Sueros post-fiesta y desayuno tardío junto al mar." },
        { time: "13:00", head: "Centro Histórico de Santa Marta", body: "Paseo por el malecón, Catedral, Parque de los Novios y compras de souvenirs." },
        { time: "16:30", head: "Atardecer en Playa Blanca / Taganga", body: "Opción de bote o tarde tranquila de piscina según la energía del grupo." },
        { time: "09:00", head: "Última noche de fiesta", body: "Cena especial y rumba de despedida. La calma que sana y la fiesta que enciende." },
      ],
    },
    {
      id: "d4",
      dow: "Martes",
      date: "24 jun",
      title: "Cierre & regreso",
      tag: "Check-out",
      stops: [
        { time: "10:00", head: "Desayuno & empaque", body: "Mañana sin afán, últimas fotos y check-out de Reserva del Mar 2." },
        { time: "13:00", head: "Últimas compras", body: "Antojos finales, café para el camino y cierre del mercado grupal." },
        { time: "17:30", head: "Traslado al aeropuerto", body: "Salida hacia el Simón Bolívar con tiempo de sobra." },
        { time: "19:10", head: "Regreso a Bogotá", body: "Vuelo Avianca AV 9645 SMR → BOG. Aterrizamos a las 20:45 con el alma llena." },
      ],
    },
  ];

  return {
    fmt, fmtCOP, PEOPLE,
    flights, crew, budget, transport, transportTotal,
    mercado, mercadoTotal, stays, days,
  };
})();
