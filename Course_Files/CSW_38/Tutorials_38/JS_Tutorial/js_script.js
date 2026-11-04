/**
 * The browser reads the HTML from top to bottom. Waiting for
 * DOMContentLoaded makes sure the canvas and buttons have been created
 * before this script tries to find them.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SETUP ---

    // Find the canvas in the HTML. The 2D context is the collection of
    // drawing tools (lines, shapes, colors, gradients, and more) for it.
    const canvas = document.getElementById('animation-canvas');
    const ctx = canvas.getContext('2d');

    /**
     * A canvas has two sizes: its displayed size (set by CSS) and its
     * drawing-buffer size (canvas.width and canvas.height). Match them so
     * drawings use the available canvas area instead of being stretched.
     * Changing the drawing-buffer size also clears the canvas.
     */
    function resizeCanvas() {
        const { clientWidth, clientHeight } = canvas;
        if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
            canvas.width = clientWidth;
            canvas.height = clientHeight;
        }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Find the three buttons that let the viewer choose an animation.
    const startBtn1 = document.getElementById('start-anim-1');
    const startBtn2 = document.getElementById('start-anim-2');
    const startBtn3 = document.getElementById('start-anim-3');

    /**
     * requestAnimationFrame returns an ID for the scheduled frame.
     * Saving it lets us cancel the current loop when another example starts,
     * so two animations do not draw over each other at the same time.
     */
    let currentAnimationId = null;

    // When a button is clicked, stop the previous animation (if any), then
    // start the selected example from its initial state.
    startBtn1.addEventListener('click', () => {
        if (currentAnimationId) {
            cancelAnimationFrame(currentAnimationId);
        }
        initAnimation1();
    });

    startBtn2.addEventListener('click', () => {
        if (currentAnimationId) {
            cancelAnimationFrame(currentAnimationId);
        }
        initAnimation2();
    });

    // The guard keeps this setup safe if the third button is not in the HTML.
    if (startBtn3) {
        startBtn3.addEventListener('click', () => {
            if (currentAnimationId) {
                cancelAnimationFrame(currentAnimationId);
            }
            initAnimation3();
        });
    }


    // --- 2. EXAMPLE 1: A SINGLE BOUNCING BALL ---

    // Keep the ball's position, size, and speed together in one object.
    // dx and dy are the amount to add to x and y on each animation frame.
    let ball = {
        x: canvas.width / 2,  // x measures horizontal distance from the left
        y: canvas.height / 2, // y measures vertical distance from the top
        radius: 10,
        dx: 3,  // Positive dx moves right; negative dx moves left
        dy: 2   // Positive dy moves down; negative dy moves up
    };

    /**
     * Reset the ball to the center and start its repeating animation loop.
     */
    function initAnimation1() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        animationLoop1();
    }

    /**
     * Draw one frame of the single-ball animation, update its position,
     * then ask the browser to schedule the next frame.
     */
    function animationLoop1() {
        // Erase the previous frame; otherwise each drawing would leave a trail.
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // A circle is an arc that goes all the way around (0 to 2*pi radians).
        // Begin a path, describe its shape, set its fill color, and fill it.
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#cb20e9ff';
        ctx.fill();
        ctx.closePath();

        // Move the ball by its speed. Repeating these small changes makes
        // separate still pictures look like continuous motion.
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Compare the ball's outer edge (center plus/minus radius) with the
        // canvas edges. Reversing dx sends it back in the opposite direction.
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx *= -1;
        }

        // Do the same vertically: reversing dy makes the ball bounce up/down.
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.dy *= -1;
        }
        
        // requestAnimationFrame asks the browser to call this function again
        // before it displays the next screen frame.
        currentAnimationId = requestAnimationFrame(animationLoop1);
    }


    // --- 3. EXAMPLE 2: MULTIPLE BOUNCING BALLS ---

    // An array stores the data for every ball so one loop can handle them all.
    let balls = [];

    /**
     * Create 15 balls with randomized starting positions, speeds, and colors,
     * then start the loop that moves and draws them.
     */
    function initAnimation2() {
        // Replace the array so restarting the example creates a fresh set.
        balls = [];
        for (let i = 0; i < 15; i++) {
            balls.push({
                // Math.random() gives a value from 0 up to (but not including) 1.
                // Multiplying by the canvas size spreads each ball across it.
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 10,
                // Shifting a random value by -0.5 gives a range from -0.5 to
                // 0.5; multiplying by 4 changes that to roughly -2 through 2.
                dx: (Math.random() - 0.5) * 4,
                dy: (Math.random() - 0.5) * 4,
                // HSL means hue, saturation, and lightness. Changing hue
                // chooses a different color while keeping vividness/brightness.
                color: `hsl(${Math.random() * 360}, 70%, 50%)`
            });
        }
        animationLoop2();
    }

    /**
     * Draw and move every ball once. The forEach callback runs once for
     * each object in the balls array.
     */
    function animationLoop2() {
        // Clear the previous frame before drawing the new positions.
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        balls.forEach(b => {
            // Draw this ball using its own position, radius, and color.
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
            ctx.closePath();

            // Change its position for the next frame.
            b.x += b.dx;
            b.y += b.dy;

            // If an edge of this ball reaches a canvas boundary, reverse
            // the matching speed component to make it travel back.
            if (b.x + b.radius > canvas.width || b.x - b.radius < 0) {
                b.dx *= -1;
            }
            if (b.y + b.radius > canvas.height || b.y - b.radius < 0) {
                b.dy *= -1;
            }
        });

        // Schedule another frame after all balls have been updated.
        currentAnimationId = requestAnimationFrame(animationLoop2);
    }

    // --- 4. EXAMPLE 3: ANIMATED FLOWERS ---

    class Flower {
        constructor(opts) {
            // Store each flower's location as fractions of the canvas size.
            // For example, 0.5 means halfway across or down.
            this.xRatio = opts.xRatio;       // position relative to canvas width (0..1)
            this.yRatio = opts.yRatio;       // position relative to canvas height (0..1)
            // These options control the flower's appearance and movement.
            // The || values are defaults used when an option is missing or zero.
            this.petalCount = opts.petalCount || 8;
            this.petalLength = opts.petalLength || 40;
            this.petalWidth = opts.petalWidth || 16;
            this.petalOffset = opts.petalOffset || 18;
            this.baseHue = opts.baseHue || 200;
            this.rotationSpeed = opts.rotationSpeed || 0; // radians per second
            this.pulseSpeed = opts.pulseSpeed || 0;       // cycles per second
            this.hueSwing = opts.hueSwing || 0;           // amount the hue can shift
            // A different starting phase makes flowers pulse at different
            // points in their cycles instead of moving in perfect unison.
            this.phase = Math.random() * Math.PI * 2;
            this.angle = 0; // Current rotation angle, in radians
            this.scale = 1; // Current size multiplier (1 means normal size)
        }

        /**
         * Update changing values before drawing a frame. dt is elapsed time
         * in seconds; t is total elapsed time, also in seconds.
         */
        update(dt, t) {
            // Multiplying by elapsed time makes rotation speed depend on time,
            // rather than on how many frames the computer happens to draw.
            this.angle += this.rotationSpeed * dt;
            if (this.pulseSpeed !== 0) {
                // Sine smoothly moves between -1 and 1. It creates a repeating
                // size change; pulseSpeed controls how many cycles happen per second.
                this.scale = 1 + 0.15 * Math.sin(2 * Math.PI * this.pulseSpeed * t + this.phase);
            } else {
                this.scale = 1;
            }
            // Optionally shift the flower's hue over time to animate its color.
            this.hue = this.baseHue + (this.hueSwing ? this.hueSwing * Math.sin(t * 0.6) : 0);
        }

        /**
         * Draw this flower centered at its proportional canvas position.
         * Canvas transformations let us rotate all petals around the center.
         */
        draw(ctx, canvas) {
            // Convert the 0-to-1 position fractions into canvas coordinates.
            // Recalculating each frame keeps flowers in place proportionally
            // if the canvas changes size.
            const x = this.xRatio * canvas.width;
            const y = this.yRatio * canvas.height;

            // Apply the current pulse size to each petal measurement.
            const s = this.scale;
            const petalLen = this.petalLength * s;
            const petalWid = this.petalWidth * s;
            const petalOff = this.petalOffset * s;

            // save()/restore() protect the canvas drawing settings so the
            // stem's styles and transforms do not affect later drawings.
            ctx.save();
            ctx.strokeStyle = 'hsl(130, 40%, 30%)';
            ctx.lineWidth = Math.max(2, 0.012 * canvas.width);
            ctx.beginPath();
            ctx.moveTo(x, y);
            // Keep the end of the stem a little above the bottom edge.
            ctx.lineTo(x, Math.min(canvas.height - 10, y + petalLen * 1.8));
            ctx.stroke();
            ctx.restore();

            // Move the drawing origin to the flower center, then rotate the
            // coordinate system. Each petal can now use the same basic shape.
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(this.angle);
            const hue = this.hue || this.baseHue;
            for (let i = 0; i < this.petalCount; i++) {
                ctx.save();
                // Divide a full circle evenly to distribute petals around
                // the center. The loop index gives each petal a new angle.
                ctx.rotate((i * Math.PI * 2) / this.petalCount);
                ctx.beginPath();
                // ellipse() draws an oval; its center is offset from the
                // flower center so the inner ends of the petals meet there.
                ctx.ellipse(0, petalOff, petalWid, petalLen, 0, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
                ctx.fill();
                ctx.strokeStyle = `hsl(${hue}, 70%, 40%)`;
                ctx.lineWidth = 1.2;
                ctx.stroke();
                ctx.restore();
            }

            // Draw a circle over the inner ends of the petals. A radial
            // gradient changes color from its center outwards.
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(6, petalWid * 0.7), 0, Math.PI * 2);
            const centerGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, Math.max(6, petalWid * 0.7));
            centerGrad.addColorStop(0, 'hsl(52, 90%, 70%)');
            centerGrad.addColorStop(1, 'hsl(42, 80%, 45%)');
            ctx.fillStyle = centerGrad;
            ctx.fill();
            ctx.restore();
        }
    }

    let flowers = [];
    // The previous frame's timestamp is needed to calculate elapsed time.
    let lastTime = null;

    /**
     * Resize the canvas, create three flowers with different settings, and
     * begin the third animation loop.
     */
    function initAnimation3() {
        resizeCanvas();
        // Start with no previous timestamp so the first frame can initialize it.
        lastTime = null;
        // Each object supplies the options that make one flower different:
        // its position, petal shape, base color, rotation, pulse, and color shift.
        flowers = [
            new Flower({
                xRatio: 0.22,
                yRatio: 0.45,
                petalCount: 7,
                petalLength: 44,
                petalWidth: 16,
                baseHue: 300,        // magenta/purple
                rotationSpeed: 0.7,  // rad/s
                pulseSpeed: 0.5,     // Hz
                hueSwing: 10
            }),
            new Flower({
                xRatio: 0.50,
                yRatio: 0.37,
                petalCount: 10,
                petalLength: 52,
                petalWidth: 14,
                baseHue: 20,         // orange
                rotationSpeed: -0.5,
                pulseSpeed: 0.85,
                hueSwing: 18
            }),
            new Flower({
                xRatio: 0.78,
                yRatio: 0.5,
                petalCount: 6,
                petalLength: 58,
                petalWidth: 18,
                baseHue: 200,        // blue/cyan
                rotationSpeed: 0.3,
                pulseSpeed: 0.35,
                hueSwing: 12
            })
        ];
        animationLoop3();
    }

    /**
     * Draw one frame of the flower scene. The browser passes in a timestamp
     * (milliseconds); converting differences to seconds makes motion easier
     * to describe in seconds and keeps it consistent across frame rates.
     */
    function animationLoop3(timestamp) {
        resizeCanvas();
        // requestAnimationFrame supplies a timestamp. performance.now() is a
        // fallback for the first direct call from initAnimation3().
        if (lastTime == null) lastTime = timestamp || performance.now();
        const now = timestamp || performance.now();
        // Divide milliseconds by 1000 to get seconds. Limit a single time
        // step to 0.033 seconds so a pause or slow frame cannot cause a jump.
        const dt = Math.min(0.033, (now - lastTime) / 1000);
        const t = now / 1000;
        lastTime = now;

        // Clear the last frame before painting the background and flowers.
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Paint a vertical gradient background. The gradient starts at the
        // top coordinate and ends at the bottom coordinate.
        const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
        g.addColorStop(0, '#1b1b1b');
        g.addColorStop(1, '#111111');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update each flower's animated values, then draw it in its new state.
        for (const f of flowers) {
            f.update(dt, t);
            f.draw(ctx, canvas);
        }

        // Keep the animation going by scheduling the next frame.
        currentAnimationId = requestAnimationFrame(animationLoop3);
    }
});
