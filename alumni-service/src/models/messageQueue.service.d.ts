export declare class MessageQueueService {
    private connection;
    private channel;
    connect(): Promise<void>;
    publishEvent(queue: string, message: Record<string, any>): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=messageQueue.service.d.ts.map