import { DataTypes } from "sequelize";
import sequelize from "../../../services/config/database";
import User from "../users/usersModel";

const Purchase = sequelize.define("Purchase", {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "NAME",
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: "AMOUNT",
  },
  saveAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: "SAVE_AMOUNT",
  },
  generatedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: "GENERATED_DATE",
  },
  stateOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "STATE_ORDER",
    validate: {
      isIn: [[1, 2, 3]],
    },
  },
}, {
  schema: "USERS",
  tableName: "PURCHASES",
  timestamps: false,
});

// ✅ Definir la relación entre `User` y `Purchase`
User.hasMany(Purchase, { foreignKey: "userId", as: "purchases" });
Purchase.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Purchase;
