import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { FipeService } from '../../../_services/fipe.service';
import { Marcas, Modelos, Anos, InformacoesFipe, ModelosResponse } from '../../../../_models/fipe.models';
import { RouterModule, Router } from '@angular/router';
import { SimulacaoService } from '../../../../services/simulacao.service';
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
import { SolicitacaoService } from '../../../../services/solicitacao.service';

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
  taxaJuros: number = 1.5;
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
  estaCarregando: boolean = false;
  estaEnviando: boolean = false;

  constructor(
    private servicoFipe: FipeService,
    private servicoSimulacao: SimulacaoService,
    private construtorFormulario: FormBuilder,
    private roteador: Router,
    private servicoMensagem: MessageService,
    private servicoSolicitacao: SolicitacaoService
  ) {
    this.criarFormulario();
  }

  ngOnInit(): void {
    const dadosSimulacao = this.servicoSimulacao.obterDadosSimulacao();

    if (dadosSimulacao && dadosSimulacao.informacoesFipe) {
      this.preencherDadosDaSimulacao(dadosSimulacao);

      // Só carrega listagens se os dados essenciais estiverem presentes
      if (this.marcaEscolhida && this.modeloEscolhido) {
        this.carregarListagensParaPreenchimento();
      } else {
        console.error('Não é possível carregar listagens: dados essenciais faltando');
        this.estaCarregando = false;
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
    console.log('Preenchendo dados da simulação:', dados);

    this.veioDaSimulacao = true;
    this.tipoVeiculo = dados.tipoVeiculo || 'carros';
    this.marcaEscolhida = dados.marcaSelecionada;
    this.modeloEscolhido = dados.modeloSelecionado;
    this.anoEscolhido = dados.anoSelecionado;
    this.dadosFipe = dados.informacoesFipe;
    this.valorEntrada = dados.valorEntrada || null;
    this.numeroParcelas = dados.parcelasSelecionadas || 36;
    this.taxaJuros = dados.taxaJuros || 1.5;
    this.rendaMensal = dados.rendaMensal || null;
    this.resultadoSimulacao = dados.resultadoSimulacao;

    if (!this.marcaEscolhida || !this.modeloEscolhido) {
      console.error('Dados da simulação incompletos:', {
        marcaEscolhida: this.marcaEscolhida,
        modeloEscolhido: this.modeloEscolhido,
        dadosRecebidos: dados
      });
      this.mostrarErro('Dados da simulação incompletos. Por favor, faça uma nova simulação.');
      this.estaCarregando = false;
      return;
    }

    console.log('Dados preenchidos com sucesso:', {
      tipoVeiculo: this.tipoVeiculo,
      marcaEscolhida: this.marcaEscolhida,
      modeloEscolhido: this.modeloEscolhido,
      anoEscolhido: this.anoEscolhido
    });
  }

  private carregarListagensParaPreenchimento(): void {
    this.estaCarregando = true;

    this.servicoFipe.listarMarcas(this.tipoVeiculo).subscribe({
      next: (marcas: Marcas[]) => {
        this.listaMarcas = marcas.map(m => ({
          label: m.nome,
          value: m.codigo
        }));

        if (this.marcaEscolhida) {
          this.carregarModelosParaPreenchimento();
        } else {
          this.estaCarregando = false;
        }
      },
      error: () => this.estaCarregando = false
    });
  }

  private carregarModelosParaPreenchimento(): void {
    if (!this.marcaEscolhida) {
      this.estaCarregando = false;
      return;
    }

    this.servicoFipe.listarModelos(this.tipoVeiculo, this.marcaEscolhida).subscribe({
      next: (resposta: ModelosResponse) => {
        if (resposta && resposta.modelos) {
          this.listaModelos = resposta.modelos.map(m => ({
            label: m.nome,
            value: m.codigo
          }));

          if (this.modeloEscolhido && this.modeloEscolhido !== 'undefined' && this.modeloEscolhido !== 'null') {
            this.carregarAnosParaPreenchimento();
          } else {
            this.estaCarregando = false;
          }
        } else {
          this.estaCarregando = false;
        }
      },
      error: (erro) => {
        console.error('Erro ao carregar modelos para preenchimento:', erro);
        this.estaCarregando = false;
      }
    });
  }

  private carregarAnosParaPreenchimento(): void {
    if (!this.marcaEscolhida || !this.modeloEscolhido) {
      console.warn('Não é possível carregar anos: marca ou modelo não definido', {
        marcaEscolhida: this.marcaEscolhida,
        modeloEscolhido: this.modeloEscolhido
      });
      this.estaCarregando = false;
      return;
    }

    if (this.modeloEscolhido === 'undefined' || this.modeloEscolhido === 'null' ||
        this.marcaEscolhida === 'undefined' || this.marcaEscolhida === 'null') {
      console.warn('Valores inválidos detectados:', {
        marcaEscolhida: this.marcaEscolhida,
        modeloEscolhido: this.modeloEscolhido
      });
      this.estaCarregando = false;
      return;
    }

    console.log('Carregando anos com:', {
      tipoVeiculo: this.tipoVeiculo,
      marcaEscolhida: this.marcaEscolhida,
      modeloEscolhido: this.modeloEscolhido
    });

    this.servicoFipe.listarAnos(this.tipoVeiculo, this.marcaEscolhida, this.modeloEscolhido).subscribe({
      next: (anos: Anos[]) => {
        if (anos && anos.length > 0) {
          this.listaAnos = anos.map(a => ({
            label: a.nome,
            value: a.codigo
          }));
        } else {
          console.warn('Nenhum ano retornado pela API');
        }
        this.estaCarregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar anos para preenchimento:', erro);
        console.error('Parâmetros usados:', {
          tipoVeiculo: this.tipoVeiculo,
          marcaEscolhida: this.marcaEscolhida,
          modeloEscolhido: this.modeloEscolhido
        });
        this.mostrarErro('Erro ao carregar anos. Verifique se o modelo foi selecionado corretamente.');
        this.estaCarregando = false;
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
    this.estaCarregando = true;

    this.servicoFipe.listarMarcas(this.tipoVeiculo).subscribe({
      next: (marcas: Marcas[]) => {
        this.listaMarcas = marcas.map(m => ({
          label: m.nome,
          value: m.codigo
        }));
        this.estaCarregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar marcas:', erro);
        this.mostrarErro('Erro ao carregar marcas. Tente novamente.');
        this.listaMarcas = [];
        this.estaCarregando = false;
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

    this.estaCarregando = true;
    this.limparDadosFipe();

    this.servicoFipe.listarModelos(this.tipoVeiculo, this.marcaEscolhida).subscribe({
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
        this.estaCarregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar modelos:', erro);
        this.mostrarErro('Erro ao carregar modelos. Tente novamente.');
        this.listaModelos = [];
        this.estaCarregando = false;
      }
    });
  }

  aoMudarModelo(): void {
    setTimeout(() => {
      if (!this.marcaEscolhida || !this.modeloEscolhido) {
        return;
      }

      if (this.modeloEscolhido === 'undefined' || this.modeloEscolhido === 'null') {
        return;
      }

      this.estaCarregando = true;

      this.listaAnos = [];
      this.anoEscolhido = undefined;
      this.dadosFipe = undefined;
      this.resultadoSimulacao = null;

      this.servicoFipe.listarAnos(this.tipoVeiculo, this.marcaEscolhida, this.modeloEscolhido).subscribe({
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
          this.estaCarregando = false;
        },
        error: (erro) => {
          console.error('Erro ao carregar anos:', erro);
          this.mostrarErro('Erro ao carregar anos. Tente novamente.');
          this.listaAnos = [];
          this.estaCarregando = false;
        }
      });
    }, 0);
  }

  aoMudarAno(): void {
    if (!this.marcaEscolhida || !this.modeloEscolhido || !this.anoEscolhido ||
        this.modeloEscolhido === 'undefined' || this.modeloEscolhido === 'null' ||
        this.anoEscolhido === 'undefined' || this.anoEscolhido === 'null') {
      this.dadosFipe = undefined;
      this.resultadoSimulacao = null;
      return;
    }

    this.estaCarregando = true;
    this.dadosFipe = undefined;
    this.resultadoSimulacao = null;

    this.servicoFipe.listarInformacoes(
      this.tipoVeiculo,
      this.marcaEscolhida,
      this.modeloEscolhido,
      this.anoEscolhido
    ).subscribe({
      next: (info: InformacoesFipe) => {
        this.dadosFipe = info;
        this.estaCarregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar informações da FIPE:', erro);
        this.mostrarErro('Erro ao carregar informações da FIPE. Tente novamente.');
        this.estaCarregando = false;
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

    const taxaMensal = this.taxaJuros / 100;
    const valorParcela = valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, this.numeroParcelas)) /
      (Math.pow(1 + taxaMensal, this.numeroParcelas) - 1);

    const totalPagar = valorParcela * this.numeroParcelas;
    const totalJuros = totalPagar - valorFinanciado;
    const aprovado = valorParcela <= (rendaMensal * 0.3);

    this.resultadoSimulacao = {
      valorFinanciado,
      valorParcela,
      totalPagar,
      totalJuros,
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

  enviarSolicitacao(): void {
    if (!this.validarFormulario()) return;
    if (!this.validarDadosFipe()) return;

    this.estaEnviando = true;

    const dadosCompletos = this.prepararDadosParaEnvio();
    console.log('Dados do formulário que serão enviados ao backend:', dadosCompletos);

    this.servicoSolicitacao.enviarSolicitacao(dadosCompletos).subscribe({
      next: () => {
        this.estaEnviando = false;
        this.mostrarSucesso('Solicitação enviada com sucesso! Acompanhe o andamento em Meus Contratos.');
        this.servicoSimulacao.limparDadosSimulacao();
        setTimeout(() => {
          this.roteador.navigate(['/painelcliente']);
        }, 500);
      },
      error: (erro) => {
        console.error('Erro ao enviar solicitação:', erro);
        this.mostrarErro('Erro ao enviar solicitação. Tente novamente.');
        this.estaEnviando = false;
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

    const authData = localStorage.getItem('auth_data');
    const idCliente = authData ? JSON.parse(authData).id_cliente : null;

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
    this.servicoMensagem.add({
      severity: 'error',
      summary: 'Erro',
      detail: mensagem,
      life: 5000
    });
  }

  private mostrarSucesso(mensagem: string): void {
    this.servicoMensagem.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: mensagem,
      life: 5000
    });
  }
}

