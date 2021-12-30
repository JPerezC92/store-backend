import { StringValueObject } from './StringValueObject';

export class Identifier extends StringValueObject {
  private constructor(readonly value: string) {
    super(value);
  }

  public static create(props: { value: string }): Identifier {
    return new Identifier(props.value);
  }
}
