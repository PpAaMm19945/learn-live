export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';
export type LogContext = '[UI]' | '[AGENT]' | '[DB]' | '[AUTH]' | '[CORE]' | '[MATRIX]' | '[PROFILE]' | '[SEC]' | '[EVIDENCE]' | '[EXPLAINER]' | '[SYNC]' | '[DEMO]';

interface LogOptions {
    level: LogLevel;
    context: LogContext;
    message: string;
    data?: any;
}

class SystemLogger {
    private levelValue(level: LogLevel): number {
        switch (level) {
            case 'trace': return 0;
            case 'debug': return 1;
            case 'info': return 2;
            case 'warn': return 3;
            case 'error': return 4;
        }
    }

    // Adjust this based on environment - showing all logs for dev
    private minLevel: number = this.levelValue('trace');

    private formatMessage({ level, context, message, data }: LogOptions): void {
        if (this.levelValue(level) < this.minLevel) return;

        const timestamp = new Date().toISOString();
        const formattedMarker = `${timestamp} ${context} [${level.toUpperCase()}]`;

        switch (level) {
            case 'error':
                console.error(formattedMarker, message, data ? data : '');
                break;
            case 'warn':
                console.warn(formattedMarker, message, data ? data : '');
                break;
            case 'info':
                console.info(formattedMarker, message, data ? data : '');
                break;
            case 'debug':
                console.debug(formattedMarker, message, data ? data : '');
                break;
            case 'trace':
                console.trace(formattedMarker, message, data ? data : '');
                break;
        }
    }

    trace(context: LogContext, message: string, data?: any) {
        this.formatMessage({ level: 'trace', context, message, data });
    }

    debug(context: LogContext, message: string, data?: any) {
        this.formatMessage({ level: 'debug', context, message, data });
    }

    info(context: LogContext, message: string, data?: any) {
        this.formatMessage({ level: 'info', context, message, data });
    }

    warn(context: LogContext, message: string, data?: any) {
        this.formatMessage({ level: 'warn', context, message, data });
    }

    error(context: LogContext, message: string, data?: any) {
        this.formatMessage({ level: 'error', context, message, data });
    }
}

export const Logger = new SystemLogger();
