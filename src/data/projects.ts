export interface ProjectMedia {
  type: 'image' | 'video';
  src: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  media: ProjectMedia[];
  nextProjectSlug: string;
}

const projects: Project[] = [
  {
    slug: "virus-2000",
    title: "VIRUS 2000",
    description: "Proyecto experimental que plantea un nuevo disco de Virus situado en los años 2000. A partir de esta premisa, se desarrolla un lenguaje visual inspirado en el futurismo Y2K, combinando estética retro y digital con tipografías sintéticas, brillos y elementos tecnológicos. La propuesta construye una identidad contemporánea donde lo analógico y lo digital conviven en una misma narrativa, integrando inteligencia artificial como recurso en la generación de imágenes.",
    media: [
      { type: 'video', src: '/videos/Virus-Previsualizacion.mp4' },
      { type: 'image', src: '/images/1.jpeg' },
    ],
    nextProjectSlug: "flyemigrates"
  },
  {
    slug: "flyemigrates",
    title: "FLYEMIGRATES",
    description: "Desarrollo de identidad integral para marca de streetwear independiente. El proyecto abarca desde el diseño textil y el desarrollo de sistemas de estampas hasta la creación de un ecosistema de packaging utilitario. La propuesta visual se inspira en el lenguaje de la logística global y los sistemas de transporte, utilizando una paleta acromática y tipografías industriales para construir una estética \"ready-to-ship\". Flyemigrate propone un uniforme para la migración urbana, donde la funcionalidad del diseño y la calidad del material son los protagonistas.",
    media: [
      { type: 'video', src: '/videos/Pre-Fly.mp4' },
      { type: 'image', src: '/images/2.jpeg' },
    ],
    nextProjectSlug: "tumbandando-el-club"
  },
  {
    slug: "tumbandando-el-club",
    title: "TUMBANDANDO EL CLUB",
    description: "Este proyecto desarrolla el ecosistema visual para el relanzamiento simbólico de \"Tumbando el Club\", el himno fundacional del trap argentino. La propuesta no se limita a la promoción de un single; construye una mitología digital que traduce la energía, el \"calor\" de la calle y la sinergia del colectivo en un lenguaje visual agresivo, técnico y altamente coleccionable.",
    media: [
      { type: 'video', src: '/videos/Previsualizacion.mp4' },
      { type: 'image', src: '/images/3.jpeg' },
      { type: 'video', src: '/videos/Pre-Fly.mp4' },
      { type: 'image', src: '/images/2.jpeg' },
      { type: 'video', src: '/videos/Virus-Previsualizacion.mp4' },
      { type: 'image', src: '/images/1.jpeg' },
    ],
    nextProjectSlug: "cerro-catedral"
  },
  {
    slug: "cerro-catedral",
    title: "CERRO CATEDRAL",
    description: "Este fotolibro es un ejercicio de nostalgia técnica. Utiliza la degradación estética del VHS para documentar la inmensidad del Cerro Catedral, Bariloche. Al capturar fotogramas, el proyecto subvierte el uso de la tecnología: emplea un formato \"obsoleto\" y ruidoso para retratar un paisaje eterno y monumental.",
    media: [
      { type: 'video', src: '/videos/pre-catedral.mp4' },
      { type: 'image', src: '/images/4.jpeg' },
    ],
    nextProjectSlug: "virus-2000"
  }
];

export default projects;
