"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueueService = void 0;
const amqp = __importStar(require("amqplib"));
const logger_1 = require("../../../api-gateway/src/utils/logger");
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
class MessageQueueService {
    constructor() {
        this.connection = null;
        this.channel = null;
    }
    async connect() {
        try {
            this.connection = await amqp.connect(RABBITMQ_URL);
            this.channel = await this.connection.createChannel();
            logger_1.logger.info("Connected to RabbitMQ");
        }
        catch (error) {
            logger_1.logger.error("Failed to connect to RabbitMQ:", error);
            throw error;
        }
    }
    async publishEvent(queue, message) {
        if (!this.channel) {
            await this.connect();
        }
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        logger_1.logger.info("Message published to queue", { queue, message });
    }
    async close() {
        try {
            if (this.channel)
                await this.channel.close();
            if (this.connection)
                await this.connection.close();
            logger_1.logger.info("RabbitMQ connection closed");
        }
        catch (error) {
            logger_1.logger.error("Error closing RabbitMQ connection:", error);
        }
    }
}
exports.MessageQueueService = MessageQueueService;
//# sourceMappingURL=messageQueue.service.js.map