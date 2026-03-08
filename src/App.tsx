import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BottomNav } from "@/components/BottomNav";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Index = lazy(() => import("./pages/Index"));
const StockDetail = lazy(() => import("./pages/StockDetail"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const RankingsPage = lazy(() => import("./pages/RankingsPage"));
const CalculatorPage = lazy(() => import("./pages/CalculatorPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const IndexDetail = lazy(() => import("./pages/IndexDetail"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const WatchlistPage = lazy(() => import("./pages/WatchlistPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const LearnPage = lazy(() => import("./pages/LearnPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const CommodityDetail = lazy(() => import("./pages/CommodityDetail"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));

const queryClient = new QueryClient();

const PageLoader = () => <div className="min-h-screen bg-background flex items-center justify-center"><Skeleton className="h-8 w-32 rounded-lg" /></div>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
      <CurrencyProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/stock/:symbol" element={<StockDetail />} />
                  <Route path="/index/:symbol" element={<IndexDetail />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/rankings" element={<RankingsPage />} />
                  <Route path="/calculators" element={<CalculatorPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/watchlist" element={<WatchlistPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/commodity/:symbol" element={<CommodityDetail />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/learn" element={<LearnPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <BottomNav />
            </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </CurrencyProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
