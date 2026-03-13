/**
 * Professor's Note: SCROLL-TRIGGERED ANIMATION TUTORIAL
 * * This script maps the user's vertical scroll position (0% to 100%)
 * to the horizontal position of the rabbit sprite across the screen.
 * This creates a "scroll-to-run" effect.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SETUP AND CONSTANTS ---

    // Get the sprite container element from the HTML
    const sprite = document.getElementById('sprite-container');

    // Define the dimensions of the viewport and sprite (these are constant).
    const SPRITE_WIDTH = 100; // Rabbit sprite frame width
    
    // The total width the sprite can travel (viewport width minus sprite width)
    let maxTravelDistance = window.innerWidth - SPRITE_WIDTH;
    
    // The maximum possible scroll distance of the entire document
    let maxScrollHeight = document.documentElement.scrollHeight - window.innerHeight;


    // --- 2. INITIALIZATION AND RESIZE HANDLER ---

    /**
     * TUTORIAL: Event Handling and Responsiveness
     * We need to recalculate our maximum travel and scroll height 
     * whenever the window size changes to keep the animation responsive.
     */
    function updateDimensions() {
        maxTravelDistance = window.innerWidth - SPRITE_WIDTH;
        
        // documentElement.scrollHeight is the total height of the content
        // window.innerHeight is the height of the viewport
        // maxScrollHeight is the amount the user can scroll.
        maxScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    }

    // Update dimensions immediately on load
    updateDimensions();

    // Listen for window resize events
    window.addEventListener('resize', updateDimensions);


    // --- 3. THE CORE SCROLL LOGIC ---

    /**
     * TUTORIAL: The Scroll Event Listener
     * This function runs *every single time* the user moves the scrollbar.
     * It's highly resource-intensive, so we must keep the calculations fast.
     */
    window.addEventListener('scroll', () => {
        
        // 1. Get the current vertical scroll position.
        // window.scrollY is the standard way to get the current scroll offset.
        const currentScrollY = window.scrollY;

        // 2. Calculate the Scroll Completion Percentage (0.0 to 1.0)
        // This is the heart of the mapping: how far have we scrolled relative to the total possible scroll height?
        const scrollPercent = currentScrollY / maxScrollHeight;
        
        // Safety check to prevent NaN if the page is too short to scroll.
        if (isNaN(scrollPercent)) {
            return;
        }

        // --- a. Horizontal Movement ---

        // 3. Map the percentage to the horizontal position.
        // We multiply the scroll percentage (e.g., 0.5 for 50%) by the total distance the sprite can travel.
        const newLeftPosition = scrollPercent * maxTravelDistance;

        // 4. Apply the new position to the sprite element's CSS.
        // We use 'style.left' because the element is 'position: fixed'.
        sprite.style.left = `${newLeftPosition}px`;


        // --- b. Control Animation Speed (Optional but good practice) ---
        
        // We can use the scroll position to control the animation's speed or even stop it.
        // For this example, we'll let the CSS animation run constantly, but we could 
        // also use the percentage to adjust the CSS 'animation-duration' if needed.
        
    });

});