addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname === "/api/login" && request.method === "POST") {
    const { code, password } = await request.json()

    // بررسی کد و پسورد
    if (code === "tahsili36" && password === "1400") {
      const token = "static_token_example_123456789"; // توکن ثابت برای تست
      return new Response(JSON.stringify({ token }), {
        headers: { "Content-Type": "application/json" }
      })
    } else {
      return new Response("Invalid credentials", { status: 400 })
    }
  }

  return new Response("Hello World", { status: 200 })
}
