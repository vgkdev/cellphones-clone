export class Cart{
    constructor(){
        this.id="";
        this.userId = "";
        this.products = [];
        this.productsQuantity = [];
        this.accessories = [];
        this.accessoriesQuantity = [];
        this.stockIds = [];
    }

    data(){
        return JSON.parse(JSON.stringify(this));
    }
}