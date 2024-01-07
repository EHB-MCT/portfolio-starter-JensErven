const app = require("./app");

// app.use("/api/users", require("./routes/users"));
const port = process.env.PORT || "3000";

app.listen(port, (err) => {
  if (!err) {
    console.log("running on port " + port);
  } else {
    console.error(err);
  }
});
