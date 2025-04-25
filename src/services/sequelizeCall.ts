import { Model, FindOptions, CreateOptions, UpdateOptions, CountOptions } from "sequelize";
import {connectDB} from "../services/config/database"; 

class SequelizeCall<T extends Model> {
  private model: any;

  constructor(model: any) {
    this.model = model;
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return await this.model.findAll(options);
  }

  async findOne(options?: FindOptions): Promise<T | null> {
    return await this.model.findOne(options);
  }

  async create(data: any, options?: CreateOptions): Promise<T> {
    return await this.model.create(data, options);
  }

  async update(data: any, options?: UpdateOptions): Promise<[number]> {
    return await this.model.update(data, options);
  }

  async delete(options?: FindOptions): Promise<number> {
    return await this.model.destroy(options);
  }

  async count(options?: CountOptions): Promise<number> {
    return await this.model.count(options);
  }
}

export default SequelizeCall;
