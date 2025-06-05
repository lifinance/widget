import { Collapse } from '@mui/material'
import type { PropsWithChildren } from 'react'
import type { RouteObject } from 'react-router-dom'
import { useRoutes as useDOMRoutes } from 'react-router-dom'
import { CollapseContainer, RouteTopLevelGrow } from './Expansion.style'

interface ExpansionProps {
  allowedPaths: string[]
}

const timeout = { enter: 225, exit: 225, appear: 0 }

export const Expansion = ({
  allowedPaths,
  children,
}: PropsWithChildren<ExpansionProps>) => {
  const routes: RouteObject[] = [
    ...allowedPaths.map((path) => ({ path: path, element: true })),
    {
      path: '*',
      element: null,
    },
  ]
  const element = useDOMRoutes(routes)
  const match = Boolean((element?.props as PropsWithChildren)?.children)
  return (
    <CollapseContainer>
      <Collapse timeout={timeout} in={match} orientation="horizontal">
        <RouteTopLevelGrow
          timeout={timeout}
          in={match}
          mountOnEnter
          unmountOnExit
        >
          <div>{children}</div>
        </RouteTopLevelGrow>
      </Collapse>
    </CollapseContainer>
  )
}
