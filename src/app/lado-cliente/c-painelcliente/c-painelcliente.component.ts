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
    mostrarBreadcrumb = false;
    temRotaFilha = false;
    paginaAtual = '';

    constructor(private router: Router) {}

    ngOnInit() {
        // Monitora mudanças de rota para controlar breadcrumb
        this.router.events
            .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe((event) => {
                this.atualizarBreadcrumb(event.url);
            });

        this.atualizarBreadcrumb(this.router.url);
    }

    private atualizarBreadcrumb(url: string) {
        if (url.includes('/painelcliente/simulacao')) {
            this.mostrarBreadcrumb = true;
            this.temRotaFilha = true;
            this.paginaAtual = 'Simulação';
        } else if (url.includes('/painelcliente/solicitacao')) {
            this.mostrarBreadcrumb = true;
            this.temRotaFilha = true;
            this.paginaAtual = 'Solicitação';
        } else if (url === '/painelcliente') {
            this.mostrarBreadcrumb = false;
            this.temRotaFilha = false;
            this.paginaAtual = '';
        }
    }
}
