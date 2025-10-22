import { Bell, Search, LogOut, User, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function Header() {
  const { user, signOut, isAdmin } = useAuth();
  const { t, i18n } = useTranslation();
  
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ur' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.setAttribute('lang', newLang);
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);

  return (
    <header className="fixed left-0 md:left-64 right-0 top-0 z-30 h-16 md:h-20 border-b border-border bg-card shadow-soft">
      <div className="flex h-full items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Search - Hidden on mobile */}
        <div className="hidden sm:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('searchPlaceholder')}
              className="pl-10 bg-muted/50 border-muted w-full"
            />
          </div>
        </div>

        {/* Mobile title */}
        <h1 className="sm:hidden text-lg font-bold text-foreground">{t('appTitle')}</h1>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* Search icon for mobile */}
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLanguage}
            title={i18n.language === 'en' ? 'Switch to Urdu' : 'انگلش میں تبدیل کریں'}
          >
            <Languages className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user?.email ? getInitials(user.email) : 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm hidden lg:inline">{user?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && (
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('admin')}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('signOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
