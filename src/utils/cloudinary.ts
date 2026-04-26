const CLOUD_NAME = "dpm7cqzhq";

export const cld = (src: string, t: string) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${t}/${src}`;
};

export const cldVideo = (src: string, t: string) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${t}/${src}`;
};

export const cldPoster = (src: string, t: string) => {
  const publicId = src.split(".")[0];
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${t}/${publicId}.jpg`;
};
