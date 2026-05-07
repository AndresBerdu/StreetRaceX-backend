import type { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: { id: string };
    }
  }
}

export class ChallengeController {
  constructor(
    private createUseCase = new (require('../../application/create-challenge').CreateChallengeUseCase)(),
    private acceptUseCase = new (require('../../application/accepted-challenge').AcceptChallengeUseCase)(),
    private rejectUseCase = new (require('../../application/rejected-challenge').RejectChallengeUseCase)(),
    private startUseCase = new (require('../../application/start-challenge').StartChallengeUseCase)(),
    private completeUseCase = new (require('../../application/completed-challenge').CompleteChallengeUseCase)(),
    private cancelUseCase = new (require('../../application/cancelled-challenge').CancelChallengeUseCase)(),
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const result = await this.createUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  accept = async (req: Request, res: Response) => {
    try {
      const result = await this.acceptUseCase.execute(
        req.params.id,
        req.user.id 
      );
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  reject = async (req: Request, res: Response) => {
    try {
      const result = await this.rejectUseCase.execute(
        req.params.id,
        req.user.id
      );
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  start = async (req: Request, res: Response) => {
    try {
      const result = await this.startUseCase.execute(req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  complete = async (req: Request, res: Response) => {
    try {
      const { ganador_id } = req.body;

      const result = await this.completeUseCase.execute(
        req.params.id,
        ganador_id
      );

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  cancel = async (req: Request, res: Response) => {
    try {
      const result = await this.cancelUseCase.execute(
        req.params.id,
        req.user.id
      );
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
}