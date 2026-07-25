//ei part dea render a host kora cilo ,vercel er jonno new part niche.
// import mongoose from "mongoose";
 

// const dbConnection = () => {
// mongoose.connect(process.env.MONGO_URI, {
//     dbName: "PORTFOLIO"
// }).then(() => {
//     console.log("connected to database")
// }).catch((error) => {
//     console.log(`some error occured while connecting to database: ${error}`)
// })
// };

// export default dbConnection;

import mongoose from "mongoose";

// In a serverless environment (Vercel), this file can be re-run on every
// request/cold-start. We cache the connection promise so repeated calls
// reuse the same connection instead of opening a new one each time,
// which would otherwise exhaust MongoDB's connection limit quickly.
let cachedConnection = null;

const dbConnection = () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  cachedConnection = mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "PORTFOLIO",
    })
    .then((conn) => {
      console.log("connected to database");
      return conn;
    })
    .catch((error) => {
      cachedConnection = null; // allow retry on next call if it failed
      console.log(`some error occured while connecting to database: ${error}`);
    });

  return cachedConnection;
};

export default dbConnection;