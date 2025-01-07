import { features } from "./featureData"
interface FeaturesSectionProps {
  title?: string
}

export default function FeaturesSection({
  title = "Buying with pludo",
}: FeaturesSectionProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <h2 className="text-2xl font-bold mb-8">{title}</h2>
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
        <div className="grid gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0">
                <feature.icon className="w-6 h-6 text-gray-800" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

