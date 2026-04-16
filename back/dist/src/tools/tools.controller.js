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
exports.ToolsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const tools_service_1 = require("./tools.service");
let ToolsController = class ToolsController {
    toolsService;
    constructor(toolsService) {
        this.toolsService = toolsService;
    }
    findAll(category, pricing, sort) {
        return this.toolsService.findAll({ category, pricing, sort });
    }
    findFeatured() {
        return this.toolsService.findFeatured();
    }
    findTopByRating() {
        return this.toolsService.findTopByRating();
    }
    getCategoryCounts() {
        return this.toolsService.getCategoryCounts();
    }
    findPending() {
        return this.toolsService.findPending();
    }
    findOne(id) {
        return this.toolsService.findOne(id);
    }
    approve(id) {
        return this.toolsService.approve(id);
    }
    reject(id) {
        return this.toolsService.reject(id);
    }
    create(body) {
        return this.toolsService.create(body);
    }
};
exports.ToolsController = ToolsController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({}),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('pricing')),
    __param(2, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ToolsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('featured'),
    openapi.ApiResponse({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolsController.prototype, "findFeatured", null);
__decorate([
    (0, common_1.Get)('ranking'),
    openapi.ApiResponse({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolsController.prototype, "findTopByRating", null);
__decorate([
    (0, common_1.Get)('categories'),
    openapi.ApiResponse({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolsController.prototype, "getCategoryCounts", null);
__decorate([
    (0, common_1.Get)('pending'),
    openapi.ApiResponse({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToolsController.prototype, "findPending", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ToolsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    openapi.ApiResponse({}),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ToolsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    openapi.ApiResponse({}),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ToolsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({}),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ToolsController.prototype, "create", null);
exports.ToolsController = ToolsController = __decorate([
    (0, common_1.Controller)('tools'),
    __metadata("design:paramtypes", [tools_service_1.ToolsService])
], ToolsController);
//# sourceMappingURL=tools.controller.js.map