"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBypassThrottlerGuard = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
let AdminBypassThrottlerGuard = class AdminBypassThrottlerGuard extends throttler_1.ThrottlerGuard {
    async shouldSkip(context) {
        const request = context.switchToHttp().getRequest();
        const provided = request.headers['x-admin-secret'] ?? '';
        const expected = process.env.ADMIN_SECRET ?? '';
        if (expected.length > 0 && provided === expected)
            return true;
        return super.shouldSkip(context);
    }
};
exports.AdminBypassThrottlerGuard = AdminBypassThrottlerGuard;
exports.AdminBypassThrottlerGuard = AdminBypassThrottlerGuard = __decorate([
    (0, common_1.Injectable)()
], AdminBypassThrottlerGuard);
//# sourceMappingURL=admin-bypass-throttler.guard.js.map