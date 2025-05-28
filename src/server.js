import "dotenv/config";
import app from "./server/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en ${PORT}`);
  console.log(
    `Documentación de Swagger de usuarios en http://localhost:${PORT}/api-docs`
  );
  console.log("Para correr los tests de adopción, ejecutar 'npm test'");
});
