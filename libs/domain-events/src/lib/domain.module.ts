import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { DOMAIN_EVENTS_DISPATCHER } from './abstractions';
import { DomainEventDispatcher } from './infrastructure/domain-event.dispatcher';

@Module({
  imports: [DiscoveryModule],
  providers: [
    {
      provide: DOMAIN_EVENTS_DISPATCHER,
      useClass: DomainEventDispatcher,
    },
  ],
  exports: [DOMAIN_EVENTS_DISPATCHER],
})
export class DomainModule {}
