import { connectForWrites } from "../connection";
import { Agent } from "@/features/trust-network/models/Agent";
import { AgentSchema, type Agent as AgentType } from "@/shared/types/models";

export class AgentRepository {
  static async findAll(): Promise<AgentType[]> {
    await connectForWrites();
    const docs = await Agent.find({}).sort({ updatedAt: -1 }).lean().exec();
    
    return docs.map((doc: Record<string, unknown>) => {
      const parsed = AgentSchema.safeParse({ ...doc, _id: (doc._id as { toString(): string })?.toString() });
      if (!parsed.success) return null;
      return parsed.data;
    }).filter(Boolean) as AgentType[];
  }

  static async findById(id: string): Promise<AgentType | null> {
    await connectForWrites();
    const doc = await Agent.findById(id).lean().exec();
    if (!doc) return null;
    const parsed = AgentSchema.safeParse({ ...doc, _id: doc._id?.toString() });
    return parsed.success ? parsed.data : null;
  }

  static async delete(id: string): Promise<void> {
    await connectForWrites();
    await Agent.findByIdAndDelete(id).exec();
  }

  static async count(): Promise<number> {
    await connectForWrites();
    return Agent.countDocuments();
  }

  static async findVerifiedAgentsByColony(colonyId: string): Promise<AgentType[]> {
    await connectForWrites();
    // Assuming colonyCoverage stores colony string IDs or ObjectIds
    const docs = await Agent.find({ 
      activeStatus: true, 
      verifiedStatus: "verified",
      colonyCoverage: colonyId
    }).sort({ rating: -1 }).lean().exec();
    
    return docs.map((doc: Record<string, unknown>) => {
      const parsed = AgentSchema.safeParse({ ...doc, _id: (doc._id as { toString(): string })?.toString() });
      if (!parsed.success) return null;
      return parsed.data;
    }).filter(Boolean) as AgentType[];
  }
}
