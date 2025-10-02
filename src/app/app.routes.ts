import { Routes } from '@angular/router';
import { CCadastroComponent } from './_pages/c-cadastro/c-cadastro.component';
import { CLoginComponent } from './_pages/c-login/c-login.component';
import { CPainelclienteComponent } from './_pages/c-painelcliente/c-painelcliente.component';
import { CMeuscontratosComponent } from './_pages/c-meuscontratos/c-meuscontratos.component';
import { CPaineladminComponent } from './_pages/c-paineladmin/c-paineladmin.component';
import { CBemvindoComponent } from './_pages/c-bemvindo/c-bemvindo.component';
import { CConsultarComponent } from './_pages/c-consultar/c-consultar.component';
import { CSimulacaoComponent } from './_pages/c-simulacao/c-simulacao.component';
import { CSolicitacaoComponent } from './_pages/c-solicitacao/c-solicitacao.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'cadastro', component: CCadastroComponent},
    {path: 'login', component: CLoginComponent},
    {path: 'painelcliente',component: CPainelclienteComponent},
    {path: 'meuscontratos', component: CMeuscontratosComponent},
    {path: 'painel', component: CPaineladminComponent},
    {path: 'bemvindo', component: CBemvindoComponent},
    {path: 'consultar', component: CConsultarComponent},
    {path: 'simulacao', component: CSimulacaoComponent},
    {path: 'solicitacao', component: CSolicitacaoComponent}
];
