import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFieldArray } from "react-hook-form";
import { FaTimes } from 'react-icons/fa';

const TagsSection = ({ control, isDarkMode }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags",
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tagFields]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      appendTag(input.trim());
      setInput("");
    }
  };

  return (
    <div className={`mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
      <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
        Product Tags
      </h2>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {tagFields.map((field, index) => (
            <span
              key={field.id}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {field.value}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-2 focus:outline-none"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type and press Enter to add tags"
            className={`flex-grow p-3 border-2 ${
              isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent`}
          />
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Press Enter to add a tag
        </p>
      </div>
    </div>
  );
};

TagsSection.propTypes = {
  control: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

export default TagsSection; 