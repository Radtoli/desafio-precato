import express from "express";
import sequelize from "./config/database.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
const PORT = 3000;


app.use("/api/v1", messageRoutes);

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to sync database:', err);
    });
