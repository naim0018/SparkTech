import { useState } from 'react';
import { useTheme } from '../../../../ThemeContext';
import { BiEdit, BiTrash, BiPlus, BiMove } from 'react-icons/bi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryOrderMutation,
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useUpdateSubCategoryMutation
} from '../../../../redux/api/CategoriesApi';
import PropTypes from 'prop-types';

// Modal component for adding/editing subcategories
const SubCategoryModal = ({ isOpen, onClose, onSubmit, initialData, mode = 'add' }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    image: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">
          {mode === 'add' ? 'Add New Subcategory' : 'Edit Subcategory'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {mode === 'add' ? 'Add Subcategory' : 'Update Subcategory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SubCategoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  mode: PropTypes.oneOf(['add', 'edit'])
};

const Categories = () => {
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    image: '',
    description: '',
    subCategories: []
  });

  const { isDarkMode } = useTheme();

  const { data: categories, isLoading } = useGetAllCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [createSubCategory] = useCreateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const [updateCategoryOrder] = useUpdateCategoryOrderMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();

  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add',
    categoryId: null,
    subCategory: null
  });

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setCategoryForm({
      name: '',
      image: '',
      description: '',
      subCategories: []
    });
  };

  // CRUD Operations
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    try {
      const response = await createCategory(categoryForm).unwrap();
      
      if (response.success) {
        resetForm();
        Swal.fire({
          icon: 'success',
          title: 'Category Added!',
          text: 'The category has been created successfully',
          confirmButtonColor: '#3B82F6'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add Category',
        text: error.data?.message || 'An error occurred while adding the category',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleDeleteSubCategory = async (categoryId, subCategoryName) => {
    try {
      const result = await Swal.fire({
        title: 'Delete Subcategory?',
        text: "This action cannot be undone",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        await deleteSubCategory({ categoryId, subCategoryName }).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The subcategory has been deleted',
          confirmButtonColor: '#3B82F6'
        });
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Delete',
        text: 'An error occurred while deleting the subcategory',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Delete Category?',
        text: "This will also delete all subcategories. This action cannot be undone",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        await deleteCategory(id).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The category has been deleted',
          confirmButtonColor: '#3B82F6'
        });
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Delete',
        text: 'An error occurred while deleting the category',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleUpdateSubCategory = async (categoryId, oldName, updatedSubCategory) => {
    try {
      await updateSubCategory({
        categoryId,
        subCategoryName: oldName,
        data: updatedSubCategory
      }).unwrap();

      setEditingSubCategory(null);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'The subcategory has been updated successfully',
        confirmButtonColor: '#3B82F6'
      });
      } catch {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating the subcategory',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(categories.data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      await updateCategoryOrder({
        categories: items.map((cat, index) => ({
          id: cat._id,
          order: index
        }))
      }).unwrap();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Reorder Failed',
        text: 'Failed to update category order',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleSubCategorySubmit = async (formData) => {
    try {
      if (modalState.mode === 'add') {
        await createSubCategory({
          categoryId: modalState.categoryId,
          data: formData
        }).unwrap();
      } else {
        await updateSubCategory({
          categoryId: modalState.categoryId,
          subCategoryName: modalState.subCategory.name,
          data: formData
        }).unwrap();
      }

      setModalState({ isOpen: false, mode: 'add', categoryId: null, subCategory: null });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: modalState.mode === 'add' ? 'Subcategory added successfully' : 'Subcategory updated successfully',
        confirmButtonColor: '#3B82F6'
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: `Failed to ${modalState.mode} subcategory`,
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const renderSubCategory = (category, sub, index) => {
    const isEditing = editingSubCategory?.categoryId === category._id && 
                     editingSubCategory?.index === index;

    if (isEditing) {
      return (
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <input
            type="text"
            value={editingSubCategory.data.name}
            onChange={(e) => setEditingSubCategory({
              ...editingSubCategory,
              data: { ...editingSubCategory.data, name: e.target.value }
            })}
            className="flex-1 p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={editingSubCategory.data.image}
            onChange={(e) => setEditingSubCategory({
              ...editingSubCategory,
              data: { ...editingSubCategory.data, image: e.target.value }
            })}
            className="flex-1 p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateSubCategory(
                category._id,
                sub.name,
                editingSubCategory.data
              )}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              Save
            </button>
            <button
              onClick={() => setEditingSubCategory(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200">
        <div className="flex items-center gap-4">
          <img 
            src={sub.image} 
            alt={sub.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div>
            <h5 className="font-semibold text-lg">{sub.name}</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {sub.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditingSubCategory({
              categoryId: category._id,
              index,
              data: { ...sub }
            })}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition duration-200"
          >
            <BiEdit size={20} />
          </button>
          <button
            onClick={() => handleDeleteSubCategory(category._id, sub.name)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200"
          >
            <BiTrash size={20} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Categories Management</h1>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="mb-12 space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Add New Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={categoryForm.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                } focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Image URL</label>
              <input
                type="text"
                name="image"
                value={categoryForm.image}
                onChange={handleInputChange}
                placeholder="Enter image URL"
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                } focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={categoryForm.description}
              onChange={handleInputChange}
              placeholder="Enter category description"
              rows="4"
              className={`w-full p-3 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              } focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              <BiPlus size={20} /> Add Category
            </button>
          </div>
        </form>

        {/* Categories List */}
        <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-lg">Loading categories...</p>
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
                            {category.subCategories?.length > 0 && (
                              <div className="ml-14">
                                <h4 className="text-lg font-semibold mb-4">Subcategories</h4>
                                <div className="grid gap-3">
                                  {category.subCategories.map((sub, subIndex) => (
                                    <div key={sub.name}>
                                      {renderSubCategory(category, sub, subIndex)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
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
      </div>

      <SubCategoryModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'add', categoryId: null, subCategory: null })}
        onSubmit={handleSubCategorySubmit}
        initialData={modalState.subCategory}
        mode={modalState.mode}
      />
    </div>
  );
};

export default Categories;
