const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const PORT = 5001;

const uri = `mongodb+srv://taskplanet:ZbF6xCI85ePPeNWg@cluster0.prlus.mongodb.net/taskplanet_test_2?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.use(cors());
app.use(express.json());


async function run() {
  try {
    const db = client.db("cryptoDB");
    const coinsCollection = db.collection("coins");

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

    // app.get("/api/coingeckoCoins", async (req, res) => {
    //   const apiUrl =
    //   "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc"; // Increased per_page value for larger results per page

    //   try {
    //     const response = await axios.get(apiUrl);



    //     // Clear existing data
    //     await coinsCollection.deleteMany({});

    //     // Insert new data
    //     await coinsCollection.insertMany(response.data);
    //     res.json(response.data);
    //   } catch (error) {
    //     console.error("Error fetching CoinGecko coins:", error);
    //     res.status(500).json({ error: "Failed to fetch data" });
    //   }
    // });

    app.get("/api/fetchStoredCoins", async (req, res) => {
      try {


        const storedCoins = await coinsCollection.find({}).toArray();
        res.json(storedCoins);
      } catch (error) {
        console.error("Error fetching stored coins:", error);
        res.status(500).json({ error: "Failed to fetch data" });
      }
    });
  } finally {

  }
}

run().catch(error => console.log(error));

app.get("/", async (req, res) => {
  res.status(200).json("app is running");
});



app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});


