import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions
} from "@angular/router";
import { routes } from "./app.routes";
import { authInterceptor } from "./interceptors/auth.interceptor";
import { loadingInterceptor } from "./interceptors/loading.interceptor";

export const appProviders = [
  provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
  provideRouter(
    routes,
    withComponentInputBinding(),
    withPreloading(PreloadAllModules),
    withViewTransitions(),
  )
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...appProviders,
  ],
};
