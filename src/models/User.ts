import mongoose, { Schema, Document } from "mongoose";

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface IProfile {
  bio?: string;
  expertise?: string[];
  experience?: number; // years of experience
  education?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface IUserStats {
  // Manager-specific stats
  totalProducts?: number;
  totalCategories?: number;
  totalOrders?: number;
  totalRevenue?: number;

  // Staff-specific stats
  productsManaged?: number;
  ordersProcessed?: number;
  tasksCompleted?: number;

  // Common stats
  joinedAt?: Date;
  lastActiveAt?: Date;
}

export interface IUserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: "light" | "dark" | "system";
  language: "en" | "bn";
  timezone?: string;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone?: string | null;
  password?: string;
  photoURL?: string;
  role: "staff" | "manager" | "admin" | "instructor" | "user";
  provider: "credentials" | "google" | "github";

  // Enhanced fields
  profile?: IProfile;
  stats?: IUserStats;
  preferences?: IUserPreferences;

  // Account status and verification
  status: "active" | "suspended" | "pending";
  isVerified: boolean;
  verificationToken?: string;

  // Security fields
  resetToken?: string;
  resetTokenExpiry?: Date;
  loginAttempts?: number;
  lockUntil?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub Schemas ──────────────────────────────────────────────────────────────
const ProfileSchema = new Schema<IProfile>({
  bio: { type: String, maxlength: 500, trim: true },
  expertise: [{ type: String, trim: true }],
  experience: { type: Number, min: 0, max: 50 },
  education: { type: String, maxlength: 200, trim: true },
  socialLinks: {
    website: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    twitter: { type: String, trim: true },
  },
});

const UserStatsSchema = new Schema<IUserStats>({
  // Manager-specific stats
  totalProducts: { type: Number, default: 0, min: 0 },
  totalCategories: { type: Number, default: 0, min: 0 },
  totalOrders: { type: Number, default: 0, min: 0 },
  totalRevenue: { type: Number, default: 0, min: 0 },

  // Staff-specific stats
  productsManaged: { type: Number, default: 0, min: 0 },
  ordersProcessed: { type: Number, default: 0, min: 0 },
  tasksCompleted: { type: Number, default: 0, min: 0 },

  // Common stats
  joinedAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
});

const UserPreferencesSchema = new Schema<IUserPreferences>({
  emailNotifications: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: true },
  theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
  language: { type: String, enum: ["en", "bn"], default: "en" },
  timezone: { type: String, default: "Asia/Dhaka" },
});

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // ✅ phone — unique index নেই, duplicate নিয়ে মাথাব্যথা নেই
    // optional field, দিলেও হয় না দিলেও হয়
    phone: {
      type: String,
      trim: true,
      default: null,
      set: (v: any) => (!v || v.trim() === "" ? null : v.trim()),
    },

    password: { type: String, minlength: 6 },
    photoURL: { type: String, default: "" },
    role: { type: String, enum: ["staff", "manager", "admin", "instructor", "user"], default: "staff" },
    provider: { type: String, enum: ["credentials", "google", "github"], default: "credentials" },

    // Enhanced fields
    profile: { type: ProfileSchema },
    stats: { type: UserStatsSchema, default: () => ({}) },
    preferences: { type: UserPreferencesSchema, default: () => ({}) },

    // Account status and verification
    status: { type: String, enum: ["active", "suspended", "pending"], default: "active" },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },

    // Security fields
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  {
    timestamps: true,
    collection: "users" // ✅ Fixed collection name in code
  }
);

// ✅ শুধু email unique index — phone index সম্পূর্ণ remove
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ provider: 1 });
UserSchema.index({ "stats.lastActiveAt": -1 });

// ─── Methods ──────────────────────────────────────────────────────────────────
UserSchema.methods.updateLastActive = function () {
  if (this.stats) {
    this.stats.lastActiveAt = new Date();
  } else {
    this.stats = { lastActiveAt: new Date() };
  }
  return this.save();
};

UserSchema.methods.updateManagerStats = function (productCount?: number, categoryCount?: number, orderCount?: number, revenue?: number) {
  if (!this.stats) {
    this.stats = {};
  }

  if (productCount !== undefined) this.stats.totalProducts = productCount;
  if (categoryCount !== undefined) this.stats.totalCategories = categoryCount;
  if (orderCount !== undefined) this.stats.totalOrders = orderCount;
  if (revenue !== undefined) this.stats.totalRevenue = revenue;

  return this.save();
};

UserSchema.methods.updateStaffStats = function (productsManaged?: number, ordersProcessed?: number, tasksCompleted?: number) {
  if (!this.stats) {
    this.stats = {};
  }

  if (productsManaged !== undefined) this.stats.productsManaged = productsManaged;
  if (ordersProcessed !== undefined) this.stats.ordersProcessed = ordersProcessed;
  if (tasksCompleted !== undefined) this.stats.tasksCompleted = tasksCompleted;

  return this.save();
};

UserSchema.methods.updateProfile = function (profileData: Partial<IProfile>) {
  if (!this.profile) {
    this.profile = {};
  }

  Object.assign(this.profile, profileData);
  return this.save();
};

UserSchema.methods.updatePreferences = function (preferencesData: Partial<IUserPreferences>) {
  if (!this.preferences) {
    this.preferences = {};
  }

  Object.assign(this.preferences, preferencesData);
  return this.save();
};

// ─── Static methods ───────────────────────────────────────────────────────────
UserSchema.statics.getInstructorLeaderboard = function (limit: number = 10) {
  return this.find({
    role: "instructor",
    status: "active"
  })
    .sort({ "stats.rating": -1, "stats.totalStudents": -1 })
    .limit(limit)
    .select('name photoURL stats.rating stats.totalStudents stats.totalCourses');
};

UserSchema.statics.getActiveUsers = function (days: number = 30) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.find({
    "stats.lastActiveAt": { $gte: cutoffDate },
    status: "active"
  }).countDocuments();
};

// ✅ Better model export pattern
const User = mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
export default User;
