import { useState } from 'react'

var EMP_TYPES = ['Salaried', 'Self-Employed']
var SAL_TYPES = ['DAT', 'Cash', 'Cheque']

export default function ProductForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial ? initial.name : '')
  const [desc, setDesc] = useState(initial ? initial.description : '')
  const [minAge, setMinAge] = useState(initial ? initial.minAge : 21)
  const [maxAge, setMaxAge] = useState(initial ? initial.maxAge : 58)
  const [minCredit, setMinCredit] = useState(initial ? initial.minCreditScore : 700)
  const [minSalary, setMinSalary] = useState(initial ? initial.minSalary : 25000)
  const [empTypes, setEmpTypes] = useState(initial ? initial.allowedEmploymentTypes : ['Salaried'])
  const [salTypes, setSalTypes] = useState(initial ? initial.allowedSalaryTypes : ['Cheque'])

  function toggle(list, setList, val) {
    if (list.includes(val)) {
      setList(list.filter((x) => x != val))
    } else {
      setList([...list, val])
    }
  }

  function handleSave() {
    onSave({
      name: name,
      description: desc,
      minAge: Number(minAge),
      maxAge: Number(maxAge),
      minCreditScore: Number(minCredit),
      allowedEmploymentTypes: empTypes,
      allowedSalaryTypes: salTypes,
      minSalary: Number(minSalary)
    })
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{initial ? 'Edit Product' : 'Add Product'}</h3>

        <label>Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>Description
          <input value={desc} onChange={(e) => setDesc(e.target.value)} />
        </label>

        <div className="row">
          <label>Min Age
            <input type="number" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
          </label>
          <label>Max Age
            <input type="number" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
          </label>
        </div>

        <div className="row">
          <label>Min Credit (300-900)
            <input type="number" value={minCredit} onChange={(e) => setMinCredit(e.target.value)} />
          </label>
          <label>Min Salary
            <input type="number" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} />
          </label>
        </div>

        <div>
          Employment:
          {EMP_TYPES.map((t) => (
            <label key={t} className="chk">
              <input type="checkbox" checked={empTypes.includes(t)} onChange={() => toggle(empTypes, setEmpTypes, t)} />
              {t}
            </label>
          ))}
        </div>

        <div style={{ marginTop: '8px' }}>
          Salary Type:
          {SAL_TYPES.map((t) => (
            <label key={t} className="chk">
              <input type="checkbox" checked={salTypes.includes(t)} onChange={() => toggle(salTypes, setSalTypes, t)} />
              {t}
            </label>
          ))}
        </div>

        <div className="row">
          <button onClick={handleSave}>Save</button>
          <button className="ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
