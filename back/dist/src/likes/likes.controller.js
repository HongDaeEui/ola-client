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
var LikesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikesController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const jwt = __importStar(require("jsonwebtoken"));
const likes_service_1 = require("./likes.service");
let LikesController = LikesController_1 = class LikesController {
    likesService;
    logger = new common_1.Logger(LikesController_1.name);
    constructor(likesService) {
        this.likesService = likesService;
    }
    toggle(body, authorization) {
        const userId = this.requireUserIdFromAuthHeader(authorization);
        return this.likesService.toggle(userId, body.targetType, body.targetId);
    }
    getStatus(targetType, targetId, authorization) {
        const userId = this.requireUserIdFromAuthHeader(authorization);
        return this.likesService.getStatus(userId, targetType, targetId);
    }
    requireUserIdFromAuthHeader(authorization) {
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
            const sub = payload.sub;
            if (typeof sub !== 'string' || sub.length === 0) {
                throw new common_1.UnauthorizedException('Token does not contain a sub claim.');
            }
            return sub;
        }
        catch (err) {
            if (err instanceof common_1.UnauthorizedException)
                throw err;
            this.logger.warn(`JWT verification failed: ${err.message ?? 'unknown error'}`);
            throw new common_1.UnauthorizedException('Invalid or expired token.');
        }
    }
};
exports.LikesController = LikesController;
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60000 } }),
    (0, common_1.Post)('toggle'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LikesController.prototype, "toggle", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Query)('targetType')),
    __param(1, (0, common_1.Query)('targetId')),
    __param(2, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], LikesController.prototype, "getStatus", null);
exports.LikesController = LikesController = LikesController_1 = __decorate([
    (0, common_1.Controller)('likes'),
    __metadata("design:paramtypes", [likes_service_1.LikesService])
], LikesController);
//# sourceMappingURL=likes.controller.js.map