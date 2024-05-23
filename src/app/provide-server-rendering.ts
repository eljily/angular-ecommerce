import { Provider } from '@angular/core';

function provideServerRendering(): Provider {
  return {
    provide: 'SERVER_RENDERING', // Vous pouvez ajuster le nom du fournisseur selon vos besoins
    useValue: null // Vous pouvez également fournir une valeur si nécessaire
  };
}

export { provideServerRendering };
