// src/routes/bin.mjs
import { Router } from 'express';
import { getAllBins, createBin, updateBin, assignMaintenance, isAdmin } from '../controllers/binController';
import { authenticate } from '../controllers/authController';

const binRouter = Router();

binRouter.use(authenticate, isAdmin);

binRouter.get('/', getAllBins);
binRouter.post('/', createBin);
binRouter.put('/:binId', updateBin);
binRouter.post('/:binId/maintenance', assignMaintenance);

export default binRouter;
