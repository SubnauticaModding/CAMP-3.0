import ModIdeaStatus from "./mod_idea_status";
import ModIdeaRating from "./mod_idea_rating";

export default class ModIdea {
  id: number;
  text: string;
  author: string;
  time: number;
  image?: string;

  message?: string;
  status: ModIdeaStatus = ModIdeaStatus.None;
  edited: boolean = false;
  comment: string = "";
  rating: ModIdeaRating = new ModIdeaRating();

  linkedBy: ModIdea[] = [];

  public constructor(id: number, text: string, author: string, image?: string) {
    this.id = id;
    this.text = text;
    this.author = author;
    this.image = image;

    this.time = Date.now();
  }
}