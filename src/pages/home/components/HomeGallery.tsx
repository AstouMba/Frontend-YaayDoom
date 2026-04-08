type HomeGalleryProps = {
  heroSrc: string;
  doctorSrc: string;
  pregnancySrc: string;
};

export default function HomeGallery({ heroSrc, doctorSrc, pregnancySrc }: HomeGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5">
      <div className="sm:col-span-7 sm:row-span-2 min-h-[340px] sm:min-h-[520px] rounded-[2rem] overflow-hidden shadow-[0_24px_60px_rgba(92,61,46,0.14)] bg-white">
        <img src={heroSrc} alt="Mère et bébé" className="w-full h-full object-cover object-center" />
      </div>

      <div className="sm:col-span-5 min-h-[160px] sm:min-h-[248px] rounded-[1.75rem] overflow-hidden shadow-[0_18px_40px_rgba(92,61,46,0.12)] bg-white">
        <img src={doctorSrc} alt="Professionnel de santé avec bébé" className="w-full h-full object-cover object-center" />
      </div>

      <div className="sm:col-span-5 relative min-h-[160px] sm:min-h-[248px] rounded-[1.75rem] overflow-hidden shadow-[0_18px_40px_rgba(92,61,46,0.12)] bg-white">
        <img src={pregnancySrc} alt="Grossesse et échographie" className="w-full h-full object-cover object-center" />
        <div className="absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold tracking-wide shadow-sm backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--primary-teal)]"></span>
          Suivi de grossesse
        </div>
      </div>
    </div>
  );
}
