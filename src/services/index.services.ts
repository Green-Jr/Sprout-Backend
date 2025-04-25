import { userService } from "./dataBase/users.services";
import { accountService } from "./dataBase/acounts.services";
import { purchaseService } from "./dataBase/purchase.services";
import { investmentService } from "./dataBase/investemets.services";
import { transactionService } from "./dataBase/transactions.services";
import { cryptoService } from "./dataBase/crypto.services";
import { emailService } from "./email/email.services";
import { externalServices } from "./externalApi/external.services";

export const ServicesGateway = {
  users: userService,
  acounts :accountService,
  purchase: purchaseService,
  investments: investmentService,
  cryptos: cryptoService,
  email: emailService,
  transactions: transactionService,
  externalServices: externalServices
};

Object.freeze(ServicesGateway);