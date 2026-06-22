import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  image: string;
  github: string;
  demo: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    tech: { type: [String], default: [] },
    image: { type: String, default: '' },
    github: { type: String, default: '' },
    demo: { type: String, default: '' },
    features: { type: [String], default: [] },
  },
  { timestamps: true }
);

// To ensure consistent behavior returning 'id' instead of '_id' or mapping it nicely 
// (which some components might expect), we can transform the output if necessary, 
// but most Next.js apps just use _id as id on the frontend.
ProjectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
