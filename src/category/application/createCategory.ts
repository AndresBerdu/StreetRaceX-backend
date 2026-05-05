export const createCategory = async (repo: { create: (arg0: any) => any; }, data: { name: any; }) => {
  if (!data.name) throw new Error("Name is required");

  return await repo.create({
    ...data,
    active: true,
    created_at: new Date()
  });
};