import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { Anos, InformacoesFipe, Marcas, ModelosResponse } from '../../_models/fipe.models';
import { FipeService } from '../../services/fipe.service';
import { SimulacaoService } from '../../services/simulacao.service';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-c-solicitacao',
  standalone: true,
  imports: [
    DropdownModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProgressSpinnerModule,
    MessagesModule,
    CardModule,
    ButtonModule,
    RippleModule,
    InputNumberModule,
    TooltipModule,
    InputTextModule,
    ToastModule
  ],
  templateUrl: './c-solicitacao.component.html',
  styleUrl: './c-solicitacao.component.scss'
})
export class CSolicitacaoComponent implements OnInit {

  listaMarcas: SelectItem[] = [];
  listaModelos: SelectItem[] = [];
  listaAnos: SelectItem[] = [];

  listaTiposVeiculo: SelectItem[] = [
    { label: 'Carros', value: 'carros' },
    { label: 'Motos', value: 'motos' },
    { label: 'Caminhões', value: 'caminhoes' }
  ];

  tipoVeiculo: string = 'carros';
  marcaEscolhida?: string;
  modeloEscolhido?: string;
  anoEscolhido?: string;
  dadosFipe?: InformacoesFipe;

  valorEntrada: number | null = null;
  listaParcelas: SelectItem[] = [
    { label: '12x', value: 12 },
    { label: '24x', value: 24 },
    { label: '36x', value: 36 },
    { label: '48x', value: 48 },
    { label: '60x', value: 60 }
  ];
  numeroParcelas: number = 36;
  taxaJuros: number = 3.5; // Taxa padrão para 36 parcelas
  rendaMensal: number | null = null;
  resultadoSimulacao: any = null;

  formularioVeiculo!: FormGroup;

  listaCores: SelectItem[] = [
    { label: 'Branco', value: 'Branco' },
    { label: 'Preto', value: 'Preto' },
    { label: 'Prata', value: 'Prata' },
    { label: 'Cinza', value: 'Cinza' },
    { label: 'Vermelho', value: 'Vermelho' },
    { label: 'Azul', value: 'Azul' },
    { label: 'Verde', value: 'Verde' },
    { label: 'Amarelo', value: 'Amarelo' },
    { label: 'Laranja', value: 'Laranja' },
    { label: 'Marrom', value: 'Marrom' },
    { label: 'Bege', value: 'Bege' },
    { label: 'Dourado', value: 'Dourado' },
    { label: 'Roxo', value: 'Roxo' },
    { label: 'Rosa', value: 'Rosa' },
    { label: 'Outra', value: 'Outra' }
  ];

  veioDaSimulacao: boolean = false;
  carregando: boolean = false;
  enviando: boolean = false;

  constructor(
    private serviceFipe: FipeService,
    private serviceSimulacao: SimulacaoService,
    private construtorFormulario: FormBuilder,
    private roteador: Router,
    private serviceMensagem: MessageService,
    private serviceSolicitacao: SolicitacaoService,
    private serviceAuth: AuthService
  ) {
    this.criarFormulario();
  }

  ngOnInit(): void {
    // Inicializa a taxa de juros baseada no número de parcelas padrão
    this.taxaJuros = this.obterTaxaJuros(this.numeroParcelas);

    const dadosSimulacao = this.serviceSimulacao.obterDadosSimulacao();

    if (dadosSimulacao && dadosSimulacao.informacoesFipe) {
      this.preencherDadosDaSimulacao(dadosSimulacao);

      if (this.marcaEscolhida && this.modeloEscolhido) {
        this.carregarListagensParaPreenchimento();
      } else {
        console.error('Não é possível carregar listagens: dados essenciais faltando');
        this.carregando = false;
      }
    } else {
      this.carregarMarcas();
    }
  }

