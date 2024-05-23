import { Provider } from '@angular/core';

export function provideAnimationsAsync(): Provider {
  return {
    provide: 'ANIMATIONS_ASYNC',
    useValue: null
  };
}
