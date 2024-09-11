import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Message = sequelize.define("mensagens", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(25),
        allowNull: true,
    }
});

export default Message;