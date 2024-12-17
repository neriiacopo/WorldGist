export function plotResultsN(r, posGroup, negGroup, n, map) {
    const rad_factor = 100000;

    // Sort results by similarity in ascending order
    const results = [...r];
    results.sort((a, b) => a.similarity - b.similarity);

    // Separate the lowest and top N entries
    const lastN = results.slice(0, n);
    const topN = results.slice(-n * 2).reverse();
    // .slice(-n * 2 + 10);

    // Calculate bounds for normalization

    const lastNMin = Math.min(...lastN.map((r) => r.similarity));
    const lastNMax = Math.max(...lastN.map((r) => r.similarity));

    const topNMin = Math.min(...topN.map((r) => r.similarity));
    const topNMax = Math.max(...topN.map((r) => r.similarity));

    highlightPano(topN[0], map);

    // Folder URL where the images are stored, ensure it is accessible from the frontend
    const imageFolderUrl = "/public/imgs";
    const popupOptions = {
        maxWidth: 220,
        minWidth: 220,
        maxHeight: 160,
        className: "custom-popup",
    };

    // Normalize and create circles for the lowest N results with popups
    lastN.forEach((loc) => {
        const normalizedSimilarity =
            (loc.similarity - lastNMin) / (lastNMax - lastNMin);
        const marker = L.circle([loc.location.Y, loc.location.X], {
            color: "#f43a6c",
            fillColor: "#f43a6c",
            fillOpacity: 0,
            weight: 1,
            radius: rad_factor * normalizedSimilarity, // Radius based on normalized similarity
        }).addTo(negGroup);

        // marker.on("click", function (e) {
        //     highlightPano(loc, map);
        // });
    });

    // Normalize and create circles for the top N results with popups
    topN.forEach((loc) => {
        const normalizedSimilarity =
            (loc.similarity - topNMin) / (topNMax - topNMin);
        const marker = L.circle([loc.location.Y, loc.location.X], {
            color: "white",
            fillColor: "#3A82F6",
            fillOpacity: 1,
            weight: 1,
            radius: rad_factor * normalizedSimilarity, // Radius based on normalized similarity
        }).addTo(posGroup);

        marker.on("click", highlightPano(this, map));
        marker.on("click", function (e) {
            highlightPano(loc, map);
        });
    });

    console.log("Top N:", topN, "Last N:", lastN, "Bounds:", {
        lastNMin,
        lastNMax,
        topNMin,
        topNMax,
    });
}

function highlightPano(pano, map) {
    const seed = 2333;
    // Display the pano viewport

    console.log(pano);
    try {
        const panoViewport = document.getElementById("panoViewport");
        panoViewport.style.display = "block";

        // Update the pano image
        const panoImg = document.getElementById("panoImg");
        panoImg.src = `./public/imgs/${pano.asciiname}_${pano.geonameid}_${seed}.png`;
    } catch (error) {
        console.error("Error displaying pano:", error);
    }
}

function closePano() {
    document.getElementById("panoViewport").style.display = "none";
}
