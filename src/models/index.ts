// src/models/index.ts
// ✅ Central model registry to avoid import issues

import mongoose from "mongoose";

// Import all models to ensure they're registered
import User from "./User";
import Blog from "./Blog";
import Enrollment from "./Enrollment";
import Transaction from "./Transaction";
import Notification from "./Notification";

// Import new inventory models with proper typing
import Category from "./Category";
import Product from "./Product";
import Order from "./Order";
import ActivityLog from "./ActivityLog";
import RestockQueue from "./RestockQueue";

// Export models with proper typing preserved
export { User, Blog, Enrollment, Transaction, Notification };
export { Category, Product, Order, ActivityLog, RestockQueue };

// Export types
export type { IUserDocument } from "./User";
export type { IBlog } from "./Blog";
export type { IEnrollmentDocument } from "./Enrollment";
export type { ITransactionDocument } from "./Transaction";
export type { INotificationDocument } from "./Notification";

// Export new inventory types
export type { ICategoryDocument } from "./Category";
export type { IProductDocument } from "./Product";
export type { IOrderDocument, IOrderItem } from "./Order";
export type { IActivityLogDocument } from "./ActivityLog";
export type { IRestockQueueDocument } from "./RestockQueue";

// Helper function to ensure all models are registered
export function ensureModelsRegistered() {
  const models = { 
    User, Blog, Enrollment, Transaction, Notification,
    Category, Product, Order, ActivityLog, RestockQueue
  };

  return models;
}

export default {
  User,
  Blog,
  Enrollment,
  Transaction,
  Notification,
  Category,
  Product,
  Order,
  ActivityLog,
  RestockQueue,
  ensureModelsRegistered,
};