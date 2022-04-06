const express = require("express");
const redis = require("redis");

require("dotenv").config();

const { PORT = 3001 } = process.env;
const { REDIS_URL = "redis://localhost" } = process.env;

const client = redis.createClient({ url: REDIS_URL });
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

(async () => {
  try {
    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();

    app.get("/counter/:bookId", async (req, res) => {
      try {
        const { bookId } = req.params;

        const count = await client.get(bookId);

        res.status(200).json({ status: 200, count: parseInt(count, 10) });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message, status: 500 });
      }
    });

    app.post("/counter/:bookId/incr", async (req, res) => {
      try {
        const { bookId } = req.params;

        const count = await client.get(bookId);

        await client.set(bookId, (parseInt(count, 10) || 0) + 1);

        res.status(200).json({ status: 200, message: "Counter increased" });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message, status: 500 });
      }
    });
  } catch (err) {
    console.log("redis не найден");
  }
})();

app.listen(PORT, "0.0.0.0",() => {
  console.log(`Слушаю порт ${PORT}`);
});
