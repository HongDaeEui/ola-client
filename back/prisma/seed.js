"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var pg_1 = require("pg");
var adapter_pg_1 = require("@prisma/adapter-pg");
var connectionString = process.env.DATABASE_URL;
var pool = new pg_1.Pool({ connectionString: connectionString });
var adapter = new adapter_pg_1.PrismaPg(pool);
var prisma = new client_1.PrismaClient({ adapter: adapter });
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var admin, creator1, creator2, dummyTools, _i, dummyTools_1, tool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Seed starting...');
                    // 1. Clean existing data
                    return [4 /*yield*/, prisma.meetupAttendee.deleteMany()];
                case 1:
                    // 1. Clean existing data
                    _a.sent();
                    return [4 /*yield*/, prisma.meetup.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.resource.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.experiment.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.prompt.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.tool.deleteMany()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'admin@olalab.kr',
                                username: 'ola_admin',
                                name: 'Ola Admin',
                                role: 'ADMIN',
                            },
                        })];
                case 8:
                    admin = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'creator1@olalab.kr',
                                username: 'Creative_Choi',
                                name: 'Creator Choi',
                                role: 'CREATOR',
                            },
                        })];
                case 9:
                    creator1 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'creator2@olalab.kr',
                                username: 'Dev_Pastel',
                                name: 'Dev Pastel',
                                role: 'CREATOR',
                            },
                        })];
                case 10:
                    creator2 = _a.sent();
                    dummyTools = [
                        {
                            name: 'Lindy.ai',
                            shortDesc: '비즈니스 프로세스를 자동화하는 강력한 AI 에이전트',
                            description: '이메일 관리, 일정 예약, CRM 업데이트 등 복잡한 워크플로우를 스스로 수행하는 2026년형 1세대 자율형 에이전트입니다.',
                            category: '에이전트 / 자동화',
                            pricingModel: 'Free Trial',
                            rating: 4.9,
                            tags: ['Automation', 'Workflow', 'Agent'],
                            isFeatured: true,
                        },
                        {
                            name: 'Cursor',
                            shortDesc: 'AI가 코드를 직접 작성하는 차세대 IDE',
                            description: '전체 코드베이스를 이해하고 자연어 명령만으로 멀티 파일 편집부터 버그 수정까지 완벽하게 수행하는 개발 필수 도구입니다.',
                            category: '코딩 / 개발 도구',
                            pricingModel: 'Freemium',
                            rating: 4.9,
                            tags: ['IDE', 'DevTools', 'Coding'],
                            isFeatured: true,
                        },
                        {
                            name: 'NotebookLM',
                            shortDesc: '나만의 문서를 기반으로 대화하는 연구 어시스턴트',
                            description: '구글의 최신 모델을 활용해 복잡한 문서를 요약하고, 출처가 명확한 인사이트를 제공하는 지식 관리의 혁명입니다.',
                            category: '오피스 / 연구',
                            pricingModel: 'Free',
                            rating: 4.8,
                            tags: ['Research', 'Knowledge', 'Google'],
                            isFeatured: true,
                        },
                        {
                            name: 'Suno v4',
                            shortDesc: '가사 한 줄로 완벽한 노래 한 곡을 작곡',
                            description: '장르, 가사, 분위기만 지정하면 보컬까지 포함된 고품질 음악을 생성하는 대중화된 음악 생성 AI입니다.',
                            category: '오디오 / 음악',
                            pricingModel: 'Freemium',
                            rating: 4.8,
                            tags: ['Music', 'Composition', 'Vocal'],
                            isFeatured: true,
                        },
                        {
                            name: 'Midjourney v6.5',
                            shortDesc: '압도적인 퀄리티의 이미지 생성 AI',
                            description: '초현실주의부터 카툰 렌더링까지 가장 아름다운 비주얼을 만들어내는 업계 표준 이미지 제너레이터입니다.',
                            category: '이미지 / 디자인',
                            pricingModel: 'Paid',
                            rating: 4.9,
                            tags: ['Art', 'Design', 'Generative'],
                            isFeatured: false,
                        },
                        {
                            name: 'HeyGen',
                            shortDesc: '립싱크까지 완벽한 AI 영상 번역 및 아바타',
                            description: '자연스러운 입모양과 목소리 톤을 유지하며 영상을 다국어로 번역하고 고품질 아바타 영상을 생성합니다.',
                            category: '비디오 / 아바타',
                            pricingModel: 'Free Trial',
                            rating: 4.8,
                            tags: ['Video', 'Translation', 'Avatar'],
                            isFeatured: true,
                        },
                    ];
                    _i = 0, dummyTools_1 = dummyTools;
                    _a.label = 11;
                case 11:
                    if (!(_i < dummyTools_1.length)) return [3 /*break*/, 14];
                    tool = dummyTools_1[_i];
                    return [4 /*yield*/, prisma.tool.create({ data: tool })];
                case 12:
                    _a.sent();
                    _a.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 11];
                case 14: 
                // 4. Seed Experiments (Labs)
                return [4 /*yield*/, prisma.experiment.createMany({
                        data: [
                            {
                                title: '에이전트로 1인 마케팅 에이전시 굴리기',
                                description: '타겟 분석부터 SEO 블로그 포스팅까지 완전 자동화한 파이프라인 구축기',
                                stack: ['CrewAI', 'Claude 3.5', 'Jasper'],
                                metric: '업무 시간 90% 단축',
                                authorId: admin.id,
                                likes: 342,
                                category: '자동화',
                                color: 'from-emerald-500 to-teal-700',
                            },
                            {
                                title: 'Cursor와 V0 조합으로 1시간 만에 SaaS MVP 배포',
                                description: '프론트엔드부터 DB 연동까지 AI 코딩 어시스턴트의 한계 테스트',
                                stack: ['Cursor', 'Vercel v0', 'Supabase'],
                                metric: '개발 기간 2주 -> 1시간',
                                authorId: creator2.id,
                                likes: 891,
                                category: '개발',
                                color: 'from-sky-500 to-indigo-700',
                            },
                            {
                                title: '텍스트 한 줄로 4K 시네마틱 뮤직비디오 만들기',
                                description: 'Suno v4로 작곡하고 Luma로 렌더링한 방구석 프로덕션 실험',
                                stack: ['Suno v4', 'Luma', 'Midjourney'],
                                metric: '제작 비용 $0',
                                authorId: creator1.id,
                                likes: 567,
                                category: '크리에이티브',
                                color: 'from-rose-500 to-pink-700',
                            },
                        ],
                    })];
                case 15:
                    // 4. Seed Experiments (Labs)
                    _a.sent();
                    // 5. Seed Prompts
                    return [4 /*yield*/, prisma.prompt.createMany({
                            data: [
                                {
                                    title: '초현실적인 사이버펑크 도시 배경',
                                    toolName: 'Midjourney v6.5',
                                    category: '이미지 생성',
                                    content: '/imagine prompt: A hyper-realistic sprawling cyberpunk megacity at night, neon lights reflecting on wet pavement, cinematic lighting, 8k, highly detailed --ar 16:9 --v 6.5',
                                    authorId: creator1.id,
                                    likes: 124,
                                    views: 1200,
                                },
                                {
                                    title: '논리적 추론이 가미된 파이썬 코드 최적화',
                                    toolName: 'OpenAI o3 / Cursor',
                                    category: '코딩',
                                    content: 'Review this Python script for memory leaks and optimize the time complexity to O(n log n). Provide the explanation using step-by-step reasoning logic.',
                                    authorId: creator2.id,
                                    likes: 310,
                                    views: 4500,
                                },
                            ],
                        })];
                case 16:
                    // 5. Seed Prompts
                    _a.sent();
                    // 6. Seed Meetups
                    return [4 /*yield*/, prisma.meetup.create({
                            data: {
                                title: 'AI 에이전트 실무 적용 4주 챌린지',
                                description: 'Lindy, CrewAI 등을 활용하여 내 업무를 돕는 자율형 에이전트를 직접 설계하고 테스트하는 오프라인 챌린지입니다.',
                                date: new Date('2026-04-25T19:00:00Z'),
                                location: '온라인 스터디 (Zoom)',
                                isVirtual: true,
                                status: 'UPCOMING',
                            },
                        })];
                case 17:
                    // 6. Seed Meetups
                    _a.sent();
                    console.log('✅ Seeding completed! Database is full of 2026 dummy data.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [4 /*yield*/, pool.end()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
