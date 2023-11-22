"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const router = express_1.default.Router();
exports.AdminRouter = router;
router.post('/vandor', index_1.CreateVandor);
router.get('/vandors', index_1.GetVandors);
router.get('/vandor/:id', index_1.GetVandorById);
router.get('/', (req, res, next) => {
    res.json({ message: 'Hello from Admin' });
});
//# sourceMappingURL=AdminRoute.js.map