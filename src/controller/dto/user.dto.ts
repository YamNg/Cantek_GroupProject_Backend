export class UserDto {
  userId: string;
  username: string;
  userNo: Number;

  constructor(userDocument: any) {
    this.userId = userDocument._id;
    this.username = userDocument.username;
    this.userNo = userDocument.userNo;
  }
}