import { lazy } from 'react'

const Shoe = { Component: lazy(() => import('./Shoe')) }
const Basic = { Component: lazy(() => import('./Basic')) }
const FadeMaterial = { Component: lazy(() => import('./FadeMaterial')) }

export {
  Shoe,
  Basic,
  FadeMaterial,
}
