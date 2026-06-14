import { Children, cloneElement } from 'react'
import { Search } from 'lucide-react'

export function FilterForm({ children, values, onChange, onSubmit }) {
  function handleChange(event) {
    onChange({
      ...values,
      [event.target.name]: event.target.value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await onSubmit()
  }

  return (
    <form className="filters" onSubmit={handleSubmit} onChange={handleChange}>
      {Children.map(children, (child) =>
        cloneElement(child, {
          value: values[child.props.name] ?? '',
        }),
      )}
      <button className="icon-button" type="submit">
        <Search size={18} />
        Apply
      </button>
    </form>
  )
}

export function TextFilter({ name, label, value }) {
  return (
    <label>
      {label}
      <input name={name} value={value} onChange={() => {}} />
    </label>
  )
}

export function SelectFilter({ name, label, options, value }) {
  return (
    <label>
      {label}
      <select name={name} value={value} onChange={() => {}}>
        {options.map((option) => {
          const optionValue = Array.isArray(option) ? option[0] : option
          const optionLabel = Array.isArray(option) ? option[1] : option || 'Any'

          return (
            <option key={`${name}-${optionValue}`} value={optionValue}>
              {optionLabel}
            </option>
          )
        })}
      </select>
    </label>
  )
}
