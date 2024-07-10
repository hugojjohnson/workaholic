// src/context.tsx
import { User } from "./Interfaces"
import { createContext } from "react";


// Create contexts with initial values
export const UserContext = createContext<User>([undefined, () => {}]);

