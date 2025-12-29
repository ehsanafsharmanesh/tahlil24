addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // تنظیم هدرهای CORS برای اجازه دسترسی از همه جا یا فقط سایت شما
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // یا آدرس سایت خود را بگذارید
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }

  // مدیریت درخواست‌های پیش‌پرواز (Preflight)
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  if (url.pathname === "/api/login" && request.method === "POST") {
    try {
      const { code, password } = await request.json()

      // بررسی کد و پسورد (طبق فایل اصلی شما)
      if (code === "tahsili36" && password === "1400") {
        const token = "static_token_example_123456789"; 
        return new Response(JSON.stringify({ token, code }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        })
      } else {
        return new Response("Invalid credentials", { 
          status: 400,
          headers: corsHeaders 
        })
      }
    } catch (e) {
      return new Response("Bad Request", { status: 400, headers: corsHeaders })
    }
  }

  return new Response("Hello World", { status: 200, headers: corsHeaders })
}
