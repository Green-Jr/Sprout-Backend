import { investmentRepo } from "../../entities/repositories/sequelizeRepository";
import sequelize from "../config/database";
import { QueryTypes, Op } from "sequelize";
import Account from "../../entities/models/acounts/accountModel";
import Crypto from "../../entities/models/acounts/cryptoModel";

export const investmentService = {
  async getInvestments() {
    return await investmentRepo.findAll();
  },

  async getInvestmentsByAccountId(accountId: string) {
    return investmentRepo.findAll({
      where: { accountId: accountId },
      include: [{
        model: Crypto,
        as: 'cryptoData',
        attributes: ['SYMBOL', 'PRICE_COP'],
        required: false
      }],
      attributes: [
        'ID', 'ID_ACCOUNT', 'ASSET',
        'INIT_VALUE', 'CURRENT_VALUE',
        'CRYPTO_AMOUNT', 'GENERATED_DATE'
      ],
      raw: true,
      nest: true
    });
  },

  async getUserInvestmentsWithPrices(accountId: string) {
    return investmentRepo.findAll({
      where: { ID_ACCOUNT: accountId },
      include: [{
        model: Crypto,
        as: 'cryptoData',
        attributes: ['SYMBOL', 'PRICE_COP'],
        required: false
      }],
      attributes: [
        'ID', 'ID_ACCOUNT', 'ASSET',
        'INIT_VALUE', 'CURRENT_VALUE',
        'CRYPTO_AMOUNT', 'GENERATED_DATE'
      ],
      raw: true,
      nest: true
    });
  },

  async getUserInvestment(userId: string, investmentId: string) {
    const account = await Account.findOne({
      where: { ID_USER: userId },
      attributes: ['ID']
    });

    if (!account) return null;

    return await investmentRepo.findOne({
      where: { /* ... */ },
      attributes: [
        'ID',
        'ID_ACCOUNT',
        'ASSET',
        'INIT_VALUE',
        'CRYPTO_AMOUNT',
        'CURRENT_VALUE',
        [sequelize.literal('"cryptoData"."PRICE_COP"'), 'currentCryptoPrice']
      ],
      include: [{
        model: Crypto,
        as: 'cryptoData',
        attributes: [] // Solo necesitamos el PRICE_COP que ya está en el literal
      }]
    });
  },

  async createInvestment(investmentData: any) {
    return await investmentRepo.create(investmentData);
  },

  async updateInvestment(id: string, updateData: any, options?: any) {
    // 1. Verificar que existe la inversión (opcional, si quieres mantener esta validación)
    const exists = await investmentRepo.findOne({
      where: { ID: id },
      transaction: options?.transaction
    });

    if (!exists) {
      throw new Error(`Inversión con ID ${id} no existe`);
    }

    // 2. Construir la consulta SQL dinámica
    const setClauses = [];
    const replacements: any = { id };

    for (const [key, value] of Object.entries(updateData)) {
      setClauses.push(`"${key}" = :${key}`);
      replacements[key] = value;
    }

    if (setClauses.length === 0) {
      return true; // No hay nada que actualizar
    }

    const updateQuery = `
          UPDATE "USERS"."INVESTMENTS"
          SET ${setClauses.join(', ')}
          WHERE "ID" = :id
      `;

    // 3. Ejecutar la consulta
    const [result] = await sequelize.query(updateQuery, {
      replacements,
      type: QueryTypes.UPDATE,
      ...options
    });

    // En PostgreSQL, result es el número de filas afectadas
    if (result === 0) {
      throw new Error(`No se actualizó la inversión ${id}. Verifica los valores proporcionados.`);
    }

    return true;
  },

  async deleteInvestment(id: string, options?: any) {
    const deletedCount = await investmentRepo.delete({
      where: { ID: id },
      ...options
    });
    return deletedCount > 0;
  }
};