import mongoose, { Schema } from "mongoose";
const { model, models } = mongoose;

const faqSchema = new Schema({ q: String, a: String }, { _id: false });
const sectionSchema = new Schema({ heading: String, content: String }, { _id: false });

const seoPageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    seoTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    keyword: String,
    h1: { type: String, required: true },
    intro: String,
    sections: [sectionSchema],
    faqs: [faqSchema],
    published: { type: Boolean, default: true, index: true },
    articleSchemaJson: String,
    faqSchemaJson: String
  },
  { timestamps: true }
);

seoPageSchema.index({ published: 1, slug: 1 });

export const SeoPageModel = models.SeoPage || model("SeoPage", seoPageSchema);
