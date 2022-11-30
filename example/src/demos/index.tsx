import { lazy } from 'react'

const Shoe = { Component: lazy(() => import('./Shoe')) }
const Basic = { Component: lazy(() => import('./Basic')) }
const FadeMaterial = { Component: lazy(() => import('./FadeMaterial')) }
const Car = { Component: lazy(() => import('./Car')) }

export {
  Shoe,
  Basic,
  FadeMaterial,
  Car,
}
