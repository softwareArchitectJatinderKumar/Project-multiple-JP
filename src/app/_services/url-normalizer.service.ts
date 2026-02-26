import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

 
@Injectable({
  providedIn: 'root'
})
export class UrlNormalizerService {
  // Configure your preferred domain format here
  // Use 'www' if you want to force www, or '' for non-www
  private readonly preferredDomain: string = ''; // Empty string for non-www (lpu.in)
  private readonly currentDomain = 'lpu.in';

  constructor(private router: Router) {
    this.normalizeUrlOnStartup();
    this.listenToNavigationEvents();
  }

  /**
   * Normalize URL on app startup to prevent initial mismatch
   */
  private normalizeUrlOnStartup(): void {
    const currentUrl = window.location.href;
    const currentOrigin = window.location.origin;

    // Check if we need to redirect (www vs non-www mismatch)
    if (this.needsUrlNormalization(currentOrigin)) {
      // Replace the URL without triggering a full page reload
      const normalizedUrl = this.getNormalizedUrl(currentUrl);
      history.replaceState(null, '', normalizedUrl);
    }
  }

  /**
   * Listen to Angular navigation events to ensure URL consistency
   */
  private listenToNavigationEvents(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      // After each navigation, ensure the URL is consistent
      this.ensureUrlConsistency(event.urlAfterRedirects);
    });
  }

  /**
   * Check if the current URL needs normalization
   */
  private needsUrlNormalization(origin: string): boolean {
    // Check if we're on www.lpu.in but want non-www (or vice versa)
    const isWwwDomain = origin.includes('www.lpu.in');
    const wantsWww = this.preferredDomain === 'www';

    return (isWwwDomain && !wantsWww) || (!isWwwDomain && wantsWww);
  }

  /**
   * Get the normalized URL
   */
  private getNormalizedUrl(url: string): string {
    let normalized = url;

    // Replace www.lpu.in with lpu.in (or vice versa based on preference)
    if (this.preferredDomain === '') {
      // Remove www
      normalized = url.replace('https://www.lpu.in', 'https://lpu.in');
    } else {
      // Add www
      normalized = url.replace('https://lpu.in', 'https://www.lpu.in');
    }

    return normalized;
  }

  /**
   * Ensure URL consistency after navigation
   */
  private ensureUrlConsistency(url: string): void {
    const fullUrl = window.location.origin + url;
    
    if (this.needsUrlNormalization(window.location.origin)) {
      const normalizedUrl = this.getNormalizedUrl(fullUrl);
      try {
        history.replaceState(null, '', normalizedUrl);
      } catch (error) {
        // Silently handle the error - the navigation still works
        console.warn('URL normalization skipped:', error);
      }
    }
  }

  /**
   * Helper method to get safe URL for history operations
   * Use this method instead of directly using window.location.href
   */
  public getSafeUrl(url: string): string {
    // Ensure the URL uses the current domain
    return this.getNormalizedUrl(url);
  }
}
