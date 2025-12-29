import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions,
} from "@angular/router";
import { routes } from "./app.routes";
import { authInterceptor } from "./interceptors/auth.interceptor";
import { loadingInterceptor } from "./interceptors/loading.interceptor";
import { provideSignalFormsConfig } from "@angular/forms/signals";
import { NG_STATUS_CLASSES } from "@angular/forms/signals/compat";

export const appProviders = [
  provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
  provideRouter(
    routes,
    withComponentInputBinding(),
    withPreloading(PreloadAllModules),
    withViewTransitions()
  ),
  provideSignalFormsConfig({
    classes: NG_STATUS_CLASSES,
  }),
];

export const appConfig: ApplicationConfig = {
  providers: [...appProviders],
};
