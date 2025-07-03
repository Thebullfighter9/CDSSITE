import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DevModeNotice() {
  const isDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (!isDev) return null;

  return (
    <Alert className="mb-4 border-yellow-500/50 bg-yellow-500/10">
      <Info className="h-4 w-4 text-yellow-500" />
      <AlertDescription className="text-yellow-200">
        <strong>Development Mode</strong> - Test accounts available:
        <br />
        <div className="mt-2 space-y-1">
          <div>
            <strong>CEO:</strong>{" "}
            <code className="text-xs bg-yellow-500/20 px-1 rounded">
              AlexDowling@circuitdreamsstudios.com
            </code>{" "}
            /{" "}
            <code className="text-xs bg-yellow-500/20 px-1 rounded">
              Hz3492k5$!
            </code>
          </div>
          <div>
            <strong>Admin:</strong>{" "}
            <code className="text-xs bg-yellow-500/20 px-1 rounded">
              dev@circuitdreamsstudios.com
            </code>{" "}
            /{" "}
            <code className="text-xs bg-yellow-500/20 px-1 rounded">
              dev123
            </code>
          </div>
          <div>
            <strong>Employee:</strong>{" "}
            <code className="text-xs bg-yellow-500/20 px-1 rounded">
              employee@circuitdreamsstudios.com
            </code>{" "}
            /{" "}
            <code className="text-xs bg-yellow-500/20 px-1 rounded">
              emp123
            </code>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
