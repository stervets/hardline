import {type PublicRuntimeConfig} from "@nuxt/schema";
import {type ComponentPublicInstance} from "vue";

export type ApplicationState = { // vue.reactive in application
    isAuthorized: boolean
    isLoading: boolean
    users: User[]
    user: User
};

export type ApplicationStore = {
  token: string
}

export type Application = {
    config: PublicRuntimeConfig; // config from /config.development.ts or /config.production.ts
    state: ApplicationState;
    store: ApplicationStore;
    route: (link: string) => void;

    serverRequest: (endPoint: string, ...args: any[])=>Promise<any>;
}

export type User = {
  phone: number
  name?: string
  password: string
  isAdmin?: boolean
};

export type SipBundle = {
  username: string
  password: string
  host: string
  realm: string
  port: number
}

declare global {
    interface ComponentInstance extends ComponentPublicInstance {
        emit: (event: string, ...args: any[]) => boolean;
        on: (event: string, callback: Function) => void;
        off: (event: string, callback: Function) => void;
        transmit: (event: string, value: any) => void;
        stopTransmit: (event: string) => void;
        receive: (event: string, ...data: any[]) => any;
        $nuxt: any
    }
}