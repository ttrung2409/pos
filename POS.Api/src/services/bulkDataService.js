import BulkDataRepository from "../repositories/bulkDataRepository";

let repo = new BulkDataRepository();

export default class BulkDataService {
  getCustomersWithIncomeBetween(params) {
    return repo.getCustomersWithIncomeBetween(params);
  }

  getProductsWithIncomeBetween(params) {
    return repo.getProductsWithIncomeBetween(params);
  }

  deleteProductsWithIncomeBetween(params) {
    return repo.deleteProductsWithIncomeBetween(params);
  }

  deleteCustomersWithIncomeBetween(params) {
    return repo.deleteCustomersWithIncomeBetween(params);
  }
}