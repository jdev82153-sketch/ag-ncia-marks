window.NICHO = {
  id: 'advocacia',
  nome: 'Painel de Advocacia',
  menu: ['Visão geral', 'Processos', 'Prazos', 'Clientes', 'Atendente WhatsApp'],
  kpis: [
    { rotulo: 'Processos ativos', valor: '48' },
    { rotulo: 'Prazos esta semana', valor: '7' },
    { rotulo: 'Audiências no mês', valor: '5' },
    { rotulo: 'Novos clientes', valor: '12' }
  ],
  tabela: {
    titulo: 'Próximos prazos',
    colunas: ['Processo', 'Cliente', 'Prazo', 'Situação'],
    linhas: [
      ['0001234-56.2026', 'Maria Souza', '14/10', 'Em andamento'],
      ['0007891-22.2026', 'João Lima', '16/10', 'Urgente'],
      ['0004567-10.2026', 'Ana Prado', '21/10', 'Aguardando']
    ]
  }
};

