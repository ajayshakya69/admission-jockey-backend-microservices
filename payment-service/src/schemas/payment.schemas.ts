import { z } from "zod"

export const createPaymentSchema = z.object({
  body: z.object({
    amount: z.number().min(1, "Amount must be greater than 0"),
    currency: z.string().length(3, "Currency must be 3 characters").default("USD"),
    description: z.string().min(1, "Description is required").max(500),
    applicationId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid application ID")
      .optional(),
    collegeId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid college ID")
      .optional(),
    paymentMethod: z.enum(["card", "bank_transfer", "wallet", "upi"]),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
})

export const processPaymentSchema = z.object({
  body: z.object({
    paymentMethodId: z.string().min(1, "Payment method ID is required"),
    billingDetails: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email"),
      phone: z.string().optional(),
      address: z.object({
        line1: z.string().min(1, "Address line 1 is required"),
        line2: z.string().optional(),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        postal_code: z.string().min(1, "Postal code is required"),
        country: z.string().length(2, "Country must be 2 characters"),
      }),
    }),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid payment ID"),
  }),
})

export const refundPaymentSchema = z.object({
  body: z.object({
    amount: z.number().min(1).optional(),
    reason: z.enum(["duplicate", "fraudulent", "requested_by_customer", "other"]),
    description: z.string().max(500).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid payment ID"),
  }),
})

export const webhookSchema = z.object({
  body: z.object({
    id: z.string(),
    object: z.string(),
    type: z.string(),
    data: z.object({
      object: z.any(),
    }),
    created: z.number(),
    livemode: z.boolean(),
    pending_webhooks: z.number(),
    request: z.object({
      id: z.string().nullable(),
      idempotency_key: z.string().nullable(),
    }),
  }),
  headers: z.object({
    "stripe-signature": z.string(),
  }),
})

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>
export type WebhookInput = z.infer<typeof webhookSchema>
