import { DomainEventRoot } from './domain-event-root';

export const DOMAIN_EVENTS_DISPATCHER = Symbol('IDomainEventDispatcher');

export interface IDomainEventDispatcher {
  commit(aggregate: DomainEventRoot): Promise<void>;
  commitMany(aggregates: DomainEventRoot[]): Promise<void>;
}
