import type { PropsWithChildren, ReactNode } from 'react'
import { ProjectAvatar, ProjectButtonBase } from './CodeControl.style'

interface ProjectButtonProps extends PropsWithChildren {
  href: string
  icon: ReactNode
}

export const ProjectButton = ({ href, icon, children }: ProjectButtonProps) => {
  const Avatar = <ProjectAvatar aria-hidden>{icon}</ProjectAvatar>

  return (
    <ProjectButtonBase
      href={href}
      rel="nofollow"
      target="_blank"
      variant="text"
      startIcon={Avatar}
    >
      {children}
    </ProjectButtonBase>
  )
}
