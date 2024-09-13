export class Voucher {
  constructor() {
    this.id = "";
    this.name = "";
    this.code = "";
    this.description = "";
    this.isExclusive = false;
    this.applicableProducts = [];
    this.discountThreshold = 0;
    this.discountRate = 0;
    this.maxDiscount = 0;
    this.maxUse = 0;
    this.currentUse = 0;
    this.startTime = Date.now();
    this.endTime = Date.now();
    this.lastUpdate = Date.now();
    this.displayImageUrl = "";
    this.iconImageUrl = "";
  }

  fortmat() {
    this.discountThreshold = Number(this.discountThreshold);
    this.discountRate = Number(this.discountRate);
    this.maxDiscount = Number(this.maxDiscount);
    this.maxUse = Number(this.maxUse);
    this.currentUse = Number(this.currentUse);
  }

  data() {
    this.fortmat();
    return JSON.parse(JSON.stringify(this));
  }
}
