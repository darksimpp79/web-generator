import type { WebsiteCode } from "@/types/website"

export const pageTemplates: Record<string, WebsiteCode> = {
  kebab: {
    html: `
      <html lang="pl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Najlepszy Kebab w Mieście</title>
        </head>
        <body>
          <header>
            <nav>
              <ul>
                <li><a href="#home">Strona Główna</a></li>
                <li><a href="#menu">Menu</a></li>
                <li><a href="#about">O Nas</a></li>
                <li><a href="#contact">Kontakt</a></li>
              </ul>
            </nav>
          </header>
          <main>
            <section id="home">
              <h1>Witaj w Kebab King</h1>
              <p>Najlepszy kebab w mieście, przygotowany z pasją i najwyższej jakości składników!</p>
            </section>
            <section id="menu">
              <h2>Nasze Menu</h2>
              <ul>
                <li>Kebab w bułce</li>
                <li>Kebab na talerzu</li>
                <li>Kebab wrap</li>
                <li>Vege Kebab</li>
              </ul>
            </section>
            <section id="about">
              <h2>O Nas</h2>
              <p>Jesteśmy pasjonatami dobrego jedzenia, którzy od lat dostarczają najlepszego kebaba w okolicy.</p>
            </section>
            <section id="contact">
              <h2>Kontakt</h2>
              <p>Zadzwoń do nas: 123-456-789</p>
              <p>Odwiedź nas: ul. Kebabowa 42, 00-000 Warszawa</p>
            </section>
          </main>
          <footer>
            <p>&copy; 2024 Kebab King. Wszelkie prawa zastrzeżone.</p>
          </footer>
        </body>
      </html>
    `,
    css: `
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        color: #333;
      }
      header {
        background-color: #e74c3c;
        color: #fff;
        padding: 1rem;
      }
      nav ul {
        list-style-type: none;
        padding: 0;
      }
      nav ul li {
        display: inline;
        margin-right: 10px;
      }
      nav ul li a {
        color: #fff;
        text-decoration: none;
      }
      main {
        padding: 20px;
      }
      section {
        margin-bottom: 20px;
      }
      h1, h2 {
        color: #e74c3c;
      }
      footer {
        background-color: #333;
        color: #fff;
        text-align: center;
        padding: 10px;
        position: fixed;
        bottom: 0;
        width: 100%;
      }
    `,
    js: "",
  },
  // Tutaj możemy dodać więcej szablonów w przyszłości
}

