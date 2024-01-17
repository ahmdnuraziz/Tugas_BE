
import express from "express";
import router from "./route/api.js";
import sequelize from "./config/database.js";
import Logger_MDW from "./middleware/Logger_MDW.js";

const app = express();
app.use(Logger_MDW); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const forceSync = process.env.NODE_ENV === 'development';

sequelize.sync({ force: forceSync }).then(() => {
    console.log("Database synchronized");
});