import { Router, type Request, type Response } from "express"
import { messageQueueService } from "../services/messageQueue.service"
import { validateBody } from "../middlewares/validation.middleware"
import { MessageQueueEventSchema } from "../schemas/common.schemas"

const router = Router()

router.post("/publish", validateBody(MessageQueueEventSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { queue, message } = req.body
    await messageQueueService.publishEvent(queue, message)

    res.status(200).json({
      message: "Event published successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to publish event",
      error: error instanceof Error ? error.message : "Unknown error",
      statusCode: 500,
      timestamp: new Date().toISOString(),
    })
  }
})

export default router
