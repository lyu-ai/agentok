'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AdaptiveTextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    onEnter?: () => void;
}

const AdaptiveTextarea = React.forwardRef<
    HTMLTextAreaElement,
    AdaptiveTextareaProps
>(({ className, onEnter, ...props }, ref) => {
    const [height, setHeight] = React.useState('16px');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const resetTextareaHeight = (textarea: HTMLTextAreaElement) => {
        textarea.style.height = '16px';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 5 * 1.5 * 20)}px`;
        setHeight(textarea.style.height);
    };

    React.useEffect(() => {
        if (textareaRef.current) {
            resetTextareaHeight(textareaRef.current);
        }
    }, [props.value]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing &&
            onEnter
        ) {
            event.preventDefault();
            onEnter();
        }
    };

    return (
        <textarea
            ref={ref || textareaRef}
            style={{ height }}
            className={cn(
                'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none',
                className
            )}
            onKeyDown={handleKeyDown}
            {...props}
        />
    );
});
AdaptiveTextarea.displayName = 'AdaptiveTextarea';

export { AdaptiveTextarea }; 