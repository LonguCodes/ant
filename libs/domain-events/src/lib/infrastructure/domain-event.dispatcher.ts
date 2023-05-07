import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

import {
  DomainEventRoot,
  IDomainEvent,
  IDomainEventDispatcher,
  IDomainEventHandler,
} from '../abstractions';
import {
  DOMAIN_EVENT_HANDLER_METADATA,
  DOMAIN_EVENT_METADATA,
} from './decorators';

import { Constructor } from '@nestjs/cqrs';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class DomainEventDispatcher
  implements
    IDomainEventDispatcher,
    OnApplicationBootstrap,
    OnApplicationShutdown
{
  private readonly eventEmitter = new EventEmitter2();

  constructor(private readonly discoveryService: DiscoveryService) {}

  async commit(aggregate: DomainEventRoot): Promise<void> {
    const eventsToProcess = [...aggregate.events];
    aggregate.clearDomainEvents();
    for (const event of eventsToProcess) {
      const eventId = this.getEventIdFromInstance(event);

      if (!eventId) {
        continue;
      }

      await this.eventEmitter.emitAsync(eventId, event);
    }
  }
  async commitMany(aggregates: DomainEventRoot[]): Promise<void> {
    await Promise.all(aggregates.map((aggregate) => this.commit(aggregate)));
  }

  onApplicationBootstrap(): any {
    this.loadSubscribers();
  }

  onApplicationShutdown(): any {
    this.removeSubscribers();
  }

  private loadSubscribers() {
    const providers = this.discoveryService.getProviders();
    try {
      providers
        .filter(
          ({ instance }: InstanceWrapper) =>
            instance && this.getHandledEvent(instance)
        )
        .forEach(({ instance }: InstanceWrapper<IDomainEventHandler<any>>) => {
          const event = this.getHandledEvent(instance);
          const eventId = this.getEventId(event);
          this.eventEmitter.on(eventId, (event) => instance.handle(event));
        });
    } catch (error) {
      Logger.error(error, 'Domain Events');
    }
  }

  private removeSubscribers() {
    this.eventEmitter.removeAllListeners();
  }

  private getEventIdFromInstance(event: IDomainEvent): string {
    const { constructor } = Object.getPrototypeOf(event);
    return this.getEventId(constructor);
  }
  private getEventId(constructor: Constructor<IDomainEvent>): string {
    try {
      return Reflect.getMetadata(DOMAIN_EVENT_METADATA, constructor);
    } catch (e) {
      Logger.error(e, 'Domain events');
    }
  }

  private getHandledEvent(
    eventHandler: IDomainEventHandler<any>
  ): Constructor<IDomainEvent> {
    try {
      const { constructor } = Object.getPrototypeOf(eventHandler);
      return Reflect.getMetadata(DOMAIN_EVENT_HANDLER_METADATA, constructor);
    } catch (e) {
      Logger.error(e, 'Domain events');
    }
  }
}
