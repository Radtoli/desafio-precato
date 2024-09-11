import express from "express";
import Message from "./models/Message.js";
import sequelize from "./config/database.js";
import { Op } from "sequelize";

const app = express();  
const PORT = 3000;

function validateNumbers(str) {
    const regex = /^\d+$/;
    return regex.test(str);
}

const possibleStatus = ["ENVIADO", "RECEBIDO", "ERRO DE ENVIO"];

app.put("/api/v1/precato/:id/:status", async (req, res) => {
    const { id, status } = req.params;
    let statusToUpper = status.toUpperCase();
    statusToUpper = statusToUpper.replace(/-/g, ' ');

    if (!validateNumbers(req.params.id)) {
        return res.status(400).json({ error: "O id da mensagem deve ser um número" });
    }
    if (possibleStatus.includes(statusToUpper) === false) {
        return res.status(400).json({ error: "Status inválido" });
        
    }

    try {
        const message = await Message.findByPk(id);
        if (!message) {
            return res.status(404).json({ error: "Mensagem não encontrada" });
        }

        message.status = statusToUpper;
        await message.save();

        return res.status(200).json({ message: "Mensagem atualizada com sucesso" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get("/api/v1/precato/:status", async (req, res) => {
    const { status } = req.params;
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    let statusToUpper = status.toUpperCase();
    statusToUpper = statusToUpper.replace(/-/g, ' ');
    if (possibleStatus.includes(statusToUpper) === false) {
        return res.status(400).json({ error: "Status inválido" });
    }
    try {
        const items = await Message.findAll({
            where: {
                status: statusToUpper,
                createdAt: {
                    [Op.gte]: last24Hours,
                },
            },
        });
        if (items.length === 0) {
            return res.status(404).json({ error: "Nenhuma mensagem encontrada" });
            
        }
        res.status(200).json({ count: items.length, items });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});



sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});