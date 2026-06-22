import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISkill extends Document {
  name: string
  category: 'frontend' | 'backend' | 'databases' | 'languages' | 'tools'
  createdAt: Date
  updatedAt: Date
}

const SkillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['frontend', 'backend', 'databases', 'languages', 'tools'],
        message: 'Invalid category',
      },
    },
  },
  { timestamps: true }
)

// Prevent duplicate skill names within the same category
SkillSchema.index({ name: 1, category: 1 }, { unique: true })

const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema)

export default Skill
