export class Stock {
    constructor(productId) {
        this.id = "";
        this.productId = productId;
        this.variantIndex = 0;
        this.quantity = 0;
        this.color = "Default";
        this.imageUrls = [];
        this.imageNames = [];
        this.lastUpdate = Date.now();
    }

    data() {
        return JSON.parse(JSON.stringify(this));
    }
}