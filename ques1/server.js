const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const port = 5000;

const myID = "18f797c5-4713-4c3b-9600-c96022a9164d";
const mySecret = "YlWiIIpMZbtnhZAI";
const myURL = "http://20.244.56.144/test";

app.use(cors());

let accToken = "";

const auth = async () => {
  try {
    const response = await axios.post(`${myURL}/auth`, {
      companyName: "Daksh Sardana",
      clientID: myID,
      clientSecret: mySecret,
      ownerName: "Daksh",
      ownerEmail: "daksh2003sardana@gmail.com",
      rollNo: "12120803121",
    });
    accToken = response.data.access_token;
  } catch (error) {
    console.error("Error in authentication:", error);
  }
};

app.use(async (req, res, next) => {
  if (!accToken) {
    await auth();
  }
  next();
});

app.get("/categories/:categoryName/products", async (req, res) => {
  const { categoryName } = req.params;
  const {
    n = 10,
    minP = 1,
    maxP = 10000,
    sort = "",
    order = "asc",
    page = 1,
  } = req.query;

  const companyNames = ["AMZ", "FLP", "SNP", "MYN", "AZO"];

  try {
    let allProducts = [];

    for (const company of companyNames) {
      const response = await axios.get(
        `${myURL}/companies/${company}/categories/${categoryName}/products`,
        {
          params: { top: n, minP: minP, maxP: maxP},
          headers: { Authorization: `Bearer ${accToken}` },
        }
      );
      allProducts = allProducts.concat(response.data);
    }

    if (sort) {
      allProducts.sort((a, b) => {
        const comparison = order === "asc" ? 1 : -1;
        return a[sort] > b[sort] ? comparison : -comparison;
      });
    }

    const start = (page - 1) * n;
    const pagProd = allProducts.slice(start, start + n);

    res.json(pagProd);
  } catch (error) {
    console.error("Error fetching:", error.response.data);
    res
      .status(500)
      .json({ errors: error.response.data.errors || "Internal server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
