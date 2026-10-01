import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthRolesService {
  roles: string[] = [];

  constructor(private authService: MsalService) {}

  async cargarRoles(): Promise<void> {
    const account = this.authService.instance.getActiveAccount();
    if (!account) { this.roles = []; return; }

    try {
      const result = await this.authService.instance.acquireTokenSilent({
        account,
        scopes: [environment.apiScope]
      });
      this.roles = this.decodeRoles(result.accessToken);
    } catch {
      this.roles = [];
    }
  }

  tiene(rol: string): boolean {
    return this.roles.includes(rol);
  }

  private decodeRoles(token: string): string[] {
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const claims = JSON.parse(decodeURIComponent(escape(json)));
      return claims.roles || [];
    } catch {
      return [];
    }
  }
}