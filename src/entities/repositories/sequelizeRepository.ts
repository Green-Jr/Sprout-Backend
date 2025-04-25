import SequelizeCall from "../../services/sequelizeCall";
import User from "../models/users/usersModel";
import Account from "../models/acounts/accountModel";
import Purchase from "../models/acounts/purchaseModel";
import Investment from "../models/acounts/investmentModel";
import InvestmentTransaction from "../models/acounts/InvestmentTransactionModel";
import Crypto from "../models/acounts/cryptoModel";

const userRepo = new SequelizeCall(User);
const accountRepo = new SequelizeCall(Account);
const purchaseRepo = new SequelizeCall(Purchase);
const investmentRepo = new SequelizeCall(Investment);
const transactionRepo = new SequelizeCall(InvestmentTransaction);
const cryptoRepo = new SequelizeCall(Crypto);


export { 
    userRepo,
    accountRepo,
    purchaseRepo,
    investmentRepo,
    transactionRepo,
    cryptoRepo,
};
