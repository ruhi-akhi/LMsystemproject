import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRestockQueueDocument extends Document {
  productId: mongoose.Types.ObjectId;
  productName: string;
  currentStock: number;
  minimumThreshold: number;
  priority: "high" | "medium" | "low";
  requestedQuantity?: number;
  notes?: string;
  status: "pending" | "ordered" | "completed";
  addedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Static methods interface
export interface IRestockQueueModel extends Model<IRestockQueueDocument> {
  addToQueue(
    productId: string,
    productName: string,
    currentStock: number,
    minimumThreshold: number,
    addedBy: string
  ): Promise<IRestockQueueDocument>;
  getQueueByPriority(): Promise<IRestockQueueDocument[]>;
}

const RestockQueueSchema = new Schema<IRestockQueueDocument>(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true, // One entry per product
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumThreshold: {
      type: Number,
      required: true,
      min: 0,
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    requestedQuantity: {
      type: Number,
      min: 1,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "ordered", "completed"],
      default: "pending",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
    collection: "restock_queue",
  }
);

// Indexes
RestockQueueSchema.index({ productId: 1 });
RestockQueueSchema.index({ priority: 1, currentStock: 1 });
RestockQueueSchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware to calculate priority
RestockQueueSchema.pre("save", function() {
  if (this.currentStock === 0) {
    this.priority = "high";
  } else if (this.currentStock <= this.minimumThreshold * 0.5) {
    this.priority = "high";
  } else if (this.currentStock <= this.minimumThreshold * 0.8) {
    this.priority = "medium";
  } else {
    this.priority = "low";
  }
  
  if (this.isModified("status") && this.status === "completed") {
    this.completedAt = new Date();
  }
});

// Methods
RestockQueueSchema.methods.markCompleted = function() {
  this.status = "completed";
  this.completedAt = new Date();
  return this.save();
};

// Statics
RestockQueueSchema.statics.addToQueue = async function(productId: string, productName: string, currentStock: number, minimumThreshold: number, addedBy: string) {
  // Check if already in queue
  const existing = await this.findOne({ productId, status: { $ne: "completed" } });
  if (existing) {
    // Update existing entry
    existing.currentStock = currentStock;
    existing.minimumThreshold = minimumThreshold;
    return existing.save();
  }
  
  // Create new entry
  return this.create({
    productId,
    productName,
    currentStock,
    minimumThreshold,
    addedBy,
  });
};

RestockQueueSchema.statics.getQueueByPriority = function() {
  return this.find({ status: { $ne: "completed" } })
    .sort({ priority: 1, currentStock: 1, createdAt: 1 })
    .populate("productId", "name price stockQuantity")
    .populate("addedBy", "name");
};

const RestockQueue = mongoose.models.RestockQueue || mongoose.model<IRestockQueueDocument, IRestockQueueModel>("RestockQueue", RestockQueueSchema);
export default RestockQueue;