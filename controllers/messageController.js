import Message from "../models/Message.js";
import { Op } from "sequelize";

const possibleStatus = ["ENVIADO", "RECEBIDO", "ERRO DE ENVIO"];

export const updateMessageStatus = async (req, res) => {
    const { id, status } = req.params;
    let statusToUpper = status.toUpperCase().replace(/-/g, ' ');

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ error: "O id da mensagem deve ser um número" });
    }

    if (!possibleStatus.includes(statusToUpper)) {
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
};

export const getMessagesByStatus = async (req, res) => {
    const { status } = req.params;
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    let statusToUpper = status.toUpperCase().replace(/-/g, ' ');

    if (!possibleStatus.includes(statusToUpper)) {
        return res.status(400).json({ error: "Status inválido" });
    }

    try {
        const items = await Message.findAll({
            where: {
                status: statusToUpper,
                updatedAt: {
                    [Op.gte]: last24Hours,
                },
            },
        });

        if (items.length === 0) {
            return res.status(404).json({ error: "Nenhuma mensagem encontrada" });
        }

        return res.status(200).json({ items });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
