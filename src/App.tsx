import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import StockDetail from "./pages/StockDetail";
import NewsPage from "./pages/NewsPage";
import RankingsPage from "./pages/RankingsPage";
import CalculatorPage from "./pages/CalculatorPage";
import NotFound from "./pages/NotFound";
import IndexDetail from "./pages/IndexDetail";
import AuthPage from "./pages/AuthPage";
import WatchlistPage from "./pages/WatchlistPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LearnPage from "./pages/LearnPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/stock/:symbol" element={<StockDetail />} />
              <Route path="/index/:symbol" element={<IndexDetail />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/calculators" element={<CalculatorPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CurrencyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
