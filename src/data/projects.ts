export interface ProjectMedia {
  type: "image" | "video";
  src: string;
  caption?: string;
  fullWidth?: boolean;
  margin?: boolean;
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
    description:
      "Proyecto experimental que plantea un nuevo disco de Virus situado en los años 2000. A partir de esta premisa, se desarrolla un lenguaje visual inspirado en el futurismo Y2K, combinando estética retro y digital con tipografías sintéticas, brillos y elementos tecnológicos. La propuesta construye una identidad contemporánea donde lo analógico y lo digital conviven en una misma narrativa, integrando inteligencia artificial como recurso en la generación de imágenes.",
    media: [
      { type: "image", src: "Tapa-1_wj4pby" },
      { type: "image", src: "Vinilo-lado-b_y8ikuh" },
      { type: "image", src: "Vinilo-lado-a_rxgnc7" },
      { type: "image", src: "Inside_zcoqwm", fullWidth: true },
      { type: "image", src: "insert-a_lki6rg_fee6ef" },
      { type: "image", src: "Insert-B_lzriqk" },
      { type: "image", src: "Contratapa-Coverplastico_vrqv7v" },
    ],
    nextProjectSlug: "flyemigrates",
  },
  {
    slug: "flyemigrates",
    title: "FLYEMIGRATES",
    description:
      'Desarrollo de identidad integral para marca de streetwear independiente. El proyecto abarca desde el diseño textil y el desarrollo de sistemas de estampas hasta la creación de un ecosistema de packaging utilitario. La propuesta visual se inspira en el lenguaje de la logística global y los sistemas de transporte, utilizando una paleta acromática y tipografías industriales para construir una estética "ready-to-ship". Flyemigrate propone un uniforme para la migración urbana, donde la funcionalidad del diseño y la calidad del material son los protagonistas.',
    media: [
      { type: "video", src: "Model_bdrbln"},
      { type: "image", src: "modelo3_qngbci", margin: true },
      { type: "video", src: "1_cvuoky", fullWidth: true },
      { type: "image", src: "modelo2_ma18ku" },
      { type: "image", src: "modelo1_scamr0", margin: true, },
      { type: "image", src: "Close-Up_Detail_v1_qeedes" },
      { type: "image", src: "Logo_Detail_Close-Up_eqrihe", margin: true },
      { type: "video", src: "2_ndtjhk", fullWidth: true },
      { type: "image", src: "Logo-Grid---Blueprint_ogw6pg" },
      { type: "image", src: "Close-Up_Print_Detail_grxebl" },
      { type: "video", src: "3_fmnwd7", fullWidth: true },
      { type: "video", src: "4_k2rq2v" },
      { type: "video", src: "5_f8zffp" },
      { type: "video", src: "6_mvypvl" },
      { type: "video", src: "7_odtewx", fullWidth: true },
      { type: "video", src: "8_gkq8u8" },
      { type: "image", src: "Reme-1_db09bt" },
      { type: "image", src: "Reme-2_q03mck" },
      { type: "image", src: "Reme-3_hzbtll" },
      { type: "image", src: "parcel_bag_front_gbfyhh", margin: true },
    ],
    nextProjectSlug: "tumbandando-el-club",
  },
  {
    slug: "tumbandando-el-club",
    title: "TUMBANDANDO EL CLUB",
    description:
      'Este proyecto desarrolla el ecosistema visual para el relanzamiento simbólico de "Tumbando el Club", el himno fundacional del trap argentino. La propuesta no se limita a la promoción de un single; construye una mitología digital que traduce la energía, el "calor" de la calle y la sinergia del colectivo en un lenguaje visual agresivo, técnico y altamente coleccionable.',
    media: [
      { type: "image", src: "1_ah98gy", fullWidth: true, margin: true },
      { type: "image", src: "duks_rksbbu", fullWidth: true, margin: true },
      { type: "image", src: "Card-Duki-Case_ahysg2" },
      { type: "image", src: "Post-Insta-template2_wmbnns" },
      { type: "image", src: "luchs2_ko7166", fullWidth: true, margin: true },
      { type: "image", src: "Card-Neo-Case_oa9bsj" },
      { type: "image", src: "Card-ysy-Case_cg89xp" },
      { type: "image", src: "Card-Duki-Case4_eql25e" },
      { type: "image", src: "Post-Insta-template_espfbl" },
      { type: "image", src: "Card-Duki-Case2_tzxao5", fullWidth: true },
      // { type: "video", src: "/videos/Previsualizacion.mp4" },
      // { type: "video", src: "/videos/Virus-Previsualizacion.mp4" },
      // { type: "video", src: "/videos/Pre-Fly.mp4" },
    ],
    nextProjectSlug: "cerro-catedral",
  },
  {
    slug: "cerro-catedral",
    title: "CERRO CATEDRAL",
    description:
      'Este fotolibro es un ejercicio de nostalgia técnica. Utiliza la degradación estética del VHS para documentar la inmensidad del Cerro Catedral, Bariloche. Al capturar fotogramas, el proyecto subvierte el uso de la tecnología: emplea un formato "obsoleto" y ruidoso para retratar un paisaje eterno y monumental.',
    media: [
      { type: "image", src: "Cover-fotolibro_eeboxw", fullWidth: true },
      { type: "image", src: "1_p1d01n", fullWidth: true },
      { type: "image", src: "2_iwfv91", fullWidth: true },
      { type: "image", src: "3_khpqyg", fullWidth: true },
      { type: "image", src: "4_dts13c", fullWidth: true },
      { type: "image", src: "BEANIE_e0cqja" },
      { type: "image", src: "BEANIE2_zmmnns" },
      { type: "image", src: "estampa_lhfzzq" },
      { type: "image", src: "estampa-copia2_wldkiy" },
      { type: "image", src: "estampa3_k4sn88" },
      { type: "image", src: "passticketsnow_monqud" },
    ],
    nextProjectSlug: "virus-2000",
  },
];

export default projects;
