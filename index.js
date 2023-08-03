const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 5001;

const mongoClient = new MongoClient("mongodb+srv://taskplanet:ZbF6xCI85ePPeNWg@cluster0.prlus.mongodb.net/taskplanet_test_2?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json("app is running");
});

app.get("/api/topCoins", async (req, res) => {
  const apiUrl = "https://api.coincap.io/v2/assets?limit=50";

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching top coins:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/coingeckoCoins", async (req, res) => {
  const apiUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false";

  try {
    const response = await axios.get(apiUrl);

    const client = await mongoClient.connect();
    const db = client.db("cryptoDB");
    const coinsCollection = db.collection("coins");

    // Clear existing data
    await coinsCollection.deleteMany({});

    // Insert new data
    await coinsCollection.insertMany(response.data);

    client.close();

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching CoinGecko coins:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/fetchStoredCoins", async (req, res) => {
  try {
    const client = await mongoClient.connect();
    const db = client.db("cryptoDB");
    const coinsCollection = db.collection("coins");

    const storedCoins = await coinsCollection.find({}).toArray();

    client.close();

    res.json(storedCoins);
  } catch (error) {
    console.error("Error fetching stored coins:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
