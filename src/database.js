const mongoose = require("mongoose");

const { USCO_APP_MONGODB_HOST, USCO_APP_MONGODB_DATABASE } = process.env;

const MONGODB_URI = `mongodb://${
  USCO_APP_MONGODB_HOST ? USCO_APP_MONGODB_HOST : "localhost"
}/${USCO_APP_MONGODB_DATABASE ? USCO_APP_MONGODB_DATABASE : "uscowebapp"}`;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then((db) => console.log("Mongodb is connected to", db.connection.host))
  .catch((err) => console.error(err));
