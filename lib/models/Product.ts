import mongoose from 'mongoose';

const DiscountSchema = new mongoose.Schema({
  type: { type: String, enum: ['percent', 'fixed'], required: true },
  value: { type: Number, required: true },
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  unit_price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  unit: { type: String, default: 'item' },
  tax_rate: { type: Number, default: 0 },
  discount: DiscountSchema,
  tags: [String],
  image_url: String,
  attachments: [String],
  sku: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  is_archived: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const Product = mongoose.models['Product'] || mongoose.model('Product', ProductSchema);
