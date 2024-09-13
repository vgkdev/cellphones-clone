export class User {
  constructor() {
    this.id = "";
    this.firstName = "";
    this.lastName = "";
    this.displayName = "";
    this.email = "";
    this.isManager = false;
    this.isStaff = false;
    this.isCustomer = true;
    this.orders = [];
    this.searchedHistory = [];
    this.purchasedItems = [];
    this.purchasedAccessories = [];
    this.likedProducts = [];
    this.reviews = [];
    this.reviewedProducts = [];
    this.ratings = [];
    this.ratedProducts = [];
    this.cartId = "";
    this.likedReviews = [];
    this.dislikedReviews = [];
    this.avatarImageUrl = "";
    this.addresses = [];
    this.phoneNumbers = [];
    this.dateCreate = Date.now();
    this.collectedVouchers = [];
    this.lastUpdate = Date.now();
  }

  data() {
    return JSON.parse(JSON.stringify(this));
  }
}
