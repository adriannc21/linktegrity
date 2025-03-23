async function checkLinks() {
    const url = document.getElementById("urlInput").value.trim();
    
    if (!url) {
        alert("Por favor, ingresa una URL válida.");
        return;
    }

    document.getElementById("results").innerHTML = `<p>⏳ Analizando enlaces...</p>`;

    try {
        // **Realizar un HEAD request para verificar si la URL es accesible**
        const response = await fetch(url, { method: "HEAD" });

        if (!response.ok) {
            document.getElementById("results").innerHTML = `<p>❌ La URL <strong>${url}</strong> no es accesible (${response.status}).</p>`;
            return;
        }

        // **Intentar obtener el contenido HTML (podría fallar por CORS)**
        const pageContent = await fetch(url).then(res => res.text()).catch(() => null);

        if (!pageContent) {
            document.getElementById("results").innerHTML = `<p>⚠️ No se pudo analizar la página debido a restricciones de seguridad (CORS).</p>`;
            return;
        }

        // **Extraer enlaces**
        const parser = new DOMParser();
        const doc = parser.parseFromString(pageContent, "text/html");
        let links = Array.from(doc.querySelectorAll("a")).map(a => a.href);

        // **Filtrar enlaces vacíos o inválidos**
        links = links.filter(link => link && link.startsWith("http"));

        if (links.length === 0) {
            document.getElementById("results").innerHTML = `<p>⚠️ No se encontraron enlaces en la página.</p>`;
            return;
        }

        let resultHTML = `<h2>Resultados:</h2>`;
        
        // **Verificar cada enlace con HEAD request**
        for (const link of links) {
            try {
                const res = await fetch(link, { method: "HEAD" });
                
                if (!res.ok) {
                    resultHTML += `<p>🔴 <a href="${link}" target="_blank">${link}</a> está roto (${res.status})</p>`;
                } else {
                    resultHTML += `<p>🟢 <a href="${link}" target="_blank">${link}</a> funciona correctamente (${res.status})</p>`;
                }
            } catch {
                resultHTML += `<p>🔴 <a href="${link}" target="_blank">${link}</a> está roto (Error de conexión)</p>`;
            }
        }

        document.getElementById("results").innerHTML = resultHTML;

    } catch (error) {
        document.getElementById("results").innerHTML = `<p>❌ No se pudo acceder a la página. Error: ${error.message}</p>`;
    }
}
