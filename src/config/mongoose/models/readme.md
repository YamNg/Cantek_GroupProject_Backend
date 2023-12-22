- Define model for schema of Mongoose

```
// for example
import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    task: String,
    status: String,
});

const Todo = mongoose.model("todo", todoSchema);

export {Todo};
```

- naming convention
  - \<modelName>-model.ts
