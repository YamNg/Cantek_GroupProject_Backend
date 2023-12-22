Define Routes to redirect web request to Controller

- File Naming convention

  - \<appName>-app-routes.ts

- In \<appName>-app-routes.ts

```
// for example:
import express from "express";
import {
  addTodo,
  updateTodo,
  deleteTodo,
  getTodos,
} from "../../controller/todo.controllers.js";

const router = express.Router();

// add a todo
router.post("/", addTodo);
// get todos
router.get("/", getTodos);
// update a todo
router.put("/:id", updateTodo);
// remove a todo
router.delete("/:id", deleteTodo);

export default router;
```

- Add Routes defined in file \<appName>-app-routes.ts to the router object in /routes/index.ts

```
// In "routes/index.ts"

// import section
import todoRoutes from "./todo-routes.js";

// add routes configuration to the "router" object in "routes/index.ts"
router.use("/todos", todoRoutes);
```
