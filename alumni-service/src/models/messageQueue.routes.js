"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = require("../../../api-gateway/src/middlewares/validation.middleware");
const common_schemas_1 = require("../../../api-gateway/src/schemas/common.schemas");
const router = (0, express_1.Router)();
router.post("/publish", (0, validation_middleware_1.validateBody)(common_schemas_1.MessageQueueEventSchema), async (req, res) => {
    try {
        const { queue, message } = req.body;
        await messageQueueService.publishEvent(queue, message);
        res.status(200).json({
            message: "Event published successfully",
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to publish event",
            error: error instanceof Error ? error.message : "Unknown error",
            statusCode: 500,
            timestamp: new Date().toISOString(),
        });
    }
});
exports.default = router;
//# sourceMappingURL=messageQueue.routes.js.map