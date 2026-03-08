import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getCommodities, getCommodityHistory } from "@/lib/stockApi";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, TrendingDown, Gem, Droplets, Flame, Zap, CircleDot, Wheat, Clock, BarChart3, Globe, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

const ICONS: Record<string, React.ReactNode> = {
  Gold: <Gem className="h-6 w-6 text-yellow-500" />,
  Silver: <CircleDot className="h-6 w-6 text-slate-400" />,
  "Crude Oil (WTI)": <Droplets className="h-6 w-6 text-amber-700" />,
  "Brent Crude": <Droplets className="h-6 w-6 text-amber-600" />,
  "Natural Gas": <Flame className="h-6 w-6 text-blue-400" />,
  Copper: <Zap className="h-6 w-6 text-orange-500" />,
  Platinum: <CircleDot className="h-6 w-6 text-gray-300" />,
  Wheat: <Wheat className="h-6 w-6 text-yellow-600" />,
};

const DE_NAMES: Record<string, string> = {
  Gold: "Gold", Silver: "Silber", "Crude Oil (WTI)": "Rohöl (WTI)",
  "Brent Crude": "Brent-Rohöl", "Natural Gas": "Erdgas", Copper: "Kupfer",
  Platinum: "Platin", Wheat: "Weizen",
};

