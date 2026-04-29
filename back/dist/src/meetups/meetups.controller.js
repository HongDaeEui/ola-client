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
var MeetupsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetupsController = void 0;
const common_1 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
const meetups_service_1 = require("./meetups.service");
let MeetupsController = MeetupsController_1 = class MeetupsController {
    meetupsService;
    logger = new common_1.Logger(MeetupsController_1.name);
    constructor(meetupsService) {
        this.meetupsService = meetupsService;
    }
    findAll() {
        return this.meetupsService.findAll();
    }
    findUpcoming() {
        return this.meetupsService.findUpcoming();
    }
    rsvp(id, body, authorization) {
        const email = this.requireEmailFromAuthHeader(authorization);
        return this.meetupsService.rsvpToggle(id, email, body.userName);
    }
    getStatus(id, authorization) {
        const email = this.requireEmailFromAuthHeader(authorization);
        return this.meetupsService.getStatus(id, email);
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
exports.MeetupsController = MeetupsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MeetupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MeetupsController.prototype, "findUpcoming", null);
__decorate([
    (0, common_1.Post)(':id/rsvp'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], MeetupsController.prototype, "rsvp", null);
__decorate([
    (0, common_1.Get)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MeetupsController.prototype, "getStatus", null);
exports.MeetupsController = MeetupsController = MeetupsController_1 = __decorate([
    (0, common_1.Controller)('meetups'),
    __metadata("design:paramtypes", [meetups_service_1.MeetupsService])
], MeetupsController);
//# sourceMappingURL=meetups.controller.js.map