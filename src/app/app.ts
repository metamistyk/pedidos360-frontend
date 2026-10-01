import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthRolesService } from './auth-roles.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  user: AccountInfo | null = null;
  private readonly destroying$ = new Subject<void>();

  constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private cdr: ChangeDetectorRef,
    public authRoles: AuthRolesService
  ) {}

  ngOnInit(): void {
    this.authService.handleRedirectObservable({ navigateToLoginRequestUrl: false }).subscribe({
      next: (result: AuthenticationResult | null) => {
        if (result?.account) {
          this.authService.instance.setActiveAccount(result.account);
        }
      },
      error: (error) => console.error('Error MSAL:', error)
    });

    this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this.destroying$)
    ).subscribe(() => {
      this.actualizarUsuario();
    });
  }

  private actualizarUsuario(): void {
    let activeAccount = this.authService.instance.getActiveAccount();
    const accounts = this.authService.instance.getAllAccounts();

    if (!activeAccount && accounts.length > 0) {
      activeAccount = accounts[0];
      this.authService.instance.setActiveAccount(activeAccount);
    }

    this.user = activeAccount ?? null;

    if (this.user) {
      this.authRoles.cargarRoles().then(() => this.cdr.markForCheck());
    }

    this.cdr.markForCheck();
  }

  login(): void {
    this.authService.loginRedirect({ scopes: ['openid', 'profile'] });
  }

  logout(): void {
    this.authService.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }
}