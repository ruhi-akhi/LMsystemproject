import mongoose, { Schema, Document, Model } from "mongoose";

export interface IActivityLogDocument extends Document {
  action: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  userName: string;
  entityType: "product" | "order" | "category" | "stock" | "user";
  entityId?: mongoose.Types.ObjectId;
  metadata?: any;
  createdAt: Date;
}

// Static methods interface
export interface IActivityLogModel extends Model<IActivityLogDocument> {
  logActivity(
    action: string,
    description: string,
    userId: string,
    userName: string,
    entityType: string,
    entityId?: string,
    metadata?: any
  ): Promise<IActivityLogDocument>;
  getRecentActivities(limit?: number): Promise<IActivityLogDocument[]>;
}

const ActivityLogSchema = new Schema<IActivityLogDocument>(
  {
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    entityType: {
      type: String,
      enum: ["product", "order", "category", "stock", "user"],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "activity_logs",
  }
);

// Indexes
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ entityType: 1, createdAt: -1 });

// Statics
ActivityLogSchema.statics.logActivity = function(
  action: string,
  description: string,
  userId: string,
  userName: string,
  entityType: string,
  entityId?: string,
  metadata?: any
) {
  return this.create({
    action,
    description,
    userId,
    userName,
    entityType,
    entityId,
    metadata,
  });
};

ActivityLogSchema.statics.getRecentActivities = function(limit: number = 10) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("userId", "name")
    .lean();
};

const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLogDocument, IActivityLogModel>("ActivityLog", ActivityLogSchema);
export default ActivityLog;