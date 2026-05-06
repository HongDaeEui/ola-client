"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetupsController = void 0;
const common_1 = require("@nestjs/common");
const meetups_service_1 = require("./meetups.service");
const create_meetup_dto_1 = require("./dto/create-meetup.dto");
const supabase_auth_util_1 = require("../common/supabase-auth.util");
let MeetupsController = class MeetupsController {
    meetupsService;
    constructor(meetupsService) {
        this.meetupsService = meetupsService;
    }
    async create(dto, authorization) {
        const { email } = await this.extractUser(authorization);
        return this.meetupsService.createMeetup(dto, email);
    }
    findAll() {
        return this.meetupsService.findAll();
    }
    findUpcoming() {
        return this.meetupsService.findUpcoming();
    }
    findOne(id) {
        return this.meetupsService.findById(id);
    }
    async rsvp(id, body, authorization) {
        const { email } = await this.extractUser(authorization);
        return this.meetupsService.rsvpToggle(id, email, body.userName);
    }
    async getStatus(id, authorization) {
        const { email } = await this.extractUser(authorization);
        return this.meetupsService.getStatus(id, email);
    }
    async extractUser(authorization) {
        if (!authorization?.toLowerCase().startsWith('bearer ')) {
            throw new common_1.UnauthorizedException('Missing Bearer token.');
        }
        const token = authorization.slice(7).trim();
        if (!token)
            throw new common_1.UnauthorizedException('Empty Bearer token.');
        return (0, supabase_auth_util_1.verifySupabaseJwt)(token);
    }
};
exports.MeetupsController = MeetupsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_meetup_dto_1.CreateMeetupDto, String]),
    __metadata("design:returntype", Promise)
], MeetupsController.prototype, "create", null);
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
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MeetupsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/rsvp'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], MeetupsController.prototype, "rsvp", null);
__decorate([
    (0, common_1.Get)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MeetupsController.prototype, "getStatus", null);
exports.MeetupsController = MeetupsController = __decorate([
    (0, common_1.Controller)('meetups'),
    __metadata("design:paramtypes", [meetups_service_1.MeetupsService])
], MeetupsController);
//# sourceMappingURL=meetups.controller.js.map