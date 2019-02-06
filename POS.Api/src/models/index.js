import Category from './category'
import Customer from './customer'
import CustomerType from './customerType'
import Product from './product'
import Uom from './uom'
import Invoice from './invoice'
import InvoiceItem from './invoiceItem'
import Payment from './Payment'

const models = {
  Category,
  Customer,
  CustomerType,
  Product,
  Uom,
  Invoice,
  InvoiceItem,
  Payment
}

for (let key of Object.keys(models)) {
  if (!!models[key].associate) {
    models[key].associate(models);
  }
}

module.exports = models
