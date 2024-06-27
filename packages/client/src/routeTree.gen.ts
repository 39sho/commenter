/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutImport } from './routes/_layout'
import { Route as LayoutIndexImport } from './routes/_layout/index'
import { Route as ScreenRoomImport } from './routes/screen/$room'
import { Route as LayoutAboutImport } from './routes/_layout/about'
import { Route as LayoutCommentRoomImport } from './routes/_layout/comment/$room'

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)

const ScreenRoomRoute = ScreenRoomImport.update({
  path: '/screen/$room',
  getParentRoute: () => rootRoute,
} as any)

const LayoutAboutRoute = LayoutAboutImport.update({
  path: '/about',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutCommentRoomRoute = LayoutCommentRoomImport.update({
  path: '/comment/$room',
  getParentRoute: () => LayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/_layout/about': {
      id: '/_layout/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof LayoutAboutImport
      parentRoute: typeof LayoutImport
    }
    '/screen/$room': {
      id: '/screen/$room'
      path: '/screen/$room'
      fullPath: '/screen/$room'
      preLoaderRoute: typeof ScreenRoomImport
      parentRoute: typeof rootRoute
    }
    '/_layout/': {
      id: '/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/comment/$room': {
      id: '/_layout/comment/$room'
      path: '/comment/$room'
      fullPath: '/comment/$room'
      preLoaderRoute: typeof LayoutCommentRoomImport
      parentRoute: typeof LayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  LayoutRoute: LayoutRoute.addChildren({
    LayoutAboutRoute,
    LayoutIndexRoute,
    LayoutCommentRoomRoute,
  }),
  ScreenRoomRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout",
        "/screen/$room"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/about",
        "/_layout/",
        "/_layout/comment/$room"
      ]
    },
    "/_layout/about": {
      "filePath": "_layout/about.tsx",
      "parent": "/_layout"
    },
    "/screen/$room": {
      "filePath": "screen/$room.tsx"
    },
    "/_layout/": {
      "filePath": "_layout/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/comment/$room": {
      "filePath": "_layout/comment/$room.tsx",
      "parent": "/_layout"
    }
  }
}
ROUTE_MANIFEST_END */