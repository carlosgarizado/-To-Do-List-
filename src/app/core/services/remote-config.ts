import { Injectable, inject } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getValue } from '@angular/fire/remote-config';


@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private rc: RemoteConfig;

  constructor() {
    this.rc = inject(RemoteConfig);
  }

  async getFeatureFlag(flagName: string): Promise<boolean> {
    try {
      await fetchAndActivate(this.rc); 
      return getValue(this.rc, flagName).asBoolean();
    } catch (error) {
      console.error('Error Remote Config:', error);
      return false;
    }
  }

  async isCategoryVisible(): Promise<boolean> {
    return this.getFeatureFlag('showCategory');
  }
}
