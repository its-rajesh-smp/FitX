import { Model, Transaction } from "objection";

export enum MessageRole {
  Human = "Human",
  Assistant = "Assistant",
}

export interface MessageContent {
  text: string;
  quickAnswers?: string[];
  widget?: {
    type:
      | "none"
      | "experience_level"
      | "muscle_multi_select"
      | "equipment_multi_select"
      | "user_plan";
    label: string;
  };
}

export class Message extends Model {
  id!: string;
  userId!: string;
  threadId!: string;
  role!: MessageRole;
  content!: MessageContent;
  createdAt!: string;
  updatedAt!: string;

  static tableName = "messages";

  static async create(
    messageData: Partial<Omit<Message, "id">>,
    trx?: Transaction,
  ): Promise<Message> {
    return await this.query(trx).insert(messageData);
  }

  static async findById(id: string): Promise<Message | undefined> {
    return await this.query().findById(id);
  }

  static async findAll(): Promise<Message[]> {
    return await this.query();
  }

  static async update(
    id: string,
    messageData: Partial<Omit<Message, "id">>,
  ): Promise<Message | undefined> {
    return await this.query().patchAndFetchById(id, messageData);
  }

  static async findByThreadId(threadId: string): Promise<Message[]> {
    return await this.query().where({ threadId }).orderBy("createdAt", "asc");
  }

  static async getRecent(threadId: string, limit = 12): Promise<Message[]> {
    const messages = await this.query()
      .where({ threadId })
      .orderBy("createdAt", "asc")
      .limit(limit);

    return messages;
  }

  static async countByThreadId(threadId: string): Promise<number> {
    return await this.query().where({ threadId }).resultSize();
  }

  static async getBatchAfterMessageCount(
    threadId: string,
    messageCount: number,
    limit: number,
  ): Promise<Message[]> {
    return await this.query()
      .where({ threadId })
      .orderBy("createdAt", "asc")
      .offset(messageCount)
      .limit(limit);
  }
}
