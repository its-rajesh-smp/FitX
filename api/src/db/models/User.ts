import { Model, Pojo } from "objection";

export class User extends Model {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  planId?: string | null;

  static tableName = "users";

  $formatJson(json: Pojo): Pojo {
    json = super.$formatJson(json);
    delete json.password;
    return json;
  }

  static async create(userData: Partial<Omit<User, "id">>): Promise<User> {
    return await this.query().insert(userData);
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    return await this.query().findOne({ email });
  }

  static async findById(id: string): Promise<User | undefined> {
    return await this.query().findById(id);
  }

  static async findAll(): Promise<User[]> {
    return await this.query();
  }

  static async update(id: string, userData: Partial<Omit<User, "id">>): Promise<User | undefined> {
    return await this.query().patchAndFetchById(id, userData);
  }
}
