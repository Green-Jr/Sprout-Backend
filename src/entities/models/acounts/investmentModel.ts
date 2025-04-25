import { DataTypes } from "sequelize";
import sequelize from "../../../services/config/database";
import Account from "./accountModel";
import Crypto from "./cryptoModel";

const Investment = sequelize.define("Investment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    field: "ID",
  },
  accountId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "ID_ACCOUNT",
    references: {
      model: Account,
      key: "ID",
    },
  },
  asset: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "ASSET",
  },
  initValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: "INIT_VALUE",
  },
  currentValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: "CURRENT_VALUE",
  },
  generatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: "GENERATED_DATE",
  },
}, {
  schema: "USERS",
  tableName: "INVESTMENTS",
  timestamps: false,
});

// ✅ Definir la relación entre `Account` y `Investment`
Account.hasMany(Investment, { foreignKey: "accountId", as: "investments" });
Investment.belongsTo(Account, { foreignKey: "accountId", as: "account" });
Investment.belongsTo(Crypto, {foreignKey: "asset",targetKey: "symbol",as: "cryptoData",constraints: false});

export default Investment;
