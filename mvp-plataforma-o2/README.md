# Plataforma O2 - MVP

Este MVP entrega uma experiência mínima para praticar os principais fluxos da Organização Orgânica (O2) em um único arquivo estático. Ele pode ser utilizado para testes rápidos em reuniões ou para validar hipóteses antes de investir em uma implementação completa.

## Funcionalidades

- **Estrutura viva**: cadastre círculos e papéis com propósito, responsabilidades, artefatos e energizações.
- **Gestão de tensões**: registre tensões criativas e direcione-as para as interações Revisar, Sincronizar, Adaptar ou Cuidar.
- **Interações do círculo**: monte agendas táticas e registre decisões integrativas vinculadas às tensões.
- **Biblioteca integrada**: destaque de padrões essenciais (Revisão Tática, Priorização Bimodal e Atos Heróicos) para apoiar a facilitação.
- **Persistência local**: os dados ficam salvos no `localStorage` do navegador, mantendo o histórico entre sessões sem necessidade de backend.

## Como executar

1. Faça o download ou clone o repositório.
2. Abra `mvp-plataforma-o2/index.html` em qualquer navegador moderno.
3. Utilize os formulários para cadastrar círculos, papéis, tensões, agenda e decisões.

> Dica: para limpar os dados armazenados, utilize a opção de limpar dados do site no navegador ou execute `localStorage.removeItem("o2-mvp-dados")` no console.

## Próximos passos sugeridos

- Controle de acesso por círculo e papéis essenciais (Guia, Representante, Facilitador, Escriba).
- Registro das interações Revisar, Sincronizar, Adaptar e Cuidar com fluxo passo a passo.
- Histórico de tensões resolvidas e métricas para acompanhamento.
- Sincronização com backend (API) para trabalho colaborativo em tempo real.
