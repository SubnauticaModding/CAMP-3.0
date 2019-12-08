export class IdeaRating {
  public likes: number = 0;
  public dislikes: number = 0;
  public get rating() {
    return this.likes - this.dislikes;
  }
}
