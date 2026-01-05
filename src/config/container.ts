import { MongoEventRepository } from '../infrastructure/repositories/MongoEventRepository';
import { CreateEventUseCase } from '../usecases/CreateEventUseCase';
import { ListEventsUseCase } from '../usecases/ListEventsUseCase';
import { GetEventByIdUseCase } from '../usecases/GetEventByIdUseCase';
import { UpdateEventUseCase } from '../usecases/UpdateEventUseCase';
import { DeleteEventUseCase } from '../usecases/DeleteEventUseCase';
import { EventController } from '../presentation/controllers/EventController';
import { ViewController } from '../presentation/controllers/ViewController';

export class Container {
  private static eventRepository: MongoEventRepository;
  private static eventController: EventController;
  private static viewController: ViewController;

  public static getEventController(): EventController {
    if (!Container.eventController) {
      const repository = Container.getEventRepository();
      
      const createEventUseCase = new CreateEventUseCase(repository);
      const listEventsUseCase = new ListEventsUseCase(repository);
      const getEventByIdUseCase = new GetEventByIdUseCase(repository);
      const updateEventUseCase = new UpdateEventUseCase(repository);
      const deleteEventUseCase = new DeleteEventUseCase(repository);

      Container.eventController = new EventController(
        createEventUseCase,
        listEventsUseCase,
        getEventByIdUseCase,
        updateEventUseCase,
        deleteEventUseCase
      );
    }

    return Container.eventController;
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
}
