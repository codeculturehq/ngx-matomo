import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Access to the global window variable.
 */
declare var window: {
  [key: string]: any;
  prototype: Window;
  new (): Window;
};

/**
 * Service for injecting the Matomo tracker in the application.
 *
 * @export
 */
@Injectable()
export class MatomoInjector {
  /**
   * Creates an instance of MatomoInjector.
   *
   * @param platformId Angular description of the platform.
   */
  constructor(@Inject(PLATFORM_ID) private platformId) {
    if (isPlatformBrowser(this.platformId)) {
      window._mtm = window._mtm || [];
    } else {
      console.warn('MatomoInjector can\'t be used on server platform');
    }
  }

  /**
   * Injects the Matomo tracker in the DOM.
   *
   * @param url URL of the Matomo instance to connect to.
   */
  init(url: string, customProperties?: Array<{}>) {
    if (isPlatformBrowser(this.platformId)) {
      (() => {
        const d = document;
        // check for existing script
        if (d.getElementById('ngx-matomo') !== null) {
          return;
        }

        const u = url;
        window._mtm.push({
          'mtm.startTime': (new Date().getTime()),
          event: 'mtm.Start'
        });
        if (customProperties) {
          window._mtm.push(...customProperties);
        }



        const g = d.createElement('script');
        const s = d.getElementsByTagName('script')[0];
        g.type = 'text/javascript';
        g.async = true;
        g.id = 'ngx-matomo';
        g.src = u;
        s.parentNode.insertBefore(g, s);
      })();
    }
  }
}
