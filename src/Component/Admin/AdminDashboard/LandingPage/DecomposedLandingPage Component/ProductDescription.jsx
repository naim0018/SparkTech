/* eslint-disable react/prop-types */
const ProductDescription = ({ description }) => (
  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <span className="text-green-600 text-xl">📋</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">পণ্যের বর্ণনা</h3>
    </div>
    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
      {description.split("\n").map((paragraph, idx) => (
        <p key={idx} className="mb-4 text-gray-600 leading-loose">{paragraph}</p>
      ))}
    </div>
  </div>
);

export default ProductDescription;
