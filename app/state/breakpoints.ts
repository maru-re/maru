import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const bp = useBreakpoints(breakpointsTailwind)

export const isMobileScreen = bp.smallerOrEqual('md')
export const isTabletScreen = bp.smallerOrEqual('lg')
