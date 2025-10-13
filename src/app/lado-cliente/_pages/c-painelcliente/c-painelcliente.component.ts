import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-c-painelcliente',
  standalone: true,
  imports: [ButtonModule,
    TabMenuModule,
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './c-painelcliente.component.html',
  styleUrls: ['./c-painelcliente.component.scss'],
})


export class CPainelclienteComponent implements OnInit {
    showBreadcrumb = false;
    hasChildRoute = false;
    currentPage = '';

    constructor(private router: Router) {}

    ngOnInit() {
        // Monitora mudanças de rota para controlar breadcrumb
        this.router.events
            .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe((event) => {
                this.updateBreadcrumb(event.url);
            });

        // Verifica rota inicial
        this.updateBreadcrumb(this.router.url);
    }

    private updateBreadcrumb(url: string) {
        if (url.includes('/painelcliente/simulacao')) {
            this.showBreadcrumb = true;
            this.hasChildRoute = true;
            this.currentPage = 'Simulação';
        } else if (url.includes('/painelcliente/solicitacao')) {
            this.showBreadcrumb = true;
            this.hasChildRoute = true;
            this.currentPage = 'Solicitação';
        } else if (url === '/painelcliente') {
            this.showBreadcrumb = false;
            this.hasChildRoute = false;
            this.currentPage = '';
        }
    }
}
