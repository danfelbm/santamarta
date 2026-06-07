/* Santa & Beyond — cliente Supabase.
   Solo se usa la ANON KEY: es pública por diseño (va en el frontend) y el acceso
   real lo gobiernan las políticas RLS de la tabla. La service_role NUNCA va aquí. */
window.SB_DB = (function () {
  const URL = "https://tcetfyfhacaujwsjcwkl.supabase.co";
  const ANON =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZXRmeWZoYWNhdWp3c2pjd2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDcwNjgsImV4cCI6MjA4MjA4MzA2OH0.8F-Vuuup2zMtpBDHQwmeQZjfJwdWf3ZmR9amqW1-rug";

  if (!window.supabase || !window.supabase.createClient) {
    console.warn("[SB_DB] supabase-js no cargó");
    return null;
  }
  const client = window.supabase.createClient(URL, ANON);

  return {
    client,
    async list() {
      const { data, error } = await client
        .from("gastos")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    async add(rows) {
      const { data, error } = await client.from("gastos").insert(rows).select();
      if (error) throw error;
      return data || [];
    },
    async remove(id) {
      const { error } = await client.from("gastos").delete().eq("id", id);
      if (error) throw error;
    },
    onChange(cb) {
      try {
        const ch = client
          .channel("gastos-rt")
          .on("postgres_changes", { event: "*", schema: "public", table: "gastos" }, cb)
          .subscribe();
        return () => client.removeChannel(ch);
      } catch (e) {
        return () => {};
      }
    },

    // ---- Mercado (checklist persistente) ----
    async mercadoList() {
      const { data, error } = await client.from("mercado").select("*");
      if (error) throw error;
      return data || [];
    },
    async mercadoSet(item_id, bought) {
      // Upsert envía SOLO estas columnas → PostgREST hace ON CONFLICT DO UPDATE
      // únicamente sobre ellas, así que name/price (override o ítem custom) se preservan.
      const { error } = await client
        .from("mercado")
        .upsert({ item_id, bought, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    async mercadoAdd(item) {
      const id = "c-" + (window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : Date.now() + "-" + Math.round(Math.random() * 1e6));
      const { error } = await client.from("mercado").insert({
        item_id: id, bought: false, custom: true,
        name: item.name, price: item.price, grp: item.grp,
      });
      if (error) throw error;
    },
    async mercadoUpdate(item_id, fields) {
      const { error } = await client
        .from("mercado")
        .upsert({ item_id, ...fields, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    async mercadoRemove(item_id) {
      const { error } = await client.from("mercado").delete().eq("item_id", item_id);
      if (error) throw error;
    },
    mercadoOnChange(cb) {
      try {
        const ch = client
          .channel("mercado-rt")
          .on("postgres_changes", { event: "*", schema: "public", table: "mercado" }, cb)
          .subscribe();
        return () => client.removeChannel(ch);
      } catch (e) {
        return () => {};
      }
    },
  };
})();
