import Message from "../models/Message.js";
import { Op } from "sequelize";

const HTTP_STATUS_ACCEPTED = 202;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_INTERNAL_SERVER = 500;
const POSSIBLE_STATUS = ["ENVIADO", "RECEBIDO", "ERRO DE ENVIO"];

export const updateMessageStatus = async (req, res) => {
    try {
	    const [id, status] = processRequest(req);

        const message = await Message.findByPk(id);

        if (!message) {
            
        }

        message.status = status;

        await message.save();

        return res.status(HTTP_STATUS_ACCEPTED).json({ message: "Mensagem atualizada com sucesso" });
    } catch (error) {
        console.log(error);
        return res.status(error.code ?? HTTP_STATUS_INTERNAL_SERVER).json({ error: error.message });
    }
};

export const getMessagesByStatus = async (req, res) => {
    const { status } = req.params;
    const last24Hours = getLast24Hours()

    try {

		processStatus(status);

        const items = await Message.findAll({
            where: {
                status: status,
                updatedAt: {
                    [Op.gte]: last24Hours,
                },
            },
        });

        if (items.length === 0) {
            throw new Error("Nenhuma mensagem encontrada.",  {statusCode: HTTP_STATUS_NOT_FOUND});
        }

        return res.status(HTTP_STATUS_ACCEPTED).json({ items });
    } catch (error) {
        return res.status(error.statusCode ?? HTTP_STATUS_INTERNAL_SERVER).json({ error: error.message });
    }
};

const processRequest = (req) => {
    const { id, status } = req.params;

	processID(id);
	processStatus(status);

    return [id, status];
}

const processID = (id) => {
    if (!/^\d+$/.test(id)) {
        throwException("O ID da mensagem deve ser numérico.", HTTP_STATUS_BAD_REQUEST);
    }
}

const processStatus = (status) => {
    status = status.toUpperCase().replace(/-/g, ' ');

    if (!POSSIBLE_STATUS.includes(status)) {
        throwException("O status informado é inválido", HTTP_STATUS_BAD_REQUEST);
    }
}

const getLast24Hours = _ => {
    let now = new Date();
    return new Date(now.getTime() - 24 * 60 * 60 * 1000);
}

const throwException = (message, statusCode) => {
    const error = new Error(message);
    error.code = statusCode;
    throw error;
 }