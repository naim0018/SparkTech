/* eslint-disable react/prop-types */
const KeyFeatures = ({ features }) => (
  features?.length > 0 && (
    <section className="max-w-7xl mx-auto bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-3xl p-12">
      <div className="text-center mb-16">
        <span className="text-green-600 font-semibold mb-2 block">ফিচারসমূহ</span>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">মূল বৈশিষ্ট্য</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">এই পণ্যের বিশেষত্ব জানুন</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-green-600 font-bold text-xl">{idx + 1}</span>
            </div>
            <p className="text-gray-800 font-medium leading-relaxed">{feature}</p>
          </div>
        ))}
      </div>
    </section>
  )
);

export default KeyFeatures;
