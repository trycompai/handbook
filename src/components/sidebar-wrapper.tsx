'use client'

import { usePathname } from 'next/navigation'
import { AppSidebar } from './app-sidebar'
import { NavigationItem } from '@/lib/markdown'

interface SidebarWrapperProps {
  navigation: NavigationItem[]
}

export function SidebarWrapper({ navigation }: SidebarWrapperProps) {
  const pathname = usePathname()

  return <AppSidebar navigation={navigation} currentPath={pathname} />
}