  private criarFormulario(): void {
    this.formularioVeiculo = this.construtorFormulario.group({
      placa: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      numChassi: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      numRenavam: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(11)]],
      cor: [null]
    });
  }

  private preencherDadosDaSimulacao(dados: any): void {

    this.veioDaSimulacao = true;
    this.tipoVeiculo = dados.tipoVeiculo || 'carros';
    this.marcaEscolhida = dados.marcaSelecionada;
    this.modeloEscolhido = dados.modeloSelecionado;
    this.anoEscolhido = dados.anoSelecionado;
    this.dadosFipe = dados.informacoesFipe;
    this.valorEntrada = dados.valorEntrada || null;
    this.numeroParcelas = dados.parcelasSelecionadas || 36;
    // Se não vier taxa nos dados, calcula baseado no número de parcelas
    this.taxaJuros = dados.taxaJuros || this.obterTaxaJuros(this.numeroParcelas);
    this.rendaMensal = dados.rendaMensal || null;
    this.resultadoSimulacao = dados.resultadoSimulacao;

    if (!this.marcaEscolhida || !this.modeloEscolhido) {
      console.error('Dados da simulação incompletos:', {
        marcaEscolhida: this.marcaEscolhida,
        modeloEscolhido: this.modeloEscolhido,
        dadosRecebidos: dados
      });
      this.mostrarErro('Dados da simulação incompletos. Por favor, faça uma nova simulação.');
      this.carregando = false;
      return;
    }

  }

  private carregarListagensParaPreenchimento(): void {
    this.carregando = true;

    this.serviceFipe.listarMarcas(this.tipoVeiculo).subscribe({
      next: (marcas: Marcas[]) => {
        this.listaMarcas = marcas.map(m => ({
          label: m.nome,
          value: m.codigo
        }));

        if (this.marcaEscolhida) {
          this.carregarModelosParaPreenchimento();
        } else {
          this.carregando = false;
        }
      },
      error: () => this.carregando = false
    });
  }

  private carregarModelosParaPreenchimento(): void {
    if (!this.marcaEscolhida) {
      this.carregando = false;
      return;
    }

    this.serviceFipe.listarModelos(this.tipoVeiculo, this.marcaEscolhida).subscribe({
      next: (resposta: ModelosResponse) => {
        if (resposta && resposta.modelos) {
          this.listaModelos = resposta.modelos.map(m => ({
            label: m.nome,
            value: m.codigo
          }));

          if (this.modeloEscolhido && this.modeloEscolhido !== 'undefined' && this.modeloEscolhido !== 'null') {
            this.carregarAnosParaPreenchimento();
          } else {
            this.carregando = false;
          }
        } else {
          this.carregando = false;
        }
      },
      error: (erro) => {
        console.error('Erro ao carregar modelos para preenchimento:', erro);
        this.carregando = false;
      }
    });
  }

  private carregarAnosParaPreenchimento(): void {
    if (!this.marcaEscolhida || !this.modeloEscolhido) {
      console.warn('Não é possível carregar anos: marca ou modelo não definido', {
        marcaEscolhida: this.marcaEscolhida,
        modeloEscolhido: this.modeloEscolhido
      });
      this.carregando = false;
      return;
    }

    if (this.modeloEscolhido === 'undefined' || this.modeloEscolhido === 'null' ||
        this.marcaEscolhida === 'undefined' || this.marcaEscolhida === 'null') {
        console.warn('Valores inválidos detectados:', {
          marcaEscolhida: this.marcaEscolhida,
          modeloEscolhido: this.modeloEscolhido
        });
        this.carregando = false;
        return;
    }


    this.serviceFipe.listarAnos(this.tipoVeiculo, this.marcaEscolhida, this.modeloEscolhido).subscribe({
      next: (anos: Anos[]) => {
        if (anos && anos.length > 0) {
          this.listaAnos = anos.map(a => ({
            label: a.nome,
            value: a.codigo
          }));
        } else {
          console.warn('Nenhum ano retornado pela API');
        }
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar anos para preenchimento:', erro);
        console.error('Parâmetros usados:', {
          tipoVeiculo: this.tipoVeiculo,
          marcaEscolhida: this.marcaEscolhida,
          modeloEscolhido: this.modeloEscolhido
        });
        this.mostrarErro('Erro ao carregar anos. Verifique se o modelo foi selecionado corretamente.');
        this.carregando = false;
      }
    });
  }

  get valorNumericoDoVeiculo(): number {
    if (!this.dadosFipe?.Valor) return 0;
    const valor = this.dadosFipe.Valor.replace('R$ ', '').replace('.', '').replace(',', '.');
    return parseFloat(valor) || 0;
  }

  get formularioEstaValido(): boolean {
    return !!(this.marcaEscolhida && this.modeloEscolhido && this.anoEscolhido);
  }

  carregarMarcas(): void {
    this.carregando = true;

    this.serviceFipe.listarMarcas(this.tipoVeiculo).subscribe({
      next: (marcas: Marcas[]) => {
        this.listaMarcas = marcas.map(m => ({
          label: m.nome,
          value: m.codigo
        }));
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar marcas:', erro);
        this.mostrarErro('Erro ao carregar marcas. Tente novamente.');
        this.listaMarcas = [];
        this.carregando = false;
      }
    });
  }

  aoMudarTipoVeiculo(): void {
    this.limparDadosFipe();
    this.carregarMarcas();
  }

  aoMudarMarca(): void {
    if (!this.marcaEscolhida) {
      this.limparDadosFipe();
      return;
    }

    this.carregando = true;
    this.limparDadosFipe();

    this.serviceFipe.listarModelos(this.tipoVeiculo, this.marcaEscolhida).subscribe({
      next: (resposta: ModelosResponse) => {
        if (resposta && resposta.modelos && resposta.modelos.length > 0) {
          this.listaModelos = resposta.modelos.map(m => ({
            label: m.nome,
            value: m.codigo
          }));
        } else {
          this.mostrarErro('Nenhum modelo encontrado para esta marca.');
          this.listaModelos = [];
        }
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar modelos:', erro);
        this.mostrarErro('Erro ao carregar modelos. Tente novamente.');
        this.listaModelos = [];
        this.carregando = false;
      }
    });
  }

  aoMudarModelo(): void {
    if (!this.marcaEscolhida || !this.modeloEscolhido) {
      return;
    }

    if (this.modeloEscolhido === 'undefined' || this.modeloEscolhido === 'null') {
      return;
    }

    this.carregando = true;

    this.listaAnos = [];
    this.anoEscolhido = undefined;
    this.dadosFipe = undefined;
    this.resultadoSimulacao = null;

    this.serviceFipe.listarAnos(this.tipoVeiculo, this.marcaEscolhida, this.modeloEscolhido).subscribe({
      next: (anos: Anos[]) => {
        if (anos && anos.length > 0) {
          this.listaAnos = anos.map(a => ({
            label: a.nome,
            value: a.codigo
          }));
        } else {
          this.mostrarErro('Nenhum ano encontrado para este modelo.');
          this.listaAnos = [];
        }
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar anos:', erro);
        this.mostrarErro('Erro ao carregar anos. Tente novamente.');
        this.listaAnos = [];
        this.carregando = false;
      }
    });
  }

  aoMudarAno(): void {
    if (!this.marcaEscolhida || !this.modeloEscolhido || !this.anoEscolhido ||
        this.modeloEscolhido === 'undefined' || this.modeloEscolhido === 'null' ||
        this.anoEscolhido === 'undefined' || this.anoEscolhido === 'null') {
      this.dadosFipe = undefined;
      this.resultadoSimulacao = null;
      return;
    }

    this.carregando = true;
    this.dadosFipe = undefined;
    this.resultadoSimulacao = null;

    this.serviceFipe.listarInformacoes(
      this.tipoVeiculo,
      this.marcaEscolhida,
      this.modeloEscolhido,
      this.anoEscolhido
    ).subscribe({
      next: (info: InformacoesFipe) => {
        this.dadosFipe = info;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar informações da FIPE:', erro);
        this.mostrarErro('Erro ao carregar informações da FIPE. Tente novamente.');
        this.carregando = false;
      }
    });
  }

  limparConsulta(): void {
    this.tipoVeiculo = 'carros';
    this.limparDadosFipe();
    this.valorEntrada = null;
    this.rendaMensal = null;
    this.carregarMarcas();
  }

  private limparDadosFipe(): void {
    this.listaModelos = [];
    this.listaAnos = [];
    this.modeloEscolhido = undefined;
    this.anoEscolhido = undefined;
    this.dadosFipe = undefined;
    this.resultadoSimulacao = null;
  }

  calcularSimulacao(): void {
    if (!this.dadosFipe) {
      this.mostrarErro('Complete a consulta FIPE primeiro.');
      return;
    }

    const valorEntrada = this.valorEntrada || 0;
    const rendaMensal = this.rendaMensal || 0;

    const valorVeiculo = this.valorNumericoDoVeiculo;
    const valorFinanciado = valorVeiculo - valorEntrada;

    if (valorFinanciado <= 0) {
      this.mostrarErro('O valor da entrada deve ser menor que o valor do veículo.');
      return;
    }

    const resultado = this.serviceSimulacao.calcularFinanciamento(valorFinanciado, this.taxaJuros, this.numeroParcelas);
    const aprovado = resultado.valorParcela <= (rendaMensal * 0.3);

    this.resultadoSimulacao = {
      ...resultado,
      aprovado,
      mensagem: aprovado
        ? 'Sua renda mensal foi aprovada na simulação inicial. \nAperte o botão abaixo e solicite seu financiamento.'
        : 'Valor da parcela excede 30% da sua renda mensal.'
    };
  }

  novaSimulacao(): void {
    this.limparConsulta();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  aoMudarParcelas(): void {
    this.taxaJuros = this.obterTaxaJuros(this.numeroParcelas);
    // Se já houver uma simulação, recalcula automaticamente
    if (this.resultadoSimulacao && this.valorNumericoDoVeiculo) {
      this.calcularSimulacao();
    }
  }

  private obterTaxaJuros(parcelas: number): number {
    switch (parcelas) {
      case 12: return 1.5;
      case 24: return 2.5;
      case 36: return 3.5;
      case 48: return 4.5;
      case 60: return 5.5;
      default: return 3.5;
    }
  }

  enviarSolicitacao(): void {
    if (!this.validarFormulario()) return;
    if (!this.validarDadosFipe()) return;

    this.enviando = true;

    const dadosCompletos = this.prepararDadosParaEnvio();

    this.serviceSolicitacao.enviarSolicitacao(dadosCompletos).subscribe({
      next: () => {
        this.enviando = false;
        this.mostrarSucesso('Solicitação enviada com sucesso! Acompanhe o andamento em Meus Contratos.');
        this.serviceSimulacao.limparDadosSimulacao();
        setTimeout(() => {
          this.roteador.navigate(['/painelcliente']);
        }, 500);
      },
      error: (erro) => {
        // Log detalhado para debug
        console.error('❌ Erro ao enviar solicitação:', {
          status: erro.status,
          statusText: erro.statusText,
          url: erro.url,
          error: erro.error,
          message: erro.message
        });

        // Tenta extrair a mensagem de erro do backend
        let mensagemErro = 'Erro ao enviar solicitação. Tente novamente.';

        if (erro.error) {
          // FastAPI retorna o erro em erro.error.detail
          if (erro.error.detail) {
            mensagemErro = erro.error.detail;
          } else if (erro.error.message) {
            mensagemErro = erro.error.message;
          } else if (typeof erro.error === 'string') {
            mensagemErro = erro.error;
          }
        }

        // Mensagens específicas baseadas no status code
        if (erro.status === 400) {
          mensagemErro = mensagemErro || 'Dados inválidos. Verifique as informações e tente novamente.';
        } else if (erro.status === 401) {
          mensagemErro = 'Sessão expirada. Por favor, faça login novamente.';
        } else if (erro.status === 403) {
          mensagemErro = 'Você não tem permissão para realizar esta ação.';
        } else if (erro.status === 404) {
          mensagemErro = mensagemErro || 'Recurso não encontrado.';
        } else if (erro.status === 500) {
          mensagemErro = mensagemErro || 'Erro interno do servidor. Por favor, tente novamente mais tarde ou entre em contato com o suporte.';
        } else if (erro.status === 0) {
          mensagemErro = 'Erro de conexão. Verifique sua internet e tente novamente.';
        }

        this.mostrarErro(mensagemErro);
        this.enviando = false;
      }
    });

  }

  private validarFormulario(): boolean {
    this.formularioVeiculo.markAllAsTouched();

    if (this.formularioVeiculo.invalid) {
      if (this.formularioVeiculo.get('placa')?.invalid) {
        this.mostrarErro('Placa é obrigatória e deve ter entre 7 e 8 caracteres.');
      } else if (this.formularioVeiculo.get('numChassi')?.invalid) {
        this.mostrarErro('Número do chassi é obrigatório e deve ter 17 caracteres.');
      } else if (this.formularioVeiculo.get('numRenavam')?.invalid) {
        this.mostrarErro('Número do RENAVAM é obrigatório e deve ter entre 9 e 11 caracteres.');
      } else {
        this.mostrarErro('Preencha todos os campos obrigatórios corretamente.');
      }
      return false;
    }
    return true;
  }

  private validarDadosFipe(): boolean {
    if (!this.dadosFipe) {
      this.mostrarErro('Dados do veículo não encontrados.');
      return false;
    }
    return true;
  }

  private prepararDadosParaEnvio(): any {
    const placa = this.formularioVeiculo.get('placa')?.value || '';
    const numChassi = this.formularioVeiculo.get('numChassi')?.value || '';
    const numRenavam = this.formularioVeiculo.get('numRenavam')?.value || '';
    const cor = this.formularioVeiculo.get('cor')?.value || null;

    const dadosLogin = this.serviceAuth.obterDadosLogin();
    const idCliente = dadosLogin?.id_cliente || null;

    const marcaNome = this.listaMarcas.find(m => m.value === this.marcaEscolhida)?.label || '';
    const modeloNome = this.listaModelos.find(m => m.value === this.modeloEscolhido)?.label || '';
    const valorVeiculo = this.valorNumericoDoVeiculo;

    return {
      id_cliente: idCliente,
      informacoesFipe: {
        Valor: this.dadosFipe?.Valor,
        Combustivel: this.dadosFipe?.Combustivel,
        CodigoFipe: this.dadosFipe?.CodigoFipe,
        MesReferencia: this.dadosFipe?.MesReferencia
      },
      tipoVeiculo: this.tipoVeiculo,
      marcaSelecionada: this.marcaEscolhida,
      marcaNome: marcaNome,
      modeloSelecionado: this.modeloEscolhido,
      modeloNome: modeloNome,
      anoSelecionado: this.anoEscolhido,
      veiculo: {
        placa: placa,
        numChassi: numChassi,
        numRenavam: numRenavam,
        cor: cor
      },
      financeiro: {
        valorVeiculo: valorVeiculo,
        valorEntrada: this.valorEntrada || 0,
        parcelasSelecionadas: this.numeroParcelas,
        taxaJuros: this.taxaJuros,
        rendaMensal: this.rendaMensal || 0,
        valorFinanciado: this.resultadoSimulacao?.valorFinanciado,
        valorParcela: this.resultadoSimulacao?.valorParcela,
        totalPagar: this.resultadoSimulacao?.totalPagar,
        totalJuros: this.resultadoSimulacao?.totalJuros
      },
      resultadoSimulacao: this.resultadoSimulacao,
      veioDaSimulacao: this.veioDaSimulacao
    };
  }

  private mostrarErro(mensagem: string): void {
    this.serviceMensagem.add({
      severity: 'error',
      summary: 'Erro',
      detail: mensagem,
      life: 10000
    });
  }

  private mostrarSucesso(mensagem: string): void {
    this.serviceMensagem.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: mensagem,
      life: 10000
    });
  }
}

