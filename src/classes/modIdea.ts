import { IdeaStatus } from "../enums/ideaStatus";
import { getNextID } from "../modIdeas";
import { IdeaRating } from "./ideaRating";
import { IdeaUpdate } from "./ideaUpdate";

export class ModIdea {
  public id: number = getNextID();
  public text?: string;
  public author: string = "";
  public image?: string;
  public time: number | Date = Date.now();
  public rating: IdeaRating = new IdeaRating();
  public status: IdeaStatus = IdeaStatus.None;
  public updates: IdeaUpdate[] = [];
}
