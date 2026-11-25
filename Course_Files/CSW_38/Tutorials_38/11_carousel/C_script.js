// Wait until the HTML document has completely loaded
        document.addEventListener('DOMContentLoaded', () => {
            try {
                // 1. Select the carousel track and scroll buttons from the DOM
                const track = document.getElementById('carouselTrack');
                const scrollLeftBtn = document.getElementById('scrollLeftBtn');
                const scrollRightBtn = document.getElementById('scrollRightBtn');
                const cartCountEl = document.getElementById('cartCount');
                const toastEl = document.getElementById('toast');

                // Distance (in pixels) to scroll on each button click (approx. 1 card + gap)
                const scrollStep = 315;
                let cartItems = 0;
                let toastTimer = null;

                // Helper function to display a brief, accessible on-screen message
                function showToast(message) {
                    toastEl.textContent = message;
                    toastEl.classList.add('show');
                    clearTimeout(toastTimer);
                    toastTimer = setTimeout(() => {
                        toastEl.classList.remove('show');
                    }, 2500);
                }

                // 2. Scroll Right Button: Advances the Flexbox carousel forward
                scrollRightBtn.addEventListener('click', () => {
                    // Check if we are already at the far right end; if so, loop back to start
                    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 5) {
                        track.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        track.scrollBy({ left: scrollStep, behavior: 'smooth' });
                    }
                });

                // 3. Scroll Left Button: Moves the Flexbox carousel backward
                scrollLeftBtn.addEventListener('click', () => {
                    // If at the very beginning, jump smoothly to the end
                    if (track.scrollLeft <= 5) {
                        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
                    } else {
                        track.scrollBy({ left: -scrollStep, behavior: 'smooth' });
                    }
                });

                // 4. Add to Cart Buttons: Increments the badge in the Nav Bar
                const addButtons = document.querySelectorAll('.add-btn');
                addButtons.forEach((button) => {
                    button.addEventListener('click', () => {
                        cartItems++;
                        cartCountEl.textContent = cartItems;
                        const productName = button.getAttribute('data-product');
                        showToast(`Added "${productName}" to your cart!`);
                    });
                });

                // 5. Nav Link Placeholders: Friendly feedback when clicked
                const navLinks = document.querySelectorAll('.nav-links a');
                navLinks.forEach((link) => {
                    link.addEventListener('click', (event) => {
                        const sectionName = link.getAttribute('data-nav');
                        if (sectionName === 'Cart') {
                            event.preventDefault();
                            showToast(`Cart currently has ${cartItems} item(s).`);
                        }
                    });
                });

            } catch (error) {
                console.error('Carousel initialization error:', error);
            }
        });