const COMMODITY_INFO: Record<string, { descEn: string; descDe: string; category: string; exchange: string; tradingHours: string; factorsEn: string[]; factorsDe: string[] }> = {
  Gold: {
    descEn: "Gold has served as a store of value for thousands of years. Central banks worldwide hold substantial gold reserves, and it remains the go-to safe-haven asset during periods of uncertainty.",
    descDe: "Gold dient seit Jahrtausenden als Wertanlage. Zentralbanken weltweit halten bedeutende Goldreserven, und in unsicheren Zeiten greifen Anleger bevorzugt auf Gold zurück.",
    category: "Precious Metals", exchange: "COMEX/NYMEX", tradingHours: "Sun–Fri 18:00–17:00 ET",
    factorsEn: ["Central bank purchases and interest rate decisions", "US dollar strength (inverse correlation)", "Geopolitical tensions and economic crises", "Inflation expectations and real yields", "Jewelry and industrial demand (electronics)"],
    factorsDe: ["Zentralbank-Käufe und Zinsentscheidungen", "Stärke des US-Dollars (inverse Korrelation)", "Geopolitische Spannungen und Wirtschaftskrisen", "Inflationserwartungen und Realzinsen", "Nachfrage aus Schmuck- und Elektronikindustrie"],
  },
  Silver: {
    descEn: "Silver combines the properties of a precious metal with broad industrial use — from electronics to solar panels. It tends to be more volatile than gold and often amplifies gold's price moves.",
    descDe: "Silber vereint die Eigenschaften eines Edelmetalls mit breiter industrieller Nutzung — von Elektronik bis Solarzellen. Es schwankt stärker als Gold und verstärkt oft dessen Preisbewegungen.",
    category: "Precious Metals", exchange: "COMEX", tradingHours: "Sun–Fri 18:00–17:00 ET",
    factorsEn: ["Solar panel and electronics demand", "Gold price movements (correlation)", "Industrial production data", "Investment demand (ETFs, coins)", "Mine supply disruptions"],
    factorsDe: ["Nachfrage aus Solar- und Elektronikindustrie", "Goldpreisentwicklung (Korrelation)", "Industrieproduktionsdaten", "Investmentnachfrage (ETFs, Münzen)", "Störungen in der Minenproduktion"],
  },
  "Crude Oil (WTI)": {
    descEn: "WTI (West Texas Intermediate) is the wichtigste US-Benchmark for crude oil. As a light, sweet crude, it's central to the global energy market. Prices respond to OPEC decisions, geopolitics, and shifts in global demand.",
    descDe: "WTI (West Texas Intermediate) ist die wichtigste US-Benchmark für Rohöl. Als leichtes, schwefelarmes Öl ist es zentral für den globalen Energiemarkt. Der Preis reagiert auf OPEC-Entscheidungen, Geopolitik und Nachfrageverschiebungen.",
    category: "Energy", exchange: "NYMEX", tradingHours: "Sun–Fri 18:00–17:00 ET",
    factorsEn: ["OPEC+ production quotas", "US shale production and rig counts", "Global economic growth (China, India)", "Geopolitical risk in Middle East", "Strategic petroleum reserve releases", "Seasonal demand (driving season, winter)"],
    factorsDe: ["OPEC+ Förderquoten", "US-Schieferölproduktion und Bohranlagen", "Weltwirtschaftswachstum (China, Indien)", "Geopolitische Risiken im Nahen Osten", "Freigabe strategischer Ölreserven", "Saisonale Nachfrage (Fahrzeit, Winter)"],
  },
  "Brent Crude": {
    descEn: "Brent Crude from the North Sea is the international oil price benchmark. It determines the price for roughly two-thirds of globally traded crude and typically trades at a slight premium to WTI.",
    descDe: "Brent-Rohöl aus der Nordsee ist der internationale Ölpreis-Benchmark. Es bestimmt den Preis für rund zwei Drittel des weltweit gehandelten Rohöls und wird meist mit leichtem Aufschlag zu WTI gehandelt.",
    category: "Energy", exchange: "ICE", tradingHours: "Sun–Fri 20:00–18:00 ET",
    factorsEn: ["Same as WTI plus European demand shifts", "North Sea production levels", "LNG trade flows to Europe", "Brent-WTI spread dynamics"],
    factorsDe: ["Gleiche Faktoren wie WTI plus europäische Nachfrageverschiebungen", "Nordsee-Produktionsniveaus", "LNG-Handelsströme nach Europa", "Brent-WTI-Spread-Dynamik"],
  },
  "Natural Gas": {
    descEn: "Natural gas powers heating, electricity generation, and industry. It's among the most volatile commodities — heavily driven by weather patterns, storage levels, and the growing global LNG trade.",
    descDe: "Erdgas treibt Heizungen, Stromerzeuger und Industrie an. Es gehört zu den volatilsten Rohstoffen — stark getrieben durch Wetter, Speicherstände und den wachsenden globalen LNG-Handel.",
    category: "Energy", exchange: "NYMEX", tradingHours: "Sun–Fri 18:00–17:00 ET",
    factorsEn: ["Winter cold snaps and summer heat waves", "Storage injection/withdrawal reports", "LNG export capacity and demand", "Renewable energy substitution", "Pipeline infrastructure constraints"],
    factorsDe: ["Kältewellen im Winter, Hitzewellen im Sommer", "Speicher-Einspeisungs- und Entnahmeberichte", "LNG-Exportkapazität und Nachfrage", "Substitution durch erneuerbare Energien", "Pipeline-Infrastrukturengpässe"],
  },
  Copper: {
    descEn: "Copper is often called 'Dr. Copper' — its price is seen as a barometer for economic health. It's essential for wiring, construction, and the electric vehicle revolution. China alone consumes about half the world's copper.",
    descDe: "Kupfer wird oft 'Dr. Copper' genannt — sein Preis gilt als Barometer für die Wirtschaftslage. Es ist unverzichtbar für Verkabelung, Bau und die E-Mobilität. China allein verbraucht rund die Hälfte des weltweiten Kupfers.",
    category: "Industrial Metals", exchange: "COMEX", tradingHours: "Sun–Fri 18:00–17:00 ET",
    factorsEn: ["Chinese industrial demand and GDP growth", "EV and renewable energy adoption rates", "Global construction activity", "Mine supply from Chile and Peru", "Recycling rates and scrap supply"],
    factorsDe: ["Chinesische Industrienachfrage und BIP-Wachstum", "E-Auto- und Erneuerbare-Energien-Ausbau", "Globale Bautätigkeit", "Minenproduktion aus Chile und Peru", "Recyclingquoten und Schrottangebot"],
  },
  Platinum: {
    descEn: "Platinum is rarer than gold but trades at a lower price — a historical anomaly. It's used in catalytic converters, jewelry, and chemical processes. South Africa produces about 70% of the world's supply.",
    descDe: "Platin ist seltener als Gold, wird aber günstiger gehandelt — eine historische Anomalie. Es wird in Katalysatoren, Schmuck und chemischen Prozessen eingesetzt. Südafrika liefert rund 70% des weltweiten Angebots.",
    category: "Precious Metals", exchange: "NYMEX", tradingHours: "Sun–Fri 18:00–17:00 ET",
    factorsEn: ["Automotive catalytic converter demand", "Hydrogen fuel cell development", "South African mine production and labor disputes", "Substitution with palladium", "Investment demand shifts"],
    factorsDe: ["Nachfrage aus der Katalysator-Produktion", "Wasserstoff-Brennstoffzellen-Entwicklung", "Südafrikanische Minenproduktion und Arbeitskonflikte", "Substitution durch Palladium", "Veränderungen in der Investmentnachfrage"],
  },
  Wheat: {
    descEn: "Wheat is a staple food and one of the most traded agricultural commodities. Prices swing with harvests, weather, and geopolitics — as the Ukraine conflict demonstrated sharply in 2022.",
    descDe: "Weizen ist ein Grundnahrungsmittel und einer der meistgehandelten Agrarrohstoffe. Die Preise schwanken mit Ernten, Wetter und Geopolitik — wie der Ukraine-Konflikt 2022 deutlich zeigte.",
    category: "Agriculture", exchange: "CBOT", tradingHours: "Sun–Fri 19:00–13:20 CT",
    factorsEn: ["Drought, floods, and growing conditions", "Geopolitics (Black Sea exports)", "US and EU agricultural subsidies", "Ethanol mandates and competing crops", "Global population growth and food security"],
    factorsDe: ["Dürre, Überschwemmungen und Anbaubedingungen", "Geopolitik (Schwarzmeer-Exporte)", "US- und EU-Agrarsubventionen", "Ethanol-Vorgaben und konkurrierende Anbaukulturen", "Weltbevölkerungswachstum und Ernährungssicherheit"],
  },
};

