import { DataTypes } from "sequelize";
import sequelize from "../../../services/config/database";
import User from "../users/usersModel";

const Account = sequelize.define("Account", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    field: "ID",
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "ID_USER",
    references: {
      model: User,
      key: "ID",
    },
  },
  amount: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    allowNull: false,
    field: "AMOUNT",
  },
  subAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    allowNull: false,
    field: "SUB_AMOUNT",
  },
  sproutCoins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    field: "SPROUT_COINS",
  },
  preferredCryptos: {
    type: DataTypes.JSONB,
    defaultValue: ["BTC", "ETH", "SOL"], // Default: Top 3 criptos
    allowNull: false,
    field: "PREFERRED_CRYPTOS"
  },
  lossPercentage: {
    type: DataTypes.FLOAT,
    defaultValue: null,
    allowNull: true,
    field: "LOSS_PERCENTAGE",
    validate: {
      min: 0,
      max: 100
    }
  },
  profitPercentage: {
    type: DataTypes.FLOAT,
    defaultValue: null,
    allowNull: true,
    field: "PROFIT_PERCENTAGE",
    validate: {
      min: 0
    }
  },
  riskManagementEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: "RISK_MANAGEMENT_ENABLED"
  }
}, {
  schema: "USERS",
  tableName: "ACCOUNTS",
  timestamps: false,
});

// ✅ Definir la relación entre `User` y `Account`
User.hasOne(Account, { foreignKey: "userId", as: "account" });
Account.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Account;
