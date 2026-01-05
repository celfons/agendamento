# Agendamento de Eventos

Plataforma de agendamento de eventos com painel administrativo desenvolvida com TypeScript, Node.js, MongoDB e Bootstrap.

## 📋 Características

- **Arquitetura Limpa**: Separação clara entre domínio, casos de uso, infraestrutura e apresentação
- **SOLID Principles**: Código coeso, desacoplado e fácil de manter
- **TypeScript**: Type-safety e melhor experiência de desenvolvimento
- **MongoDB**: Banco de dados NoSQL flexível e escalável
- **Bootstrap**: Interface responsiva e moderna
- **Clean Code**: Código limpo e bem documentado

## 🏗️ Arquitetura

O projeto segue os princípios de Clean Architecture com as seguintes camadas:

```
src/
├── domain/              # Camada de Domínio (Entidades e Interfaces)
│   ├── entities/        # Entidades do negócio
│   └── interfaces/      # Interfaces (Ports)
├── usecases/            # Casos de Uso (Lógica de Negócio)
├── infrastructure/      # Camada de Infraestrutura (Adapters)
│   ├── database/        # Modelos e conexão MongoDB
│   └── repositories/    # Implementação dos repositórios
├── presentation/        # Camada de Apresentação
│   ├── controllers/     # Controladores
│   ├── routes/          # Rotas da API e Views
│   └── views/           # Templates HTML
└── config/              # Configurações e DI Container
```

## 🚀 Funcionalidades

### Autenticação e Autorização

- ✅ Registro de usuários (com roles: user, organizer, admin)
- ✅ Login com JWT
- ✅ Middleware de autenticação
- ✅ Controle de acesso baseado em roles

### Gestão de Grupos

- ✅ Criação de grupos de organizadores
- ✅ Gerenciamento de membros
- ✅ Controle de admins do grupo

### Inscrição em Eventos

- ✅ Usuários externos podem se inscrever em eventos públicos
- ✅ Gerenciamento automático de vagas disponíveis
- ✅ Listagem de inscrições por usuário
- ✅ Cancelamento de inscrição

### Painel Administrativo

- ✅ Listagem de eventos (pública)
- ✅ Criação de eventos (protegida - admin/organizer)
- ✅ Edição de eventos (protegida - admin/organizer)
- ✅ Exclusão de eventos (protegida - admin/organizer)
- ✅ Visualização detalhada de eventos

### Gestão de Eventos

Cada evento contém:
- Nome do evento
- Descrição
- Data e hora
- Local
- Número máximo de participantes
- Vagas disponíveis
- Lista de organizadores
- Indicador se é público (permite inscrições externas)
- Criador do evento
- Grupo responsável (opcional)

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - JSON Web Tokens para autenticação
- **bcryptjs** - Hash de senhas
- **express-validator** - Validação de dados
- **Bootstrap 5** - Framework CSS
- **Bootstrap Icons** - Ícones

## 📦 Instalação

### Pré-requisitos

- Node.js (v14 ou superior)
- MongoDB (v4.4 ou superior)
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone <repository-url>
cd agendamento
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/agendamento
JWT_SECRET=your-secret-key-change-in-production
```

**IMPORTANTE:** Mude o `JWT_SECRET` para uma chave secreta forte em produção!

4. **Opção A: Usando Docker Compose (Recomendado)**

Execute tudo com um único comando:
```bash
docker-compose up -d
```

A aplicação estará disponível em `http://localhost:3000` e o MongoDB em `localhost:27017`.

Para parar:
```bash
docker-compose down
```

**Opção B: Instalação Manual**

4.1. Inicie o MongoDB:
```bash
# Se estiver usando Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou inicie o MongoDB localmente
mongod
```

4.2. Compile o TypeScript:
```bash
npm run build
```

4.3. Inicie a aplicação:
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

5. Acesse a aplicação:
```
http://localhost:3000
```

## 🐳 Docker

O projeto inclui configuração Docker para facilitar o deploy:

```bash
# Build da imagem
docker build -t agendamento .

# Executar com Docker Compose (inclui MongoDB)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## 📖 API Endpoints

Para documentação completa da API incluindo autenticação, gestão de usuários, grupos e inscrições em eventos, consulte [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Resumo dos Endpoints

#### Autenticação (Público)
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login (retorna JWT token)

#### Eventos
- `GET /api/events` - Listar todos os eventos (público)
- `GET /api/events/:id` - Buscar evento por ID (público)
- `POST /api/events` - Criar evento (requer autenticação: admin/organizer)
- `PUT /api/events/:id` - Atualizar evento (requer autenticação: admin/organizer)
- `DELETE /api/events/:id` - Deletar evento (requer autenticação: admin/organizer)

#### Inscrições em Eventos (Requer Autenticação)
- `POST /api/registrations/events/:eventId` - Inscrever-se em um evento
- `DELETE /api/registrations/events/:eventId` - Cancelar inscrição
- `GET /api/registrations/my-registrations` - Listar minhas inscrições
- `GET /api/registrations/events/:eventId` - Listar inscrições de um evento

#### Grupos (Requer Autenticação)
- `POST /api/groups` - Criar grupo (admin/organizer)
- `GET /api/groups` - Listar grupos
- `POST /api/groups/:groupId/members` - Adicionar membro ao grupo

## 🎨 Interface

### Páginas

- `/` - Listagem de eventos
- `/create` - Formulário de criação de evento
- `/event/:id` - Detalhes e edição de evento

### Recursos da Interface

- Design responsivo que funciona em desktop, tablet e mobile
- Validação de formulários em tempo real
- Feedback visual para ações do usuário
- Interface intuitiva com ícones do Bootstrap Icons

## 🧪 Validações de Negócio

### Eventos
- Número máximo de participantes deve ser maior que 0
- Vagas disponíveis não podem exceder o máximo de participantes
- Data do evento deve ser no futuro
- Nome do evento é obrigatório
- Pelo menos um organizador é obrigatório

### Usuários
- Email deve ser único
- Senha deve ter no mínimo 6 caracteres
- Nome é obrigatório

### Inscrições
- Usuário pode se inscrever apenas em eventos públicos
- Usuário não pode se inscrever duas vezes no mesmo evento
- Evento deve ter vagas disponíveis

## 🔒 Segurança

- Senhas são criptografadas com bcrypt antes de serem armazenadas
- Autenticação baseada em JWT (JSON Web Tokens)
- Tokens expiram após 24 horas
- Controle de acesso baseado em roles (user, organizer, admin)
- Proteção de rotas sensíveis com middleware de autenticação
- Validação de dados de entrada com express-validator

## 🔒 Princípios SOLID Aplicados

- **Single Responsibility**: Cada classe tem uma única responsabilidade
- **Open/Closed**: Aberto para extensão, fechado para modificação
- **Liskov Substitution**: Interfaces bem definidas para substituição
- **Interface Segregation**: Interfaces específicas e coesas
- **Dependency Inversion**: Dependências através de abstrações

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build do projeto
npm run build

# Iniciar em produção
npm start
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

ISC