#!/bin/bash

# Script para instalar componentes UI faltantes de shadcn/ui

echo "🎨 Instalando componentes de UI faltantes..."

# Componentes requeridos que pueden no estar incluidos
npx shadcn-ui@latest add accordion --yes || true
npx shadcn-ui@latest add alert --yes || true
npx shadcn-ui@latest add alert-dialog --yes || true
npx shadcn-ui@latest add avatar --yes || true
npx shadcn-ui@latest add badge --yes || true
npx shadcn-ui@latest add calendar --yes || true
npx shadcn-ui@latest add card --yes || true
npx shadcn-ui@latest add carousel --yes || true
npx shadcn-ui@latest add checkbox --yes || true
npx shadcn-ui@latest add collapsible --yes || true
npx shadcn-ui@latest add command --yes || true
npx shadcn-ui@latest add context-menu --yes || true
npx shadcn-ui@latest add dropdown-menu --yes || true
npx shadcn-ui@latest add form --yes || true
npx shadcn-ui@latest add hover-card --yes || true
npx shadcn-ui@latest add input-otp --yes || true
npx shadcn-ui@latest add menubar --yes || true
npx shadcn-ui@latest add navigation-menu --yes || true
npx shadcn-ui@latest add popover --yes || true
npx shadcn-ui@latest add progress --yes || true
npx shadcn-ui@latest add radio-group --yes || true
npx shadcn-ui@latest add scroll-area --yes || true
npx shadcn-ui@latest add select --yes || true
npx shadcn-ui@latest add separator --yes || true
npx shadcn-ui@latest add sheet --yes || true
npx shadcn-ui@latest add sidebar --yes || true
npx shadcn-ui@latest add skeleton --yes || true
npx shadcn-ui@latest add slider --yes || true
npx shadcn-ui@latest add switch --yes || true
npx shadcn-ui@latest add table --yes || true
npx shadcn-ui@latest add tabs --yes || true
npx shadcn-ui@latest add toggle --yes || true
npx shadcn-ui@latest add toggle-group --yes || true
npx shadcn-ui@latest add tooltip --yes || true

echo "✅ Componentes UI instalados"
echo ""
echo "Componentes disponibles en components/ui/"
ls -la components/ui/
