import { IDomainEvent } from './domain-event.interface';

export interface IDomainEventHandler<TEvent extends IDomainEvent> {
  handle(event: TEvent): Promise<void>;
}
