import { createApp } from "./app";

const PORT = 3000;

createApp()
  .then((app) =>
    app.listen(PORT, () => console.log(`API running on : ${PORT}`))
  )
  .catch((err) => {
    console.error("Bootstrap error: ", err);
    process.exit(1);
  });
