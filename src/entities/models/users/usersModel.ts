import { DataTypes } from "sequelize";
import sequelize  from "../../../services/config/database";

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    field: 'ID' 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'NAME' 
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'EMAIL'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'PASSWORD'
  },
  minInvestmentAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 20000,
    field: 'MIN_INVESTMENT_AMOUNT',
    validate: {
      min: 20000
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,  
    field: 'CREATEDAT'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,  
    field: 'UPDATEDAT'
  }
}, {
  schema: 'USERS',
  tableName: 'USERS', 
  timestamps: false,
  underscored: true,
});

export default User;