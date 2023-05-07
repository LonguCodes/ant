import { IDomainEvent } from './domain-event.interface';

export abstract class DomainEventRoot {
  private domainEvents: IDomainEvent[] = [];

  get events(): readonly IDomainEvent[] {
    return this.domainEvents;
  }

  addDomainEvent(event: IDomainEvent) {
    this.domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this.domainEvents.length = 0;
  }
}
