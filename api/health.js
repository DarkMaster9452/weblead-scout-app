export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.status(200).json({
    status: "ok",
    service: "weblead-scout-backend",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
