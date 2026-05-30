import { connectForWrites } from "../connection";
import { LeadModel } from "@/features/lead-engine/models/Lead";
import { LeadSchema, type Lead } from "@/shared/types/models";

export class LeadRepository {
  static async createLead(data: Omit<Lead, "_id" | "createdAt" | "updatedAt">): Promise<Lead> {
    await connectForWrites();
    const doc = await LeadModel.create(data);
    return LeadSchema.parse({ ...doc.toObject(), _id: doc._id.toString() });
  }

  static async findAll(): Promise<Lead[]> {
    await connectForWrites();
    const docs = await LeadModel.find({}).sort({ createdAt: -1 }).lean().exec();
    return docs.map(doc => LeadSchema.parse({ ...doc, _id: doc._id?.toString() }));
  }

  static async updateStatus(id: string, status: Lead["status"]): Promise<void> {
    await connectForWrites();
    await LeadModel.findByIdAndUpdate(id, { status }).exec();
  }

  static async delete(id: string): Promise<void> {
    await connectForWrites();
    await LeadModel.findByIdAndDelete(id).exec();
  }
}
