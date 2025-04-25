import { DataTypes } from "sequelize";
import sequelize from "../../../services/config/database";
import Investment from "./investmentModel";

const Crypto = sequelize.define("Crypto", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: "ID"
  },
  symbol: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    field: "SYMBOL"
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: "NAME"
  },
  priceCOP: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: "PRICE_COP"
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: "UPDATED_AT",
    defaultValue: DataTypes.NOW
  }
}, {
  schema: "USERS",
  tableName: "CRYPTOS",
  timestamps: false, // Desactivamos timestamps automáticos
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ["SYMBOL"]
    }
  ]
});

export default Crypto;