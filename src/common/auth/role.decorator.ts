import { Role } from './role.enum';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from './role.guard';

export function UseRole(...roles: Role[]): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    SetMetadata('roles', roles)(target, propertyKey, descriptor); // Attach roles as metadata
    UseGuards(AuthGuard)(target, propertyKey, descriptor); // Apply AuthGuard
  };
}
