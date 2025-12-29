// src/index.js

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // ۱. بخش ورود
  if (url.pathname === "/api/login" && request.method === "POST") {
    const { code, password } = await request.json();
    const userData = await USERS.get(code); // دریافت اطلاعات از KV

    if (userData) {
      const user = JSON.parse(userData);
      if (user.password === password) {
        return new Response(JSON.stringify({ token: "auth_" + code, code }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    return new Response("کد یا رمز عبور اشتباه است", { status: 401, headers: corsHeaders });
  }

  // ۲. بخش ذخیره تحلیل و داده‌ها
  if (url.pathname === "/api/save" && request.method === "POST") {
    const { code, newData } = await request.json();
    let userData = JSON.parse(await USERS.get(code) || "{}");
    
    // اضافه کردن داده جدید به تاریخچه (ارتقای تحلیل)
    if (!userData.history) userData.history = [];
    userData.history.push({ ...newData, timestamp: new Date().toISOString() });
    
    await USERS.put(code, JSON.stringify(userData));
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  // ۳. بخش دریافت داده‌های پروفایل
  if (url.pathname === "/api/get-profile" && request.method === "POST") {
    const { code } = await request.json();
    const userData = await USERS.get(code);
    return new Response(userData, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  return new Response("Not Found", { status: 404, headers: corsHeaders });
}
