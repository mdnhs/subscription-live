// models/Subscription.ts
import mongoose, { Schema } from "mongoose";

const CookieSchema = new Schema({
  domain: { type: String, required: true },
  expirationDate: { type: Number },
  hostOnly: { type: Boolean, required: true },
  httpOnly: { type: Boolean, required: true },
  name: { type: String, required: true },
  path: { type: String, required: true },
  sameSite: { type: String },
  secure: { type: Boolean, required: true },
  session: { type: Boolean, required: true },
  storeId: { type: String },
  value: { type: String, required: true },
});

const SubscriptionSchema = new Schema(
  {
    title: { type: String, required: true },
    targetUrl: { type: String, required: true },
    json: [CookieSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);