import mongoose, { Schema } from "mongoose";
const { model, models } = mongoose;

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: String,
    content: { type: String, default: "" },
    featuredImage: String,
    category: String,
    seoTitle: String,
    seoDescription: String,
    keywords: [String],
    schemaType: { type: String, default: "Article" },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    relatedSlugs: [String],
    faqs: [{
      question: String,
      answer: String
    }],
    lastAutosavedAt: Date
  },
  { timestamps: true }
);

blogSchema.index({ status: 1, title: "text", slug: "text" });

export const BlogModel = models.Blog || model("Blog", blogSchema);
