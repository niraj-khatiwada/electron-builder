import React from 'react'

import Moon from '~/assets/icons/moon.svg?react'
import SideNav from '~/assets/icons/side-nav.svg?react'
import Sun from '~/assets/icons/sun.svg?react'

type SVGAsComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>

function asRegistry<T extends string>(arg: Record<T, SVGAsComponent>): Record<T, SVGAsComponent> {
  return arg
}

const registry = asRegistry({
  sideNav: SideNav,
  sun: Sun,
  moon: Moon
})

export default registry
