import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ColorModeToggleProps {
  colorMode: "light" | "dark"
  toggleColorMode: () => void
}

export default function ColorModeToggle({ colorMode, toggleColorMode }: ColorModeToggleProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleColorMode}
      aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
    >
      {colorMode === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  )
}

