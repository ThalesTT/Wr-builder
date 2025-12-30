Wild Rift Builder 🛠️ Um simulador de builds avançado para Wild Rift, focado em
precisão técnica, performance e facilidade de compartilhamento. O projeto
utiliza React + TypeScript e implementa as regras de inventário oficiais do
jogo. 🚀 Funcionalidades Principais • Lógica de Inventário Inteligente:
Gerenciamento automático de slots, respeitando as posições fixas para Botas
(Slot 5) e Encantamentos (Slot 6). • Sistema de Runas Completo: Interface
intuitiva para seleção de Runa Essencial (Keystone), Árvore Secundária por tiers
e Runa Extra. • Deep Linking (URL Sync): Toda a build (itens e runas) é
codificada na URL. Isso permite que o usuário compartilhe sua build apenas
copiando e colando o link. • Filtro Inteligente de Catálogo: Busca dinâmica por
nome ou categoria, com suporte a múltiplos idiomas (PT/EN). • Persistência
Local: Salva builds favoritas no localStorage para consulta rápida. • Social
Card Modal: Geração de visualização para exportação e compartilhamento em redes
sociais. 🏗️ Arquitetura Técnica O projeto segue o padrão de Smart e Dumb
Components, garantindo que a lógica de negócio esteja separada da interface
visual. Componentes Chave Componente Responsabilidade Itens.tsx O "cérebro" da
aplicação. Coordena o estado global, URL e sincronização de dados. Runes.tsx
Gerencia a lógica complexa de seleção e dependência das árvores de runas.
BuildDisplay.tsx Renderiza a barra de build ativa e gerencia as ações de
salvar/compartilhar. Frame.tsx Componente visual reutilizável para itens, runas
e campeões com suporte a estados de hover e remoção. Hooks Customizados (Lógica
Extraída) • useBuildManager: Centraliza as regras de negócio do Wild Rift
(impedir itens duplicados, auto-foco em slots vazios). • useBuildFromUrl:
Especializado em fazer o parsing dos parâmetros da URL para reconstruir o estado
da aplicação. • useFetchData: Hook com TypeScript Generics para carregamento
seguro e tipado dos dados estáticos (JSONs). 🛠️ Tecnologias Utilizadas • React
18 • TypeScript (Tipagem estrita para maior segurança) • React Router Dom v6
(Navegação e gerenciamento de Query Params) • CSS Modules (Escopo de estilos por
componente) 📁 Estrutura de Pastas Plaintext src/ ├── components/ # Componentes
visuais e de lógica ├── hooks/ # Hooks customizados (BuildManager, Sound,
FetchData) ├── data/ # Arquivos JSON (Itens, Runas, Champions) ├── types/ #
Definições de interfaces TypeScript └── routes/ # Configuração de rotas e
layouts 📝 Regras de Negócio Implementadas 1. Limite de Inventário: Máximo de 5
itens comuns + 1 Bota + 1 Encantamento. 2. Unicidade: Não é permitido adicionar
o mesmo item duas vezes na build. 3. Itens de Suporte: O sistema detecta e
impede a adição de mais de um item de suporte. 4. Hierarquia de Runas: A Runa
Extra é filtrada dinamicamente para não pertencer à mesma árvore secundária
selecionada.

🔮 Próximos Passos (Roadmap) • [ ] Migração para Next.js para otimização de
imagens e SSR. • [ ] Implementação de Context API para gerenciamento de catálogo
global.
