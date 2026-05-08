import type { Request, Response } from "express";
import { updateUserRank } from "../../../notification/application/notifyRankUp.ts";
import { handleResponse } from "../../../main/infrastructure/middlewares/handleResponseMiddleware.ts";
import { fireOrmUserRepository } from "../firebase/fireOrmUserRepository.ts";
import { socketIoNotifierRepository } from "../../../notification/infrastructure/adapters/socket/socketIoNotifier.ts";
import { io } from "../../../server.ts";

const userRepository = fireOrmUserRepository();

export const updateUserRankController = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const { newRank } = req.body;
    
    const nofiticationRepository = socketIoNotifierRepository(io);
    
    const result = await updateUserRank(userRepository, nofiticationRepository)(
      slug,
      newRank,
    );

    handleResponse(res, result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ ok: false, error: error.message });
    }
  }
};
