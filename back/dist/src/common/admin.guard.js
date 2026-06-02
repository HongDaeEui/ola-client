"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AdminGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
const supabase_auth_util_1 = require("./supabase-auth.util");
const ADMIN_EMAIL = 'admin@olalab.kr';
let AdminGuard = AdminGuard_1 = class AdminGuard {
    logger = new common_1.Logger(AdminGuard_1.name);
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const provided = request.headers['x-admin-secret'] ??
            request.headers['X-Admin-Secret'];
        const expected = process.env.ADMIN_SECRET;
        if (expected && expected.trim().length > 0 && provided === expected) {
            return true;
        }
        const authorization = request.headers['authorization'];
        if (authorization?.toLowerCase().startsWith('bearer ')) {
            const token = authorization.slice(7).trim();
            if (expected && token === expected) {
                return true;
            }
            try {
                const { email } = await (0, supabase_auth_util_1.verifySupabaseJwt)(token);
                if (email === ADMIN_EMAIL) {
                    return true;
                }
                throw new common_1.ForbiddenException('Not an admin account.');
            }
            catch (err) {
                if (err instanceof common_1.ForbiddenException)
                    throw err;
            }
        }
        throw new common_1.ForbiddenException('Invalid or missing admin credentials.');
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = AdminGuard_1 = __decorate([
    (0, common_1.Injectable)()
], AdminGuard);
//# sourceMappingURL=admin.guard.js.map