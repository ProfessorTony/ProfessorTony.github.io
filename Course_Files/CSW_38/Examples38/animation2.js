
        // Get the canvas and context
        const canvas = document.getElementById('animCanvas');
        const ctx = canvas.getContext('2d');
        const replayBtn = document.getElementById('replayBtn');

        // Animation State Configuration
        const squareSize = 100;
        const cornerRadius = 20;
        const speed = 6;
        
        // Dynamic variables
        let x = 0; // Starting X position
        let y = (canvas.height / 2) - (squareSize / 2); // Center Y vertically
        let dx = speed; // Velocity on X axis
        let opacity = 1.0; // Starting opacity
        
        // Track the state of the bounce
        let hasBounced = false;
        let isStopped = false;
        let animationFrameId = null;

        // Function to reset the animation to its initial state
        function resetAnimation() {
            x = 50; // Start slightly off the left edge for visual breathing room
            dx = speed;
            opacity = 1.0;
            hasBounced = false;
            isStopped = false;
            
            // Cancel any currently running frame before starting a new one
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            draw();
        }

        // The main animation loop
        function draw() {
            // 1. Clear the entire canvas for the new frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 2. Set the color and opacity (Tailwind green-500: #22c55e)
            ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;

            // 3. Draw the rounded square
            ctx.beginPath();
            // Fallback for older browsers without roundRect support, though highly supported now
            if (ctx.roundRect) {
                ctx.roundRect(x, y, squareSize, squareSize, cornerRadius);
            } else {
                // Manual rounded rectangle path just in case
                ctx.moveTo(x + cornerRadius, y);
                ctx.lineTo(x + squareSize - cornerRadius, y);
                ctx.arcTo(x + squareSize, y, x + squareSize, y + cornerRadius, cornerRadius);
                ctx.lineTo(x + squareSize, y + squareSize - cornerRadius);
                ctx.arcTo(x + squareSize, y + squareSize, x + squareSize - cornerRadius, y + squareSize, cornerRadius);
                ctx.lineTo(x + cornerRadius, y + squareSize);
                ctx.arcTo(x, y + squareSize, x, y + squareSize - cornerRadius, cornerRadius);
                ctx.lineTo(x, y + cornerRadius);
                ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
            }
            ctx.fill();

            // 4. Update coordinates if the animation hasn't stopped
            if (!isStopped) {
                x += dx;

                // Check for the collision with the right wall (the bounce)
                if (x + squareSize >= canvas.width && !hasBounced) {
                    x = canvas.width - squareSize; // Snap to the edge perfectly
                    dx = -dx; // Reverse direction
                    opacity = 0.5; // Drop to 50% opacity on the bounce back
                    hasBounced = true; // Mark as bounced
                }

                // Check for collision with the left wall to stop the animation
                if (x <= 50 && hasBounced) {
                    x = 50; // Snap to starting edge
                    isStopped = true; // Stop moving
                }
            }

            // 5. Request the next frame recursively
            animationFrameId = requestAnimationFrame(draw);
        }

        // Event listener for the replay button
        replayBtn.addEventListener('click', resetAnimation);

        // Start the animation immediately when the script runs
        resetAnimation();
    