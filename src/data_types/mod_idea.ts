import ModIdeaStatus from "./mod_idea_status";

export default class ModIdea {
  id: number;
  text: string;
  author: string;
  image?: string;

  status: ModIdeaStatus = ModIdeaStatus.None;
  edited: boolean = false;
  comment: string = "";

  linkedBy: ModIdea[] = [];

  public constructor(id: number, text: string, author: string, image?: string) {
    this.id = id;
    this.text = text;
    this.author = author;
    this.image = image;
  }
}