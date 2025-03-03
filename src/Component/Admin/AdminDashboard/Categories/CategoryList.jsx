import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BiMove, BiPlus, BiTrash } from 'react-icons/bi';
import LoadingSpinner from '../../../../UI/LoadingSpinner';
import SubCategories from './SubCategories';

// CategoryList component displays a list of categories with drag-and-drop functionality
const CategoryList = ({ categories, handleDeleteCategory, isDarkMode, isLoading, handleDragEnd, setModalState, renderSubCategory }) => {

  // Check if there are no categories and return a message if true
  if (!categories?.data?.length) {
    return <div className="p-8 text-center">
    <p className="text-lg text-gray-500">No categories found</p>
  </div>;
  }

  return (
    <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
    {isLoading ? (
      <div className="p-8 text-center">
        <LoadingSpinner />
      </div>
    ) : !categories?.data?.length ? (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-500">No categories found</p>
      </div>
    ) : (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <ul 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {categories.data.map((category, index) => (
                <Draggable key={category._id} draggableId={category._id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`p-6 ${
                        snapshot.isDragging ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-6">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition duration-200"
                          >
                            <BiMove size={24} />
                          </div>
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-20 h-20 object-cover rounded-lg shadow-md"
                          />
                          <div>
                            <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setModalState({
                              isOpen: true,
                              mode: 'add',
                              categoryId: category._id,
                              subCategory: null
                            })}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                          >
                            <BiPlus size={20} /> Add Subcategory
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200"
                          >
                            <BiTrash size={24} />
                          </button>
                        </div>
                      </div>

                      {/* Subcategories */}
                      <SubCategories category={category} renderSubCategory={renderSubCategory} />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    )}
  </div>
  );
};

// PropTypes for type checking the props passed to CategoryList
CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
  handleEditCategory: PropTypes.func.isRequired,
  handleDeleteCategory: PropTypes.func.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  setSubCategoryName: PropTypes.func.isRequired,
  setSubCategoryDescription: PropTypes.func.isRequired,
  handleDeleteSubCategory: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  setModalState: PropTypes.func.isRequired,
  renderSubCategory: PropTypes.func.isRequired,
};

export default CategoryList;
