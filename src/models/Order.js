export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  DELIVERING: "DELIVERING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
};

export class Order {
  constructor() {
    this.id = "";
    this.userId = "";
    this.name = "";
    this.phoneNumber = "";
    this.city = "";
    this.district = "";
    this.ward = "";
    this.street = "";
    this.address = "";
    this.totalProductPrice = 0;
    this.shipFee = 0;
    this.discount = 0;
    this.productNames = [];
    this.productDescriptions = [];
    this.productPrices = [];
    this.products = [];
    this.stockIds = [];
    this.quantities = [];
    this.accessories = [];
    this.accessoriesQuantity = [];
    this.status = ORDER_STATUS.PENDING;
    this.total = 0;
    this.voucherId = "";
    this.locationTracks = [];
    this.trackHistory = [];
    this.dateCreate = Date.now();
    this.key = "";
    this.lastUpdate = Date.now();
  }

  format() {
    this.totalProductPrice = Number(this.totalProductPrice);
    this.shipFee = Number(this.shipFee);
    this.total = Number(this.total);
  }

  data() {
    this.format();
    return JSON.parse(JSON.stringify(this));
  }
}
