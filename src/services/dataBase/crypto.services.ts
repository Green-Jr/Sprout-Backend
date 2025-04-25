import { cryptoRepo } from "../../entities/repositories/sequelizeRepository";
import sequelize from "../config/database";
import { QueryTypes } from "sequelize";

export const cryptoService = {
    async GetCryptos(options?: any) {
        return await cryptoRepo.findAll(options);
    }
};