import { Database } from './infrastructure/database/Database';
import { EventModel } from './infrastructure/database/EventModel';
import { config } from './config/config';

async function seed() {
  try {
    // Connect to database
    const database = Database.getInstance();
    await database.connect(config.mongoUri);
    console.log('✅ Connected to database');

    // Clear existing events
    await EventModel.deleteMany({});
    console.log('🗑️  Cleared existing events');

    // Create sample activities
    const activities = [
      {
        title: 'Workshop de Node.js',
        description: 'Aprenda a construir APIs modernas com Node.js, Express e TypeScript. Workshop prático com exemplos reais.',
        startTime: new Date('2026-02-15T09:00:00'),
        endTime: new Date('2026-02-15T12:00:00'),
        location: 'Auditório Principal - Bloco A',
        maxParticipants: 30,
        availableSlots: 30
      },
      {
        title: 'Introdução ao React',
        description: 'Fundamentos do React: componentes, hooks, estado e props. Ideal para iniciantes.',
        startTime: new Date('2026-02-16T14:00:00'),
        endTime: new Date('2026-02-16T17:00:00'),
        location: 'Laboratório de Informática 2',
        maxParticipants: 25,
        availableSlots: 25
      },
      {
        title: 'Python para Data Science',
        description: 'Análise de dados com Python, Pandas e Matplotlib. Traga seu laptop!',
        startTime: new Date('2026-02-17T10:00:00'),
        endTime: new Date('2026-02-17T13:00:00'),
        location: 'Sala 305 - Bloco B',
        maxParticipants: 20,
        availableSlots: 20
      },
      {
        title: 'Design Thinking na Prática',
        description: 'Metodologias ágeis e design thinking aplicados a projetos reais. Atividade em grupo.',
        startTime: new Date('2026-02-18T09:00:00'),
        endTime: new Date('2026-02-18T12:00:00'),
        location: 'Sala de Workshops - Bloco C',
        maxParticipants: 40,
        availableSlots: 40
      },
      {
        title: 'Git e GitHub Essencial',
        description: 'Controle de versão com Git e colaboração usando GitHub. Para todos os níveis.',
        startTime: new Date('2026-02-19T15:00:00'),
        endTime: new Date('2026-02-19T17:00:00'),
        location: 'Laboratório de Informática 1',
        maxParticipants: 35,
        availableSlots: 35
      },
      {
        title: 'Banco de Dados MongoDB',
        description: 'NoSQL com MongoDB: modelagem, queries e agregações. Conhecimento prévio em bancos de dados é recomendado.',
        startTime: new Date('2026-02-20T10:00:00'),
        endTime: new Date('2026-02-20T13:00:00'),
        location: 'Sala 401 - Bloco A',
        maxParticipants: 25,
        availableSlots: 25
      }
    ];

    const created = await EventModel.insertMany(activities);
    console.log(`✅ Created ${created.length} sample activities`);

    console.log('\n📝 Sample Activities:');
    created.forEach((activity, index) => {
      console.log(`${index + 1}. ${activity.title}`);
      console.log(`   ${activity.startTime.toLocaleString('pt-BR')} - ${activity.endTime.toLocaleString('pt-BR')}`);
      console.log(`   ${activity.availableSlots}/${activity.maxParticipants} vagas\n`);
    });

    await database.disconnect();
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
