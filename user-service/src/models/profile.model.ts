import mongoose, { type Document, Schema } from "mongoose"

export interface IProfile extends Document {
  userId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: Date
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  bio?: string
  profilePicture?: string
  createdAt: Date
  updatedAt: Date
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    profilePicture: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  },
)

profileSchema.index({ email: 1 })
profileSchema.index({ userId: 1 })

export const Profile = mongoose.model<IProfile>("Profile", profileSchema)
