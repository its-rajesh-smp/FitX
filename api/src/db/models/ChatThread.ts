import { Model, Transaction } from "objection";

export class ChatThread extends Model {
  id!: string;
  userId!: string;
  threadMemory!: Record<string, unknown>;

  static tableName = "chat_threads";

  static async create(
    threadData: Partial<Omit<ChatThread, "id">>,
    trx?: Transaction,
  ): Promise<ChatThread> {
    return await this.query(trx).insert(threadData);
  }

  static async findById(id: string): Promise<ChatThread | undefined> {
    return await this.query().findById(id);
  }

  static async findAll(): Promise<ChatThread[]> {
    return await this.query();
  }

  static async update(
    id: string,
    threadData: Partial<Omit<ChatThread, "id">>,
    trx?: Transaction,
  ): Promise<ChatThread | undefined> {
    return await this.query(trx).patchAndFetchById(id, threadData);
  }

  static async findLatestByUserId(
    userId: string,
  ): Promise<ChatThread | undefined> {
    return await this.query()
      .where({ userId })
      .orderBy("updatedAt", "desc")
      .first();
  }

  static async findByIdAndUserId(
    id: string | undefined,
    userId: string,
  ): Promise<ChatThread | undefined> {
    return await this.query().findOne({ id, userId });
  }

  static async touch(id: string): Promise<void> {
    await this.query()
      .findById(id)
      .patch({ updatedAt: new Date().toISOString() } as Partial<ChatThread>);
  }
}
