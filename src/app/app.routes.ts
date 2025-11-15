import { Routes } from '@angular/router';

import { CLoginComponent } from './lado-cliente/c-login/c-login.component';
import { CCadastroComponent } from './lado-cliente/c-cadastro/c-cadastro.component';


import { CBemvindoComponent } from './lado-cliente/c-bemvindo/c-bemvindo.component';
import { CMeuscontratosComponent } from './lado-cliente/c-meuscontratos/c-meuscontratos.component';
import { CVisualizarContratosComponent } from './lado-cliente/c-visualizar-contratos/c-visualizar-contratos.component';
import { CSimulacaoComponent } from './lado-cliente/c-simulacao/c-simulacao.component';
import { CSolicitacaoComponent } from './lado-cliente/c-solicitacao/c-solicitacao.component';
import { CPainelclienteComponent } from './lado-cliente/c-painelcliente/c-painelcliente.component';
import { CContratosComponent } from './lado-admin/c-contratos/c-contratos.component';
import { CPaineladminComponent } from './lado-admin/c-paineladmin/c-paineladmin.component';
import { SolicitacaoDetalheComponent } from './lado-admin/solicitacao-detalhe/solicitacao-detalhe.component';
import { DetalheContratoComponent } from './lado-admin/detalhe-contrato/detalhe-contrato.component';
import { CDashboardAdminComponent } from './lado-admin/c-dashboard-admin/c-dashboard-admin.component';

// Guards
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { clienteGuard } from './guards/cliente.guard';

export const routes: Routes = [
  // Redireciona raiz para login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: CLoginComponent },
  { path: 'cadastro', component: CCadastroComponent },
  { path: 'inicio-admin', component: CDashboardAdminComponent, canActivate: [adminGuard] },
  { path: 'paineladmin', component: CPaineladminComponent, canActivate: [adminGuard]},
  { path: 'paineladmin/solicitacao/:id', component: SolicitacaoDetalheComponent, canActivate: [adminGuard]},
  { path: 'admin/contratos', component: CContratosComponent, canActivate: [adminGuard]},
  { path: 'admin/contratos/:id', component: DetalheContratoComponent, canActivate: [adminGuard]},
  { path: 'inicio', component: CBemvindoComponent, canActivate: [authGuard]},
  { path: 'contratos', component: CMeuscontratosComponent, canActivate: [clienteGuard]},
  { path: 'meuscontratos', component: CMeuscontratosComponent, canActivate: [clienteGuard]},
  { path: 'meuscontratos/:id', component: CVisualizarContratosComponent, canActivate: [clienteGuard]},
  { path: 'painelcliente', component: CPainelclienteComponent, canActivate: [clienteGuard],
    children: [
      { path: 'simulacao', component: CSimulacaoComponent },
      { path: 'solicitacao', component: CSolicitacaoComponent },
    ]
  },
  { path: '**', redirectTo: 'login' },
];
