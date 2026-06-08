import { Model } from "objection";

export type MessageRole = "Assistant" | "Human";

export class Message extends Model {
  id!: string;
  userId!: string;
  threadId!: string;
  role!: MessageRole;
  content!: Record<string, unknown>;
  createdAt!: string;
  updatedAt!: string;

  static tableName = "messages";

  static async create(messageData: Partial<Omit<Message, "id">>): Promise<Message> {
    return await this.query().insert(messageData);
  }

  static async findById(id: string): Promise<Message | undefined> {
    return await this.query().findById(id);
  }

  static async findAll(): Promise<Message[]> {
    return await this.query();
  }

  static async update(id: string, messageData: Partial<Omit<Message, "id">>): Promise<Message | undefined> {
    return await this.query().patchAndFetchById(id, messageData);
  }
}
