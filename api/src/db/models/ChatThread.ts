import { Model } from "objection";

export class ChatThread extends Model {
  id!: string;
  userId!: string;
  threadMemory!: Record<string, unknown>;

  static tableName = "chat_threads";

  static async create(threadData: Partial<Omit<ChatThread, "id">>): Promise<ChatThread> {
    return await this.query().insert(threadData);
  }

  static async findById(id: string): Promise<ChatThread | undefined> {
    return await this.query().findById(id);
  }

  static async findAll(): Promise<ChatThread[]> {
    return await this.query();
  }

  static async update(id: string, threadData: Partial<Omit<ChatThread, "id">>): Promise<ChatThread | undefined> {
    return await this.query().patchAndFetchById(id, threadData);
  }
}
