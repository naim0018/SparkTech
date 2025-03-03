    import PropTypes from 'prop-types'

const SubCategories = ({category, renderSubCategory}) => {
  return (
    <div>
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
    </div>
  )
}

SubCategories.propTypes = {
  category: PropTypes.object.isRequired,
  renderSubCategory: PropTypes.func.isRequired
}

export default SubCategories
