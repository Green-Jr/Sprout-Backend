import { transactionRepo } from "../../entities/repositories/sequelizeRepository";
import sequelize from "../config/database";
import { QueryTypes, Op } from "sequelize";
import Account from "../../entities/models/acounts/accountModel";
import Crypto from "../../entities/models/acounts/cryptoModel";

interface CountResult {
  total: string; // PostgreSQL devuelve COUNT como string
}


export const transactionService = {

  async create(data: any) {

    if (!data.USER_ID || !data.TYPE || !data.AMOUNT || !data.CRYPTO_AMOUNT || !data.ASSET) {
      throw new Error(`Faltan campos requeridos: ${JSON.stringify(data)}`);
    }

    return transactionRepo.create({
      userId: data.USER_ID,
      investmentId: data.INVESTMENT_ID,
      type: data.TYPE,
      amount: data.AMOUNT,
      cryptoAmount: data.CRYPTO_AMOUNT,
      asset: data.ASSET,
      status: data.STATUS || "COMPLETED"
    });
  },

  async executeAtomic(callback: (t: any) => Promise<any>) {
    const t = await sequelize.transaction();
    try {
      const result = await callback(t);
      await t.commit();
      return result;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async getRedemptionHistory(params: {
    userId: string;
    limit: number;
    offset: number;
  }): Promise<any[]> {
    return await sequelize.query(`
        SELECT 
            t."ID",
            t."INVESTMENT_ID",
            t."TYPE",
            t."AMOUNT",
            t."CRYPTO_AMOUNT",
            t."ASSET",
            t."CREATED_AT"
        FROM "USERS"."INVESTMENT_TRANSACTIONS" t
        WHERE t."USER_ID" = :userId
        AND t."TYPE" = 'REDEMPTION'
        ORDER BY t."CREATED_AT" DESC
        LIMIT :limit OFFSET :offset
    `, {
      replacements: {
        userId: params.userId,
        limit: params.limit,
        offset: params.offset
      },
      type: QueryTypes.SELECT
    });
  },

  async countRedemptions(userId: string): Promise<number> {
    const result = await sequelize.query<CountResult>(`
      SELECT COUNT(*) as "total"
      FROM "USERS"."INVESTMENT_TRANSACTIONS"
      WHERE "USER_ID" = :userId
      AND "TYPE" = 'REDEMPTION'
  `, {
      replacements: { userId },
      type: QueryTypes.SELECT
    });

    // Verificar que hay resultados y acceder de forma segura
    if (!result || result.length === 0) {
      return 0;
    }

    return parseInt(result[0].total);
  },

  // En tu servicio de transactions
  async updateAll(updates: any, options?: any) {
    const [affectedCount] = await transactionRepo.update(
      updates,
      {
        where: options?.where,
        transaction: options?.transaction
      }
    );
    return affectedCount;
  }

}