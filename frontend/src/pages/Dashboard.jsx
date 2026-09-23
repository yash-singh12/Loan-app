import { useEffect, useState } from 'react'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import ProductForm from '../components/ProductForm'
import UserForm from '../components/UserForm'

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth()
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('')
  const [showProductForm, setShowProductForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showUserForm, setShowUserForm] = useState(false)
  const [viewData, setViewData] = useState(null)
  const [msg, setMsg] = useState('')

  async function getProducts() {
    try {
      const res = await api.get('/products')
      setProducts(res.data)
    } catch (e) {
      console.log(e)
    }
  }

  async function getUsers(status) {
    try {
      let url = '/users'
      if (status && status != '') url = '/users?status=' + status
      const res = await api.get(url)
      setUsers(res.data)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getProducts()
    getUsers('')
  }, [])

  function onFilterChange(e) {
    setFilter(e.target.value)
    getUsers(e.target.value)
  }

  // age for display only, backend does real calc
  function calcAge(dob) {
    return new Date().getFullYear() - new Date(dob).getFullYear()
  }

  async function saveProduct(data) {
    try {
      if (editing) {
        const res = await api.put('/products/' + editing._id, data)
        setMsg('Updated. Checked ' + res.data.reEvaluation.users + ' users.')
      } else {
        const res = await api.post('/products', data)
        setMsg('Added. Checked ' + res.data.reEvaluation.users + ' users.')
      }
      setShowProductForm(false)
      setEditing(null)
      getProducts()
      getUsers(filter)
    } catch (e) {
      console.log(e)
      alert(e.response?.data?.message || 'error saving product')
    }
  }

  async function saveUser(data) {
    try {
      const res = await api.post('/users', data)
      setMsg(res.data.fullName + ' -> ' + res.data.status)
      setShowUserForm(false)
      getUsers(filter)
    } catch (e) {
      console.log(e)
      alert(e.response?.data?.message || 'error adding user')
    }
  }

  async function openEligible(u) {
    const res = await api.get('/users/' + u._id + '/eligible')
    setViewData({ name: u.fullName, status: res.data.status, list: res.data.eligibleProducts })
  }

  return (
    <div className="layout">
      <header>
        <h1>Loan Admin Panel</h1>
        <div>
          {user?.name} ({user?.role}) <button onClick={logout}>Logout</button>
        </div>
      </header>

      {msg != '' && <div className="notice" onClick={() => setMsg('')}>{msg}</div>}

      <nav>
        <button className={tab == 'products' ? 'active' : ''} onClick={() => setTab('products')}>Products ({products.length})</button>
        <button className={tab == 'users' ? 'active' : ''} onClick={() => setTab('users')}>Users ({users.length})</button>
      </nav>

      {tab == 'products' && (
        <section>
          {isAdmin && <button onClick={() => { setEditing(null); setShowProductForm(true) }}>+ Add Product</button>}
          <table>
            <thead>
              <tr><th>Name</th><th>Age</th><th>Credit</th><th>Employment</th><th>Salary Type</th><th>Salary</th>{isAdmin && <th>Action</th>}</tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td><b>{p.name}</b><br /><small>{p.description}</small></td>
                  <td>{p.minAge}-{p.maxAge}</td>
                  <td>{p.minCreditScore}</td>
                  <td>{p.allowedEmploymentTypes.join(', ')}</td>
                  <td>{p.allowedSalaryTypes.join(', ')}</td>
                  <td>Rs {p.minSalary}</td>
                  {isAdmin && <td><button onClick={() => { setEditing(p); setShowProductForm(true) }}>Edit</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab == 'users' && (
        <section>
          <div className="row">
            {isAdmin && <button onClick={() => setShowUserForm(true)}>+ Add User</button>}
            <select value={filter} onChange={onFilterChange}>
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <table>
            <thead>
              <tr><th>Name</th><th>Age</th><th>Credit</th><th>Emp</th><th>Sal Type</th><th>Salary</th><th>Status</th><th>Eligible</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td>{calcAge(u.dob)}</td>
                  <td>{u.creditScore}</td>
                  <td>{u.employmentType}</td>
                  <td>{u.salaryType}</td>
                  <td>Rs {u.salary}</td>
                  <td><span className={u.status}>{u.status}</span></td>
                  <td>{u.status == 'Active' ? <button onClick={() => openEligible(u)}>View ({u.eligibleProducts?.length})</button> : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {showProductForm && <ProductForm initial={editing} onSave={saveProduct} onClose={() => { setShowProductForm(false); setEditing(null) }} />}
      {showUserForm && <UserForm onSave={saveUser} onClose={() => setShowUserForm(false)} />}

      {viewData && (
        <div className="modal-bg" onClick={() => setViewData(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{viewData.name} - {viewData.status}</h3>
            <ul>
              {viewData.list.map((p) => <li key={p._id}><b>{p.name}</b> - {p.description}</li>)}
            </ul>
            <button onClick={() => setViewData(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
