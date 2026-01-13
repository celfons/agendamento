flowchart TD

    %% =============================
    %% ENTRADAS DE EVENTOS
    %% =============================

    subgraph Inputs["📥 Fontes de Eventos"]
        A1["Eventos de Pagamento"]
        A2["Dados de Onboarding (KYC/KYB)"]
        A3["Bureau / Open Finance"]
        A4["Atividades do Usuário (Behavioral)"]
        A5["Transações Financeiras (AML)"]
    end

    %% Kafka como backbone
    K["☕ Kafka Event Hub"]

    A1 --> K
    A2 --> K
    A3 --> K
    A4 --> K
    A5 --> K

    %% =============================
    %% CHANGE STREAMS
    %% =============================

    subgraph Mongo["🍃 MongoDB (Transações / Usuários / Histórico)"]
        MS["Change Streams"]
    end

    Mongo --> MS --> K

    %% =============================
    %% ORQUESTRADOR
    %% =============================

    O["🧩 Risk Orchestrator<br/>(Event Router + Feature Loader)"]
    K --> O

    %% =============================
    %% FEATURE STORE
    %% =============================

    FS["📚 Feature Store<br/>(Redis / Mongo TS / Kafka State Store)"]
    O --> FS

    %% =============================
    %% MICROSERVIÇOS + MICROAGENTS
    %% =============================

    subgraph Domains["🤖 Microagents por Domínio (Independentes)"]

        subgraph F1["💳 Microagent - Fraude de Pagamento"]
            R1["Rules Engine<br/>(Velocity, IP Risk, Device, Amount)"]
            AI1["AI Agent FRAUD<br/>Score + Explicações"]
        end

        subgraph F2["📊 Microagent - Score de Crédito"]
            R2["Rules Engine<br/>(Renda, Histórico, Inadimplência)"]
            AI2["AI Agent CREDIT<br/>Probabilidade de Default"]
        end

        subgraph F3["🪪 Microagent - Identidade (KYC/KYB)"]
            R3["Rules Engine<br/>(Documento, Biom. Liveness)"]
            AI3["AI Agent IDENTITY<br/>Risco de Identidade"]
        end

        subgraph F4["🧬 Microagent - Behavioral Analytics"]
            R4["Rules Engine<br/>(Padrões de Uso, Navegação)"]
            AI4["AI Agent BEHAVIOR<br/>Detecção de Anomalias"]
        end

        subgraph F5["💸 Microagent - AML / Antilavagem"]
            R5["Rules Engine<br/>(Fracionamento, Georisco)"]
            AI5["AI Agent AML<br/>Detecção de Atividades Suspeitas"]
        end

        subgraph F6["🏪 Microagent - Risco de Merchant"]
            R6["Rules Engine<br/>(Categoria, Chargeback, Reputação)"]
            AI6["AI Agent MERCHANT<br/>Risk Tier Dinâmico"]
        end

    end

    %% Orquestrador chama cada domínio
    O --> F1
    O --> F2
    O --> F3
    O --> F4
    O --> F5
    O --> F6

    FS --> F1
    FS --> F2
    FS --> F3
    FS --> F4
    FS --> F5
    FS --> F6

    %% =============================
    %% OUTPUTS
    %% =============================

    subgraph Out["📤 Saídas e Decisões"]
        D1["Resultado Fraude"]
        D2["Score de Crédito"]
        D3["Aprovação de Identidade"]
        D4["Alerts AML"]
        D5["Anomalias Comportamentais"]
        D6["Merchant Tiering"]
        AUD["📁 Auditoria / Explainability"]
    end

    F1 --> D1 --> AUD
    F2 --> D2 --> AUD
    F3 --> D3 --> AUD
    F4 --> D5 --> AUD
    F5 --> D4 --> AUD
    F6 --> D6 --> AUD

    AUD --> K

    %% =============================
    %% FIM
    %% =============================