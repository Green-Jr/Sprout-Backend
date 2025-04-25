import { accountRepo } from "../../entities/repositories/sequelizeRepository";
import sequelize from "../config/database";
import { QueryTypes, Op } from "sequelize";


export const accountService = {
  async getAccounts() {
    return await accountRepo.findAll();
  },

  async updateUserAccount(userId: string, updateData: any) {
    return await accountRepo.update(updateData, {
      where: { userId },
      returning: true
    });
  },

  // 🔹 ✅ Método para consultar la vista `USER_ACCOUNT_INFO`
  async getUserAccountInfo(userId: string) {
    const query = `
        SELECT * FROM "USERS"."USER_ACCOUNT_INFO" WHERE "USER_ID" = :userId;
      `;
    const [results] = await sequelize.query(query, {
      replacements: { userId },
      type: QueryTypes.SELECT,
    });

    return results;
  },

  // 🔹 ✅ Método para obtener todos los usuarios con cuentas
  async getAllUsersWithAccounts() {
    const query = `
        SELECT * FROM "USERS"."USER_ACCOUNT_INFO";
      `;
    const [results] = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    return results;
  },

  async createAccount(accountData: any) {
    return await accountRepo.create(accountData);
  },

  async getAccountByUserId(ID_USER: string) {
    const query = `
        SELECT "AMOUNT",  "SUB_AMOUNT", "SPROUT_COINS"
        FROM "USERS"."ACCOUNTS"
        WHERE "ID_USER" = :ID_USER
        LIMIT 1;
      `;

    const [results] = await sequelize.query(query, {
      replacements: { ID_USER },
      type: QueryTypes.SELECT
    });

    return results
  },

  async rechargeUserAccount(IDUSER: string, AMOUNT: number) {
    const query = `
        UPDATE "USERS"."ACCOUNTS"
        SET "AMOUNT" = "AMOUNT" + :amount 
        WHERE "ID_USER" = :userId;
        `;

    const [result] = await sequelize.query(query, {
      replacements: { userId: IDUSER, amount: AMOUNT }
    });

    return result;
  },

  async decreaseUserBalance(IDUSER: string, totalAmount: number) {
    const query = `
        UPDATE "USERS"."ACCOUNTS"
        SET "AMOUNT" = "AMOUNT" - :totalAmount
        WHERE "ID_USER" = :IDUSER;
      `;
    const [result] = await sequelize.query(query, {
      replacements: { IDUSER, totalAmount }
    });
    return result;
  },

  async increaseUserSubAmount(ID_USER: string, amount: number) {
    const query = `
          UPDATE "USERS"."ACCOUNTS"
          SET "SUB_AMOUNT" = "SUB_AMOUNT" + :amount
          WHERE "ID_USER" = :ID_USER
      `;
    const [result] = await sequelize.query(query, {
      replacements: { ID_USER, amount }
    });
    return result;
  },

  async decreaseUserSubAmount(ID_USER: string, amount: number) {
    const query = `
          UPDATE "USERS"."ACCOUNTS"
          SET "SUB_AMOUNT" = "SUB_AMOUNT" - :amount
          WHERE "ID_USER" = :ID_USER
      `;
    const [result] = await sequelize.query(query, {
      replacements: { ID_USER, amount }
    });
    return result;
  },

  async rechargeSproutsCoinsUserAccount(IDUSER: string, AMOUNT: number) {
    const query = `
        UPDATE "USERS"."ACCOUNTS"
        SET "SPROUT_COINS" = "SPROUT_COINS" + :amount 
        WHERE "ID_USER" = :userId;
        `;

    const [result] = await sequelize.query(query, {
      replacements: { userId: IDUSER, amount: AMOUNT }
    });

    return result;
  },

  async redeemSproutsCoinsUserAccount(IDUSER: string, AMOUNT: number) {
    const query = `
        UPDATE "USERS"."ACCOUNTS"
        SET "SPROUT_COINS" = "SPROUT_COINS" - :amount 
        WHERE "ID_USER" = :userId;
        `;

    const [result] = await sequelize.query(query, {
      replacements: { userId: IDUSER, amount: AMOUNT }
    });

    return result;
  },

  async getAllAccountsWithRiskManagementEnabled() {
    return await accountRepo.findAll({
        where: {
          riskManagementEnabled: true,
          lossPercentage: { [Op.not]: null },
          profitPercentage: { [Op.not]: null }
        },
        raw: true
    });
}


};
