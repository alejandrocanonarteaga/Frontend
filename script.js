const API_BASE = "http://localhost:8080/pagos";

// Cargar pagos en la tabla
document.addEventListener("DOMContentLoaded", () => {
    const tablaPagos = document.getElementById("tabla-pagos");

    // Obtener la lista de pagos
    fetch(API_BASE)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la respuesta de la API");
            }
            return response.json();
        })
        .then((data) => {
            // Verifica si hay pagos
            if (data.length === 0) {
                tablaPagos.innerHTML = "<tr><td colspan='6'>No se encontraron pagos.</td></tr>";
            } else {
                // Cargar los pagos en la tabla
                data.forEach((pago) => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${pago.id}</td>
                        <td>${pago.usuario_id}</td>
                        <td>${pago.vehiculo_id}</td>
                        <td>${pago.monto}</td>
                        <td>${new Date(pago.fecha).toLocaleString()}</td>
                        <td>
                            <a href="detalle_pago.html?id=${pago.id}" class="btn">Ver</a>
                        </td>
                    `;
                    tablaPagos.appendChild(fila);
                });
            }
        })
        .catch((error) => {
            console.error("Error al cargar los pagos:", error);
            tablaPagos.innerHTML = "<tr><td colspan='6'>Error al cargar los pagos.</td></tr>";
        });
});

// Registrar un nuevo pago
const formPago = document.getElementById("form-nuevo-pago");
if (formPago) {
    formPago.addEventListener("submit", (e) => {
        e.preventDefault();

        // Validar campos
        const usuario = e.target.usuario.value;
        const vehiculo = e.target.vehiculo.value;
        const monto = parseFloat(e.target.monto.value);
        const descripcion = e.target.descripcion.value;

        if (!usuario || !vehiculo || isNaN(monto) || !descripcion) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const datos = {
            usuario_id: usuario,
            vehiculo_id: vehiculo,
            monto: monto,
            descripcion: descripcion,
        };

        // Enviar datos a la API
        fetch(API_BASE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al registrar el pago");
                }
                return response.json();
            })
            .then(() => {
                alert("Pago registrado exitosamente.");
                window.location.href = "index.html"; // Redirigir a la página principal
            })
            .catch((error) => {
                console.error("Error al registrar el pago:", error);
                alert("Hubo un error al registrar el pago.");
            });
    });
}

// Ver detalles de un pago
const urlParams = new URLSearchParams(window.location.search);
const pagoId = urlParams.get("id");

if (pagoId) {
    // Obtener los detalles del pago usando el ID
    fetch(`${API_BASE}/${pagoId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al obtener los detalles del pago");
            }
            return response.json();
        })
        .then((pago) => {
            const detalleDiv = document.getElementById("detalle-pago");
            detalleDiv.innerHTML = `
                <h2>ID: ${pago.id}</h2>
                <p>Usuario: ${pago.usuario_id}</p>
                <p>Vehículo: ${pago.vehiculo_id}</p>
                <p>Monto: ${pago.monto}</p>
                <p>Fecha: ${new Date(pago.fecha).toLocaleString()}</p>
                <p>Descripción: ${pago.descripcion}</p>
            `;
        })
        .catch((error) => {
            console.error("Error al obtener los detalles del pago:", error);
            const detalleDiv = document.getElementById("detalle-pago");
            detalleDiv.innerHTML = "<p>Error al cargar los detalles del pago.</p>";
        });
}
