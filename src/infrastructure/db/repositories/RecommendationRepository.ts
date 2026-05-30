import { connectForWrites } from "../connection";
import { RecommendationModel } from "@/features/recommendations/models/Recommendation";
import { RecommendationSchema, type RecommendationSession } from "@/shared/types/models";

export class RecommendationRepository {
  static async createSession(data: Omit<RecommendationSession, "_id" | "createdAt">): Promise<RecommendationSession> {
    await connectForWrites();
    const doc = await RecommendationModel.create(data);
    return RecommendationSchema.parse({ ...doc.toObject(), _id: doc._id.toString() });
  }

  static async findById(id: string): Promise<RecommendationSession | null> {
    await connectForWrites();
    const doc = await RecommendationModel.findById(id).lean().exec();
    if (!doc) return null;
    return RecommendationSchema.parse({ ...doc, _id: doc._id?.toString() });
  }
}
