import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const { isOnline, isSyncing, pendingChanges, syncNow } = useOfflineSync();

  return (
    <div className={cn(
      "fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg px-3 py-2 text-sm shadow-lg",
      isOnline 
        ? "bg-green-50 text-green-900 border border-green-200" 
        : "bg-amber-50 text-amber-900 border border-amber-200"
    )}>
      {isOnline ? (
        <Cloud className="h-4 w-4" />
      ) : (
        <CloudOff className="h-4 w-4" />
      )}
      
      <span className="font-medium">
        {isOnline ? 'آن لائن' : 'آف لائن'}
      </span>

      {pendingChanges > 0 && (
        <>
          <span className="text-xs">
            ({pendingChanges} تبدیلیاں منتظر)
          </span>
          {isOnline && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2"
              onClick={syncNow}
              disabled={isSyncing}
            >
              <RefreshCw className={cn("h-3 w-3", isSyncing && "animate-spin")} />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
