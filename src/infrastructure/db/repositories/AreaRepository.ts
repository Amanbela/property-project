import { connectForWrites } from "../connection";
import { AreaModel } from "@/features/colony-intelligence/models/Area";
import { AreaSchema, type Area } from "@/shared/types/models";

export class AreaRepository {
  static async findAllPublished(): Promise<Area[]> {
    await connectForWrites();
    const docs = await AreaModel.find({ published: true }).lean().exec();
    
    return docs.map(doc => {
      const parsed = AreaSchema.safeParse({ ...doc, _id: doc._id?.toString() });
      if (!parsed.success) {
        console.warn(`Validation failed for Area ${doc.name}`, parsed.error);
        return null;
      }
      return parsed.data;
    }).filter(Boolean) as Area[];
  }

  static async findAll(): Promise<Area[]> {
    await connectForWrites();
    const docs = await AreaModel.find({}).sort({ updatedAt: -1 }).lean().exec();
    return docs.map(doc => AreaSchema.parse({ ...doc, _id: doc._id?.toString() }));
  }

  static async count(): Promise<number> {
    await connectForWrites();
    return AreaModel.countDocuments();
  }

  static async findById(id: string): Promise<Area | null> {
    await connectForWrites();
    const doc = await AreaModel.findById(id).lean().exec();
    if (!doc) return null;
    return AreaSchema.parse({ ...doc, _id: doc._id?.toString() });
  }

  static async delete(id: string): Promise<void> {
    await connectForWrites();
    await AreaModel.findByIdAndDelete(id).exec();
  }

  static async findBySlug(slug: string): Promise<Area | null> {
    await connectForWrites();
    const doc = await AreaModel.findOne({ slug, published: true }).lean().exec();
    if (!doc) return null;
    return AreaSchema.parse({ ...doc, _id: doc._id?.toString() });
  }
}
