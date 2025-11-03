import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { importProvidersFrom } from '@angular/core';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    importProvidersFrom(IonicStorageModule.forRoot()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideRemoteConfig(() => {
      const rc = getRemoteConfig(initializeApp(environment.firebase));
      rc.settings.minimumFetchIntervalMillis = 1000; 
      rc.defaultConfig = environment.remoteConfigDefaults;
      return rc;
    })
  ],
});
