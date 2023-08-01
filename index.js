const express = require("express");
const axios = require("axios");
const cors = require("cors");




const app = express();
const PORT = 5001; // Choose any available port

app.use(cors()); // Allow all origins; you can customize this as needed
app.use(express.json());
app.get('/', async(req, res)=>{
    res.status(200).json("app is running")
})
app.get("/api/topCoins", async (req, res) => {
  const apiUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false";

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching top coins:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
