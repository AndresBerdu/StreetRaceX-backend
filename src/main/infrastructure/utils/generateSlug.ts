import { slugify } from "./slugify.ts";
import { v4 as uuid4 } from "uuid";

export const generateSlug =  (
  title: string,
): string => {
  let baseSlug = slugify(title);
  let slug = baseSlug;
  const uuid = uuid4().split("-")[0]

  slug = `${baseSlug}-${uuid}`;
    
  return slug;
};
