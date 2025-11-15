import { Component, OnInit} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CadastroService, DadosCadastro } from '../../services/cadastro.service';

@Component({
  selector: 'app-c-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    TabMenuModule,
    InputGroupModule,
    InputGroupAddonModule,
    PasswordModule,
    ToastModule,
    CommonModule
  ],
  templateUrl: './c-cadastro.component.html',
  styleUrls: ['./c-cadastro.component.scss']
})
export class CCadastroComponent implements OnInit {
  cadastroForm!: FormGroup;
  carregando = false;
  cepEncontrado = true;
  consultandoCep = false;

  constructor(
    private fb: FormBuilder,
    private cadastroService: CadastroService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.initializeForm();
  }


  private initializeForm() {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cpf: ['', [Validators.required, this.validarCPF]],
      email: ['', [Validators.required, Validators.email]],
      emailConfirm: ['', [Validators.required]],
      telefone: [''],
      renda: [0, [Validators.min(0)]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      estado: ['', [Validators.required, Validators.maxLength(2)]],
      logradouro: ['', [Validators.required]],
      numero: [''],
      bairro: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      senhaConfirm: ['', [Validators.required]]
    }, { validators: [this.validarEmailConfirm, this.validarSenhaConfirm] });
  }

  cadastrarUsuario() {


    if (this.cadastroForm.invalid) {
      this.marcarCamposComoTocados();
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios corretamente.'
      });
      return;
    }

    this.carregando = true;

    const formValue = this.cadastroForm.value;
    const dadosCadastro: DadosCadastro = {
      nome: formValue.nome,
      cpf: formValue.cpf,
      telefone: formValue.telefone,
      renda: formValue.renda,

      logradouro: formValue.logradouro,
      numero: formValue.numero,
      bairro: formValue.bairro,
      cidade: formValue.cidade,
      estado: formValue.estado,
      cep: formValue.cep,

      usuario: formValue.usuario,
      email: formValue.email,
      senha: formValue.senha
    };

    this.cadastroService.cadastrarCliente(dadosCadastro).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cadastro realizado com sucesso!'
        });
        this.carregando = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro no cadastro:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao realizar cadastro. Tente novamente.'
        });
        this.carregando = false;
      }
    });
  }

  private marcarCamposComoTocados() {
    Object.keys(this.cadastroForm.controls).forEach(key => {
      const control = this.cadastroForm.get(key);
      control?.markAsTouched();
    });
  }

  validarCPF(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const cpf = control.value.replace(/\D/g, '');
    if (cpf.length !== 11) return { cpfInvalido: true };

    if (/^(\d)\1{10}$/.test(cpf)) return { cpfInvalido: true };

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return { cpfInvalido: true };

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return { cpfInvalido: true };

    return null;
  }

  validarEmailConfirm(control: AbstractControl): ValidationErrors | null {
    const email = control.get('email')?.value;
    const emailConfirm = control.get('emailConfirm')?.value;

    if (!email || !emailConfirm) {
      return null;
    }

    if (email !== emailConfirm) {
      return { emailNaoConfere: true };
    }
    return null;
  }

  validarSenhaConfirm(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senha')?.value;
    const senhaConfirm = control.get('senhaConfirm')?.value;

    if (!senha || !senhaConfirm) {
      return null;
    }

    if (senha !== senhaConfirm) {
      return { senhaNaoConfere: true };
    }
    return null;
  }

  formatarCEP(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length >= 5) {
      valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    }
    this.cadastroForm.get('cep')?.setValue(valor);
  }

  consultarCEP() {
    const cep = this.cadastroForm.get('cep')?.value;
    const cepLimpo = cep?.replace(/\D/g, '') || '';


    if (cepLimpo.length !== 8) {
      this.cepEncontrado = true;
      this.consultandoCep = false;
      return;
    }

    this.consultandoCep = true;

    this.cadastroService.consultarCEP(cep).subscribe({
      next: (dados: any) => {
        this.consultandoCep = false;
        if (dados.erro) {
          this.cepEncontrado = false;
          this.limparCamposEndereco();
          this.messageService.add({
            severity: 'warn',
            summary: 'Aviso',
            detail: 'CEP não encontrado. Preencha os campos manualmente.'
          });
        } else {
          this.cepEncontrado = true;
          this.preencherCamposEndereco(dados);
        }
      },
      error: (err) => {
        this.consultandoCep = false;
        this.cepEncontrado = false;
        this.limparCamposEndereco();
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao consultar CEP. Tente novamente.'
        });
      }
    });
  }

  preencherCamposEndereco(dados: any) {
    this.cadastroForm.patchValue({
      logradouro: dados.logradouro || '',
      bairro: dados.bairro || '',
      cidade: dados.localidade || '',
      estado: dados.uf || ''
    });
  }

  limparCamposEndereco() {
    this.cadastroForm.patchValue({
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
  }

  ocultarSenha = true;

  alternarVisibilidadeSenha(event: MouseEvent) {
    this.ocultarSenha = !this.ocultarSenha;
    event.stopPropagation();
  }

  itensMenu: MenuItem[] | undefined;

  ngOnInit() {
    this.itensMenu = [];
  }

}
