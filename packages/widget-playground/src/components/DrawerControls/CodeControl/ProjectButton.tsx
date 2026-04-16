import type { JSX, PropsWithChildren, ReactNode } from 'react'
import { ProjectAvatar, ProjectButtonBase } from './CodeControl.style.js'

interface ProjectButtonProps extends PropsWithChildren {
  href: string
  icon?: ReactNode
  iconSrc?: string
}

export const ProjectButton = ({
  href,
  icon,
  iconSrc,
  children,
}: ProjectButtonProps): JSX.Element => {
  const Avatar = (
    <ProjectAvatar aria-hidden src={iconSrc}>
      {icon}
    </ProjectAvatar>
  )

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
