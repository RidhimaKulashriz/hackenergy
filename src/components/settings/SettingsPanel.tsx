import { Settings, X, Sun, Moon, Type, Minimize2, Maximize2, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

export const SettingsPanel = () => {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    reduceMotion,
    setReduceMotion,
    showOnscreenKeyboard,
    setShowOnscreenKeyboard,
  } = useTheme();

  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Open settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your CollabForge experience
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Theme</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('galaxy')}
                className={`glass-hover p-4 rounded-xl text-left transition-all ${
                  theme === 'galaxy' ? 'ring-2 ring-primary' : ''
                }`}
                aria-pressed={theme === 'galaxy'}
              >
                <Moon className="h-6 w-6 mb-2 text-primary" />
                <div className="font-semibold">Galaxy</div>
                <div className="text-sm text-muted-foreground">
                  Dark theme with starfield
                </div>
              </button>
              <button
                onClick={() => setTheme('sun')}
                className={`glass-hover p-4 rounded-xl text-left transition-all ${
                  theme === 'sun' ? 'ring-2 ring-primary' : ''
                }`}
                aria-pressed={theme === 'sun'}
              >
                <Sun className="h-6 w-6 mb-2 text-warning" />
                <div className="font-semibold">Sun</div>
                <div className="text-sm text-muted-foreground">
                  Light theme with warmth
                </div>
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Font Size</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={fontSize === 'small' ? 'default' : 'outline'}
                onClick={() => setFontSize('small')}
                className="flex items-center gap-2"
              >
                <Minimize2 className="h-4 w-4" />
                Small
              </Button>
              <Button
                variant={fontSize === 'default' ? 'default' : 'outline'}
                onClick={() => setFontSize('default')}
                className="flex items-center gap-2"
              >
                <Type className="h-4 w-4" />
                Default
              </Button>
              <Button
                variant={fontSize === 'large' ? 'default' : 'outline'}
                onClick={() => setFontSize('large')}
                className="flex items-center gap-2"
              >
                <Maximize2 className="h-4 w-4" />
                Large
              </Button>
            </div>
          </div>

          {/* Accessibility Options */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Accessibility</Label>
            
            <div className="flex items-center justify-between glass p-4 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="reduce-motion" className="cursor-pointer">
                  Reduce Motion
                </Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and parallax effects
                </p>
              </div>
              <Switch
                id="reduce-motion"
                checked={reduceMotion}
                onCheckedChange={setReduceMotion}
              />
            </div>

            <div className="flex items-center justify-between glass p-4 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="onscreen-keyboard" className="cursor-pointer">
                  Onscreen Keyboard
                </Label>
                <p className="text-sm text-muted-foreground">
                  Show virtual keyboard overlay
                </p>
              </div>
              <Switch
                id="onscreen-keyboard"
                checked={showOnscreenKeyboard}
                onCheckedChange={setShowOnscreenKeyboard}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
