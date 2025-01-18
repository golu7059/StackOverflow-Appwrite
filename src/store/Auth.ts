import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPref {
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null;
  user: Models.User<UserPref> | null;
  jwt: string | null;
  hydrated: boolean;

  setHydrated(): void;
  verifySession(): Promise<void>;

  login(email: string, password: string): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;

  createAccount(
    email: string,
    password: string,
    name: string
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;

  logout(): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
}

// this is the zustand store Manage the Authentication state
export const useAuthStore = create<IAuthStore>()(
  // persist to ensure the data is not lost, stored in the local storage(or another backend storage)
  persist(
    // immer to ensure the state is immutable , and automatically do direct mutation under the hood
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true });
      },

      async verifySession() {
        try {
          // try to get the session from the appwrite
          const session = await account.getSession("session");
          set({ session });
        } catch (error) {
          console.log("Error in verifying session : ", error);
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          const [user, { jwt }] = await Promise.all([
            account.get<UserPref>(),
            account.createJWT(),
          ]);
          if (!user.prefs?.reputation) {
            await account.updatePrefs({ reputation: 0 });
          }
          set({ session, user, jwt });
          return { success: true };
        } catch (error) {
          console.log("Error in login : ", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async createAccount(email: string, password: string, name: string) {
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error) {
          console.log("Error in creating account : ", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async logout() {
        try {
          await account.deleteSessions(); // delete all the sessions , in case of one session give session id
          return { success: true };
        } catch (error) {
          console.log("Error in logout : ", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
    })),

    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (error) {
            console.log("Rdhydration error : ", error);
          } else {
            console.log("Unexpected error occured : ", error);
          }
        };
      },
    }
  )
);
