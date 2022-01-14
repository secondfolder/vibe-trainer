import React, { useContext, createContext, useState } from 'react'

export const VibeLevelContext = createContext<
    [number, React.Dispatch<React.SetStateAction<number>>] | [number]
>([0])

export function useVibeLevel() {
    return useContext(VibeLevelContext)
}

export function VibeLevelProvider({children}: {children: React.ReactNode}) {
    return (
        <VibeLevelContext.Provider value={useState(0)} children={children} />
    )
}