"use client";

import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { ReactNode } from "react";
import DemoTheme from "@/style/Theme";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={DemoTheme}>{children}</ThemeProvider>
      </StyledEngineProvider>
    </AppRouterCacheProvider>
  );
}
