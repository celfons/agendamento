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

### Painel Administrativo

- ✅ Listagem de eventos
- ✅ Criação de eventos
- ✅ Edição de eventos
- ✅ Exclusão de eventos
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

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
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
```

4. Inicie o MongoDB:
```bash
# Se estiver usando Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou inicie o MongoDB localmente
mongod
```

5. Compile o TypeScript:
```bash
npm run build
```

6. Inicie a aplicação:
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

7. Acesse a aplicação:
```
http://localhost:3000
```

## 📖 API Endpoints

### Events API

#### Criar Evento
```http
POST /api/events
Content-Type: application/json

{
  "name": "Workshop de Node.js",
  "description": "Workshop prático sobre desenvolvimento backend",
  "date": "2024-12-20T14:00:00",
  "location": "São Paulo, SP",
  "maxParticipants": 50,
  "availableSlots": 50,
  "organizers": ["João Silva", "Maria Santos"]
}
```

#### Listar Eventos
```http
GET /api/events
```

#### Buscar Evento por ID
```http
GET /api/events/:id
```

#### Atualizar Evento
```http
PUT /api/events/:id
Content-Type: application/json

{
  "name": "Workshop de Node.js Avançado",
  "availableSlots": 45
}
```

#### Deletar Evento
```http
DELETE /api/events/:id
```

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

- Número máximo de participantes deve ser maior que 0
- Vagas disponíveis não podem exceder o máximo de participantes
- Data do evento deve ser no futuro
- Nome do evento é obrigatório
- Pelo menos um organizador é obrigatório

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