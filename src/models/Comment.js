export class Comment {
  constructor() {
    this.id = "";
    this.author = "";
    this.createdAt = Date.now();
    this.content = "";
    this.attachedImages = [];
    this.attachedGifs = [];
    this.likes = [];
    this.dislikes = [];
    this.replies = [];
    this.lastModifiedAt = Date.now();
  }

  data() {
    return JSON.parse(JSON.stringify(this));
  }
}
