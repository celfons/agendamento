import { MongoEventRepository } from '../infrastructure/repositories/MongoEventRepository';
import { MongoEventRegistrationRepository } from '../infrastructure/repositories/MongoEventRegistrationRepository';
import { ListEventsUseCase } from '../usecases/ListEventsUseCase';
import { GetEventByIdUseCase } from '../usecases/GetEventByIdUseCase';
import { RegisterToEventUseCase } from '../usecases/RegisterToEventUseCase';
import { UnregisterFromEventUseCase } from '../usecases/UnregisterFromEventUseCase';
import { EventController } from '../presentation/controllers/EventController';
import { EventRegistrationController } from '../presentation/controllers/EventRegistrationController';
import { ViewController } from '../presentation/controllers/ViewController';

export class Container {
  private static eventRepository: MongoEventRepository;
  private static eventRegistrationRepository: MongoEventRegistrationRepository;
  
  private static eventController: EventController;
  private static eventRegistrationController: EventRegistrationController;
  private static viewController: ViewController;

  public static getEventController(): EventController {
    if (!Container.eventController) {
      const repository = Container.getEventRepository();
      
      const listEventsUseCase = new ListEventsUseCase(repository);
      const getEventByIdUseCase = new GetEventByIdUseCase(repository);

      Container.eventController = new EventController(
        listEventsUseCase,
        getEventByIdUseCase
      );
    }

    return Container.eventController;
  }

  public static getEventRegistrationController(): EventRegistrationController {
    if (!Container.eventRegistrationController) {
      const eventRegistrationRepository = Container.getEventRegistrationRepository();
      const eventRepository = Container.getEventRepository();
      
      const registerToEventUseCase = new RegisterToEventUseCase(
        eventRegistrationRepository,
        eventRepository
      );
      const unregisterFromEventUseCase = new UnregisterFromEventUseCase(
        eventRegistrationRepository,
        eventRepository
      );

      Container.eventRegistrationController = new EventRegistrationController(
        registerToEventUseCase,
        unregisterFromEventUseCase
      );
    }

    return Container.eventRegistrationController;
  }

  public static getViewController(): ViewController {
    if (!Container.viewController) {
      Container.viewController = new ViewController();
    }

    return Container.viewController;
  }

  private static getEventRepository(): MongoEventRepository {
    if (!Container.eventRepository) {
      Container.eventRepository = new MongoEventRepository();
    }

    return Container.eventRepository;
  }

  private static getEventRegistrationRepository(): MongoEventRegistrationRepository {
    if (!Container.eventRegistrationRepository) {
      Container.eventRegistrationRepository = new MongoEventRegistrationRepository();
    }

    return Container.eventRegistrationRepository;
  }
}

