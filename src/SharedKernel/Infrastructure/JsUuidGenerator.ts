import { v4 as uuidv4 } from 'uuid';
import { UuidGenerator } from '../Domain/UuidGenerator';

export class JsUuidGenerator implements UuidGenerator {
  generate(): string {
    return uuidv4();
  }
}
