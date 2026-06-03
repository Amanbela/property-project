import { connectForWrites } from "../connection";
import { BudgetRangeModel } from "@/features/budget/models/BudgetRange";
import { BudgetRangeSchema, type BudgetRange } from "@/shared/types/models";

export class BudgetRepository {
  static async findAll(): Promise<BudgetRange[]> {
    await connectForWrites();
    const docs = await BudgetRangeModel.find({}).sort({ sortOrder: 1 }).lean().exec();
    return docs.map(doc => BudgetRangeSchema.parse({ ...doc, _id: doc._id?.toString() }));
  }

  static async findBySlug(slug: string): Promise<BudgetRange | null> {
    await connectForWrites();
    const doc = await BudgetRangeModel.findOne({ slug }).lean().exec();
    if (!doc) return null;
    return BudgetRangeSchema.parse({ ...doc, _id: doc._id?.toString() });
  }

  static async findById(id: string): Promise<BudgetRange | null> {
    await connectForWrites();
    const doc = await BudgetRangeModel.findById(id).lean().exec();
    if (!doc) return null;
    return BudgetRangeSchema.parse({ ...doc, _id: doc._id?.toString() });
  }

  static async create(data: Partial<BudgetRange>): Promise<BudgetRange> {
    await connectForWrites();
    const doc = await BudgetRangeModel.create(data);
    return BudgetRangeSchema.parse({ ...doc.toObject(), _id: doc._id?.toString() });
  }

  static async update(id: string, data: Partial<BudgetRange>): Promise<BudgetRange | null> {
    await connectForWrites();
    const doc = await BudgetRangeModel.findByIdAndUpdate(id, data, { new: true }).lean().exec();
    if (!doc) return null;
    return BudgetRangeSchema.parse({ ...doc, _id: doc._id?.toString() });
  }

  static async delete(id: string): Promise<void> {
    await connectForWrites();
    await BudgetRangeModel.findByIdAndDelete(id).exec();
  }

  static async findActive(): Promise<BudgetRange[]> {
    await connectForWrites();
    const docs = await BudgetRangeModel.find({ isActive: true }).sort({ sortOrder: 1 }).lean().exec();
    return docs.map(doc => BudgetRangeSchema.parse({ ...doc, _id: doc._id?.toString() }));
  }
}
