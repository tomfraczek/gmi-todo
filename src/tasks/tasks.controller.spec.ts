import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    // Create a mock TasksService
    const mockTasksService = {
      create: jest.fn((dto) => ({ id: Date.now(), ...dto })),
      findAll: jest.fn(() => [
        { id: 1, title: 'Test Task', description: 'Something' },
      ]),
      findOne: jest.fn((id) => ({
        id,
        title: 'Test Task',
        description: 'Something',
      })),
      findByTags: jest.fn((tags) => [
        { id: 1, title: 'Test Task', description: 'Something', tags },
      ]),
      update: jest.fn((id, dto) => ({ id, ...dto })),
      remove: jest.fn((id) => ({ id })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    const createTaskDto = new CreateTaskDto();
    await controller.create(createTaskDto);
    expect(service.create).toHaveBeenCalledWith(createTaskDto);
  });

  it('should retrieve all tasks', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should retrieve a single task by ID', async () => {
    const id = '1';
    await controller.findOne(id);
    expect(service.findOne).toHaveBeenCalledWith(+id);
  });

  it('should retrieve tasks by tags', async () => {
    const tags = 'home,urgent';
    await controller.findByTags(tags);
    expect(service.findByTags).toHaveBeenCalledWith(tags.split(','));
  });

  it('should update a task', async () => {
    const updateTaskDto = new UpdateTaskDto();
    const id = '1';
    await controller.update(id, updateTaskDto);
    expect(service.update).toHaveBeenCalledWith(+id, updateTaskDto);
  });

  it('should remove a task', async () => {
    const id = '1';
    await controller.remove(id);
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});
