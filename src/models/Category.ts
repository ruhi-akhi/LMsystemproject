import mongoose, { Schema, Document } from "mongoose";

export interface ICategoryDocument extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

// Indexes
CategorySchema.index({ name: 1 });
CategorySchema.index({ isActive: 1 });

const Category = mongoose.models.Category || mongoose.model<ICategoryDocument>("Category", CategorySchema);
export default Category;