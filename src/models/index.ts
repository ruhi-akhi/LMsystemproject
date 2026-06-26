// Central model registry
import User from "./User";
import Transaction from "./Transaction";
import Notification from "./Notification";
import Category from "./Category";
import Product from "./Product";
import Order from "./Order";
import ActivityLog from "./ActivityLog";
import RestockQueue from "./RestockQueue";

export {
  User,
  Transaction,
  Notification,
  Category,
  Product,
  Order,
  ActivityLog,
  RestockQueue,
};

export type { IUserDocument } from "./User";
export type { ITransactionDocument } from "./Transaction";
export type { INotificationDocument } from "./Notification";
export type { ICategoryDocument } from "./Category";
export type { IProductDocument } from "./Product";
export type { IOrderDocument, IOrderItem } from "./Order";
export type { IActivityLogDocument } from "./ActivityLog";
export type { IRestockQueueDocument } from "./RestockQueue";

export function ensureModelsRegistered() {
  return {
    User,
    Transaction,
    Notification,
    Category,
    Product,
    Order,
    ActivityLog,
    RestockQueue,
  };
}

export default ensureModelsRegistered();
