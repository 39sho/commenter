import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== "username") return;
    callback();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener("storage", onStorage);
  };
};

const getSnapshot = () => {
  return localStorage.getItem("username") ?? "";
};

const getServerSnapshot = () => {
  return "Zli太郎";
};

const setUsername = (username: string) => {
  localStorage.setItem("username", username.trim());
  window.dispatchEvent(new StorageEvent("storage", { key: "username" }));
};

export const useUsername = () => {
  const username = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return { username, setUsername };
};

export const UsernameDialog = () => {
  const { username: storedUsername, setUsername: setStoredUsername } =
    useUsername();
  const [inputUsername, setInputUsername] = useState("");

  const isOpen = storedUsername === "";

  const saveUsername = (username: string) => {
    if (username.trim() === "") return;
    setUsername(username);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ユーザー名を設定する</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          autoFocus={true}
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            saveUsername(inputUsername);
          }}
        />
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              saveUsername(inputUsername);
            }}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
