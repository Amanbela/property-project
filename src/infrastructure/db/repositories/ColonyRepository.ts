import { connectForWrites } from "../connection";
import { ColonyModel } from "@/features/colony-intelligence/models/Colony";
import { ColonySchema, type Colony } from "@/shared/types/models";

export class ColonyRepository {
  /**
   * Fetch all colonies (published or not)
   */
  static async findAll(): Promise<Colony[]> {
    await connectForWrites();
    const docs = await ColonyModel.find({}).sort({ updatedAt: -1 }).lean().exec();
    
    return docs.map(doc => {
      const parsed = ColonySchema.safeParse({ ...doc, _id: doc._id?.toString() });
      if (!parsed.success) {
        console.warn(`Validation failed for Colony ${doc.colonyName}`, parsed.error);
        return null;
      }
      return parsed.data;
    }).filter(Boolean) as Colony[];
  }

  /**
   * Find colony by ID
   */
  static async findById(id: string): Promise<Colony | null> {
    await connectForWrites();
    const doc = await ColonyModel.findById(id).lean().exec();
    if (!doc) return null;
    const parsed = ColonySchema.safeParse({ ...doc, _id: doc._id?.toString() });
    return parsed.success ? parsed.data : null;
  }

  /**
   * Find colony by slug
   */
  static async findBySlug(slug: string): Promise<Colony | null> {
    await connectForWrites();
    const doc = await ColonyModel.findOne({ slug, published: true }).lean().exec();
    
    if (!doc) return null;
    
    const parsed = ColonySchema.safeParse({ ...doc, _id: doc._id?.toString() });
    if (!parsed.success) {
      console.error(`Validation failed for Colony slug: ${slug}`, parsed.error);
      return null;
    }
    return parsed.data;
  }

  /**
   * Find by Area
   */
  static async findByArea(areaName: string): Promise<Colony[]> {
    await connectForWrites();
    const docs = await ColonyModel.find({ areaName, published: true }).lean().exec();
    return docs.map(doc => ColonySchema.parse({ ...doc, _id: doc._id?.toString() }));
  }

  /**
   * Count all colonies
   */
  static async count(): Promise<number> {
    await connectForWrites();
    return ColonyModel.countDocuments();
  }

  /**
   * Increment view count
   */
  static async incrementViews(slug: string): Promise<void> {
    await connectForWrites();
    await ColonyModel.updateOne({ slug }, { $inc: { viewCount: 1 } });
  }
}
