import { useState } from 'react'

export default function UserForm({ onSave, onClose }) {
  const [fullName, setFullName] = useState('')
  const [dob, setDob] = useState('1996-03-15')
  const [credit, setCredit] = useState(720)
  const [emp, setEmp] = useState('Salaried')
  const [salType, setSalType] = useState('Cheque')
  const [salary, setSalary] = useState(30000)

  function handleSave() {
    onSave({
      fullName: fullName,
      dob: dob,
      creditScore: Number(credit),
      employmentType: emp,
      salaryType: salType,
      salary: Number(salary)
    })
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Add User</h3>
        <label>Full Name
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="eg Rahul Sharma" />
        </label>
        <label>DOB
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </label>
        <div className="row">
          <label>Credit (300-900)
            <input type="number" value={credit} onChange={(e) => setCredit(e.target.value)} />
          </label>
          <label>Salary
            <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
          </label>
        </div>
        <div className="row">
          <label>Employment
            <select value={emp} onChange={(e) => setEmp(e.target.value)}>
              <option>Salaried</option>
              <option>Self-Employed</option>
            </select>
          </label>
          <label>Salary Type
            <select value={salType} onChange={(e) => setSalType(e.target.value)}>
              <option>DAT</option>
              <option>Cash</option>
              <option>Cheque</option>
            </select>
          </label>
        </div>
        <div className="row">
          <button onClick={handleSave}>Save & Evaluate</button>
          <button className="ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
