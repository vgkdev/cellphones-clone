export const PostStatus = {
    IS_VERIFIED: "Verified",
    IS_PENDING: "Pending",
    IS_REJECTED: "Rejected"
};

export const PostCategory = {
    NEWS: "News",
    BLOG: "Blog",
    EVENT: "Event",
    PROMOTION: "Promotion",
    PHONE_OVERVIEW: "Phone Overview",
    PHONE: "Phone",
    ACCESSORY: "Accessory",
    OTHER: "Other"
};

export class Post {
    constructor(){
        this.id="";
        this.title = "";
        this.description = "";
        this.content = "";
        this.publishedAt = "";
        this.author = "";
        this.category = PostCategory.OTHER;
        this.status = PostStatus.IS_PENDING;
        this.imageNames = [];
        this.imageUrls = [];
        this.comments = [];
        this.lastUpdate = "";
    }

    data(){
        return JSON.parse(JSON.stringify(this));
    }
}