import express from 'express';
import { login } from '../controllers/auth.js';

const router = express.Router(); // will allow express to configure all these routes and keep them in separate files

router.post('/login', login);

export default router;
