// link: https://docs.google.com/spreadsheets/d/156ZhsFAVjD1MJdgOQWm85diH0xkKXNfwqd60cg1U1Bo/edit#gid=1150565208
export class Review{
    constructor(){
        this.id = "";
        this.userId = "";
        this.productId = "";
        this.content = "";
        this.ratingId = "";
        this.score = 0;
        this.boughtProduct = false;
        this.isReviewFromStaff = false;
        this.isDeleted = false;
        this.helpful = 0;
        this.notHelpful = 0;
        this.attachedImageUrls = [];
        this.productOpinions = [];
        this.lastUpdate = Date.now();
    }

    data(){
        this.score = Number(this.score);
        return JSON.parse(JSON.stringify(this));
    }
}