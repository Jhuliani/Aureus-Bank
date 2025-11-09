import { Routes } from '@angular/router';

// Páginas "públicas" (sem sidebar)
import { CLoginComponent } from './lado-cliente/_pages/c-login/c-login.component';
import { CCadastroComponent } from './lado-cliente/_pages/c-cadastro/c-cadastro.component';

// Páginas "internas" (com sidebar)
import { CBemvindoComponent } from './lado-admin/c-bemvindo/c-bemvindo.component';
import { CMeuscontratosComponent } from './lado-cliente/_pages/c-meuscontratos/c-meuscontratos.component';
import { CVisualizarContratosComponent } from './lado-cliente/_pages/c-visualizar-contratos/c-visualizar-contratos.component';
import { CSimulacaoComponent } from './lado-cliente/_pages/_simulacao/c-simulacao/c-simulacao.component';
import { CSolicitacaoComponent } from './lado-cliente/_pages/_solicitacao/c-solicitacao/c-solicitacao.component';
import { CPainelclienteComponent } from './lado-cliente/_pages/c-painelcliente/c-painelcliente.component';
import { CSettingsComponent } from './lado-cliente/_pages/c-settings/c-settings.component';
import { CConsultaComponent } from './lado-admin/c-consulta/c-consulta.component';
import { CContratosComponent } from './lado-admin/c-contratos/c-contratos.component';
import { CPaineladminComponent } from './lado-admin/c-paineladmin/c-paineladmin.component';

// Guards
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { clienteGuard } from './guards/cliente.guard';

export const routes: Routes = [
  // Redireciona raiz para login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rotas públicas (fora do layout principal) - sem guard
  { path: 'login', component: CLoginComponent },
  { path: 'cadastro', component: CCadastroComponent },

  // Rotas para o lado do admin - requerem autenticação e perfil admin
  { 
    path: 'bemvindo', 
    component: CBemvindoComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'paineladmin', 
    component: CPaineladminComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'consulta-contratos', component: CConsultaComponent},
      { path: 'contratos-cliente', component: CContratosComponent},
    ]
  },

  // Rota interna compartilhada - requer apenas autenticação
  { 
    path: 'inicio', 
    component: CBemvindoComponent,
    canActivate: [authGuard]
  },

  // Rotas do cliente - requerem autenticação e perfil cliente
  { 
    path: 'contratos', 
    component: CMeuscontratosComponent,
    canActivate: [clienteGuard]
  },
  { 
    path: 'meuscontratos', 
    component: CMeuscontratosComponent,
    canActivate: [clienteGuard]
  },
  { 
    path: 'meuscontratos/:id', 
    component: CVisualizarContratosComponent,
    canActivate: [clienteGuard]
  },
  {
    path: 'painelcliente', 
    component: CPainelclienteComponent,
    canActivate: [clienteGuard],
    children: [
      { path: 'simulacao', component: CSimulacaoComponent },
      { path: 'solicitacao', component: CSolicitacaoComponent },
    ]
  },
  { 
    path: 'simulacao', 
    redirectTo: 'painelcliente/simulacao'
  },
  { 
    path: 'solicitacao', 
    redirectTo: 'painelcliente/solicitacao'
  },
  { 
    path: 'settings', 
    component: CSettingsComponent,
    canActivate: [clienteGuard]
  },

  // Rota curinga (404 opcional)
  { path: '**', redirectTo: 'login' },
];
