/* eslint-disable react/prop-types */
const ProductTags = ({ tags, removeTag, inputRef, input, setInput, addTag }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Product Tags
                  </h2>
                  <div className="relative">
                    <div className="flex flex-wrap items-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-gray-500 dark:focus-within:ring-gray-400 focus-within:border-gray-500 dark:focus-within:border-gray-400 bg-white dark:bg-gray-700">
                      {tags.slice(0, 10).map((tag, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="focus:outline-none hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            aria-label={`Remove tag ${tag}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                      {tags.length < 10 && (
                        <input
                          ref={inputRef}
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (tags.length < 10) {
                              addTag(e);
                            }
                          }}
                          placeholder={
                            tags.length === 0
                              ? "Type a tag and press Enter"
                              : ""
                          }
                          className="flex-grow outline-none text-sm bg-transparent text-gray-800 dark:text-gray-200"
                        />
                      )}
                    </div>
                  </div>
                  {tags.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {tags.length} tag{tags.length !== 1 ? "s" : ""} added
                      {tags.length === 10 && " (Maximum reached)"}
                    </p>
                  )}
                </div>
  )
}

export default ProductTags
