document.addEventListener('DOMContentLoaded', () => {

    // --- Daily Quote Logic ---
    const getDailySeed = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(now.getDate()).padStart(2, '0');
        return parseInt(`${year}${month}${day}`);
    };

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

    // Run the quote fetcher (only if elements are present on the page)
    if (document.getElementById('dailyQuote') && document.getElementById('quoteAuthor')) {
        fetchQuote();
    }


    // Optional: Smooth scroll for internal links (nice touch for UX)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Current Year Logic ---
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }


    // --- Contact Form Submission and Pop-up Logic ---
    const contactForm = document.getElementById('contactForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const closeButtons = document.querySelectorAll('.close-button, .modal-close-btn');

    // ONLY initialize form/modal listeners if the form elements actually exist on THIS page
    if (contactForm && confirmationModal && modalTitle && modalMessage && closeButtons.length > 0) {

        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission (page reload)

            const formData = new FormData(contactForm);
            
            // ⭐⭐⭐ PASTE YOUR FORMSPREE ENDPOINT URL HERE ⭐⭐⭐
            // Example: 'https://formspree.io/f/xqabjlzg'
            const formspreeUrl = 'https://formspree.io/f/xqabjlzg'; // <-- Replace with YOUR Formspree URL

            // Disable button and show loading state (optional)
            const submitButton = contactForm.querySelector('.form-submit-btn');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                // Add a loading spinner or animation if you have one
            }

            try {
                const response = await fetch(formspreeUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Essential for Formspree's JSON response
                    }
                });

                if (response.ok) { // Check if the response status is 2xx (e.g., 200 OK)
                    modalTitle.textContent = "Message Sent Successfully!";
                    modalMessage.textContent = "Thank you for reaching out. We will get back to you soon.";
                    contactForm.reset(); // Clear the form fields
                } else {
                    // Try to get a more specific error message from Formspree's response
                    const errorData = await response.json();
                    const errorMessage = errorData.error || "An unexpected error occurred.";

                    modalTitle.textContent = "Submission Failed!";
                    modalMessage.textContent = `Oops! There was an error sending your message: ${errorMessage}. Please try again or contact us directly.`;
                    console.error('Formspree error:', errorData);
                }
            } catch (error) {
                // Handle network errors (e.g., no internet, CORS issues)
                console.error('Network or JavaScript error during form submission:', error);
                modalTitle.textContent = "Network Error!";
                modalMessage.textContent = "Could not connect to the server. Please check your internet connection and try again.";
            } finally {
                // Re-enable button and reset text
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
                confirmationModal.style.display = 'flex'; // Show the modal
            }
        });

        // Close modal functions
        function closeModal() {
            confirmationModal.style.display = 'none';
        }

        // Event listeners for closing the modal
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });

        // Close modal if user clicks outside of it
        window.addEventListener('click', function(event) {
            if (event.target === confirmationModal) {
                closeModal();
            }
        });

    } else {
        // This warning will now only show if contact form/modal elements are genuinely missing
        // on a page where this main.js is loaded, which is correct behavior.
        // console.warn("Contact form or modal elements not found on this page. Pop-up functionality might not be active.");
    }
});