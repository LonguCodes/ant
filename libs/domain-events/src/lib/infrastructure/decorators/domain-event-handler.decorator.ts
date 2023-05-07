import { v4 } from 'uuid';

import { IDomainEvent } from '../../abstractions';
import {
  DOMAIN_EVENT_HANDLER_METADATA,
  DOMAIN_EVENT_METADATA,
} from './constants';
import { applyDecorators, Injectable, Type } from '@nestjs/common';

export const DomainEventHandler = <T extends IDomainEvent>(
  event: Type<IDomainEvent>
): ClassDecorator => {
  return applyDecorators((target: object) => {
    if (!Reflect.hasOwnMetadata(DOMAIN_EVENT_METADATA, event)) {
      Reflect.defineMetadata(DOMAIN_EVENT_METADATA, v4(), event);
    }
    Reflect.defineMetadata(DOMAIN_EVENT_HANDLER_METADATA, event, target);
  }, Injectable());
};
