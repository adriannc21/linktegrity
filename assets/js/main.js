async function checkLinks() {
    const inputElement = document.getElementById("urlInput");
    const resultsContainer = document.getElementById("results");

    if (!inputElement || !resultsContainer) {
        console.error("❌ Error: No se encontró el input o el contenedor de resultados.");
        return;
    }

    const url = inputElement.value.trim();
    if (!url) {
        alert("Por favor, ingresa una URL.");
        return;
    }

    resultsContainer.innerHTML = "<p>🔍 Analizando la página...</p>";

    try {
        // Intentar obtener el HTML de la página
        const response = await fetch(url);
        if (!response.ok) {
            resultsContainer.innerHTML = `<p>❌ La URL <strong>${url}</strong> no es accesible (${response.status}).</p>`;
            return;
        }

        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const links = Array.from(doc.querySelectorAll("a")).map(a => a.href);

        if (links.length === 0) {
            resultsContainer.innerHTML = `<p>⚠ No se encontraron enlaces en la página.</p>`;
            return;
        }

        let resultHTML = `<h2>Resultados:</h2>`;
        const linkChecks = links.map(async (link) => {
            try {
                const res = await fetch(link, { method: "HEAD", mode: "no-cors" });

                if (!res.ok) {
                    resultHTML += `<p>🔴 <a href="${link}" target="_blank">${link}</a> está roto (${res.status})</p>`;
                } else {
                    resultHTML += `<p>🟢 <a href="${link}" target="_blank">${link}</a> funciona correctamente (${res.status})</p>`;
                }
            } catch (error) {
                resultHTML += `<p>🔴 <a href="${link}" target="_blank">${link}</a> está roto (Error de conexión)</p>`;
            }
        });

        await Promise.all(linkChecks);
        resultsContainer.innerHTML = resultHTML;

    } catch (error) {
        resultsContainer.innerHTML = `<p>❌ No se pudo acceder a la página.</p>`;
        console.error("🚨 Error al analizar la URL:", error);
    }
}
