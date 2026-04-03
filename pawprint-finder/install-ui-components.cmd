@echo off
REM Script para instalar componentes UI faltantes de shadcn/ui en Windows

echo 🎨 Instalando componentes de UI faltantes...
echo.

REM Componentes requeridos
npx shadcn-ui@latest add accordion --yes 2>nul
npx shadcn-ui@latest add alert --yes 2>nul
npx shadcn-ui@latest add alert-dialog --yes 2>nul
npx shadcn-ui@latest add avatar --yes 2>nul
npx shadcn-ui@latest add badge --yes 2>nul
npx shadcn-ui@latest add calendar --yes 2>nul
npx shadcn-ui@latest add card --yes 2>nul
npx shadcn-ui@latest add carousel --yes 2>nul
npx shadcn-ui@latest add checkbox --yes 2>nul
npx shadcn-ui@latest add collapsible --yes 2>nul
npx shadcn-ui@latest add command --yes 2>nul
npx shadcn-ui@latest add context-menu --yes 2>nul
npx shadcn-ui@latest add dropdown-menu --yes 2>nul
npx shadcn-ui@latest add form --yes 2>nul
npx shadcn-ui@latest add hover-card --yes 2>nul
npx shadcn-ui@latest add input-otp --yes 2>nul
npx shadcn-ui@latest add menubar --yes 2>nul
npx shadcn-ui@latest add navigation-menu --yes 2>nul
npx shadcn-ui@latest add popover --yes 2>nul
npx shadcn-ui@latest add progress --yes 2>nul
npx shadcn-ui@latest add radio-group --yes 2>nul
npx shadcn-ui@latest add scroll-area --yes 2>nul
npx shadcn-ui@latest add select --yes 2>nul
npx shadcn-ui@latest add separator --yes 2>nul
npx shadcn-ui@latest add sheet --yes 2>nul
npx shadcn-ui@latest add sidebar --yes 2>nul
npx shadcn-ui@latest add skeleton --yes 2>nul
npx shadcn-ui@latest add slider --yes 2>nul
npx shadcn-ui@latest add switch --yes 2>nul
npx shadcn-ui@latest add table --yes 2>nul
npx shadcn-ui@latest add tabs --yes 2>nul
npx shadcn-ui@latest add toggle --yes 2>nul
npx shadcn-ui@latest add toggle-group --yes 2>nul
npx shadcn-ui@latest add tooltip --yes 2>nul

echo.
echo ✅ Componentes UI instalados
echo.
echo Componentes disponibles en components/ui/
dir /B components\ui\

pause
