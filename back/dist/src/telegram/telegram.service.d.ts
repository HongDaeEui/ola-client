export declare class TelegramService {
    private readonly logger;
    private readonly botToken;
    private readonly chatId;
    constructor();
    private sendMessage;
    sendToolSubmitNotification(data: any): Promise<void>;
    sendPromptSubmitNotification(data: any): Promise<void>;
}
