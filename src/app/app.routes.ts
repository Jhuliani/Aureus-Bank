import { Routes } from '@angular/router';

// Páginas "públicas" (sem sidebar)
import { CLoginComponent } from './_pages/c-login/c-login.component';
import { CCadastroComponent } from './_pages/c-cadastro/c-cadastro.component';

// Páginas "internas" (com sidebar)
import { CBemvindoComponent } from './_pages/c-bemvindo/c-bemvindo.component';
import { CMeuscontratosComponent } from './_pages/c-meuscontratos/c-meuscontratos.component';
import { CPaineladminComponent } from './_pages/c-paineladmin/c-paineladmin.component';
import { CConsultarComponent } from './_pages/c-consultar/c-consultar.component';
import { CSimulacaoComponent } from './_pages/_simulacao/c-simulacao/c-simulacao.component';
import { CSolicitacaoComponent } from './_pages/_solicitacao/c-solicitacao/c-solicitacao.component';
import { CPainelclienteComponent } from './_pages/c-painelcliente/c-painelcliente.component';
import { CSettingsComponent } from './_pages/c-settings/c-settings.component';

export const routes: Routes = [
  // Redireciona raiz para login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rotas públicas (fora do layout principal)
  { path: 'login', component: CLoginComponent },
  { path: 'cadastro', component: CCadastroComponent },

  // Rotas internas (usadas pelo layout global já presente no AppComponent)
  { path: 'inicio', component: CBemvindoComponent },
  { path: 'contratos', component: CMeuscontratosComponent },
  { path: 'painelcliente', component: CPainelclienteComponent },
  { path: 'painel', component: CPaineladminComponent },
  { path: 'consultar', component: CConsultarComponent },
  { path: 'simulacao', component: CSimulacaoComponent },
  { path: 'solicitacao', component: CSolicitacaoComponent },
  { path: 'settings', component: CSettingsComponent },

  // Rota curinga (404 opcional)
  { path: '**', redirectTo: 'login' },
];
