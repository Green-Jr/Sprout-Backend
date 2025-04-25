import { userRepo } from "../../entities/repositories/sequelizeRepository";
import sequelize from "../config/database";
import { QueryTypes, Op } from "sequelize";


export const userService = {
    async getUsers() {
      return await userRepo.findAll();
    },
  
    async getUserById(id: string) {
      return await userRepo.findOne({ where: { id } });
    },
  
    async getUserByEmail(email: string) {
      return await userRepo.findOne({ where: { email } });
    },
  
    async createUser(userData: any) {
      return await userRepo.create(userData);
    },
  
    async updateUser(id: string, updateData: any) {
      return await userRepo.update(updateData, { where: { id } });
    },
  
    async deleteUser(id: string) {
      return await userRepo.delete({ where: { id } });
    },
  };