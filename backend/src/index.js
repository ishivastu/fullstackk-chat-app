import "./config/dotenv.js";
import {dbConnect} from "./db/db.js";
import {server} from "./lib/socket.js"
import path from "path";

const PORT = process.env.PORT;

const __dirname = path.resolve();


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


dbConnect()
.then(()=>{
  server.listen(5001,()=>{
    console.log(`server is running at ${PORT}`)
  })
})
.catch((err)=>{
  console.log("connection failed")
})
