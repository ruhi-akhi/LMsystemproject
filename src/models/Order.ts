import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrderDocument extends Document {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

// Static methods interface
export interface IOrderModel extends Model<IOrderDocument> {
  generateOrderNumber(): string;
  getTodayOrders(): Promise<IOrderDocument[]>;
  getTodayRevenue(): Promise<any[]>;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      trim: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    confirmedAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

// Indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ customerName: 1 });
OrderSchema.index({ createdBy: 1 });
OrderSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate total
OrderSchema.pre("save", function() {
  this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
  
  // Update status timestamps
  if (this.isModified("status")) {
    const now = new Date();
    switch (this.status) {
      case "confirmed":
        if (!this.confirmedAt) this.confirmedAt = now;
        break;
      case "shipped":
        if (!this.shippedAt) this.shippedAt = now;
        break;
      case "delivered":
        if (!this.deliveredAt) this.deliveredAt = now;
        break;
      case "cancelled":
        if (!this.cancelledAt) this.cancelledAt = now;
        break;
    }
  }
});

// Methods
OrderSchema.methods.addItem = function(productId: string, productName: string, quantity: number, price: number) {
  // Check if product already exists in order
  const existingItem = this.items.find((item: IOrderItem) => item.productId.toString() === productId);
  if (existingItem) {
    throw new Error("This product is already added to the order.");
  }
  
  const subtotal = quantity * price;
  this.items.push({
    productId,
    productName,
    quantity,
    price,
    subtotal,
  });
  
  return this.save();
};

OrderSchema.methods.updateStatus = function(newStatus: string) {
  this.status = newStatus as any;
  return this.save();
};

// Statics
OrderSchema.statics.generateOrderNumber = function() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `ORD${timestamp}${random}`;
};

OrderSchema.statics.getTodayOrders = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    createdAt: { $gte: today, $lt: tomorrow }
  });
};

OrderSchema.statics.getTodayRevenue = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: today, $lt: tomorrow },
        status: { $in: ["confirmed", "shipped", "delivered"] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" }
      }
    }
  ]);
};

const Order = mongoose.models.Order || mongoose.model<IOrderDocument, IOrderModel>("Order", OrderSchema);
export default Order;