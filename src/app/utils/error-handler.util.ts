/**
 * Utilitário para extrair mensagens de erro do backend de forma consistente
 */
export function extrairMensagemErro(erro: any, mensagemPadrao: string = 'Erro ao processar solicitação. Tente novamente.'): string {
  // Log detalhado para debug
  console.error('❌ Erro capturado:', {
    error: erro,
    errorError: erro?.error,
    errorMessage: erro?.message,
    errorDetail: erro?.error?.detail,
    status: erro?.status
  });

  let mensagemErro = mensagemPadrao;

  // 1. Verifica se o erro vem do serviço (throwError com new Error)
  if (erro?.error instanceof Error) {
    mensagemErro = erro.error.message;
  }
  // 2. Verifica se vem diretamente como mensagem
  else if (erro?.message && !erro?.error) {
    mensagemErro = erro.message;
  }
  // 3. Verifica se vem do backend FastAPI (err.error.detail)
  else if (erro?.error?.detail) {
    mensagemErro = erro.error.detail;
  }
  // 4. Verifica se vem como err.error.message
  else if (erro?.error?.message) {
    mensagemErro = erro.error.message;
  }
  // 5. Verifica se é uma string direta
  else if (typeof erro?.error === 'string') {
    mensagemErro = erro.error;
  }
  // 6. Mensagens específicas baseadas no status code (fallback)
  else if (erro?.status) {
    switch (erro.status) {
      case 400:
        mensagemErro = mensagemErro || 'Dados inválidos. Verifique as informações e tente novamente.';
        break;
      case 401:
        mensagemErro = 'Sessão expirada. Por favor, faça login novamente.';
        break;
      case 403:
        mensagemErro = 'Você não tem permissão para realizar esta ação.';
        break;
      case 404:
        mensagemErro = mensagemErro || 'Recurso não encontrado.';
        break;
      case 500:
        mensagemErro = mensagemErro || 'Erro interno do servidor. Por favor, tente novamente mais tarde ou entre em contato com o suporte.';
        break;
      case 0:
        mensagemErro = 'Erro de conexão. Verifique sua internet e tente novamente.';
        break;
    }
  }

  // Remove prefixos desnecessários
  mensagemErro = mensagemErro
    .replace(/^Erro (no|ao|na|na requisição):\s*/i, '')
    .replace(/^Error:\s*/i, '')
    .trim();

  return mensagemErro || mensagemPadrao;
}

