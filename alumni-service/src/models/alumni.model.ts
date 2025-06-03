import mongoose, { Schema } from "mongoose"
import type { IAlumni } from "@/types/alumni.types"

const alumniSchema = new Schema<IAlumni>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    graduationYear: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear(),
      index: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    currentPosition: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 1000,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    linkedinProfile: {
      type: String,
      validate: {
        validator: (v: string) => !v || /^https?:\/\/(www\.)?linkedin\.com\//.test(v),
        message: "Invalid LinkedIn profile URL",
      },
    },
    isAvailableForMentoring: {
      type: Boolean,
      default: false,
      index: true,
    },
    profilePicture: {
      type: String,
    },
    connections: [
      {
        type: Schema.Types.ObjectId,
        ref: "Alumni",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for better query performance
alumniSchema.index({ name: "text", bio: "text" })
alumniSchema.index({ college: 1, graduationYear: 1 })
alumniSchema.index({ skills: 1 })

// Virtual for connection count
alumniSchema.virtual("connectionCount").get(function () {
  return this.connections.length
})

export const Alumni = mongoose.model<IAlumni>("Alumni", alumniSchema)
