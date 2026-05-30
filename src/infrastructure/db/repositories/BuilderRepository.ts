import { connectForWrites } from "../connection";
import { Builder } from "@/features/trust-network/models/Builder";
import { BuilderSchema, type Builder as BuilderType } from "@/shared/types/models";

export class BuilderRepository {
  static async findAll(): Promise<BuilderType[]> {
    await connectForWrites();
    const docs = await Builder.find({}).sort({ updatedAt: -1 }).lean().exec();
    
    return docs.map((doc: Record<string, unknown>) => {
      const parsed = BuilderSchema.safeParse({ ...doc, _id: (doc._id as { toString(): string })?.toString() });
      if (!parsed.success) {
        console.warn(`Validation failed for Builder ${doc.builderName}`, parsed.error);
        return null;
      }
      return parsed.data;
    }).filter(Boolean) as BuilderType[];
  }

  static async delete(id: string): Promise<void> {
    await connectForWrites();
    await Builder.findByIdAndDelete(id).exec();
  }

  static async count(): Promise<number> {
    await connectForWrites();
    return Builder.countDocuments();
  }

  static async findById(id: string): Promise<BuilderType | null> {
    await connectForWrites();
    const doc = await Builder.findById(id).lean().exec();
    if (!doc) return null;
    return BuilderSchema.parse({ ...doc, _id: (doc._id as { toString(): string })?.toString() });
  }
}
