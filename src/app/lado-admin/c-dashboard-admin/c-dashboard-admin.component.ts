import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, DashboardMetricas } from '../../services/admin.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-c-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastModule, ProgressSpinnerModule],
  providers: [MessageService],
  templateUrl: './c-dashboard-admin.component.html',
  styleUrl: './c-dashboard-admin.component.scss'
})
export class CDashboardAdminComponent implements OnInit {
  metricas: DashboardMetricas | null = null;
  carregando = true;

  constructor(
    private adminService: AdminService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarMetricas();
  }

  carregarMetricas(): void {
    this.carregando = true;
    this.adminService.obterMetricasDashboard().subscribe({
      next: (data) => {
        this.metricas = data;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar métricas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar as métricas do dashboard.'
        });
        this.carregando = false;
      }
    });
  }
}

