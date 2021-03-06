import Sequelize from 'sequelize';
import context from '../dbContext';

let Customer = context.define('Customer', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  no: Sequelize.STRING,
  name: Sequelize.STRING,
  phone: Sequelize.STRING,
  email: Sequelize.STRING,
  address: Sequelize.STRING,
  dob: Sequelize.DATEONLY,
  typeId: Sequelize.INTEGER,
  notes: Sequelize.TEXT,
  deletedAt: Sequelize.DATE
}, { tableName: 'Customer', timestamps: true, paranoid: true });

Customer.associate = function (models) {
  Customer.belongsTo(models.CustomerType, { foreignKey: 'typeId', as: 'type' });
  Customer.hasMany(models.Invoice, {
    foreignKey: 'customerId'
  });
}

export default Customer
