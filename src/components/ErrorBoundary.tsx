import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Logger } from '@/lib/Logger';
import { Button } from '@/components/ui/button';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        Logger.error('[UI]', 'Uncaught error in React component tree', { error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center text-foreground">
                    <div className="max-w-md w-full p-8 border-2 border-destructive rounded-2xl bg-card shadow-lg">
                        <h2 className="text-2xl font-black mb-4 text-destructive">Something went wrong</h2>
                        <p className="text-muted-foreground mb-6">
                            We've encountered an unexpected error. Please refresh the page to try again.
                        </p>
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={() => window.location.reload()}
                        >
                            Reload Application
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
