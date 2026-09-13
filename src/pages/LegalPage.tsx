/**
 * LegalPage — renders imprint, privacy policy, terms and cookie notice
 * from the structured content in `src/i18n/legalContent.ts`.
 */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { AlertTriangle } from "lucide-react";
import { legalDocs, legalRoutes, CONTACT_MISSING, type LegalSlug } from "@/i18n/legalContent";

export default function LegalPage({ slug }: { slug: LegalSlug }) {
  const { lang } = useLanguage();
  const doc = legalDocs[slug][lang];
  usePageTitle(doc.title);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container max-w-3xl px-3 py-8 sm:px-4 sm:py-12 lg:px-8">
        <h1 className="font-display text-3xl font-bold">{doc.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{doc.intro}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {lang === "de" ? "Stand" : "Last updated"}: {doc.updated}
        </p>

        {CONTACT_MISSING && (
          <div
            role="note"
            className="mt-6 flex gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-foreground"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
            <p>
              {lang === "de"
                ? "Hinweis an den Betreiber: Die Kontaktadresse ist noch ein Platzhalter. Bitte in src/i18n/legalContent.ts durch eine erreichbare E-Mail-Adresse ersetzen."
                : "Note to the operator: the contact address is still a placeholder. Replace it with a reachable email address in src/i18n/legalContent.ts."}
            </p>
          </div>
        )}

        <div className="mt-8 space-y-8">
          {doc.sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="font-display text-lg font-semibold">{section.heading}</h2>
              {section.blocks.map((block, i) => {
                if (block.type === "p") {
                  return (
                    <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                      {block.text}
                    </p>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul key={i} className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <div key={i} className="overflow-x-auto rounded-xl border border-border/60">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          {block.head.map((h) => (
                            <th key={h} scope="col" className="px-3 py-2 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row) => (
                          <tr key={row[0]} className="border-t border-border/50 align-top">
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-3 py-2 text-muted-foreground">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </section>
          ))}
        </div>

        <nav aria-label={lang === "de" ? "Weitere Rechtsseiten" : "Other legal pages"} className="mt-12 flex flex-wrap gap-4 border-t border-border/50 pt-6 text-sm">
          {legalRoutes
            .filter((r) => r.slug !== slug)
            .map((r) => (
              <Link key={r.path} to={r.path} className="text-primary hover:underline">
                {legalDocs[r.slug][lang].title}
              </Link>
            ))}
        </nav>
      </main>
      <Footer />
    </div>
  );
}
