import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { I18nextProvider } from "react-i18next"
import i18n from "./i18n"
import { ThemeModeProvider } from "./contexts/ThemeModeContext"
import { AuthProvider } from "./contexts/AuthContext"
import AppRoutes from "./AppRoutes"

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Main App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <ThemeModeProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ThemeModeProvider>
        </BrowserRouter>
      </I18nextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
