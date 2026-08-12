import { Gem, ShieldCheck, Truck, Headphones } from "lucide-react";

const reasons = [
  {
    icon: Gem,
    title: "خامات فاخرة",
    description: "نختار أجود الخامات وأرقاها لضمان راحتك وأناقتك في كل قطعة",
  },
  {
    icon: ShieldCheck,
    title: "ضمان الجودة",
    description: "كل منتج يخضع لفحص دقيق قبل التسليم لضمان أعلى معايير الجودة",
  },
  {
    icon: Truck,
    title: "شحن سريع",
    description: "توصيل سريع وآمن لجميع المحافظات مع إمكانية تتبع الشحنة",
  },
  {
    icon: Headphones,
    title: "خدمة عملاء متميزة",
    description: "فريق دعم متخصص جاهز لمساعدتك في أي وقت عبر واتساب أو الهاتف",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="font-body text-[11px] tracking-[0.3em] text-warm-gold uppercase mb-2">
            التزامنا لك
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-cream">
            لماذا تختارينا
          </h2>
          <div className="gold-divider max-w-32 mx-auto mt-4" />
        </div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="text-center group"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-warm-gold/30 bg-warm-gold/5 group-hover:bg-warm-gold/10 group-hover:border-warm-gold/50 transition-all duration-300">
                  <Icon className="h-7 w-7 text-warm-gold" />
                </div>
                <h3 className="font-heading text-xl text-cream mb-2">
                  {reason.title}
                </h3>
                <p className="font-body text-sm text-cream/60 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
