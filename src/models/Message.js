export class Message {
  constructor() {
    this.message = "";
    this.sendTime = Date.now();
    this.sender = "";
    this.senderId = "";
    this.isFromStaff = false;
    this.isReadBy = [];
  }

  data() {
    return JSON.parse(JSON.stringify(this));
  }

  static quickMsg(user, content) {
    if (user) {
      const message = new Message();
      message.message = content;
      message.sender = user.displayName;
      message.senderId = user.id;
      message.sendTime = Date.now();
      return message.data();
    } else {
      const message = new Message();
      message.message = content;
      message.sender = "Guest";
      message.senderId = "";
      message.sendTime = Date.now();
      return message.data();
    }
  }

  static quickStaffMsg(content, staffId="") {
    const message = new Message();
    message.message = content;
    message.sender = "Staff";
    message.senderId = staffId;
    message.sendTime = Date.now();
    message.isFromStaff = true;
    return message.data();
  }
}
