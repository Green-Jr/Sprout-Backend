import { purchaseRepo } from "../../entities/repositories/sequelizeRepository";
import User from "../../entities/models/users/usersModel";

export const purchaseService = {
    async getPurchases() {
      return await purchaseRepo.findAll();
    },

    async getUserPurchases(options: any) {
      return await purchaseRepo.findAll({
          where: options.where,
          limit: options.limit,
          offset: options.offset,
          order: options.order,
          include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'] // Solo datos básicos
          }]
      });
  },

  async getCount(options: any) {
      return await purchaseRepo.count({
          where: options.where
      });
  },
  
    async getPurchaseById(id: string) {
      return await purchaseRepo.findOne({ where: { id } });
    },
  
    async createPurchase(purchaseData: any) {
      return await purchaseRepo.create(purchaseData);
    },
  
    async cancelPurchase(purchaseId: string) {
      return await purchaseRepo.update(
        { stateOrder: 3 },
        { where: { id: purchaseId, stateOrder: 1 } } // solo si aún está pendiente
      );
    },
  
    async deletePurchase(id: string) {
      return await purchaseRepo.delete({ where: { id } });
    },
  };