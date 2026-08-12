import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "من نحن — HM",
  description: "تعرفي على متجر HM المتخصص في الملابس الحريمي الفاخرة",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-near-black py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-body text-[11px] tracking-[0.3em] text-warm-gold/80 uppercase mb-3">
            قصتنا
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mb-4">
            من نحن
          </h1>
          <div className="gold-divider max-w-32 mx-auto" />
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-8 text-center">
            <p className="font-heading text-xl md:text-2xl text-cream leading-relaxed">
              <span className="text-warm-gold font-bold">HM</span> — متجر إلكتروني
              متخصص في الملابس الحريمي الفاخرة، نقدم لكِ مجموعة متميزة من
              العبايات والهدوم الداخلية وقمصان النوم والشنط والمزيد.
            </p>

            <div className="gold-divider max-w-48 mx-auto" />

            <p className="font-body text-base text-cream/70 leading-loose">
              نؤمن أن كل امرأة تستحق أن تشعر بالأناقة والراحة في آن واحد.
              لذلك نختار بعناية كل قطعة في مجموعتنا من أجود الخامات وأرقى
              التصاميم، لنقدم لكِ تجربة تسوق فريدة تجمع بين الفخامة والعملية.
            </p>

            <p className="font-body text-base text-cream/70 leading-loose">
              بدأنا رحلتنا من القاهرة — مصر، بحلم بسيطة: أن نجعل الأناقة
              العربية في متناول كل امرأة. اليوم، نفتخر بتقديم تشكيلة واسعة
              تشمل عبايات فاخرة، هدوم داخلية مريحة، قمصان نوم أنيقة، شنط
              عملية، هدوم أطفال، سجاد، وملابس مدارس — كلها بجودة لا مثيل لها
              وأسعار تنافسية.
            </p>
          </div>

          {/* Values */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "جودة الخامات",
                desc: "نختار أجود الأقمشة والخيوط لضمان متانة وراحة كل قطعة",
              },
              {
                title: "تصاميم عصرية",
                desc: "نواكب أحدث صيحات الموضة مع الحفاظ على الطابع الأصيل",
              },
              {
                title: "أسعار منافسة",
                desc: "نقدم أفضل قيمة مقابل السعر دون التنازل عن الجودة",
              },
            ].map((value, i) => (
              <div key={i} className="text-center p-6 rounded-lg bg-near-black/50 border border-warm-gold/10">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full border border-warm-gold/30 flex items-center justify-center">
                  <span className="text-warm-gold font-heading text-lg font-bold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-heading text-lg text-cream mb-2">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-cream/60 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-warm-gold text-near-black px-8 py-3 font-body text-sm font-medium tracking-wide hover:bg-gold-light transition-colors duration-300"
            >
              تسوقي الآن
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
