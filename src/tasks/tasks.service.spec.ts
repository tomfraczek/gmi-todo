import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      task: {
        create: jest.fn((dto) => Promise.resolve({ id: 1, ...dto.data })),
        findMany: jest.fn(() =>
          Promise.resolve([
            {
              id: 1,
              title: 'Task One',
              description: 'Do something',
              tags: ['home', 'urgent'],
            },
          ]),
        ),
        findUnique: jest.fn((condition) =>
          Promise.resolve({
            id: condition.where.id,
            title: 'Task One',
            description: 'Do something',
            tags: ['home', 'urgent'],
          }),
        ),
        update: jest.fn((args) =>
          Promise.resolve({ ...args.data, id: args.where.id }),
        ),
        delete: jest.fn((condition) =>
          Promise.resolve({ id: condition.where.id }),
        ),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new task', async () => {
    const createTaskDto = new CreateTaskDto();
    createTaskDto.title = 'New Task';
    createTaskDto.description = 'Test Description';
    createTaskDto.tags = ['home', 'urgent'];
    expect(await service.create(createTaskDto)).toEqual({
      id: 1,
      title: 'New Task',
      description: 'Test Description',
      tags: ['home', 'urgent'],
    });
    expect(prismaService.task.create).toHaveBeenCalledWith({
      data: createTaskDto,
    });
  });

  it('should find all tasks', async () => {
    expect(await service.findAll()).toEqual([
      {
        id: 1,
        title: 'Task One',
        description: 'Do something',
        tags: ['home', 'urgent'],
      },
    ]);
    expect(prismaService.task.findMany).toHaveBeenCalled();
  });

  it('should find a task by id', async () => {
    const taskId = 1;
    expect(await service.findOne(taskId)).toEqual({
      id: taskId,
      title: 'Task One',
      description: 'Do something',
      tags: ['home', 'urgent'],
    });
    expect(prismaService.task.findUnique).toHaveBeenCalledWith({
      where: { id: taskId },
    });
  });

  it('should find tasks by tags', async () => {
    const tags = ['home', 'urgent'];
    expect(await service.findByTags(tags)).toEqual([
      {
        id: 1,
        title: 'Task One',
        description: 'Do something',
        tags: tags,
      },
    ]);
    expect(prismaService.task.findMany).toHaveBeenCalledWith({
      where: {
        tags: {
          hasEvery: tags,
        },
      },
    });
  });

  it('should update a task', async () => {
    const updateTaskDto = new UpdateTaskDto();
    updateTaskDto.title = 'Updated Task';
    updateTaskDto.description = 'Updated Description';
    const taskId = 1;
    expect(await service.update(taskId, updateTaskDto)).toEqual({
      id: taskId,
      title: 'Updated Task',
      description: 'Updated Description',
    });
    expect(prismaService.task.update).toHaveBeenCalledWith({
      where: { id: taskId },
      data: updateTaskDto,
    });
  });

  it('should delete a task', async () => {
    const taskId = 1;
    expect(await service.remove(taskId)).toEqual({ id: taskId });
    expect(prismaService.task.delete).toHaveBeenCalledWith({
      where: { id: taskId },
    });
  });
});
