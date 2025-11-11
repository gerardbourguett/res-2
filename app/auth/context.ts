import { createContext } from "react-router";
import type { User } from "../types/auth.types";

export const userContext = createContext<User | null>(null);
