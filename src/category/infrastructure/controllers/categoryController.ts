import { createCategory } from "../../application/createCategory.ts";

export const createCategoryController = (repo: { create: (arg0: any) => any; }) => async (req, res) => {
  try {
    const result = await createCategory(repo, req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
