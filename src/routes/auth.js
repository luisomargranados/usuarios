import Router from "express";
import {consultartodos, autenticar, crear} from "../controllers/ctrauth";
import {transac} from "../controllers/ctrclientes";

const router = Router();
export default router; 

//auth
router.get("/auth/consultar", consultartodos);
router.post("/auth/autenticar", autenticar);
router.post("/auth/crear", crear);

//clientes
router.post("/clientes/transac", transac);