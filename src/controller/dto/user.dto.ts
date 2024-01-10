export class UserDto {
  _id: string;
  username: string;
  userNo: Number;

  constructor(userDocument: any) {
    this._id = userDocument._id;
    this.username = userDocument.username;
    this.userNo = userDocument.userNo;
  }
}