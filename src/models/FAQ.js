export const FAQCategory = {
    GENERAL: "General",
    PRODUCT_FAQ: "Product",
    ACCOUNT: "Account",
    PAYMENT: "Payment",
    SECURITY: "Security",
    PRIVACY: "Privacy",
    PHONE: "Phone",
    ACCESSORY: "Accessory",
    OTHER: "Other"
}

export class FAQ {
    constructor(){
        this.id = "";
        this.title = "";
        this.question = "";
        this.answer = "";
        this.category = FAQCategory.GENERAL;
        this.lastUpdate = Date.now();
    }

    data(){
        return JSON.parse(JSON.stringify(this));
    }
}