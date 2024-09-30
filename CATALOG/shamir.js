const fs = require('fs');

// Function to decode a value from a given base
function decodeValue(base, value) {
    return parseInt(value, parseInt(base));
}

// Lagrange interpolation to find the constant term
function lagrangeInterpolation(points) {
    const n = points.length;
    let c = 0;

    for (let i = 0; i < n; i++) {
        let xi = points[i][0];
        let yi = points[i][1];
        let li = 1;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                li *= (0 - points[j][0]) / (xi - points[j][0]);
            }
        }

        c += li * yi;
    }

    return c;
}

// Function to check for wrong points
function findWrongPoints(points, secret) {
    const wrongPoints = [];
    for (const [x, y] of points) {
        const calculatedY = secret; // Assuming secret is the constant term
        if (calculatedY !== y) {
            wrongPoints.push({ x, y });
        }
    }
    return wrongPoints;
}

// Main function to read JSON and process the data
function main() {
    const data = JSON.parse(fs.readFileSync('input.json', 'utf8'));
    const n = data.keys.n;
    const k = data.keys.k;

    const points = [];

    // Decode Y values
    for (let i = 1; i <= n; i++) {
        if (data[i]) {  // Check if data[i] exists
            const base = data[i].base;
            const value = data[i].value;
            const x = i;
            const y = decodeValue(base, value);
            points.push([x, y]);
        }
    }

    console.log("Points after decoding: ", points);

    // Calculate the secret (constant term c)
    const secret = lagrangeInterpolation(points.slice(0, k));
    console.log(`Secret (constant term c): ${secret}`);

    // Find wrong points in the second test case
    const wrongPoints = findWrongPoints(points.slice(k), secret);

    if (wrongPoints.length > 0) {
        console.log("Wrong Points:");
        wrongPoints.forEach(point => {
            console.log(`x: ${point.x}, y: ${point.y}`);
        });
    } else {
        console.log("No wrong points found.");
    }
}

main();
