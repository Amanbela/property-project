import { connectForWrites } from "../connection";
import { AreaComparisonModel } from "@/features/comparisons/models/AreaComparison";
import { AreaModel } from "@/features/colony-intelligence/models/Area";
import { AreaComparisonSchema, type AreaComparison } from "@/shared/types/models";

const ACTIVE_POPULATE_FIELDS = "name slug investmentScore familyScore rentalDemand futureGrowth trafficScore averagePricePerSqft featuredImage";

export class ComparisonRepository {
  static async findAll(): Promise<AreaComparison[]> {
    await connectForWrites();
    const docs = await AreaComparisonModel.find({}).sort({ sortOrder: 1 }).lean().exec();
    return docs.map(doc => AreaComparisonSchema.parse({ ...doc, _id: doc._id?.toString() }));
  }

  static async findActive(): Promise<AreaComparison[]> {
    await connectForWrites();
    const docs = await AreaComparisonModel.find({ isActive: true })
      .populate("area1", ACTIVE_POPULATE_FIELDS)
      .populate("area2", ACTIVE_POPULATE_FIELDS)
      .sort({ sortOrder: 1 })
      .lean()
      .exec();

    return docs.map(doc => AreaComparisonSchema.parse({ ...doc, _id: doc._id?.toString() }));
  }

  static async findBySlug(slug: string): Promise<AreaComparison | null> {
    await connectForWrites();
    const doc = await AreaComparisonModel.findOne({ slug })
      .populate("area1")
      .populate("area2")
      .lean()
      .exec();

    if (!doc) return null;
    return AreaComparisonSchema.parse({ ...doc, _id: doc._id?.toString() });
  }

  static async findById(id: string): Promise<AreaComparison | null> {
    await connectForWrites();
    const doc = await AreaComparisonModel.findById(id).lean().exec();
    if (!doc) return null;
    return AreaComparisonSchema.parse({ ...doc, _id: doc._id?.toString() });
  }

  static async findByAreaIds(area1Id: string, area2Id: string): Promise<AreaComparison | null> {
    await connectForWrites();
    const doc = await AreaComparisonModel.findOne({
      $or: [
        { area1: area1Id, area2: area2Id },
        { area1: area2Id, area2: area1Id }
      ]
    }).lean().exec();

    if (!doc) return null;
    return AreaComparisonSchema.parse({ ...doc, _id: doc._id?.toString() });
  }

  static async create(data: Partial<AreaComparison>): Promise<AreaComparison> {
    await connectForWrites();
    const area1 = await AreaModel.findById(data.area1).select("slug").lean().exec();
    const area2 = await AreaModel.findById(data.area2).select("slug").lean().exec();

    const slug = data.slug || `${area1?.slug}-vs-${area2?.slug}`;

    const doc = await AreaComparisonModel.create({ ...data, slug });
    return AreaComparisonSchema.parse({ ...doc.toObject(), _id: doc._id?.toString() });
  }

  static async update(id: string, data: Partial<AreaComparison>): Promise<AreaComparison | null> {
    await connectForWrites();
    const doc = await AreaComparisonModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean().exec();
    if (!doc) return null;
    return AreaComparisonSchema.parse({ ...doc, _id: doc._id?.toString() });
  }

  static async delete(id: string): Promise<void> {
    await connectForWrites();
    await AreaComparisonModel.findByIdAndDelete(id).exec();
  }

  static async findAllSlugs(): Promise<string[]> {
    await connectForWrites();
    const docs = await AreaComparisonModel.find({}).select("slug").lean().exec();
    return docs.map(doc => doc.slug);
  }

  static async findByArea(areaId: string): Promise<AreaComparison[]> {
    await connectForWrites();
    const docs = await AreaComparisonModel.find({
      isActive: true,
      $or: [{ area1: areaId }, { area2: areaId }]
    })
      .populate("area1", ACTIVE_POPULATE_FIELDS)
      .populate("area2", ACTIVE_POPULATE_FIELDS)
      .sort({ sortOrder: 1 })
      .lean()
      .exec();

    return docs.map(doc => AreaComparisonSchema.parse({ ...doc, _id: doc._id?.toString() }));
  }

  static async findByAreaIdList(areaIds: string[]): Promise<AreaComparison[]> {
    await connectForWrites();
    const docs = await AreaComparisonModel.find({
      isActive: true,
      $or: [
        { area1: { $in: areaIds } },
        { area2: { $in: areaIds } }
      ]
    })
      .populate("area1", ACTIVE_POPULATE_FIELDS)
      .populate("area2", ACTIVE_POPULATE_FIELDS)
      .sort({ sortOrder: 1 })
      .lean()
      .exec();

    return docs.map(doc => AreaComparisonSchema.parse({ ...doc, _id: doc._id?.toString() }));
  }
}
