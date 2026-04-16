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
exports.PromptsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const prompts_service_1 = require("./prompts.service");
let PromptsController = class PromptsController {
    promptsService;
    constructor(promptsService) {
        this.promptsService = promptsService;
    }
    getPrompts(category) {
        return this.promptsService.findAll({ category });
    }
    findOne(id) {
        return this.promptsService.findOne(id);
    }
    create(body) {
        return this.promptsService.create(body);
    }
};
exports.PromptsController = PromptsController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ type: [Object] }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromptsController.prototype, "getPrompts", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({}),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromptsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({}),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PromptsController.prototype, "create", null);
exports.PromptsController = PromptsController = __decorate([
    (0, common_1.Controller)('prompts'),
    __metadata("design:paramtypes", [prompts_service_1.PromptsService])
], PromptsController);
//# sourceMappingURL=prompts.controller.js.map