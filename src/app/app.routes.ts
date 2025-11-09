import { Routes } from '@angular/router';

// Páginas "públicas" (sem sidebar)
import { CLoginComponent } from './lado-cliente/_pages/c-login/c-login.component';
import { CCadastroComponent } from './lado-cliente/_pages/c-cadastro/c-cadastro.component';

// Páginas "internas" (com sidebar)
import { CBemvindoComponent } from './lado-admin/c-bemvindo/c-bemvindo.component';
import { CMeuscontratosComponent } from './lado-cliente/_pages/c-meuscontratos/c-meuscontratos.component';
import { CSimulacaoComponent } from './lado-cliente/_pages/_simulacao/c-simulacao/c-simulacao.component';
import { CSolicitacaoComponent } from './lado-cliente/_pages/_solicitacao/c-solicitacao/c-solicitacao.component';
import { CPainelclienteComponent } from './lado-cliente/_pages/c-painelcliente/c-painelcliente.component';
import { CSettingsComponent } from './lado-cliente/_pages/c-settings/c-settings.component';
import { CConsultaComponent } from './lado-admin/c-consulta/c-consulta.component';
import { CContratosComponent } from './lado-admin/c-contratos/c-contratos.component';
import { CPaineladminComponent } from './lado-admin/c-paineladmin/c-paineladmin.component';

export const routes: Routes = [
  // Redireciona raiz para login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rotas públicas (fora do layout principal)
  { path: 'login', component: CLoginComponent },
  { path: 'cadastro', component: CCadastroComponent },

  // Rotas para o lado do admin
  { path: 'bemvindo', component: CBemvindoComponent},
  { path: 'paineladmin', component: CPaineladminComponent,
    children: [
      { path: 'consulta-contratos', component: CConsultaComponent},
      { path: 'contratos-cliente', component: CContratosComponent},
    ]
  },

  // Rotas internas (usadas pelo layout global já presente no AppComponent)
  { path: 'inicio', component: CBemvindoComponent },
  { path: 'contratos', component: CMeuscontratosComponent },
  { path: 'meuscontratos', component: CMeuscontratosComponent }, // Rota direta para meus contratos
  {
    path: 'painelcliente', component: CPainelclienteComponent,
    children: [
      { path: 'simulacao', component: CSimulacaoComponent },
      { path: 'solicitacao', component: CSolicitacaoComponent },
    ]
  },
  { path: 'simulacao', redirectTo: 'painelcliente/simulacao' },
  { path: 'solicitacao', redirectTo: 'painelcliente/solicitacao' },
  { path: 'settings', component: CSettingsComponent },



  // Rota curinga (404 opcional)
  { path: '**', redirectTo: 'login' },
];
