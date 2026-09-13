/**
 * Legal page content (DE/EN).
 *
 * Plain data so the pages stay dumb renderers. Replace `LEGAL_CONTACT.email`
 * with a real, reachable address — the pages show a warning while it is unset.
 */

export const LEGAL_CONTACT = {
  name: "Alexander Albert",
  /** TODO: replace with a real contact address. */
  email: "TODO@example.com",
  country: { de: "Deutschland", en: "Germany" },
};

export const CONTACT_MISSING = LEGAL_CONTACT.email.startsWith("TODO");

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}

export type LegalSlug = "imprint" | "privacy" | "terms" | "cookies";

const UPDATED = "2026-09-13";

const p = (text: string): LegalBlock => ({ type: "p", text });
const list = (items: string[]): LegalBlock => ({ type: "list", items });

export const legalDocs: Record<LegalSlug, { de: LegalDoc; en: LegalDoc }> = {
  imprint: {
    de: {
      title: "Impressum",
      intro: "Angaben zum Anbieter dieser Website sowie zur Herkunft der angezeigten Daten.",
      updated: UPDATED,
      sections: [
        {
          heading: "Anbieter",
          blocks: [
            p(`${LEGAL_CONTACT.name}, ${LEGAL_CONTACT.country.de}`),
            p(`Kontakt: ${LEGAL_CONTACT.email}`),
            p("StoneStocks ist ein privates, nicht kommerzielles Projekt. Es werden keine Produkte oder Dienstleistungen verkauft, es gibt keine Werbung und keine Partnerlinks."),
          ],
        },
        {
          heading: "Verantwortlich für den Inhalt",
          blocks: [p(`${LEGAL_CONTACT.name}, erreichbar unter ${LEGAL_CONTACT.email}`)],
        },
        {
          heading: "Keine Anlageberatung",
          blocks: [
            p("Alle Inhalte dienen ausschließlich der allgemeinen Information und der Finanzbildung. Sie sind keine Anlageberatung, keine Anlagevermittlung, keine Empfehlung zum Kauf oder Verkauf von Wertpapieren und keine Aufforderung zur Abgabe eines Angebots."),
            p("Kennzahlen, Punktzahlen, Ranglisten, Stimmungsindikatoren, Rückrechnungen und KI-gestützte Zusammenfassungen sind regelbasierte oder automatisch erzeugte Auswertungen. Sie können unvollständig, veraltet oder fehlerhaft sein. Frühere Wertentwicklungen sagen nichts über künftige Ergebnisse aus. Der Handel mit Wertpapieren kann zum Totalverlust führen."),
          ],
        },
        {
          heading: "Haftung für Inhalte und Links",
          blocks: [
            p("Die Inhalte werden mit Sorgfalt erstellt, eine Gewähr für Richtigkeit, Vollständigkeit und Aktualität wird nicht übernommen. Kursdaten sind in der Regel verzögert und ohne Gewähr."),
            p("Diese Website verlinkt auf externe Seiten, insbesondere auf Nachrichtenquellen. Für deren Inhalte sind ausschließlich die jeweiligen Anbieter verantwortlich. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar. Bei bekannt werdenden Rechtsverletzungen werden entsprechende Links entfernt."),
          ],
        },
        {
          heading: "Datenquellen und Marken",
          blocks: [
            p("Kurs-, Unternehmens- und Kalenderdaten stammen von externen Anbietern, unter anderem Yahoo Finance, Finnhub, Polygon und der SEC. Nachrichtenüberschriften, Kurztexte und Vorschaubilder stammen von den jeweils genannten Medien und verlinken auf die Originalquelle."),
            p("Unternehmenslogos, Firmennamen und Tickersymbole sind Marken der jeweiligen Inhaber. Sie werden ausschließlich zur Kennzeichnung des jeweiligen Unternehmens verwendet, nicht zu Werbezwecken. Es besteht keine Verbindung zu den genannten Unternehmen oder Datenanbietern."),
          ],
        },
        {
          heading: "Urheberrecht",
          blocks: [
            p("Eigene Texte und Grafiken dieser Website unterliegen dem Urheberrecht. Inhalte Dritter sind als solche gekennzeichnet und verbleiben bei ihren Rechteinhabern. Wer einen Urheberrechtsverstoß bemerkt, kann sich an die oben genannte Adresse wenden; betroffene Inhalte werden umgehend geprüft und gegebenenfalls entfernt."),
          ],
        },
        {
          heading: "Streitschlichtung",
          blocks: [
            p("Eine Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle findet nicht statt. Da kein entgeltliches Angebot besteht, kommen keine Verbraucherverträge zustande."),
          ],
        },
      ],
    },
    en: {
      title: "Legal Notice",
      intro: "Who runs this website and where the displayed data comes from.",
      updated: UPDATED,
      sections: [
        {
          heading: "Operator",
          blocks: [
            p(`${LEGAL_CONTACT.name}, ${LEGAL_CONTACT.country.en}`),
            p(`Contact: ${LEGAL_CONTACT.email}`),
            p("StoneStocks is a private, non-commercial project. Nothing is sold, there is no advertising and there are no affiliate links."),
          ],
        },
        {
          heading: "Responsible for the content",
          blocks: [p(`${LEGAL_CONTACT.name}, reachable at ${LEGAL_CONTACT.email}`)],
        },
        {
          heading: "Not investment advice",
          blocks: [
            p("All content is provided for general information and financial education only. It is not investment advice, not a recommendation to buy or sell any security, and not an offer or solicitation."),
            p("Metrics, scores, rankings, sentiment indicators, backtests and AI-generated summaries are rule-based or automatically produced evaluations. They may be incomplete, outdated or wrong. Past performance says nothing about future results. Trading securities can lead to a total loss."),
          ],
        },
        {
          heading: "Liability for content and links",
          blocks: [
            p("Content is compiled with care, but no warranty is given for accuracy, completeness or timeliness. Market data is usually delayed and provided without guarantee."),
            p("This site links to external pages, in particular news sources. The respective providers are solely responsible for their content. No infringements were apparent when the links were added; links will be removed once a violation becomes known."),
          ],
        },
        {
          heading: "Data sources and trademarks",
          blocks: [
            p("Market, company and calendar data comes from external providers including Yahoo Finance, Finnhub, Polygon and the SEC. News headlines, summaries and thumbnails come from the outlets named next to them and link back to the original source."),
            p("Company logos, names and ticker symbols are trademarks of their respective owners and are used only to identify the company, not for promotion. There is no affiliation with the companies or data providers mentioned."),
          ],
        },
        {
          heading: "Copyright",
          blocks: [
            p("Original texts and graphics on this site are protected by copyright. Third-party content is marked as such and remains with its rights holders. If you spot an infringement, contact the address above; the content will be reviewed and removed where necessary."),
          ],
        },
        {
          heading: "Dispute resolution",
          blocks: [
            p("There is no participation in consumer dispute resolution proceedings. Since nothing is offered for payment, no consumer contracts are concluded."),
          ],
        },
      ],
    },
  },

  privacy: {
    de: {
      title: "Datenschutzerklärung",
      intro: "Welche Daten StoneStocks verarbeitet, warum, wie lange und welche Rechte du hast.",
      updated: UPDATED,
      sections: [
        {
          heading: "Verantwortlicher",
          blocks: [
            p(`${LEGAL_CONTACT.name}, ${LEGAL_CONTACT.country.de}, ${LEGAL_CONTACT.email}`),
            p("Ein Datenschutzbeauftragter ist gesetzlich nicht erforderlich und nicht bestellt."),
          ],
        },
        {
          heading: "Grundsatz",
          blocks: [
            p("StoneStocks ist ohne Konto vollständig nutzbar. Ohne Anmeldung werden keine personenbezogenen Profile gebildet. Es gibt keine Werbung, kein Tracking, keine Analysewerkzeuge, keine Social-Media-Plugins und keine eingebetteten fremden Inhalte."),
          ],
        },
        {
          heading: "Server-Logdaten",
          blocks: [
            p("Beim Aufruf der Seite verarbeitet der Hosting-Anbieter technisch notwendige Verbindungsdaten wie IP-Adresse, Zeitpunkt, aufgerufene Adresse, Browsertyp und übertragene Datenmenge. Rechtsgrundlage ist das berechtigte Interesse an einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO). Diese Daten werden kurzfristig gespeichert und nicht mit anderen Daten zusammengeführt."),
          ],
        },
        {
          heading: "Konto und Profil",
          blocks: [
            p("Für ein Konto sind ein Nutzername und ein Passwort erforderlich. Die Angabe einer E-Mail-Adresse ist freiwillig und dient allein der Passwort-Zurücksetzung und optionalen Benachrichtigungen. Ohne E-Mail-Adresse kann ein vergessenes Passwort nicht wiederhergestellt werden."),
            p("Passwörter werden ausschließlich als kryptografischer Hash gespeichert. Rechtsgrundlage ist die Erfüllung des Nutzungsverhältnisses (Art. 6 Abs. 1 lit. b DSGVO) beziehungsweise die Einwilligung bei freiwilligen Angaben (Art. 6 Abs. 1 lit. a DSGVO)."),
          ],
        },
        {
          heading: "Inhalte, die du selbst anlegst",
          blocks: [
            list([
              "Watchlist: beobachtete Wertpapiere, optionale Notizen und Zielkurse",
              "Portfolio und Paper Trading: erfasste Positionen, Stückzahlen, Kaufkurse und Daten",
              "Kursalarme und Termin-Benachrichtigungen: Wertpapier, Schwelle, Zustellstatus",
              "Community: Kommentare und Bewertungen, sichtbar mit deinem Nutzernamen",
              "Lernfortschritt: gelesene Kapitel",
            ]),
            p("Diese Daten liegen in der Datenbank des Projekts, sind über Zugriffsregeln auf dein Konto beschränkt und werden nur verarbeitet, um die jeweilige Funktion bereitzustellen. Community-Beiträge sind öffentlich sichtbar."),
          ],
        },
        {
          heading: "Push-Benachrichtigungen",
          blocks: [
            p("Push-Nachrichten werden nur nach ausdrücklicher Freigabe im Browser versendet. Dabei wird eine vom Browser erzeugte Zustelladresse gespeichert, die an den Push-Dienst des jeweiligen Browserherstellers gebunden ist. Die Freigabe kann jederzeit in den Browsereinstellungen oder in den Einstellungen der App widerrufen werden."),
          ],
        },
        {
          heading: "Speicherung im Browser",
          blocks: [
            p("Es werden ausschließlich technisch notwendige Einträge im lokalen Speicher des Browsers abgelegt, etwa Sprache, Währung, Design, Onboarding-Status und die Anmeldesitzung. Es gibt keine Werbe- oder Analyse-Cookies. Einzelheiten stehen im Cookie-Hinweis."),
          ],
        },
        {
          heading: "Empfänger und Auftragsverarbeiter",
          blocks: [
            list([
              "Hosting, Datenbank, Anmeldung und Serverfunktionen: Lovable Cloud auf Basis von Supabase",
              "Markt-, Unternehmens- und Kalenderdaten: Yahoo Finance, Finnhub, Polygon, SEC",
              "Nachrichten: die jeweils genannten Medien",
              "KI-Auswertungen: ein Sprachmodell-Dienst über das Lovable-AI-Gateway",
              "Push-Zustellung: der Push-Dienst deines Browserherstellers",
            ]),
            p("Anfragen an Datenanbieter und KI-Dienste erfolgen über den Server des Projekts, nicht direkt aus deinem Browser. Dadurch erfahren diese Anbieter deine IP-Adresse nicht. Eine Ausnahme sind Vorschaubilder von Nachrichten, die direkt vom Medium geladen werden; dabei kann dieses deine IP-Adresse sehen."),
            p("Einzelne Dienste verarbeiten Daten in den USA. Grundlage sind Standardvertragsklauseln beziehungsweise Angemessenheitsbeschlüsse der EU-Kommission."),
          ],
        },
        {
          heading: "Speicherdauer",
          blocks: [
            p("Kontobezogene Daten werden gespeichert, solange das Konto besteht. Nach Löschung des Kontos werden die zugehörigen Inhalte entfernt. Technische Zwischenspeicher für Marktdaten enthalten keine personenbezogenen Daten und laufen automatisch ab."),
          ],
        },
        {
          heading: "Deine Rechte",
          blocks: [
            list([
              "Auskunft über die zu deiner Person gespeicherten Daten (Art. 15 DSGVO)",
              "Berichtigung unrichtiger Daten (Art. 16 DSGVO)",
              "Löschung (Art. 17 DSGVO)",
              "Einschränkung der Verarbeitung (Art. 18 DSGVO)",
              "Datenübertragbarkeit (Art. 20 DSGVO)",
              "Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO)",
              "Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)",
            ]),
            p("In den Einstellungen kannst du deine Daten als Datei herunterladen und dein Konto samt Inhalten selbst löschen. Darüber hinaus besteht ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde, in Deutschland bei der Behörde des jeweiligen Bundeslandes."),
          ],
        },
        {
          heading: "Minderjährige",
          blocks: [
            p("Das Angebot richtet sich an Personen ab 16 Jahren. Jüngere Personen sollten ein Konto nur mit Zustimmung der Erziehungsberechtigten anlegen."),
          ],
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      intro: "What StoneStocks processes, why, for how long, and what rights you have.",
      updated: UPDATED,
      sections: [
        {
          heading: "Controller",
          blocks: [
            p(`${LEGAL_CONTACT.name}, ${LEGAL_CONTACT.country.en}, ${LEGAL_CONTACT.email}`),
            p("A data protection officer is not legally required and has not been appointed."),
          ],
        },
        {
          heading: "Principle",
          blocks: [
            p("StoneStocks is fully usable without an account. No personal profiles are built for visitors who do not sign in. There is no advertising, no tracking, no analytics tooling, no social plugins and no embedded third-party content."),
          ],
        },
        {
          heading: "Server logs",
          blocks: [
            p("When you open the site, the hosting provider processes technically necessary connection data such as IP address, timestamp, requested path, browser type and transferred volume. The legal basis is the legitimate interest in secure and stable operation (Art. 6(1)(f) GDPR). This data is kept briefly and not combined with other data."),
          ],
        },
        {
          heading: "Account and profile",
          blocks: [
            p("An account requires a username and a password. Providing an email address is optional and used only for password resets and optional notifications. Without an email address a forgotten password cannot be recovered."),
            p("Passwords are stored only as a cryptographic hash. The legal basis is performance of the usage relationship (Art. 6(1)(b) GDPR) or consent for optional data (Art. 6(1)(a) GDPR)."),
          ],
        },
        {
          heading: "Content you create",
          blocks: [
            list([
              "Watchlist: tracked securities, optional notes and target prices",
              "Portfolio and paper trading: positions, quantities, purchase prices and dates",
              "Price and earnings alerts: security, threshold, delivery status",
              "Community: comments and votes, visible with your username",
              "Learning progress: chapters marked as read",
            ]),
            p("This data lives in the project database, is restricted to your account by access rules, and is processed only to provide the respective feature. Community posts are publicly visible."),
          ],
        },
        {
          heading: "Push notifications",
          blocks: [
            p("Push messages are only sent after you explicitly allow them in your browser. A browser-generated delivery endpoint tied to your browser vendor's push service is stored. You can withdraw the permission at any time in your browser or in the app settings."),
          ],
        },
        {
          heading: "Browser storage",
          blocks: [
            p("Only technically necessary entries are stored in your browser, such as language, currency, theme, onboarding status and the sign-in session. There are no advertising or analytics cookies. Details are in the cookie notice."),
          ],
        },
        {
          heading: "Recipients and processors",
          blocks: [
            list([
              "Hosting, database, authentication and server functions: Lovable Cloud, built on Supabase",
              "Market, company and calendar data: Yahoo Finance, Finnhub, Polygon, SEC",
              "News: the outlets named with each item",
              "AI summaries: a language model service via the Lovable AI gateway",
              "Push delivery: your browser vendor's push service",
            ]),
            p("Requests to data providers and AI services are made by the project server, not directly by your browser, so those providers do not see your IP address. One exception is news thumbnails, which are loaded directly from the publisher and may expose your IP address to it."),
            p("Some services process data in the United States, based on standard contractual clauses or EU adequacy decisions."),
          ],
        },
        {
          heading: "Retention",
          blocks: [
            p("Account data is stored for as long as the account exists. When the account is deleted, the associated content is removed. Technical caches for market data contain no personal data and expire automatically."),
          ],
        },
        {
          heading: "Your rights",
          blocks: [
            list([
              "Access to the data stored about you (Art. 15 GDPR)",
              "Rectification of inaccurate data (Art. 16 GDPR)",
              "Erasure (Art. 17 GDPR)",
              "Restriction of processing (Art. 18 GDPR)",
              "Data portability (Art. 20 GDPR)",
              "Objection to processing based on legitimate interests (Art. 21 GDPR)",
              "Withdrawal of consent with effect for the future (Art. 7(3) GDPR)",
            ]),
            p("In the settings you can download your data as a file and delete your account along with its content. You also have the right to lodge a complaint with a data protection supervisory authority."),
          ],
        },
        {
          heading: "Minors",
          blocks: [
            p("The service is aimed at people aged 16 and over. Younger users should only create an account with the consent of a parent or guardian."),
          ],
        },
      ],
    },
  },

  terms: {
    de: {
      title: "Nutzungsbedingungen",
      intro: "Die Regeln für die Nutzung von StoneStocks.",
      updated: UPDATED,
      sections: [
        {
          heading: "Angebot",
          blocks: [
            p("StoneStocks ist ein kostenloses, privates Informationsangebot zu Finanzmärkten. Es besteht kein Anspruch auf Verfügbarkeit, bestimmte Funktionen oder den Fortbestand des Angebots. Funktionen können jederzeit geändert oder eingestellt werden."),
          ],
        },
        {
          heading: "Keine Zahlungen, kein Widerruf",
          blocks: [
            p("Es werden keine Produkte oder Dienstleistungen verkauft, es gibt keine Abonnements, keine Werbung und keine Partnerlinks. Da keine Zahlungen erfolgen, gibt es weder Rückerstattungen noch einen Widerrufsfall. Sollten künftig kostenpflichtige Funktionen angeboten werden, gelten dafür gesonderte Bedingungen mit Widerrufsbelehrung."),
          ],
        },
        {
          heading: "Keine Anlageberatung",
          blocks: [
            p("Alle Inhalte dienen der Information und Bildung. Sie stellen keine Anlageberatung, Steuer- oder Rechtsberatung dar. Entscheidungen über Käufe oder Verkäufe triffst du eigenverantwortlich, gegebenenfalls nach Rücksprache mit einer zugelassenen Beraterin oder einem zugelassenen Berater. Kapitalanlagen bergen das Risiko des Totalverlusts."),
          ],
        },
        {
          heading: "Konto",
          blocks: [
            p("Ein Konto ist persönlich. Zugangsdaten sind geheim zu halten. Mehrfachkonten zur Umgehung von Sperren oder zur Manipulation von Bewertungen sind untersagt. Das Konto kann jederzeit in den Einstellungen gelöscht werden."),
          ],
        },
        {
          heading: "Community-Beiträge",
          blocks: [
            p("Für eigene Beiträge bist du verantwortlich. Untersagt sind insbesondere:"),
            list([
              "rechtswidrige, beleidigende, diskriminierende oder bedrohende Inhalte",
              "Kurs- oder Marktmanipulation, Pump-and-Dump-Aufrufe, bezahlte Empfehlungen ohne Kennzeichnung",
              "Werbung, Spam und Weiterleitungen auf betrügerische Angebote",
              "Inhalte, die Rechte Dritter verletzen, etwa Urheber- oder Persönlichkeitsrechte",
              "personenbezogene Daten anderer Personen",
            ]),
            p(`Rechtswidrige oder regelwidrige Beiträge können ohne Vorankündigung entfernt und Konten gesperrt werden. Meldungen zu problematischen Inhalten bitte an ${LEGAL_CONTACT.email}; sie werden zeitnah geprüft.`),
            p("Mit dem Veröffentlichen räumst du das einfache Recht ein, den Beitrag im Rahmen dieser Website anzuzeigen. Die Rechte am Beitrag bleiben bei dir."),
          ],
        },
        {
          heading: "Zulässige Nutzung",
          blocks: [
            p("Automatisiertes Abgreifen von Inhalten, das Umgehen technischer Schutzmaßnahmen sowie Handlungen, die den Betrieb stören oder überlasten, sind untersagt. Marktdaten Dritter dürfen nicht aus diesem Angebot heraus weiterverbreitet werden."),
          ],
        },
        {
          heading: "Haftung",
          blocks: [
            p("Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. Bei der Verletzung wesentlicher Vertragspflichten wird auch für einfache Fahrlässigkeit gehaftet, begrenzt auf den typischerweise vorhersehbaren Schaden. Die Haftung für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie nach dem Produkthaftungsgesetz bleibt unberührt."),
            p("Für Anlageentscheidungen, die auf Grundlage der hier gezeigten Daten getroffen werden, wird keine Haftung übernommen."),
          ],
        },
        {
          heading: "Änderungen und Schlussbestimmungen",
          blocks: [
            p("Diese Bedingungen können angepasst werden, wenn sich das Angebot oder die Rechtslage ändert. Es gilt deutsches Recht. Sollte eine Bestimmung unwirksam sein, bleibt der übrige Teil wirksam."),
          ],
        },
      ],
    },
    en: {
      title: "Terms of Use",
      intro: "The rules for using StoneStocks.",
      updated: UPDATED,
      sections: [
        {
          heading: "The service",
          blocks: [
            p("StoneStocks is a free, private information service about financial markets. There is no entitlement to availability, to specific features, or to the continued existence of the service. Features may change or be discontinued at any time."),
          ],
        },
        {
          heading: "No payments, no refunds",
          blocks: [
            p("Nothing is sold, there are no subscriptions, no advertising and no affiliate links. Because no payments are made, there are no refunds and no right of withdrawal to exercise. If paid features are introduced later, separate terms including withdrawal information will apply."),
          ],
        },
        {
          heading: "Not investment advice",
          blocks: [
            p("All content is for information and education. It is not investment, tax or legal advice. Buy and sell decisions are your own responsibility, ideally taken after consulting a licensed advisor. Investments carry the risk of total loss."),
          ],
        },
        {
          heading: "Account",
          blocks: [
            p("Accounts are personal and credentials must be kept confidential. Multiple accounts used to evade blocks or manipulate votes are not allowed. You can delete your account at any time in the settings."),
          ],
        },
        {
          heading: "Community posts",
          blocks: [
            p("You are responsible for the content you post. The following is prohibited:"),
            list([
              "unlawful, insulting, discriminatory or threatening content",
              "market manipulation, pump-and-dump calls, undisclosed paid promotion",
              "advertising, spam and links to fraudulent offers",
              "content infringing third-party rights, such as copyright or personality rights",
              "personal data of other people",
            ]),
            p(`Unlawful or non-compliant posts may be removed without notice and accounts may be blocked. Report problematic content to ${LEGAL_CONTACT.email}; reports are reviewed promptly.`),
            p("By posting you grant a simple right to display the post within this website. You keep the rights to your content."),
          ],
        },
        {
          heading: "Acceptable use",
          blocks: [
            p("Automated scraping, circumventing technical protections and any activity that disrupts or overloads the service are prohibited. Third-party market data may not be redistributed from this service."),
          ],
        },
        {
          heading: "Liability",
          blocks: [
            p("Liability is limited to intent and gross negligence. For breaches of essential obligations, liability also applies to ordinary negligence, limited to typically foreseeable damage. Liability for injury to life, body or health and under product liability law remains unaffected."),
            p("No liability is accepted for investment decisions made on the basis of the data shown here."),
          ],
        },
        {
          heading: "Changes and final provisions",
          blocks: [
            p("These terms may be adjusted if the service or the legal situation changes. German law applies. If a provision is invalid, the remainder stays in force."),
          ],
        },
      ],
    },
  },

  cookies: {
    de: {
      title: "Cookies und lokale Speicherung",
      intro: "Was StoneStocks in deinem Browser speichert und warum kein Einwilligungsbanner nötig ist.",
      updated: UPDATED,
      sections: [
        {
          heading: "Kurz gesagt",
          blocks: [
            p("StoneStocks setzt keine Werbe-, Analyse- oder Tracking-Cookies. Gespeichert werden ausschließlich Einträge, die für den Betrieb oder für von dir gewählte Einstellungen notwendig sind. Für solche Einträge ist nach § 25 Abs. 2 TDDDG keine Einwilligung erforderlich, deshalb gibt es kein Cookie-Banner."),
          ],
        },
        {
          heading: "Was gespeichert wird",
          blocks: [
            {
              type: "table",
              head: ["Eintrag", "Zweck", "Dauer"],
              rows: [
                ["Anmeldesitzung", "Hält dich angemeldet, nur bei eigenem Konto", "Bis zur Abmeldung"],
                ["app_lang", "Gewählte Sprache", "Bis zum Löschen"],
                ["stonestocks-currency", "Gewählte Währung", "Bis zum Löschen"],
                ["theme", "Helles oder dunkles Design", "Bis zum Löschen"],
                ["onboarding_done", "Merkt, dass die Einführung gezeigt wurde", "Bis zum Löschen"],
                ["learn_read", "Gelesene Kapitel im Finanzwissen", "Bis zum Löschen"],
                ["pref_price_alerts, pref_news_alerts", "Benachrichtigungseinstellungen", "Bis zum Löschen"],
                ["Offline-Speicher der App", "Ermöglicht die Nutzung als installierbare App", "Bis zum Löschen"],
              ],
            },
          ],
        },
        {
          heading: "Löschen",
          blocks: [
            p("Alle Einträge können jederzeit über die Browsereinstellungen gelöscht werden. Danach werden Sprache, Währung und Design auf die Standardwerte zurückgesetzt und du wirst abgemeldet."),
          ],
        },
        {
          heading: "Künftige Änderungen",
          blocks: [
            p("Sollten später Werbung, Partnerlinks oder Statistikwerkzeuge eingesetzt werden, wird vorher eine Einwilligung eingeholt und dieser Hinweis angepasst."),
          ],
        },
      ],
    },
    en: {
      title: "Cookies and local storage",
      intro: "What StoneStocks stores in your browser and why no consent banner is required.",
      updated: UPDATED,
      sections: [
        {
          heading: "In short",
          blocks: [
            p("StoneStocks sets no advertising, analytics or tracking cookies. Only entries needed to operate the site or to remember settings you chose are stored. Such strictly necessary storage does not require consent, which is why there is no cookie banner."),
          ],
        },
        {
          heading: "What is stored",
          blocks: [
            {
              type: "table",
              head: ["Entry", "Purpose", "Duration"],
              rows: [
                ["Sign-in session", "Keeps you signed in, only with an account", "Until sign-out"],
                ["app_lang", "Selected language", "Until cleared"],
                ["stonestocks-currency", "Selected currency", "Until cleared"],
                ["theme", "Light or dark appearance", "Until cleared"],
                ["onboarding_done", "Remembers that the intro was shown", "Until cleared"],
                ["learn_read", "Chapters read in Financial Knowledge", "Until cleared"],
                ["pref_price_alerts, pref_news_alerts", "Notification preferences", "Until cleared"],
                ["App offline storage", "Allows use as an installable app", "Until cleared"],
              ],
            },
          ],
        },
        {
          heading: "Clearing",
          blocks: [
            p("You can clear all entries at any time in your browser settings. Language, currency and appearance then return to their defaults and you will be signed out."),
          ],
        },
        {
          heading: "Future changes",
          blocks: [
            p("If advertising, affiliate links or analytics tools are introduced later, consent will be requested beforehand and this notice will be updated."),
          ],
        },
      ],
    },
  },
};

export const legalRoutes: { slug: LegalSlug; path: string }[] = [
  { slug: "imprint", path: "/impressum" },
  { slug: "privacy", path: "/datenschutz" },
  { slug: "terms", path: "/agb" },
  { slug: "cookies", path: "/cookies" },
];
