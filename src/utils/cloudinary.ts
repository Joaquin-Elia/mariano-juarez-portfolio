const CLOUD_NAME = "dpm7cqzhq";

export const cld = (src: string, t: string) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${t}/${src}`;
};