type Period = "1W" | "1M" | "3M" | "6M" | "1Y";

export default function CommodityDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const decodedName = decodeURIComponent(symbol || "");
  const { convert, symbol: cSym } = useCurrency();
  const t = useT();
  const { lang } = useLanguage();
  const [period, setPeriod] = useState<Period>("1M");

  const { data: commodities, isLoading } = useQuery({
    queryKey: ["commodities"],
    queryFn: getCommodities,
    refetchInterval: 60_000,
  });

  const commodity = commodities?.find((c: any) => c.name === decodedName);
  const info = COMMODITY_INFO[decodedName];

  const { data: historyData, isLoading: histLoading } = useQuery({
    queryKey: ["commodity-history", decodedName, period],
    queryFn: () => getCommodityHistory(decodedName, period),
    staleTime: 5 * 60_000,
    enabled: !!decodedName,
  });

  const chartData = useMemo(() => {
    if (!historyData?.length) return [];
    return historyData.map((d: any) => ({
      date: d.date,
      price: d.close,
    }));
  }, [historyData]);

  const isUp = commodity ? commodity.change >= 0 : true;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 sm:py-10 max-w-5xl px-3 sm:px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1"><ArrowLeft className="h-3 w-3" />{t("nav.markets")}</Link>
          <span className="text-foreground font-medium">/ {lang === "de" ? (DE_NAMES[decodedName] || decodedName) : decodedName}</span>
        </nav>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        ) : !commodity ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Commodity not found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/60 bg-card overflow-hidden">
              <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-transparent p-6 sm:p-8">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/10 shadow-lg">
                      {ICONS[decodedName] || <Gem className="h-6 w-6 text-primary" />}
                    </div>
                    <div>
                      <h1 className="font-display text-2xl sm:text-3xl font-bold">
                        {lang === "de" ? (DE_NAMES[decodedName] || decodedName) : decodedName}
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        {info && <Badge variant="secondary" className="text-xs">{info.category}</Badge>}
                        <Badge variant="outline" className="text-xs">{commodity.symbol}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl sm:text-4xl font-bold">
                      {cSym}{convert(commodity.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`flex items-center justify-end gap-1.5 text-lg font-semibold ${isUp ? "text-chart-2" : "text-destructive"}`}>
                      {isUp ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                      {isUp ? "+" : ""}{commodity.changePercent.toFixed(2)}%
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        ({isUp ? "+" : ""}{cSym}{convert(Math.abs(commodity.change)).toFixed(2)})
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">/{commodity.unit}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Chart */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {lang === "de" ? "Preisverlauf" : "Price History"}
                </h2>
                <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
                  <TabsList className="h-8">
                    {(["1W", "1M", "3M", "6M", "1Y"] as Period[]).map(p => (
                      <TabsTrigger key={p} value={p} className="text-xs px-3 h-7">{p}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              {histLoading ? (
                <Skeleton className="h-64 rounded-xl" />
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="commodityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="date" tickFormatter={(v) => { const d = new Date(v); return d.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "short", day: "numeric" }); }} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${cSym}${v.toLocaleString()}`} />
                    <Tooltip formatter={(value: number) => [`${cSym}${convert(value).toFixed(2)}`, lang === "de" ? "Preis" : "Price"]} labelFormatter={(l) => new Date(l).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { year: "numeric", month: "long", day: "numeric" })} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="url(#commodityGrad)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  {lang === "de" ? "Keine historischen Daten verfügbar" : "No historical data available"}
                </div>
              )}
            </motion.div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Key Facts */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border/60 bg-card p-5">
                <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  {lang === "de" ? "Fakten" : "Key Facts"}
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground">{lang === "de" ? "Einheit" : "Unit"}</span>
                    <span className="font-medium text-sm">{commodity.unit}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground">{lang === "de" ? "Vortagesschluss" : "Prev. Close"}</span>
                    <span className="font-medium text-sm">{cSym}{convert(commodity.prevClose).toFixed(2)}</span>
                  </div>
                  {info && (
                    <>
                      <div className="flex justify-between py-2 border-b border-border/30">
                        <span className="text-sm text-muted-foreground">{lang === "de" ? "Kategorie" : "Category"}</span>
                        <span className="font-medium text-sm">{info.category}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border/30">
                        <span className="text-sm text-muted-foreground">{lang === "de" ? "Börse" : "Exchange"}</span>
                        <span className="font-medium text-sm">{info.exchange}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{lang === "de" ? "Handelszeiten" : "Trading Hours"}</span>
                        <span className="font-medium text-xs">{info.tradingHours}</span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              {info && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-border/60 bg-card p-5">
                  <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    {lang === "de" ? "Über diesen Rohstoff" : "About this Commodity"}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lang === "de" ? info.descDe : info.descEn}
                  </p>
                </motion.div>
              )}

              {/* Supply/Demand Factors */}
              {info && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-border/60 bg-card p-5">
                  <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    {lang === "de" ? "Was beeinflusst den Preis?" : "What Drives the Price?"}
                  </h2>
                  <div className="space-y-2">
                    {(lang === "de" ? info.factorsDe : info.factorsEn).map((factor, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm">
                        <span className="text-primary font-bold mt-0.5">›</span>
                        <span className="text-muted-foreground leading-relaxed">{factor}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Other Commodities */}
            {commodities && commodities.length > 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-border/60 bg-card p-5">
                <h2 className="font-display font-bold text-lg mb-4">
                  {lang === "de" ? "Weitere Rohstoffe" : "Other Commodities"}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {commodities.filter((c: any) => c.name !== decodedName).map((c: any) => {
                    const up = c.change >= 0;
                    return (
                      <Link key={c.name} to={`/commodity/${encodeURIComponent(c.name)}`} className="rounded-xl bg-muted/40 border border-border/30 p-3 hover:border-primary/30 transition-colors group">
                        <div className="flex items-center gap-2 mb-1.5">
                          {ICONS[c.name] || <Gem className="h-4 w-4 text-muted-foreground" />}
                          <span className="text-xs font-medium text-muted-foreground truncate group-hover:text-primary transition-colors">
                            {lang === "de" ? (DE_NAMES[c.name] || c.name) : c.name}
                          </span>
                        </div>
                        <div className="font-display font-bold text-sm">{cSym}{convert(c.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div className={`text-xs font-medium mt-0.5 ${up ? "text-chart-2" : "text-destructive"}`}>
                          {up ? "+" : ""}{c.changePercent.toFixed(2)}%
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
