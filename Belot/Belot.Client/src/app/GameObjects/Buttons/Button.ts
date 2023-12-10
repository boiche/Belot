import BelotGameObject from "../BelotGameObject";

export default abstract class Button extends BelotGameObject {
  public abstract click(): void;
}
