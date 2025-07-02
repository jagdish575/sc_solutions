document.addEventListener('DOMContentLoaded', () => {
    // Function to get the current date as a simple integer (e.g., 20231027)
    const getDailySeed = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(now.getDate()).padStart(2, '0');
        return parseInt(`${year}${month}${day}`);
    };

    // Simple pseudo-random number generator using the daily seed
    const seededRandom = (seed) => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    const fetchQuote = async () => {
        try {
            const response = await fetch('assets/js/quotes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const quotes = await response.json();

            if (quotes.length === 0) {
                console.warn('No quotes found in quotes.json');
                return;
            }

            const dailySeed = getDailySeed();
            const randomIndex = Math.floor(seededRandom(dailySeed) * quotes.length);
            const dailyQuote = quotes[randomIndex];

            const quoteElement = document.getElementById('dailyQuote');
            const authorElement = document.getElementById('quoteAuthor');

            if (quoteElement && authorElement) {
                quoteElement.textContent = `"${dailyQuote.quote}"`;
                authorElement.textContent = `- ${dailyQuote.author}`;
            } else {
                console.error('Quote display elements not found in the DOM.');
            }

        } catch (error) {
            console.error("Could not fetch or parse quotes:", error);
            // Fallback quote if fetching fails
            const quoteElement = document.getElementById('dailyQuote');
            const authorElement = document.getElementById('quoteAuthor');
            if (quoteElement && authorElement) {
                quoteElement.textContent = `"Innovate, consult, transcend."`;
                authorElement.textContent = `- S.C Solutions`;
            }
        }
    };

    // Run the quote fetcher
    fetchQuote();

    // Optional: Smooth scroll for internal links (nice touch for UX)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add any other interactive JS here (e.g., Hamburger menu for mobile)
});