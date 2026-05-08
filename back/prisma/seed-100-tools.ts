import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const toolData = [
  // LLMs / Chatbots
  { name: 'ChatGPT', developer: 'OpenAI', category: 'LLMs', shortDesc: '가장 널리 쓰이는 대화형 AI', description: 'OpenAI의 GPT-4o 기반 대화형 AI. 텍스트, 이미지, 음성을 지원하는 범용 AI 비서입니다.', pricingModel: 'Freemium', tags: ['대화형', 'GPT-4', '범용'] },
  { name: 'Claude', developer: 'Anthropic', category: 'LLMs', shortDesc: '뛰어난 코딩/분석 능력의 AI', description: '자연스러운 문장과 뛰어난 코딩 능력을 자랑하는 AI. 3.5 Sonnet 모델이 특히 각광받고 있습니다.', pricingModel: 'Freemium', tags: ['코딩', '분석', '문서작성'] },
  { name: 'Gemini', developer: 'Google', category: 'LLMs', shortDesc: '구글 생태계와 결합된 AI', description: 'Google Workspace와 연동되며 멀티모달 능력이 뛰어난 구글의 플래그십 AI 모델.', pricingModel: 'Freemium', tags: ['멀티모달', '구글', '검색'] },
  { name: 'Copilot', developer: 'Microsoft', category: 'LLMs', shortDesc: '웹 검색과 오피스를 결합한 AI', description: 'Bing 검색과 결합되어 최신 정보를 제공하며 윈도우/오피스와 깊게 연동됩니다.', pricingModel: 'Freemium', tags: ['검색', '오피스', '이미지생성'] },
  { name: 'Perplexity', developer: 'Perplexity', category: 'Search AI', shortDesc: '출처를 명확히 알려주는 AI 검색엔진', description: '웹을 실시간으로 검색하여 논문, 기사 등의 출처를 명확히 제시하는 검색 특화 AI.', pricingModel: 'Freemium', tags: ['검색', '리서치', '출처확인'] },
  { name: 'Pi', developer: 'Inflection', category: 'LLMs', shortDesc: '감성적이고 친절한 개인용 AI 비서', description: '공감 능력이 뛰어나고 대화의 맥락을 잘 파악하는 일상 대화 특화 AI.', pricingModel: 'Free', tags: ['감성대화', '일상용'] },
  { name: 'Poe', developer: 'Quora', category: 'LLMs', shortDesc: '다양한 AI 모델을 한 곳에서', description: 'ChatGPT, Claude, Llama 등 여러 회사의 AI 모델을 하나의 플랫폼에서 사용 가능.', pricingModel: 'Freemium', tags: ['플랫폼', '다중모델'] },
  { name: 'HuggingChat', developer: 'Hugging Face', category: 'LLMs', shortDesc: '오픈소스 AI 모델 테스트 플랫폼', description: '최신 오픈소스 언어 모델들을 무료로 테스트해볼 수 있는 플랫폼.', pricingModel: 'Free', tags: ['오픈소스', '테스트'] },
  { name: 'GroqChat', developer: 'Groq', category: 'LLMs', shortDesc: '초고속 LPU 기반 실시간 AI 챗봇', description: '독자적인 LPU 칩을 사용하여 타의 추종을 불허하는 초고속 답변 생성 속도를 자랑합니다.', pricingModel: 'Free', tags: ['초고속', '오픈소스모델'] },
  { name: 'Mistral Le Chat', developer: 'Mistral', category: 'LLMs', shortDesc: '유럽 최고의 오픈소스 AI', description: '강력한 성능의 오픈소스 모델(Mistral Large 등)을 제공하는 프랑스 스타트업의 챗봇.', pricingModel: 'Freemium', tags: ['오픈소스', '유럽AI'] },
  { name: 'Character.ai', developer: 'Character', category: 'LLMs', shortDesc: '가상의 캐릭터와 대화하는 플랫폼', description: '유명인, 애니메이션 캐릭터, 혹은 직접 만든 페르소나와 실감나는 대화가 가능합니다.', pricingModel: 'Freemium', tags: ['캐릭터', '엔터테인먼트'] },
  { name: 'Llama 3', developer: 'Meta', category: 'LLMs', shortDesc: '메타의 강력한 오픈소스 생태계', description: '가장 강력한 오픈소스 언어 모델. 로컬에서 실행하거나 다양한 클라우드에서 활용 가능.', pricingModel: 'Free', tags: ['오픈소스', '메타'] },
  
  // Image Generation
  { name: 'Midjourney', developer: 'Midjourney', category: 'Image Generation', shortDesc: '최고의 예술성을 자랑하는 이미지 AI', description: '디스코드 기반으로 작동하며 놀라운 디테일과 예술적인 결과물을 제공합니다.', pricingModel: 'Paid', tags: ['이미지생성', '디스코드', '고퀄리티'] },
  { name: 'DALL-E 3', developer: 'OpenAI', category: 'Image Generation', shortDesc: '프롬프트를 가장 잘 이해하는 이미지 AI', description: 'ChatGPT 내에서 사용 가능하며, 사용자의 의도를 정확히 파악하여 이미지를 생성합니다.', pricingModel: 'Freemium', tags: ['프롬프트이해', 'ChatGPT'] },
  { name: 'Stable Diffusion', developer: 'Stability AI', category: 'Image Generation', shortDesc: '무한한 확장성의 오픈소스 이미지 AI', description: '로컬 PC에서 실행 가능하며 ControlNet, LoRA 등을 통해 세밀한 제어가 가능합니다.', pricingModel: 'Free', tags: ['오픈소스', '로컬구동', '제어력'] },
  { name: 'Adobe Firefly', developer: 'Adobe', category: 'Image Generation', shortDesc: '저작권 문제없는 상업용 이미지 AI', description: '포토샵과 연동되며 저작권이 확보된 이미지로만 학습하여 상업적 이용이 안전합니다.', pricingModel: 'Freemium', tags: ['상업용', '포토샵', '저작권안전'] },
  { name: 'Leonardo.ai', developer: 'Leonardo', category: 'Image Generation', shortDesc: '게임 에셋 및 다양한 스타일 생성 특화', description: 'Stable Diffusion 기반으로 웹에서 편리하게 고퀄리티 이미지를 생성할 수 있습니다.', pricingModel: 'Freemium', tags: ['웹기반', '게임에셋'] },
  { name: 'Ideogram', developer: 'Ideogram', category: 'Image Generation', shortDesc: '이미지 내 텍스트 렌더링 최강자', description: '포스터, 로고, 타이포그래피 등 글자가 포함된 이미지를 가장 잘 만들어냅니다.', pricingModel: 'Freemium', tags: ['타이포그래피', '로고', '텍스트렌더링'] },
  { name: 'Krea AI', developer: 'Krea', category: 'Image Generation', shortDesc: '실시간 이미지 생성 및 업스케일링', description: '내가 그림을 그리는 실시간으로 AI 이미지가 렌더링되며 강력한 화질 개선 기능을 제공합니다.', pricingModel: 'Freemium', tags: ['실시간', '업스케일링'] },
  { name: 'Magnific AI', developer: 'Magnific', category: 'Image Generation', shortDesc: '압도적인 디테일의 AI 업스케일러', description: '기존 이미지를 상상할 수 없는 수준의 디테일로 재창조해주는 업스케일링 도구.', pricingModel: 'Paid', tags: ['업스케일링', '디테일강화'] },
  { name: 'Playground AI', developer: 'Playground', category: 'Image Generation', shortDesc: '하루 100장 무료 이미지 생성', description: '다양한 필터와 직관적인 캔버스 인터페이스를 제공하는 웹 기반 이미지 생성기.', pricingModel: 'Freemium', tags: ['무료', '직관적'] },
  { name: 'Recraft', developer: 'Recraft', category: 'Image Generation', shortDesc: '벡터(SVG) 이미지 생성에 특화된 AI', description: '로고, 아이콘, 일러스트를 벡터 포맷으로 만들어내어 디자이너들에게 유용합니다.', pricingModel: 'Freemium', tags: ['벡터', '디자인', '로고'] },
  { name: 'Fooocus', developer: 'Fooocus', category: 'Image Generation', shortDesc: 'Midjourney 퀄리티를 로컬에서 쉽게', description: '설정 없이 버튼 한 번으로 고퀄리티 이미지를 뽑아주는 오픈소스 오프라인 툴.', pricingModel: 'Free', tags: ['로컬', '오픈소스', '쉬운사용'] },
  { name: 'Tensor.art', developer: 'Tensor', category: 'Image Generation', shortDesc: '수많은 AI 모델을 무료로 사용', description: '웹상에서 수많은 Stable Diffusion 모델과 LoRA를 조합하여 이미지를 생성할 수 있습니다.', pricingModel: 'Freemium', tags: ['웹기반', '모델공유'] },
  { name: 'Civitai', developer: 'Civitai', category: 'Image Generation', shortDesc: 'AI 이미지 모델 공유의 허브', description: '전 세계 유저들이 만든 AI 모델(Checkpoints, LoRA)을 다운로드하고 공유하는 커뮤니티.', pricingModel: 'Free', tags: ['커뮤니티', '모델다운로드'] },
  { name: 'Freepik AI', developer: 'Freepik', category: 'Image Generation', shortDesc: '스톡 이미지 플랫폼의 AI 변신', description: '프롬프트 입력만으로 저작권 걱정 없는 고품질 스톡 이미지를 즉시 생성합니다.', pricingModel: 'Freemium', tags: ['스톡이미지', '빠른생성'] },

  // Video AI
  { name: 'Sora', developer: 'OpenAI', category: 'Video Generation', shortDesc: '물리법칙을 이해하는 혁신적 영상 생성 AI', description: '최대 1분 길이의 압도적으로 사실적이고 일관성 있는 동영상을 생성합니다.', pricingModel: 'Paid', tags: ['동영상', '초고화질'] },
  { name: 'Runway Gen-3', developer: 'Runway', category: 'Video Generation', shortDesc: '시네마틱 영상 생성의 선두주자', description: '알파 채널을 지원하며 영화 같은 카메라 워킹과 연출이 가능한 영상 생성 AI.', pricingModel: 'Freemium', tags: ['동영상', '시네마틱'] },
  { name: 'Luma Dream Machine', developer: 'Luma AI', category: 'Video Generation', shortDesc: '빠르고 자연스러운 고품질 영상 생성', description: '텍스트나 이미지를 놀랍도록 자연스러운 5초짜리 영상으로 순식간에 만들어냅니다.', pricingModel: 'Freemium', tags: ['동영상', '빠른속도'] },
  { name: 'Kling AI', developer: 'Kuaishou', category: 'Video Generation', shortDesc: '물리적 상호작용이 뛰어난 영상 생성', description: '음식을 먹거나 물체가 부딪히는 등 복잡한 물리 연산을 자연스럽게 구현합니다.', pricingModel: 'Freemium', tags: ['동영상', '물리연산'] },
  { name: 'Pika Labs', developer: 'Pika', category: 'Video Generation', shortDesc: '애니메이션과 립싱크에 특화', description: '디스코드 기반으로 시작해 현재는 웹에서 특정 영역 수정, 캐릭터 립싱크 등을 지원합니다.', pricingModel: 'Freemium', tags: ['동영상', '립싱크'] },
  { name: 'HeyGen', developer: 'HeyGen', category: 'Video Generation', shortDesc: '가상 아바타 비디오 제작 끝판왕', description: '사진 1장이나 짧은 영상만으로 내 목소리와 얼굴을 복제해 영상을 만듭니다.', pricingModel: 'Freemium', tags: ['아바타', '발표영상'] },
  { name: 'Synthesia', developer: 'Synthesia', category: 'Video Generation', shortDesc: '기업용 AI 아바타 프레젠테이션', description: '텍스트만 입력하면 전문 아나운서나 강사 아바타가 읽어주는 교육/홍보 영상을 제작합니다.', pricingModel: 'Paid', tags: ['기업용', '교육영상'] },
  { name: 'Descript', developer: 'Descript', category: 'Video Editing', shortDesc: '텍스트 편집하듯 동영상을 편집', description: '영상을 자동 자막 처리한 뒤, 글을 지우면 영상도 잘려나가는 혁신적 편집 툴.', pricingModel: 'Freemium', tags: ['영상편집', '자막', '팟캐스트'] },
  { name: 'CapCut AI', developer: 'ByteDance', category: 'Video Editing', shortDesc: '틱톡/쇼츠 제작을 위한 올인원 AI', description: '자동 자막, AI 필터, 목소리 변조 등 숏폼 제작에 필요한 모든 AI 기능을 제공합니다.', pricingModel: 'Freemium', tags: ['숏폼', '무료', '모바일'] },
  { name: 'Opus Clip', developer: 'Opus', category: 'Video Editing', shortDesc: '긴 영상을 10개의 쇼츠로 자동 분할', description: '유튜브 영상 링크만 넣으면 바이럴 될 만한 쇼츠 10개를 자막과 함께 뽑아줍니다.', pricingModel: 'Freemium', tags: ['쇼츠추출', '자동화'] },
  { name: 'Veed.io', developer: 'Veed', category: 'Video Editing', shortDesc: '웹 기반 올인원 비디오 에디터', description: '시선 고정 AI, 자동 자막, 번역 등 유튜버들을 위한 강력한 웹 기반 편집기.', pricingModel: 'Freemium', tags: ['웹편집', '시선처리'] },
  { name: 'Fliki', developer: 'Fliki', category: 'Video Generation', shortDesc: '텍스트를 유튜브 영상으로 원클릭 변환', description: '블로그 글이나 대본을 넣으면 관련 스톡 영상과 AI 성우를 결합해 영상을 뚝딱 만듭니다.', pricingModel: 'Freemium', tags: ['텍스트투비디오', '유튜브'] },
  { name: 'InVideo AI', developer: 'InVideo', category: 'Video Generation', shortDesc: '프롬프트로 유튜브 쇼츠/롱폼 생성', description: '주제만 던져주면 대본 작성부터 음성, 영상 컷편집까지 한 번에 완성해줍니다.', pricingModel: 'Freemium', tags: ['자동생성', '유튜브'] },
  { name: 'Topaz Video AI', developer: 'Topaz Labs', category: 'Video Editing', shortDesc: '저화질 영상을 4K/8K로 업스케일링', description: '오래된 영상이나 흐릿한 영상을 놀라운 화질과 프레임(60fps)으로 복원합니다.', pricingModel: 'Paid', tags: ['화질개선', '프레임보간'] },

  // Audio / Music AI
  { name: 'Suno AI', developer: 'Suno', category: 'Audio AI', shortDesc: '라디오 퀄리티의 음악 생성 AI', description: '가사와 장르만 입력하면 보컬이 포함된 완벽한 3분짜리 노래를 만들어냅니다.', pricingModel: 'Freemium', tags: ['음악생성', '보컬'] },
  { name: 'Udio', developer: 'Udio', category: 'Audio AI', shortDesc: '최상급 음질의 AI 작곡가', description: 'Suno의 라이벌로, 특히 악기 세션의 디테일과 음질 면에서 극찬을 받는 AI.', pricingModel: 'Freemium', tags: ['음악생성', '고음질'] },
  { name: 'ElevenLabs', developer: 'ElevenLabs', category: 'Audio AI', shortDesc: '가장 자연스러운 AI 음성 합성', description: '감정과 억양까지 살려주는 최고의 TTS. 내 목소리를 1분 만에 클로닝할 수도 있습니다.', pricingModel: 'Freemium', tags: ['TTS', '목소리복제'] },
  { name: 'Murf AI', developer: 'Murf', category: 'Audio AI', shortDesc: '유튜버를 위한 스튜디오급 AI 성우', description: '다양한 억양과 나이대의 고품질 AI 성우를 제공하여 영상 나레이션에 최적화.', pricingModel: 'Freemium', tags: ['TTS', '나레이션'] },
  { name: 'PlayHT', developer: 'PlayHT', category: 'Audio AI', shortDesc: '블로그 글을 팟캐스트로 변환', description: '초현실적인 목소리를 제공하며, 대량의 텍스트를 고속으로 음성 변환합니다.', pricingModel: 'Freemium', tags: ['TTS', '대량변환'] },
  { name: 'Resemble AI', developer: 'Resemble', category: 'Audio AI', shortDesc: '엔터프라이즈급 음성 복제', description: '보안이 강화된 음성 복제 기술을 통해 콜센터나 게임 캐릭터 음성에 활용.', pricingModel: 'Paid', tags: ['목소리복제', '기업용'] },
  { name: 'Voiceflow', developer: 'Voiceflow', category: 'Audio AI', shortDesc: '음성 기반 AI 에이전트 빌더', description: '코딩 없이 드래그 앤 드롭으로 알렉사 스킬이나 음성 챗봇을 설계합니다.', pricingModel: 'Freemium', tags: ['챗봇', '노코드'] },
  { name: 'MusicGen', developer: 'Meta', category: 'Audio AI', shortDesc: '메타의 오픈소스 음악 생성 AI', description: '멜로디를 참조하거나 텍스트 프롬프트로 BGM을 생성하는 오픈소스 모델.', pricingModel: 'Free', tags: ['오픈소스', 'BGM'] },
  { name: 'Stable Audio', developer: 'Stability AI', category: 'Audio AI', shortDesc: '고품질 BGM 및 효과음 생성', description: '상업적 이용이 가능한 고음질의 배경음악과 다양한 효과음을 생성합니다.', pricingModel: 'Freemium', tags: ['BGM', '효과음'] },
  { name: 'Adobe Podcast', developer: 'Adobe', category: 'Audio AI', shortDesc: '잡음 제거 및 스튜디오 음질 복원', description: '핸드폰으로 녹음한 오디오도 스튜디오 마이크로 녹음한 것처럼 깔끔하게 바꿔줍니다.', pricingModel: 'Free', tags: ['잡음제거', '음질개선'] },
  { name: 'Kits AI', developer: 'Kits', category: 'Audio AI', shortDesc: '가수들의 AI 보컬 모델', description: '유명 가수의 목소리나 내 목소리로 노래를 부르게(AI 커버) 할 수 있는 플랫폼.', pricingModel: 'Freemium', tags: ['AI커버', '보컬변환'] },
  { name: 'Voicify AI', developer: 'Voicify', category: 'Audio AI', shortDesc: '유명인 목소리 AI 커버', description: '스폰지밥, 드레이크 등 수많은 캐릭터와 유명인의 목소리로 노래를 만듭니다.', pricingModel: 'Paid', tags: ['엔터테인먼트', '보컬커버'] },

  // Coding / Development
  { name: 'GitHub Copilot', developer: 'GitHub', category: 'Coding AI', shortDesc: '개발자들의 필수 AI 페어 프로그래머', description: '에디터 내에서 실시간으로 코드를 자동 완성해주며 생산성을 크게 높여줍니다.', pricingModel: 'Paid', tags: ['자동완성', '표준툴'] },
  { name: 'Cursor', developer: 'Cursor', category: 'Coding AI', shortDesc: '코드베이스 전체를 이해하는 AI 에디터', description: 'VS Code 기반으로, 프로젝트 전체 파일을 읽고 연관된 코드를 완벽히 수정해줍니다.', pricingModel: 'Freemium', tags: ['IDE', '맥락이해'] },
  { name: 'Devin', developer: 'Cognition', category: 'Coding AI', shortDesc: '세계 최초의 자율형 AI 소프트웨어 엔지니어', description: '목표만 주어지면 스스로 환경을 세팅하고 브라우징하며 코딩부터 배포까지 수행합니다.', pricingModel: 'Paid', tags: ['자율형', '에이전트'] },
  { name: 'V0 by Vercel', developer: 'Vercel', category: 'Coding AI', shortDesc: '프롬프트로 React UI 즉시 생성', description: '텍스트로 원하는 디자인을 설명하면 즉시 복붙 가능한 Tailwind/React 코드를 짜줍니다.', pricingModel: 'Freemium', tags: ['UI생성', '프론트엔드'] },
  { name: 'Codeium', developer: 'Codeium', category: 'Coding AI', shortDesc: '무료이면서 강력한 Copilot 대안', description: '개인 개발자에게 전면 무료로 제공되는 빠르고 훌륭한 AI 코드 자동완성 도구.', pricingModel: 'Free', tags: ['무료', '자동완성'] },
  { name: 'Supermaven', developer: 'Supermaven', category: 'Coding AI', shortDesc: '백만 토큰 컨텍스트의 초고속 코드 어시스턴트', description: '방대한 레포지토리를 한 번에 이해하고 딜레이 없이 코드를 제안하는 최신 AI.', pricingModel: 'Freemium', tags: ['초고속', '대용량컨텍스트'] },
  { name: 'Tabnine', developer: 'Tabnine', category: 'Coding AI', shortDesc: '보안을 중시하는 기업용 AI 코딩 어시스턴트', description: '로컬 환경 실행을 지원하여 기업 코드 유출 걱정 없이 사용할 수 있습니다.', pricingModel: 'Freemium', tags: ['보안', '기업용'] },
  { name: 'Phind', developer: 'Phind', category: 'Coding AI', shortDesc: '개발자를 위한 AI 검색 엔진', description: '개발 관련 질문을 하면 최신 문서와 StackOverflow를 검색해 정답 코드를 짜줍니다.', pricingModel: 'Freemium', tags: ['검색', '디버깅'] },
  { name: 'Amazon Q', developer: 'Amazon', category: 'Coding AI', shortDesc: 'AWS 환경에 최적화된 기업용 AI', description: '기존 CodeWhisperer를 계승하며 AWS 아키텍처 설계와 레거시 코드 변환을 돕습니다.', pricingModel: 'Freemium', tags: ['AWS', '엔터프라이즈'] },
  { name: 'Replit Ghostwriter', developer: 'Replit', category: 'Coding AI', shortDesc: '클라우드 IDE에 통합된 코딩 파트너', description: '웹 브라우저 환경에서 코딩, 배포, AI 디버깅을 한 번에 해결할 수 있습니다.', pricingModel: 'Paid', tags: ['웹IDE', '초보자추천'] },
  { name: 'Lovable', developer: 'Lovable', category: 'Coding AI', shortDesc: '비개발자를 위한 풀스택 앱 생성기', description: '자연어로 앱 아이디어를 설명하면 프론트엔드와 백엔드를 즉시 구축해줍니다.', pricingModel: 'Freemium', tags: ['노코드', '풀스택'] },
  { name: 'Bolt.new', developer: 'StackBlitz', category: 'Coding AI', shortDesc: '브라우저 내에서 자율 코딩 및 배포', description: '로컬 환경 설정 없이 브라우저에서 바로 AI와 함께 풀스택 앱을 코딩하고 구동합니다.', pricingModel: 'Freemium', tags: ['웹환경', '빠른실행'] },
  { name: 'Claude Code', developer: 'Anthropic', category: 'Coding AI', shortDesc: '터미널에서 동작하는 Claude 에이전트', description: '터미널 환경에서 파일 시스템을 읽고 코드를 분석, 리팩토링하는 CLI 도구입니다.', pricingModel: 'Paid', tags: ['CLI', '에이전트'] },

  // Productivity / Writing
  { name: 'Notion AI', developer: 'Notion', category: 'Productivity', shortDesc: '노션 워크스페이스에 통합된 만능 AI', description: '문서 요약, 초안 작성, 톤앤매너 수정, 데이터베이스 자동 채우기 등 막강한 기능을 제공합니다.', pricingModel: 'Paid', tags: ['문서작업', '협업'] },
  { name: 'GrammarlyGO', developer: 'Grammarly', category: 'Productivity', shortDesc: '영어 문장 교정을 넘어선 이메일 작성기', description: '수준 높은 영문 교정은 물론, 답장 내용을 요약하고 적절한 톤으로 이메일을 써줍니다.', pricingModel: 'Freemium', tags: ['영작', '이메일'] },
  { name: 'Jasper', developer: 'Jasper', category: 'Productivity', shortDesc: '기업용 마케팅 카피라이팅 AI', description: '브랜드 보이스를 학습시켜 일관된 톤으로 블로그, 광고 카피, SNS 글을 대량 생성합니다.', pricingModel: 'Paid', tags: ['마케팅', '카피라이팅'] },
  { name: 'Copy.ai', developer: 'Copy.ai', category: 'Productivity', shortDesc: '영업 및 마케팅 팀을 위한 텍스트 생성기', description: '무수한 템플릿을 제공하여 누구나 쉽게 고품질의 홍보 문구를 작성할 수 있습니다.', pricingModel: 'Freemium', tags: ['세일즈', '마케팅'] },
  { name: 'Writesonic', developer: 'Writesonic', category: 'Productivity', shortDesc: 'SEO 최적화 블로그 자동 작성', description: '최신 구글 데이터를 반영하여 검색 노출이 잘 되는 긴 블로그 포스팅을 작성합니다.', pricingModel: 'Freemium', tags: ['블로그', 'SEO'] },
  { name: 'Wordtune', developer: 'AI21 Labs', category: 'Productivity', shortDesc: '문장 재작성 및 톤 변환 특화 AI', description: '어색한 문장을 비즈니스용, 캐주얼용 등으로 즉시 다듬어주는 글쓰기 도우미.', pricingModel: 'Freemium', tags: ['글다듬기', '영작'] },
  { name: 'QuillBot', developer: 'QuillBot', category: 'Productivity', shortDesc: '논문/과제 패러프레이징의 최강자', description: '원문의 뜻은 유지하면서 단어와 구조를 바꾸어 표절을 방지하고 문장을 매끄럽게 합니다.', pricingModel: 'Freemium', tags: ['패러프레이징', '학술'] },
  { name: 'Gamma', developer: 'Gamma', category: 'Productivity', shortDesc: '한 줄 입력으로 PPT 즉시 완성', description: '주제만 던져주면 이미지, 텍스트, 레이아웃이 완벽한 프레젠테이션/웹사이트를 1분만에 만듭니다.', pricingModel: 'Freemium', tags: ['PPT', '웹사이트'] },
  { name: 'Tome', developer: 'Tome', category: 'Productivity', shortDesc: '스토리텔링 형식의 프레젠테이션 AI', description: '모바일에 최적화된 세련된 디자인의 스토리텔링형 프레젠테이션 슬라이드를 생성합니다.', pricingModel: 'Freemium', tags: ['PPT', '스토리텔링'] },
  { name: 'Beautiful.ai', developer: 'Beautiful.ai', category: 'Productivity', shortDesc: '디자인 고민을 없애주는 스마트 슬라이드', description: '텍스트를 입력하면 AI가 가장 보기 좋은 레이아웃과 디자인으로 자동 정렬해줍니다.', pricingModel: 'Paid', tags: ['디자인자동화', 'PPT'] },
  { name: 'Rytr', developer: 'Rytr', category: 'Productivity', shortDesc: '가성비 최고의 AI 글쓰기 도구', description: '다국어를 지원하며 저렴한 가격에 다양한 템플릿의 글쓰기 기능을 제공합니다.', pricingModel: 'Freemium', tags: ['가성비', '다국어'] },

  // Meetings / Transcripts
  { name: 'Fireflies.ai', developer: 'Fireflies', category: 'Meetings AI', shortDesc: '화상 회의 자동 녹음 및 회의록 작성', description: 'Zoom, Meet 등에 AI가 봇으로 참여해 대화를 녹음하고, 스크립트와 액션 아이템을 정리합니다.', pricingModel: 'Freemium', tags: ['회의록', '자동화'] },
  { name: 'Otter.ai', developer: 'Otter', category: 'Meetings AI', shortDesc: '실시간 음성 인식 및 트랜스크립션', description: '영어 회의에서 뛰어난 정확도로 실시간 자막을 제공하고 회의 요약본을 이메일로 보내줍니다.', pricingModel: 'Freemium', tags: ['음성인식', '자막'] },
  { name: 'Fathom', developer: 'Fathom', category: 'Meetings AI', shortDesc: '무료로 쓰는 고품질 AI 회의 비서', description: '통화 내용을 녹화/녹음하고 7개 국어로 즉시 요약해주는 무료 화상회의 플러그인.', pricingModel: 'Freemium', tags: ['무료비서', '줌플러그인'] },
  { name: 'Read AI', developer: 'Read', category: 'Meetings AI', shortDesc: '회의 참석자들의 반응과 감정까지 분석', description: '단순 요약을 넘어 "참석자들의 참여도와 반응"을 수치화해서 보여주는 분석 AI.', pricingModel: 'Freemium', tags: ['감정분석', '참여도'] },
  { name: 'tl;dv', developer: 'tl;dv', category: 'Meetings AI', shortDesc: '구글 밋/줌을 위한 AI 회의록 (한국어 지원)', description: '한국어 인식률이 훌륭하며 주요 순간을 타임스탬프로 클립 저장할 수 있습니다.', pricingModel: 'Freemium', tags: ['한국어특화', '영상클립'] },
  { name: 'MacWhisper', developer: 'Jordi Bruin', category: 'Meetings AI', shortDesc: '맥북 안에서 오프라인으로 녹음본 텍스트 변환', description: 'OpenAI Whisper 모델을 Mac에서 로컬로 구동하여 보안 이슈 없이 녹음 파일을 문자로 변환.', pricingModel: 'Freemium', tags: ['로컬구동', '오프라인', '보안'] },

  // Search / Research
  { name: 'Consensus', developer: 'Consensus', category: 'Research AI', shortDesc: '오직 논문만 검색해주는 학술 AI', description: '질문을 던지면 수백만 건의 동료 평가 논문을 바탕으로 과학적 근거가 있는 답변을 내놓습니다.', pricingModel: 'Freemium', tags: ['학술', '논문검색'] },
  { name: 'Elicit', developer: 'Elicit', category: 'Research AI', shortDesc: '논문 문헌 조사(Literature Review) 자동화', description: '연구 주제를 입력하면 관련 논문들을 찾아 표 형태로 핵심만 싹 요약해주는 대학원생 필수템.', pricingModel: 'Freemium', tags: ['문헌조사', '표요약'] },
  { name: 'SciSpace', developer: 'SciSpace', category: 'Research AI', shortDesc: '난해한 수식과 그래프까지 설명해주는 논문 AI', description: 'PDF 논문을 업로드하고 드래그하면 수식, 표, 텍스트의 의미를 쉽게 풀어서 설명해줍니다.', pricingModel: 'Freemium', tags: ['PDF분석', '수식해설'] },
  { name: 'ChatPDF', developer: 'ChatPDF', category: 'Research AI', shortDesc: 'PDF 문서와 대화하는 도구', description: '수백 페이지의 PDF 문서를 올리고 "이 문서의 핵심 요약해줘"라고 채팅할 수 있습니다.', pricingModel: 'Freemium', tags: ['PDF문답', '빠른요약'] },
  { name: 'Arc Search', developer: 'The Browser Company', category: 'Search AI', shortDesc: '검색 대신 "나를 위해 웹을 훑어주는" 앱', description: '모바일에서 검색어를 치면 6개의 사이트를 스스로 읽고 하나의 완벽한 웹페이지로 요약해줍니다.', pricingModel: 'Free', tags: ['브라우저', '자동요약'] },

  // Automation / Workflows
  { name: 'Zapier AI', developer: 'Zapier', category: 'Automation', shortDesc: '자연어로 수천 개의 앱 연동 자동화', description: '"지메일에 영수증 오면 구글 시트에 정리해줘"라고 쓰면 자동화 워크플로우를 알아서 짭니다.', pricingModel: 'Paid', tags: ['자동화', '노코드'] },
  { name: 'Make', developer: 'Make', category: 'Automation', shortDesc: '시각적이고 강력한 AI 자동화 플랫폼', description: 'Zapier보다 저렴하고 복잡한 분기 처리가 가능한 노코드 자동화의 최강자.', pricingModel: 'Freemium', tags: ['노코드', '복잡한분기'] },
  { name: 'n8n', developer: 'n8n', category: 'Automation', shortDesc: '개발자를 위한 오픈소스 자동화 툴', description: '직접 서버에 설치해 무료로 쓸 수 있으며 커스텀 코드를 넣어 정교한 자동화를 만듭니다.', pricingModel: 'Freemium', tags: ['오픈소스', '개발자용'] },
  { name: 'LangChain', developer: 'LangChain', category: 'Automation', shortDesc: 'LLM 애플리케이션 개발 프레임워크', description: '여러 AI 모델과 외부 데이터(PDF, DB)를 엮어서 나만의 AI 에이전트를 만드는 표준 라이브러리.', pricingModel: 'Free', tags: ['프레임워크', '에이전트'] },
  { name: 'Flowise', developer: 'Flowise', category: 'Automation', shortDesc: '드래그 앤 드롭으로 랭체인 만들기', description: '코딩 없이 노드 연결만으로 복잡한 RAG(검색 증강 생성) 챗봇을 만들 수 있는 도구입니다.', pricingModel: 'Free', tags: ['노코드', 'RAG'] },
  { name: 'Dify', developer: 'Dify', category: 'Automation', shortDesc: 'AI 앱 개발 및 배포 오픈소스 플랫폼', description: '팀 단위로 LLM 프롬프트를 관리하고 RAG 챗봇을 5분 만에 배포할 수 있는 막강한 툴.', pricingModel: 'Freemium', tags: ['오픈소스', '협업'] },

  // Marketing / SEO
  { name: 'Surfer SEO', developer: 'Surfer', category: 'Marketing', shortDesc: '검색엔진 상위노출을 위한 AI 글쓰기', description: '구글 1페이지에 있는 경쟁사 글들을 분석해 내 글에 어떤 키워드를 넣어야 할지 가이드해줍니다.', pricingModel: 'Paid', tags: ['SEO', '블로그상위노출'] },
  { name: 'Anyword', developer: 'Anyword', category: 'Marketing', shortDesc: '클릭률을 예측해주는 카피라이팅 AI', description: '작성한 광고 문구가 얼마나 많은 클릭을 유도할지 점수로 예측하고 개선해줍니다.', pricingModel: 'Paid', tags: ['클릭률예측', '카피라이팅'] },
  { name: 'Mutiny', developer: 'Mutiny', category: 'Marketing', shortDesc: 'B2B 웹사이트 개인화 AI', description: '웹사이트에 방문하는 회사에 따라 랜딩 페이지 문구와 이미지를 실시간으로 다르게 보여줍니다.', pricingModel: 'Paid', tags: ['개인화', 'B2B'] },
  { name: 'AdCreative.ai', developer: 'AdCreative', category: 'Marketing', shortDesc: '전환율 높은 배너 광고 수백장 자동 생성', description: '로고와 문구만 넣으면 인스타, 페북 규격에 맞춰 성과가 보장된 광고 배너를 쏟아냅니다.', pricingModel: 'Paid', tags: ['광고배너', '대량생성'] },

  // Design / UI
  { name: 'Canva AI (Magic Studio)', developer: 'Canva', category: 'Design', shortDesc: '누구나 디자이너가 되는 매직 스튜디오', description: '배경 지우기, 이미지 확장, 텍스트로 요소 추가 등 모든 디자인 작업에 AI가 깊이 침투해 있습니다.', pricingModel: 'Freemium', tags: ['템플릿디자인', '쉬운사용'] },
  { name: 'Figma AI', developer: 'Figma', category: 'Design', shortDesc: 'UI/UX 디자이너의 시간을 아껴주는 AI', description: '와이어프레임 자동 생성, 텍스트 더미 데이터 채우기, 레이어 정리 등 막일에서 해방시켜 줍니다.', pricingModel: 'Paid', tags: ['UIUX', '프로토타이핑'] },
  { name: 'Relume AI', developer: 'Relume', category: 'Design', shortDesc: '웹사이트 와이어프레임 1분 컷', description: '서비스 설명만 적으면 랜딩페이지의 전체 구조와 카피, 피그마 레이아웃까지 짜줍니다.', pricingModel: 'Freemium', tags: ['웹디자인', '와이어프레임'] },
  { name: 'Framer AI', developer: 'Framer', category: 'Design', shortDesc: '프롬프트로 시작하는 반응형 웹 제작', description: '문장을 입력하면 반응형 웹사이트 초안을 만들고, 컬러 팔레트를 클릭 한 번에 수정할 수 있습니다.', pricingModel: 'Freemium', tags: ['웹빌더', '반응형'] }
];

async function main() {
  console.log(`Inserting ${toolData.length} new AI tools...`);

  let count = 0;
  for (const tool of toolData) {
    const iconUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=random&color=fff&size=128`;
    const coverUrl = `https://picsum.photos/seed/${encodeURIComponent(tool.name)}/800/400`;

    await prisma.tool.create({
      data: {
        name: tool.name,
        developer: tool.developer,
        category: tool.category,
        shortDesc: tool.shortDesc,
        description: tool.description,
        pricingModel: tool.pricingModel,
        rating: Math.floor(Math.random() * 10 + 40) / 10, // 4.0 to 4.9
        likes: Math.floor(Math.random() * 500 + 50),
        status: 'ACTIVE',
        isFeatured: Math.random() > 0.8,
        tags: tool.tags,
        iconUrl,
        coverUrl,
      }
    });
    count++;
  }

  console.log(`Successfully added ${count} AI tools to the database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
