import './index.css'

const FiltersGroup = props => {
  const renderSaleryList = () => {
    const {salaryRange} = props
    return salaryRange.map(sal => {
      const {changeSalary} = props
      const onClickChangeSalary = () => changeSalary(sal.salaryRangeId)
      return (
        <li key={sal.salaryRangeId}>
          <input
            type="radio"
            name="salary"
            id={sal.salaryRangeId}
            onClick={onClickChangeSalary}
          />
          <label htmlFor={sal.salaryRangeId}>{sal.label}</label>
        </li>
      )
    })
  }

  const renderSalery = () => (
    <>
      <hr />
      <ul>{renderSaleryList()}</ul>
    </>
  )

  const renderEmployeeList = () => {
    const {employmentType} = props
    return employmentType.map(employmet => {
      const {changeType} = props
      const onClickChangeType = () => changeType(employmet.employmentTypeId)
      return (
        <li key={employmet.employmentTypeId}>
          <input
            type="checkbox"
            onClick={onClickChangeType}
            id={employmet.employmentTypeId}
          />
          <label htmlFor={employmet.employmentTypeId}>{employmet.label}</label>
        </li>
      )
    })
  }

  const renderEmployee = () => (
    <>
      <hr />
      <ul>{renderEmployeeList()}</ul>
    </>
  )

  return (
    <div>
      {renderEmployee()}
      {renderSalery()}
    </div>
  )
}

export default FiltersGroup
