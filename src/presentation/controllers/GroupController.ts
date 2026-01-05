import { Response } from 'express';
import { CreateGroupUseCase } from '../../usecases/CreateGroupUseCase';
import { ListGroupsUseCase } from '../../usecases/ListGroupsUseCase';
import { AddUserToGroupUseCase } from '../../usecases/AddUserToGroupUseCase';
import { AuthRequest } from '../../infrastructure/middleware/AuthMiddleware';

export class GroupController {
  constructor(
    private createGroupUseCase: CreateGroupUseCase,
    private listGroupsUseCase: ListGroupsUseCase,
    private addUserToGroupUseCase: AddUserToGroupUseCase
  ) {}

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const group = await this.createGroupUseCase.execute(req.body, req.user.userId);
      res.status(201).json(group);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async list(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string | undefined;
      const groups = await this.listGroupsUseCase.execute(userId);
      res.status(200).json(groups);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async addMember(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { groupId } = req.params;
      const { userId } = req.body;

      await this.addUserToGroupUseCase.execute(groupId, userId, req.user.userId);
      res.status(200).json({ message: 'User added to group successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
