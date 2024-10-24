import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function aArregloDePGSql<T>(arreglo: T[]) {
  return JSON.stringify(arreglo).replace("[", "{").replace("]", "}")
}