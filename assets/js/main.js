async function checkLinks() {
    const url = document.getElementById("urlInput").value;
    if (!url) {
        alert("Por favor, ingresa una URL.");
        return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            document.getElementById("results").innerHTML = `<p>❌ La URL <strong>${url}</strong> no es accesible (${response.status}).</p>`;
            return;
        }

        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const links = Array.from(doc.querySelectorAll("a")).map(a => a.href);

        if (links.length === 0) {
            document.getElementById("results").innerHTML = `<p>No se encontraron enlaces en la página.</p>`;
            return;
        }

        let resultHTML = `<h2>Resultados:</h2>`;
        for (const link of links) {
            try {
                const res = await fetch(link, { method: "HEAD" });
                if (!res.ok) {
                    resultHTML += `<p>🔴 <a href="${link}" target="_blank">${link}</a> está roto (${res.status})</p>`;
                } else {
                    resultHTML += `<p>🟢 <a href="${link}" target="_blank">${link}</a> funciona correctamente (${res.status})</p>`;
                }
            } catch (error) {
                resultHTML += `<p>🔴 <a href="${link}" target="_blank">${link}</a> está roto (Error de conexión)</p>`;
            }
        }

        document.getElementById("results").innerHTML = resultHTML;

    } catch (error) {
        document.getElementById("results").innerHTML = `<p>❌ No se pudo acceder a la página.</p>`;
    }
}
