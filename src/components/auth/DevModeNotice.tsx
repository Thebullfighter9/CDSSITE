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
        <strong>Development Mode</strong> - You can login with CEO credentials:
        <br />
        <code className="text-xs bg-yellow-500/20 px-1 rounded">
          AlexDowling@circuitdreamsstudios.com
        </code>
        <br />
        <code className="text-xs bg-yellow-500/20 px-1 rounded">
          Hz3492k5$!
        </code>
      </AlertDescription>
    </Alert>
  );
}
