export async function POST(req) {
  try {
    const data = await req.json();
    console.log("Received data:", data);

    // ...rest of your logic

    return Response.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}