import { MongoEventRepository } from '../infrastructure/repositories/MongoEventRepository';
import { MongoUserRepository } from '../infrastructure/repositories/MongoUserRepository';
import { MongoGroupRepository } from '../infrastructure/repositories/MongoGroupRepository';
import { MongoEventRegistrationRepository } from '../infrastructure/repositories/MongoEventRegistrationRepository';
import { CreateEventUseCase } from '../usecases/CreateEventUseCase';
import { ListEventsUseCase } from '../usecases/ListEventsUseCase';
import { GetEventByIdUseCase } from '../usecases/GetEventByIdUseCase';
import { UpdateEventUseCase } from '../usecases/UpdateEventUseCase';
import { DeleteEventUseCase } from '../usecases/DeleteEventUseCase';
import { RegisterUserUseCase } from '../usecases/RegisterUserUseCase';
import { LoginUserUseCase } from '../usecases/LoginUserUseCase';
import { CreateGroupUseCase } from '../usecases/CreateGroupUseCase';
import { ListGroupsUseCase } from '../usecases/ListGroupsUseCase';
import { AddUserToGroupUseCase } from '../usecases/AddUserToGroupUseCase';
import { RegisterToEventUseCase } from '../usecases/RegisterToEventUseCase';
import { UnregisterFromEventUseCase } from '../usecases/UnregisterFromEventUseCase';
import { ListEventRegistrationsUseCase } from '../usecases/ListEventRegistrationsUseCase';
import { EventController } from '../presentation/controllers/EventController';
import { AuthController } from '../presentation/controllers/AuthController';
import { GroupController } from '../presentation/controllers/GroupController';
import { EventRegistrationController } from '../presentation/controllers/EventRegistrationController';
import { ViewController } from '../presentation/controllers/ViewController';

export class Container {
  private static eventRepository: MongoEventRepository;
  private static userRepository: MongoUserRepository;
  private static groupRepository: MongoGroupRepository;
  private static eventRegistrationRepository: MongoEventRegistrationRepository;
  
  private static eventController: EventController;
  private static authController: AuthController;
  private static groupController: GroupController;
  private static eventRegistrationController: EventRegistrationController;
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

  public static getAuthController(): AuthController {
    if (!Container.authController) {
      const userRepository = Container.getUserRepository();
      
      const registerUserUseCase = new RegisterUserUseCase(userRepository);
      const loginUserUseCase = new LoginUserUseCase(userRepository);

      Container.authController = new AuthController(
        registerUserUseCase,
        loginUserUseCase
      );
    }

    return Container.authController;
  }

  public static getGroupController(): GroupController {
    if (!Container.groupController) {
      const groupRepository = Container.getGroupRepository();
      const userRepository = Container.getUserRepository();
      
      const createGroupUseCase = new CreateGroupUseCase(groupRepository, userRepository);
      const listGroupsUseCase = new ListGroupsUseCase(groupRepository);
      const addUserToGroupUseCase = new AddUserToGroupUseCase(groupRepository, userRepository);

      Container.groupController = new GroupController(
        createGroupUseCase,
        listGroupsUseCase,
        addUserToGroupUseCase
      );
    }

    return Container.groupController;
  }

  public static getEventRegistrationController(): EventRegistrationController {
    if (!Container.eventRegistrationController) {
      const eventRegistrationRepository = Container.getEventRegistrationRepository();
      const eventRepository = Container.getEventRepository();
      const userRepository = Container.getUserRepository();
      
      const registerToEventUseCase = new RegisterToEventUseCase(
        eventRegistrationRepository,
        eventRepository,
        userRepository
      );
      const unregisterFromEventUseCase = new UnregisterFromEventUseCase(
        eventRegistrationRepository,
        eventRepository
      );
      const listEventRegistrationsUseCase = new ListEventRegistrationsUseCase(
        eventRegistrationRepository
      );

      Container.eventRegistrationController = new EventRegistrationController(
        registerToEventUseCase,
        unregisterFromEventUseCase,
        listEventRegistrationsUseCase
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

  private static getUserRepository(): MongoUserRepository {
    if (!Container.userRepository) {
      Container.userRepository = new MongoUserRepository();
    }

    return Container.userRepository;
  }

  private static getGroupRepository(): MongoGroupRepository {
    if (!Container.groupRepository) {
      Container.groupRepository = new MongoGroupRepository();
    }

    return Container.groupRepository;
  }

  private static getEventRegistrationRepository(): MongoEventRegistrationRepository {
    if (!Container.eventRegistrationRepository) {
      Container.eventRegistrationRepository = new MongoEventRegistrationRepository();
    }

    return Container.eventRegistrationRepository;
  }
}

