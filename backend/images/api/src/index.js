const express = require("express");
const app = express();

app.use(express.json());
app.use("/api/recipes", require("./routes/recipes"));

// app.use("/api/users", require("./routes/users"));
const port = process.env.PORT || "3000";

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
