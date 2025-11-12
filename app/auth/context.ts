import { createContext } from "react-router";
import type { User } from "../types/user.types";

export const userContext = createContext<User | null>(null);
