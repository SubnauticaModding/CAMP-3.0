import { UpdateType } from "../enums/updateType";

export class IdeaUpdate {
  public type: UpdateType = UpdateType.Comment;
  public comment: string = "";
  public by: string = "";
}
