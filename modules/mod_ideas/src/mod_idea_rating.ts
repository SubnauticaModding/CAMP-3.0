export default class ModIdeaRating {
  public disabled: boolean = false;
  public disabledBy: string = "";

  public likes: string[] = [];
  public dislikes: string[] = [];

  public preventDeletion: boolean = false;
  public pendingDeletionStart?: number;
}