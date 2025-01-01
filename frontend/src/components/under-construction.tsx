import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function UnderConstruction() {
  return (
    <Alert className="max-w-xl mx-auto mt-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Under Construction</AlertTitle>
      <AlertDescription>
        This page is currently under construction. Please check back later.
      </AlertDescription>
    </Alert>
  );
}
