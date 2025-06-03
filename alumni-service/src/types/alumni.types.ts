import type { Document } from "mongoose"

export interface IAlumni extends Document {
  _id: string
  userId: string
  name: string
  email: string
  graduationYear: number
  degree: string
  college: string
  currentPosition?: string
  company?: string
  location?: string
  bio?: string
  skills: string[]
  linkedinProfile?: string
  isAvailableForMentoring: boolean
  profilePicture?: string
  connections: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateAlumniRequest {
  userId: string
  name: string
  email: string
  graduationYear: number
  degree: string
  college: string
  currentPosition?: string
  company?: string
  location?: string
  bio?: string
  skills: string[]
  linkedinProfile?: string
  isAvailableForMentoring?: boolean
}

export interface UpdateAlumniRequest extends Partial<CreateAlumniRequest> {}

export interface AlumniQuery {
  page?: number
  limit?: number
  college?: string
  graduationYear?: number
  skills?: string[]
  isAvailableForMentoring?: boolean
  search?: string
}
