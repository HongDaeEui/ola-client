"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PromptsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptsController = void 0;
const common_1 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
const prompts_service_1 = require("./prompts.service");
const admin_guard_1 = require("../common/admin.guard");
let PromptsController = PromptsController_1 = class PromptsController {
    promptsService;
    logger = new common_1.Logger(PromptsController_1.name);
    constructor(promptsService) {
        this.promptsService = promptsService;
    }
    getPrompts(category, userEmail, page = '1', limit, admin) {
        const includeFlagged = admin === 'true';
        const take = limit ? parseInt(limit, 10) : undefined;
        const skip = take ? (parseInt(page, 10) - 1) * take : 0;
        return this.promptsService.findAll({ category, userEmail }, skip, take, includeFlagged);
    }
    findOne(id) {
        return this.promptsService.findOne(id);
    }
    incrementViews(id) {
        return this.promptsService.incrementViews(id);
    }
    remove(id) {
        return this.promptsService.remove(id);
    }
    create(body, authorization) {
        const email = this.requireEmailFromAuthHeader(authorization);
        return this.promptsService.create({
            title: body.title,
            toolName: body.toolName,
            category: body.category,
            content: body.content,
            userEmail: email,
            userName: body.userName,
        });
    }
    requireEmailFromAuthHeader(authorization) {
        if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
            throw new common_1.UnauthorizedException('Missing Bearer token.');
        }
        const token = authorization.slice(7).trim();
        if (!token) {
            throw new common_1.UnauthorizedException('Empty Bearer token.');
        }
        const secret = process.env.SUPABASE_JWT_SECRET;
        if (!secret || secret.trim().length === 0) {
            this.logger.error('SUPABASE_JWT_SECRET is not configured. Refusing to accept JWT without signature verification.');
            throw new common_1.UnauthorizedException('Server authentication is not configured.');
        }
        try {
            const payload = jwt.verify(token, secret);
            if (!payload || typeof payload === 'string') {
                throw new common_1.UnauthorizedException('Invalid token payload.');
            }
            const email = payload.email ??
                payload
                    .user_metadata?.email ??
                null;
            if (typeof email !== 'string' || email.length === 0) {
                throw new common_1.UnauthorizedException('Token does not contain an email claim.');
            }
            return email;
        }
        catch (err) {
            if (err instanceof common_1.UnauthorizedException)
                throw err;
            this.logger.warn(`JWT verification failed: ${err.message ?? 'unknown error'}`);
            throw new common_1.UnauthorizedException('Invalid or expired token.');
        }
    }
};
exports.PromptsController = PromptsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('userEmail')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('admin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, String, String]),
    __metadata("design:returntype", void 0)
], PromptsController.prototype, "getPrompts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromptsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/view'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromptsController.prototype, "incrementViews", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromptsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PromptsController.prototype, "create", null);
exports.PromptsController = PromptsController = PromptsController_1 = __decorate([
    (0, common_1.Controller)('prompts'),
    __metadata("design:paramtypes", [prompts_service_1.PromptsService])
], PromptsController);
//# sourceMappingURL=prompts.controller.js.map