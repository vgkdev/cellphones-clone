//================================================
// Classes
//================================================

import { Assistant } from "@mui/icons-material";
import { toNumArray } from "../utils/num";

export const PRODUCT_TYPES = {
  NONE: 0,
  PHONE: 1,
  ACCESSORY: 2,
};

export class Product {
  constructor() {
    this.id = "";
    this.isConfigured = false;
    this.name = "";
    this.manufacturer = "";
    this.overview = "";
    this.variantCount = 1;
    this.variantName = [""];
    this.variantMemory = [0];
    this.variantMemoryDataUnit = ["GB"];
    this.variantStorage = [0];
    this.variantStorageDataUnit = ["GB"];
    this.variantPrice = [0];
    this.finalPrices = [0];
    this.screenTech = "";
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.screenSize = 0;
    this.refreshRate = 0;
    this.screenFeatures = "";
    this.screenOutlook = "";
    this.backCamera = "";
    this.backCameraVideo = "";
    this.backCameraFeatures = "";
    this.frontCamera = "";
    this.frontCameraVideo = "";
    this.chipset = "";
    this.cpu = "";
    this.gpu = "";
    this.battery = "";
    this.chargerTech = "";
    this.chargerConnector = "";
    this.simCard = "";
    this.os = "";
    this.jack_3_5mm = "";
    this.nfc = "";
    this.network = "";
    this.bluetooth = "";
    this.wifi = "";
    this.gps = [];
    this.phoneWidth = 0;
    this.phoneHeight = 0;
    this.phoneDepth = 0;
    this.weight = 0;
    this.backMaterial = "";
    this.frameMaterial = "";
    this.compatibility = "";
    this.waterAndDustProof = "";
    this.additionalFeatures = "";
    this.otherUtilities = "";
    this.soundTech = "";
    this.fingerPrintTech = "";
    this.sensors = [];
    this.specialFeatures = "";
    this.usages = [];
    this.publishedAt = "";
    this.comments = [];
    this.reviews = [];
    this.ratings = [];
    this.FAQs = [];
    this.posts = [];
    this.imageNames = [];
    this.imageUrls = [];
    this.videos = [];
    this.relatedProducts = [];
    this.frontCameraResolution = "";
    this.backCameraResolution = "";
    this.cpuName = "";
    this.coresNumber = 0;
    this.displayImageUrl = "";
    this.isDeleted = false;
    this.likeCount = 0;
    this.activeEvent = "";
    this.productType = PRODUCT_TYPES.NONE;
    this.lastUpdate = Date.now();
  }

  static fromJson(json) {
    let product = new Product();
    for (let key in json) {
      product[key] = json[key];
    }
    return product;
  }

  format() {
    this.variantCount = Number(this.variantCount);
    this.variantMemory = toNumArray(this.variantMemory);
    this.variantStorage = toNumArray(this.variantStorage);
    this.variantPrice = toNumArray(this.variantPrice);
    this.screenWidth = Number(this.screenWidth);
    this.screenHeight = Number(this.screenHeight);
    this.screenSize = Number(this.screenSize);
    this.refreshRate = Number(this.refreshRate);
    this.phoneWidth = Number(this.phoneWidth);
    this.phoneHeight = Number(this.phoneHeight);
    this.phoneDepth = Number(this.phoneDepth);
    this.weight = Number(this.weight);
    this.coresNumber = Number(this.coresNumber);
    this.publishedAt = new Date(this.publishedAt).getTime();
  }

  data() {
    this.format();
    return JSON.parse(JSON.stringify(this));
  }
}

export class Phone extends Product {
  constructor() {
    super();
    this.productType = PRODUCT_TYPES.PHONE;
  }
}

export class Accessory extends Product {
  constructor() {
    super();
    this.productType = PRODUCT_TYPES.ACCESSORY;
  }
}
