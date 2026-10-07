import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true, // snapshot en el cliente
    () => false, // snapshot en el servidor y durante la hidratación
  );
