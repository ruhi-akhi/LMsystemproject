import mongoose, { Schema, Document } from "mongoose";

export interface IProductDocument extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
  price: number;
  stockQuantity: number;
  minimumStockThreshold: number;
  status: "active" | "out_of_stock" | "inactive";
  description?: string;
  imageUrl?: string;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    minimumStockThreshold: {
      type: Number,
      required: true,
      min: 0,
      default: 5,
    },
    status: {
      type: String,
      enum: ["active", "out_of_stock", "inactive"],
      default: "active",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

// Indexes
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ stockQuantity: 1 });
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ sku: 1 }, { unique: true, sparse: true });

// Pre-save middleware to update status based on stock
ProductSchema.pre("save", function() {
  if (this.stockQuantity === 0) {
    this.status = "out_of_stock";
  } else if (this.status === "out_of_stock" && this.stockQuantity > 0) {
    this.status = "active";
  }
});

// Methods
ProductSchema.methods.updateStock = function(quantity: number) {
  this.stockQuantity = Math.max(0, this.stockQuantity + quantity);
  return this.save();
};

ProductSchema.methods.isLowStock = function() {
  return this.stockQuantity <= this.minimumStockThreshold && this.stockQuantity > 0;
};

// Statics
ProductSchema.statics.getLowStockProducts = function() {
  return this.find({
    $expr: { $lte: ["$stockQuantity", "$minimumStockThreshold"] },
    stockQuantity: { $gt: 0 },
    status: "active"
  }).populate("categoryId", "name");
};

ProductSchema.statics.getOutOfStockProducts = function() {
  return this.find({
    stockQuantity: 0,
    status: "out_of_stock"
  }).populate("categoryId", "name");
};

const Product = mongoose.models.Product || mongoose.model<IProductDocument>("Product", ProductSchema);
export default Product;