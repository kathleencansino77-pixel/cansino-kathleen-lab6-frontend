import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

import {
  LayoutGrid,
  Package,
  BarChart3,
  Search,
  Bell,
  Plus,
  Pencil,
  Trash2,
  X,
  Sun,
  Moon,
  LogOut,
  Upload,
  Laptop,
  User,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft
} from 'lucide-react'

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL = 'https://cansino-kathleen-lab6.onrender.com'

/*
 * FIX: uploaded images are saved in ROOT_DIR/public/uploads/products/
 * and the DB stores "uploads/products/xxx.jpg".
 * If your server root is the project folder, images are served from /public/...
 * If your server root is already the "public" folder, change this to: API_URL
 */
const IMAGE_BASE = API_URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json'
  }
})

/* =========================================================
   THEME
========================================================= */

const THEMES = {
  light: {
    '--bg': '#f6efec',
    '--card': '#fbf6f4',
    '--side': '#c9bdf0',
    '--text': '#2a2438',
    '--muted': '#8a8399',
    '--accent': '#8b72e6',
    '--line': '#e8ddf6',
    '--t1': '#e9e2fb',
    '--t2': '#fbdcd2',
    '--t3': '#d8f0e0',
    '--t4': '#fdeec3',
    '--clay':
      '10px 14px 28px rgba(120,100,165,.15), inset 3px 3px 7px rgba(255,255,255,.95), inset -4px -5px 11px rgba(150,130,190,.12)',
    '--pressed':
      'inset 4px 5px 10px rgba(130,110,175,.18), inset -3px -3px 8px rgba(255,255,255,.9)'
  },

  dark: {
    '--bg': '#17142a',
    '--card': '#221e3b',
    '--side': '#3a2f6b',
    '--text': '#f1edff',
    '--muted': '#9d95bd',
    '--accent': '#a48cff',
    '--line': '#342d57',
    '--t1': '#2f2753',
    '--t2': '#4a2f3c',
    '--t3': '#25423a',
    '--t4': '#4a4026',
    '--clay':
      '10px 14px 28px rgba(0,0,0,.45), inset 2px 2px 6px rgba(255,255,255,.07), inset -4px -5px 10px rgba(0,0,0,.35)',
    '--pressed':
      'inset 4px 5px 10px rgba(0,0,0,.45), inset -2px -2px 6px rgba(255,255,255,.05)'
  }
}

const clay =
  'shadow-[var(--clay)] bg-[var(--card)] rounded-[28px]'

const input =
  'h-12 w-full rounded-2xl bg-[var(--bg)] px-4 text-base text-[var(--text)] outline-none shadow-[var(--pressed)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--accent)]'

const btn =
  'inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 h-12 text-base font-semibold text-white shadow-[0_10px_20px_rgba(139,114,230,.35),inset_2px_2px_5px_rgba(255,255,255,.35)] transition hover:brightness-110 active:translate-y-px'

const peso = (n) =>
  '₱' +
  Number(n || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

/* =========================================================
   AUTH TOKEN
========================================================= */

const getToken = () =>
  localStorage.getItem('access_token')

/* =========================================================
   AXIOS JWT INTERCEPTOR
========================================================= */

api.interceptors.request.use(
  (config) => {
    const token = getToken()

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/* =========================================================
   AXIOS RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || ''

      if (!requestUrl.includes('/api/auth/login')) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }
    }

    return Promise.reject(error)
  }
)

/* =========================================================
   HELPERS
========================================================= */

const getImageUrl = (image) => {
  if (!image) return ''

  const value = String(image).trim()

  if (value.startsWith('http://localhost:3000')) {
    return `${API_URL}${value.replace('http://localhost:3000', '')}`
  }

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:')
  ) {
    return value
  }

  const clean = value.replace(/^\/+/, '').replace(/^public\//, '')

  return `${IMAGE_BASE}/${clean}`
}

const stockInfo = (n) => {
  const stock = Number(n || 0)

  if (stock === 0) {
    return {
      label: 'Out of stock',
      cls: 'bg-rose-100 text-rose-600'
    }
  }

  if (stock <= 5) {
    return {
      label: `Low · ${stock} left`,
      cls: 'bg-amber-100 text-amber-700'
    }
  }

  return {
    label: `In stock · ${stock}`,
    cls: 'bg-emerald-100 text-emerald-700'
  }
}

/* =========================================================
   LAPTOP IMAGE
========================================================= */

function LaptopArt({ item, big }) {
  const image = getImageUrl(item?.image)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [image])

  if (image && !failed) {
    return (
      <img
        src={image}
        alt={item?.product_name || 'Laptop'}
        className="absolute inset-0 h-full w-full object-contain p-1 drop-shadow-[0_18px_20px_rgba(60,40,100,.3)]"
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <div
      className={`relative mx-auto flex items-center justify-center ${
        big ? 'h-36 w-48' : 'h-16 w-24'
      }`}
    >
      <div className="relative w-full">
        <div className="mx-auto rounded-xl bg-[#4b4961] p-1.5 shadow-[0_15px_25px_rgba(40,30,80,.25)]">
          <div className="aspect-[16/10] rounded-lg bg-gradient-to-br from-[#b8a8f0] to-[#7e6bc8]">
            <div className="grid h-full place-items-center">
              <Laptop
                size={big ? 48 : 25}
                className="text-white/80"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto h-2 w-[115%] -translate-x-[7.5%] rounded-b-xl bg-gradient-to-b from-[#bfc0cf] to-[#74768b]" />
      </div>
    </div>
  )
}

/* =========================================================
   LINE CHART
========================================================= */

function LineChart({ data }) {
  if (!data.length) {
    return (
      <div className="grid h-44 place-items-center text-base text-[var(--muted)]">
        No inventory data yet.
      </div>
    )
  }

  const w = 460
  const h = 170
  const max = Math.max(...data, 1) * 1.15

  const pts = data.map((v, i) => [
    data.length === 1
      ? w / 2
      : (i / (data.length - 1)) * w,
    h - (v / max) * h
  ])

  const d = pts.reduce((a, [x, y], i) => {
    if (!i) return `M${x},${y}`

    const [px, py] = pts[i - 1]
    const cx = (px + x) / 2

    return (
      a +
      ` C${cx},${py} ${cx},${y} ${x},${y}`
    )
  }, '')

  return (
    <svg
      viewBox={`0 0 ${w} ${h + 8}`}
      className="w-full"
    >
      <defs>
        <linearGradient
          id="inventoryGradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="var(--accent)"
            stopOpacity=".3"
          />

          <stop
            offset="1"
            stopColor="var(--accent)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      <path
        d={`${d} L${w},${h} L0,${h} Z`}
        fill="url(#inventoryGradient)"
      />

      <path
        d={d}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {pts.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="5"
          fill="var(--card)"
          stroke="var(--accent)"
          strokeWidth="3"
        />
      ))}
    </svg>
  )
}

/* =========================================================
   DONUT
========================================================= */

function Donut({ parts }) {
  const validParts = parts.filter(
    (p) => p.v > 0
  )

  const total =
    validParts.reduce(
      (s, p) => s + p.v,
      0
    ) || 1

  let acc = 0

  const stops = validParts
    .map((p) => {
      const a = (acc / total) * 100

      acc += p.v

      return `${p.c} ${a}% ${(acc / total) * 100}%`
    })
    .join(',')

  if (!validParts.length) {
    return (
      <div className="grid place-items-center">
        <div className="grid h-32 w-32 place-items-center rounded-full bg-[var(--t1)] shadow-[var(--clay)]">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--card)] shadow-[var(--pressed)]">
            <span className="text-sm text-[var(--muted)]">
              No stock
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <div
        className="grid h-32 w-32 shrink-0 place-items-center rounded-full shadow-[var(--clay)]"
        style={{
          background: `conic-gradient(${stops})`
        }}
      >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--card)] text-center shadow-[var(--pressed)]">
          <span className="text-xl font-bold">
            {total}

            <span className="block text-xs font-medium text-[var(--muted)]">
              units
            </span>
          </span>
        </div>
      </div>

      <ul className="space-y-1.5 text-sm text-[var(--muted)]">
        {validParts.map((p) => (
          <li
            key={p.n}
            className="flex items-center gap-2"
          >
            <i
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: p.c
              }}
            />

            {p.n}

            <b className="text-[var(--text)]">
              {p.v}
            </b>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* =========================================================
   ADD / EDIT MODAL
========================================================= */

function LaptopModal({
  item,
  onClose,
  onSave,
  saving
}) {
  const [f, setF] = useState({
    id: item?.id ?? null,
    brand: item?.brand || '',
    product_name:
      item?.product_name || '',
    description:
      item?.description || '',
    price: item?.price ?? '',
    quantity: item?.quantity ?? '',
    image: null,
    existingImage: item?.image || '',
    preview: getImageUrl(item?.image)
  })

  const [error, setError] =
    useState('')

  const set = (key) => (e) => {
    setF((prev) => ({
      ...prev,
      [key]: e.target.value
    }))
  }

  /* =======================================================
     IMAGE PICKER
  ======================================================= */

  const pick = (e) => {
    const file =
      e.target.files?.[0]

    if (!file) return

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        'Image must not exceed 5 MB.'
      )

      e.target.value = ''
      return
    }

    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif'
    ]

    if (!allowed.includes(file.type)) {
      setError(
        'Only JPG, PNG, WEBP, and GIF images are allowed.'
      )

      e.target.value = ''
      return
    }

    setError('')

    const reader =
      new FileReader()

    reader.onload = () => {
      setF((prev) => ({
        ...prev,
        image: file,
        preview: reader.result
      }))
    }

    reader.readAsDataURL(file)
  }

  const ok =
    f.brand.trim() &&
    f.product_name.trim() &&
    f.price !== '' &&
    f.quantity !== '' &&
    Number(f.price) >= 0 &&
    Number(f.quantity) >= 0

  const field = (
    key,
    label,
    type = 'text'
  ) => (
    <label className="block text-sm font-medium text-[var(--muted)]">
      {label}

      <input
        type={type}
        value={f[key]}
        onChange={set(key)}
        className={`${input} mt-1.5`}
        min={
          type === 'number'
            ? '0'
            : undefined
        }
        step={
          key === 'price'
            ? '0.01'
            : undefined
        }
      />
    </label>
  )

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#1a1233]/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`${clay} max-h-[92vh] w-full max-w-2xl overflow-y-auto p-7`}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">
              {item
                ? 'Edit laptop'
                : 'Add laptop'}
            </h3>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {item
                ? 'Update the product information.'
                : 'Add a new laptop to your inventory.'}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full shadow-[var(--clay)]"
          >
            <X size={18} />
          </button>
        </div>

        <label className="relative mb-5 flex h-44 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl bg-[var(--t1)] p-3 text-base text-[var(--muted)] shadow-[var(--pressed)]">
          {f.preview ? (
            <>
              <img
                src={f.preview}
                alt="Product preview"
                className="h-full max-w-full object-contain"
              />

              <span className="absolute bottom-3 rounded-xl bg-[var(--card)] px-3 py-1 text-xs shadow-[var(--clay)]">
                Click to change image
              </span>
            </>
          ) : (
            <>
              <Upload size={24} />

              Upload laptop photo

              <span className="text-xs">
                JPG, PNG, WEBP, GIF · Max 5 MB
              </span>
            </>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={pick}
            className="hidden"
          />
        </label>

        {error && (
          <div className="mb-4 rounded-2xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {field(
            'brand',
            'Brand'
          )}

          {field(
            'product_name',
            'Product name'
          )}

          {field(
            'price',
            'Price (₱)',
            'number'
          )}

          {field(
            'quantity',
            'Quantity',
            'number'
          )}
        </div>

        <label className="mt-4 block text-sm font-medium text-[var(--muted)]">
          Description

          <textarea
            value={f.description}
            onChange={set(
              'description'
            )}
            rows={4}
            placeholder="Enter product description..."
            className={`${input} mt-1.5 h-auto py-3`}
          />
        </label>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="h-12 rounded-2xl px-5 text-base font-semibold text-[var(--muted)]"
          >
            Cancel
          </button>

          <button
            disabled={!ok || saving}
            onClick={() =>
              onSave({
                ...f,
                price: Number(f.price),
                quantity: Number(f.quantity)
              })
            }
            className={`${btn} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {saving ? (
              <>
                <RefreshCw
                  size={16}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : item ? (
              'Save changes'
            ) : (
              'Add laptop'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   DESCRIPTION VIEW (specs table, bullet lists)
========================================================= */

function DescriptionView({ text }) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  const sections = []
  let cur = { title: '', items: [] }

  lines.forEach((line) => {
    if (/^[A-Z][A-Z &/]{2,30}$/.test(line)) {
      if (cur.title || cur.items.length) sections.push(cur)
      cur = { title: line, items: [] }
    } else {
      cur.items.push(line)
    }
  })

  sections.push(cur)

  const isRow = (l) => !l.startsWith('- ') && /^[^:]{2,30}:\s*\S/.test(l)

  return (
    <div className="space-y-6">
      {sections.map((sec, i) => {
        const bullets = sec.items.filter((l) => l.startsWith('- '))
        const rows = sec.items.filter(isRow)
        const other = sec.items.filter((l) => !l.startsWith('- ') && !isRow(l))

        return (
          <div key={i}>
            {sec.title && (
              <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
                {sec.title}
                <span className="h-px flex-1 bg-[var(--line)]" />
              </p>
            )}

            {rows.length > 0 && (
              <div className="rounded-2xl bg-[var(--bg)] px-5 py-2 shadow-[var(--pressed)]">
                {rows.map((l, n) => {
                  const k = l.indexOf(':')

                  return (
                    <div
                      key={n}
                      className="grid grid-cols-[130px_1fr] gap-4 border-b border-[var(--line)] py-2.5 text-sm last:border-b-0 sm:grid-cols-[160px_1fr]"
                    >
                      <span className="text-[var(--muted)]">
                        {l.slice(0, k)}
                      </span>

                      <span className="font-semibold">
                        {l.slice(k + 1).trim()}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {bullets.length > 0 && (
              <ul className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                {bullets.map((l, n) => (
                  <li key={n} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>{l.slice(2)}</span>
                  </li>
                ))}
              </ul>
            )}

            {other.map((l, n) => (
              <p key={n} className="whitespace-pre-line break-words text-base leading-6">
                {l}
              </p>
            ))}
          </div>
        )
      })}
    </div>
  )
}

/* =========================================================
   PRODUCT DETAIL
========================================================= */

function Detail({
  item,
  onClose
}) {
  const s =
    stockInfo(item.quantity)

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#1a1233]/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* FIX: modal scrolls when the description is long */}
      <div
        className={`${clay} grid max-h-[92vh] w-full max-w-5xl overflow-y-auto md:grid-cols-[5fr_6fr] md:overflow-hidden`}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="grid min-h-[320px] place-items-center bg-[var(--t1)] p-8">
          {/* FIX: fixed-height box so the image stays inside */}
          <div className="relative flex h-64 w-full items-center justify-center">
            <LaptopArt
              item={item}
              big
            />
          </div>
        </div>

        <div className="p-8 md:max-h-[92vh] md:overflow-y-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-base font-medium text-[var(--accent)]">
                {item.brand}
              </p>

              <h3 className="text-2xl font-bold">
                {item.product_name}
              </h3>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-10 w-10 place-items-center rounded-full shadow-[var(--clay)]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-3xl font-bold">
              {peso(item.price)}
            </p>

            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${s.cls}`}
            >
              {s.label}
            </span>
          </div>

          {item.description && (
            <div className="mt-6">
              <DescriptionView
                text={item.description}
              />
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[var(--bg)] p-4 shadow-[var(--pressed)]">
              <p className="text-sm text-[var(--muted)]">
                Brand
              </p>

              <p className="mt-1 text-base font-semibold">
                {item.brand || '—'}
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--bg)] p-4 shadow-[var(--pressed)]">
              <p className="text-sm text-[var(--muted)]">
                Available
              </p>

              <p className="mt-1 text-base font-semibold">
                {item.quantity} units
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   CONFIRM DELETE MODAL
========================================================= */

function ConfirmModal({
  item,
  onCancel,
  onConfirm,
  loading
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onCancel()
    }

    window.addEventListener('keydown', onKey)

    return () =>
      window.removeEventListener('keydown', onKey)
  }, [loading, onCancel])

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-[#1a1233]/40 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!loading) onCancel()
      }}
    >
      <div
        className={`${clay} w-full max-w-md p-7 text-center`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[var(--t2)] text-rose-500 shadow-[var(--clay)]">
          <Trash2 size={26} />
        </div>

        <h3 className="text-xl font-bold">
          Delete this laptop?
        </h3>

        <p className="mt-2 text-base text-[var(--muted)]">
          <b className="text-[var(--text)]">
            {item.product_name}
          </b>{' '}
          will be permanently removed. This action cannot be undone.
        </p>

        <div className="mt-7 flex justify-center gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="h-12 rounded-2xl bg-[var(--bg)] px-6 text-base font-semibold text-[var(--muted)] shadow-[var(--pressed)] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-rose-500 px-6 text-base font-semibold text-white shadow-[0_10px_20px_rgba(244,63,94,.3),inset_2px_2px_5px_rgba(255,255,255,.3)] transition hover:brightness-110 active:translate-y-px disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw
                  size={16}
                  className="animate-spin"
                />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   LOGIN PAGE
========================================================= */

function Login({ onLogin }) {
  const [mode, setMode] =
    useState('login')

  const [login, setLogin] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [username, setUsername] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [registerPassword, setRegisterPassword] =
    useState('')

  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [showRegisterPassword, setShowRegisterPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  /* =======================================================
     LOGIN
  ======================================================= */

  const submitLogin = async (e) => {
    e.preventDefault()

    const loginValue =
      login.trim()

    if (
      !loginValue ||
      !password
    ) {
      setError(
        'Username/email and password are required.'
      )

      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response =
        await api.post(
          '/api/auth/login',
          {
            login: loginValue,
            password
          },
          {
            headers: {
              'Content-Type':
                'application/json',
              Accept:
                'application/json'
            }
          }
        )

      const data =
        response.data

      if (
        !data?.tokens?.access_token
      ) {
        setError(
          'Login response did not contain an access token.'
        )

        return
      }

      localStorage.setItem(
        'access_token',
        data.tokens.access_token
      )

      if (
        data.tokens.refresh_token
      ) {
        localStorage.setItem(
          'refresh_token',
          data.tokens.refresh_token
        )
      }

      if (data.user) {
        localStorage.setItem(
          'user',
          JSON.stringify(data.user)
        )
      }

      onLogin(data.user)

    } catch (err) {
      console.error(
        'LOGIN ERROR:',
        err.response?.data ||
          err.message ||
          err
      )

      const data =
        err.response?.data

      if (
        data?.locked ||
        data?.status === 429 ||
        err.response?.status === 429
      ) {
        setError(
          data?.error ||
            'Too many failed login attempts. Please try again later.'
        )
      } else if (
        err.response?.status === 401
      ) {
        setError(
          data?.error ||
            'Invalid username/email or password.'
        )
      } else if (
        err.response?.status === 403
      ) {
        setError(
          data?.error ||
            'Your account is inactive.'
        )
      } else if (
        err.response?.status === 404
      ) {
        setError(
          'Login API endpoint was not found.'
        )
      } else if (
        err.response?.status === 500
      ) {
        setError(
          'Server error. Please check the LavaLust backend.'
        )
      } else {
        setError(
          data?.error ||
            'Unable to connect to the server.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  /* =======================================================
     REGISTER
  ======================================================= */

  const submitRegister =
    async (e) => {
      e.preventDefault()

      const cleanUsername =
        username.trim()

      const cleanEmail =
        email.trim()

      setError('')
      setSuccess('')

      if (
        !cleanUsername ||
        !cleanEmail ||
        !registerPassword ||
        !confirmPassword
      ) {
        setError(
          'Please complete all fields.'
        )

        return
      }

      if (
        registerPassword.length < 6
      ) {
        setError(
          'Password must be at least 6 characters.'
        )

        return
      }

      if (
        registerPassword !==
        confirmPassword
      ) {
        setError(
          'Passwords do not match.'
        )

        return
      }

      setLoading(true)

      try {
        const response =
          await api.post(
            '/api/auth/register',
            {
              username:
                cleanUsername,
              email:
                cleanEmail,
              password:
                registerPassword
            },
            {
              headers: {
                'Content-Type':
                  'application/json',
                Accept:
                  'application/json'
              }
            }
          )

        console.log(
          'REGISTER RESPONSE:',
          response.data
        )

        setSuccess(
          'Account created successfully! You can now sign in.'
        )

        setUsername('')
        setEmail('')
        setRegisterPassword('')
        setConfirmPassword('')

        setTimeout(() => {
          setMode('login')
          setLogin(cleanEmail)
          setPassword('')
          setSuccess('')
        }, 1200)

      } catch (err) {
        console.error(
          'REGISTER ERROR:',
          err.response?.data ||
            err.message ||
            err
        )

        const data =
          err.response?.data

        if (
          err.response?.status === 409
        ) {
          setError(
            data?.error ||
              'Username or email is already registered.'
          )
        } else if (
          err.response?.status === 400
        ) {
          setError(
            data?.error ||
              'Please check the information you entered.'
          )
        } else if (
          err.response?.status === 500
        ) {
          setError(
            'Server error. Please check the LavaLust backend.'
          )
        } else {
          setError(
            data?.error ||
              'Unable to create your account.'
          )
        }
      } finally {
        setLoading(false)
      }
    }

  return (
    <div
      style={THEMES.light}
      className="grid min-h-screen place-items-center bg-[var(--bg)] p-5 text-[var(--text)]"
    >
      <div className="w-full max-w-md">
        <div
          className={`${clay} p-8 sm:p-10`}
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-[22px] bg-[#ffb4a2] text-white shadow-[var(--clay)]">
              {mode === 'login' ? (
                <Laptop size={30} />
              ) : (
                <UserPlus size={30} />
              )}
            </div>

            <h1 className="text-3xl font-bold">
              Laptop Manager
            </h1>

            <p className="mt-2 text-base text-[var(--muted)]">
              {mode === 'login'
                ? 'Sign in to manage your laptop inventory'
                : 'Create an account to access the laptop catalog'}
            </p>
          </div>

          {mode === 'login' && (
            <form
              onSubmit={submitLogin}
              className="space-y-5"
            >
              <label className="block text-sm font-medium text-[var(--muted)]">
                Username or Email

                <div className="relative mt-1.5">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    type="text"
                    value={login}
                    onChange={(e) =>
                      setLogin(
                        e.target.value
                      )
                    }
                    placeholder="Enter your username or email"
                    autoComplete="username"
                    className={`${input} pl-11`}
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-[var(--muted)]">
                Password

                <div className="relative mt-1.5">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`${input} pl-11 pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-[var(--muted)] hover:bg-[var(--bg)]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              {error && (
                <div className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`${btn} w-full disabled:opacity-50`}
              >
                {loading ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={17} />
                    Sign in
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <span className="text-sm text-[var(--muted)]">
                  Don't have an account?
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setMode('register')
                    setError('')
                    setSuccess('')
                  }}
                  className="ml-1 text-sm font-bold text-[var(--accent)] hover:underline"
                >
                  Create account
                </button>
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form
              onSubmit={submitRegister}
              className="space-y-4"
            >
              <label className="block text-sm font-medium text-[var(--muted)]">
                Username

                <div className="relative mt-1.5">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value
                      )
                    }
                    placeholder="Choose a username"
                    autoComplete="username"
                    className={`${input} pl-11`}
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-[var(--muted)]">
                Email

                <div className="relative mt-1.5">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="Enter your email"
                    autoComplete="email"
                    className={`${input} pl-11`}
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-[var(--muted)]">
                Password

                <div className="relative mt-1.5">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    type={
                      showRegisterPassword
                        ? 'text'
                        : 'password'
                    }
                    value={registerPassword}
                    onChange={(e) =>
                      setRegisterPassword(
                        e.target.value
                      )
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className={`${input} pl-11 pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowRegisterPassword(
                        !showRegisterPassword
                      )
                    }
                    className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-[var(--muted)] hover:bg-[var(--bg)]"
                  >
                    {showRegisterPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              <label className="block text-sm font-medium text-[var(--muted)]">
                Confirm Password

                <div className="relative mt-1.5">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className={`${input} pl-11 pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-[var(--muted)] hover:bg-[var(--bg)]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              {success && (
                <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-700">
                  {success}
                </div>
              )}

              {error && (
                <div className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`${btn} w-full disabled:opacity-50`}
              >
                {loading ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus size={17} />
                    Create account
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <span className="text-sm text-[var(--muted)]">
                  Already have an account?
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setError('')
                    setSuccess('')
                  }}
                  className="ml-1 inline-flex items-center gap-1 text-sm font-bold text-[var(--accent)] hover:underline"
                >
                  <ArrowLeft size={14} />
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-[var(--muted)]">
          Product Management System
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

function Dashboard({
  user,
  onLogout
}) {
  const [dark, setDark] =
    useState(false)

  const [tab, setTab] =
    useState('overview')

  const [items, setItems] =
    useState([])

  const [q, setQ] =
    useState('')

  const [brand, setBrand] =
    useState('All')

  const [modal, setModal] =
    useState(null)

  const [detail, setDetail] =
    useState(null)

  const [menu, setMenu] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState('')

  const [confirmItem, setConfirmItem] =
    useState(null)

  const [deleting, setDeleting] =
    useState(false)

  const isAdmin =
    user?.role === 'admin'

  const name =
    user?.username ||
    user?.name ||
    'User'

  /* =======================================================
     LOAD PRODUCTS
  ======================================================= */

  const loadProducts =
    async () => {
      setLoading(true)
      setError('')

      try {
        const response =
          await api.get(
            '/api/products'
          )

        const data =
          response.data

        const products =
          Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : []

        setItems(
          products.map((item) => ({
            ...item,
            id: item.id,
            image:
              item.image ||
              item.product_image ||
              item.image_path ||
              ''
          }))
        )

      } catch (err) {
        console.error(
          'LOAD PRODUCTS ERROR:',
          err.response?.data ||
            err.message ||
            err
        )

        if (
          err.response?.status === 401
        ) {
          onLogout()
          return
        }

        setError(
          err.response?.data
            ?.error ||
            'Unable to load products.'
        )
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    loadProducts()
  }, [])

  /* =======================================================
     BRANDS
  ======================================================= */

  const brands = useMemo(() => {
    return [
      'All',
      ...new Set(
        items
          .map(
            (item) => item.brand
          )
          .filter(Boolean)
      )
    ]
  }, [items])

  /* =======================================================
     FILTERED PRODUCTS
  ======================================================= */

  const shown = useMemo(() => {
    const search =
      q.toLowerCase().trim()

    return items.filter(
      (item) => {
        const matchesBrand =
          brand === 'All' ||
          item.brand === brand

        const text = `
          ${item.brand || ''}
          ${item.product_name || ''}
          ${item.description || ''}
        `.toLowerCase()

        return (
          matchesBrand &&
          text.includes(search)
        )
      }
    )
  }, [items, q, brand])

  /* =======================================================
     STATS
  ======================================================= */

  const totalUnits =
    items.reduce(
      (sum, item) =>
        sum +
        Number(
          item.quantity || 0
        ),
      0
    )

  const inventoryValue =
    items.reduce(
      (sum, item) =>
        sum +
        Number(
          item.quantity || 0
        ) *
          Number(
            item.price || 0
          ),
      0
    )

  const low =
    items.filter(
      (item) =>
        Number(
          item.quantity || 0
        ) <= 5
    )

  const stats = [
    [
      'Models',
      items.length,
      't1',
      Laptop
    ],
    [
      'Units in stock',
      totalUnits,
      't2',
      Package
    ],
    [
      'Inventory value',
      peso(inventoryValue),
      't3',
      BarChart3
    ],
    [
      'Low / out',
      low.length,
      't4',
      AlertTriangle
    ]
  ]

  /* =======================================================
     BRAND CHART
  ======================================================= */

  const palette = [
    '#a48cff',
    '#ffb4a2',
    '#9fdcb4',
    '#ffd98a',
    '#8ec5ff',
    '#f4a6d7'
  ]

  const parts = [
    ...new Set(
      items
        .map(
          (item) => item.brand
        )
        .filter(Boolean)
    )
  ].map((b, n) => ({
    n: b,

    v: items
      .filter(
        (item) =>
          item.brand === b
      )
      .reduce(
        (sum, item) =>
          sum +
          Number(
            item.quantity || 0
          ),
        0
      ),

    c:
      palette[
        n % palette.length
      ]
  }))

  /* =======================================================
     SAVE PRODUCT
  ======================================================= */

  const save = async (form) => {
    setSaving(true)
    setError('')

    try {
      /*
      =======================================================
      EDIT EXISTING PRODUCT
      =======================================================
      */

      if (form.id !== null && form.id !== undefined) {

        /*
         * IMPORTANT:
         *
         * If a NEW image was selected, use FormData.
         * This allows PHP to receive $_FILES['image'].
         *
         * If no new image was selected, JSON is enough.
         */

        if (form.image) {
          const formData =
            new FormData()

          formData.append(
            'brand',
            form.brand
          )

          formData.append(
            'product_name',
            form.product_name
          )

          formData.append(
            'description',
            form.description
          )

          formData.append(
            'price',
            form.price
          )

          formData.append(
            'quantity',
            form.quantity
          )

          formData.append(
            'image',
            form.image
          )

          /*
           * FIX: PHP does not parse multipart/form-data on a real PUT request,
           * so $_FILES / $_POST would be empty. Send POST with _method=PUT
           * to /api/products/{id}/update instead.
           *
           * DO NOT manually set Content-Type. Axios/browser will automatically
           * add: multipart/form-data + boundary.
           */

          formData.append(
            '_method',
            'PUT'
          )

          await api.post(
            `/api/products/${form.id}/update`,
            formData,
            {
              headers: {
                Accept:
                  'application/json'
              }
            }
          )

        } else {
          /*
           * No new image.
           * Keep the existing database image.
           */

          await api.put(
            `/api/products/${form.id}`,
            {
              brand:
                form.brand,

              product_name:
                form.product_name,

              description:
                form.description,

              price:
                form.price,

              quantity:
                form.quantity,

              image:
                form.existingImage ||
                null
            },
            {
              headers: {
                'Content-Type':
                  'application/json',
                Accept:
                  'application/json'
              }
            }
          )
        }

      } else {

        /*
        =====================================================
        ADD NEW PRODUCT
        =====================================================
        */

        const formData =
          new FormData()

        formData.append(
          'brand',
          form.brand
        )

        formData.append(
          'product_name',
          form.product_name
        )

        formData.append(
          'description',
          form.description
        )

        formData.append(
          'price',
          form.price
        )

        formData.append(
          'quantity',
          form.quantity
        )

        if (form.image) {
          formData.append(
            'image',
            form.image
          )
        }

        await api.post(
          '/api/products',
          formData,
          {
            headers: {
              Accept:
                'application/json'
            }
          }
        )
      }

      /*
      =======================================================
      IMPORTANT:
      Reload from DATABASE after saving.
      =======================================================
      */

      setModal(null)

      await loadProducts()

    } catch (err) {
      console.error(
        'SAVE PRODUCT ERROR:',
        err.response?.data ||
          err.message ||
          err
      )

      if (
        err.response?.status === 401
      ) {
        onLogout()
        return
      }

      setError(
        err.response?.data
          ?.error ||
          'Unable to save the product.'
      )
    } finally {
      setSaving(false)
    }
  }

  /* =======================================================
     DELETE
  ======================================================= */

  const del = async (id) => {
    try {
      await api.delete(
        `/api/products/${id}`
      )

      setItems((current) =>
        current.filter(
          (item) =>
            String(item.id) !==
            String(id)
        )
      )

      if (
        detail &&
        String(detail.id) ===
          String(id)
      ) {
        setDetail(null)
      }

    } catch (err) {
      console.error(
        'DELETE PRODUCT ERROR:',
        err.response?.data ||
          err.message ||
          err
      )

      if (
        err.response?.status === 401
      ) {
        onLogout()
        return
      }

      setError(
        err.response?.data
          ?.error ||
          'Unable to delete the product.'
      )
    }
  }

  const confirmDelete = async () => {
    if (!confirmItem) return

    setDeleting(true)

    await del(confirmItem.id)

    setDeleting(false)
    setConfirmItem(null)
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = async () => {
    try {
      const refreshToken =
        localStorage.getItem(
          'refresh_token'
        )

      if (refreshToken) {
        await api.post(
          '/api/auth/logout',
          {
            refresh_token:
              refreshToken
          },
          {
            headers: {
              'Content-Type':
                'application/json',
              Accept:
                'application/json'
            }
          }
        )
      }
    } catch {
      // Clear local authentication anyway.
    }

    onLogout()
  }

  /* =======================================================
     SEARCH
  ======================================================= */

  const SearchBox = (
    <div className="relative w-full max-w-sm">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
      />

      <input
        value={q}
        onChange={(e) =>
          setQ(e.target.value)
        }
        placeholder="Search brand, product..."
        className={`${input} pl-11`}
      />
    </div>
  )

  /* =======================================================
     FILTERS
  ======================================================= */

  const Filters = (
    <div className="flex flex-wrap gap-2">
      {brands.map((b) => (
        <button
          key={b}
          onClick={() =>
            setBrand(b)
          }
          className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
            brand === b
              ? 'bg-[var(--accent)] text-white shadow-[var(--clay)]'
              : 'bg-[var(--card)] text-[var(--muted)] shadow-[var(--clay)]'
          }`}
        >
          {b}
        </button>
      ))}
    </div>
  )

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      style={
        THEMES[
          dark ? 'dark' : 'light'
        ]
      }
      className="min-h-screen bg-[var(--bg)] p-3 text-[var(--text)] transition-colors sm:p-5"
    >
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1400px] gap-5">

        {isAdmin && (
          <aside className="hidden w-56 shrink-0 flex-col rounded-[32px] bg-[var(--side)] p-4 shadow-[var(--clay)] md:flex">
            <div className="mb-8 mt-2 flex items-center gap-3 px-2">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ffb4a2] text-white shadow-[var(--clay)]">
                <Laptop size={22} />
              </div>

              <b className="text-base leading-tight">
                Laptop
                <br />
                Manager
              </b>
            </div>

            {[
              [
                'overview',
                'Overview',
                LayoutGrid
              ],
              [
                'inventory',
                'Inventory',
                Package
              ]
            ].map(
              ([k, label, Icon]) => (
                <button
                  key={k}
                  onClick={() =>
                    setTab(k)
                  }
                  className={`mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition ${
                    tab === k
                      ? 'bg-[var(--card)] shadow-[var(--clay)]'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <Icon
                    size={18}
                    className="text-[var(--accent)]"
                  />

                  {label}
                </button>
              )
            )}

            <div className="mt-auto rounded-3xl bg-white/20 p-4 text-sm shadow-[var(--pressed)]">
              <b>
                {low.length} items
              </b>{' '}
              need restocking.
            </div>
          </aside>
        )}

        <div className="min-w-0 flex-1">
          <header className="mb-5 flex flex-wrap items-center gap-4">
            <div className="mr-auto">
              <h1 className="text-2xl font-bold sm:text-3xl">
                {isAdmin
                  ? tab === 'overview'
                    ? 'Dashboard'
                    : 'Inventory'
                  : 'Laptop catalog'}
              </h1>

              <p className="text-base text-[var(--muted)]">
                {isAdmin
                  ? `Welcome back, ${name}`
                  : 'Find the right laptop for you'}
              </p>
            </div>

            {isAdmin && (
              <div className="flex gap-2 md:hidden">
                {[
                  'overview',
                  'inventory'
                ].map((k) => (
                  <button
                    key={k}
                    onClick={() =>
                      setTab(k)
                    }
                    className={`rounded-full px-4 py-2.5 text-sm font-semibold capitalize ${
                      tab === k
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-[var(--card)] shadow-[var(--clay)]'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() =>
                setDark(!dark)
              }
              aria-label="Toggle theme"
              className="grid h-11 w-11 place-items-center rounded-full bg-[var(--card)] shadow-[var(--clay)]"
            >
              {dark ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            {isAdmin && (
              <div className="relative">
                <button
                  onClick={() =>
                    setMenu(
                      menu === 'bell'
                        ? null
                        : 'bell'
                    )
                  }
                  aria-label="Notifications"
                  className="relative grid h-11 w-11 place-items-center rounded-full bg-[var(--card)] shadow-[var(--clay)]"
                >
                  <Bell size={18} />

                  {low.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-pink-400 text-xs font-bold text-white">
                      {low.length}
                    </span>
                  )}
                </button>

                {menu === 'bell' && (
                  <div
                    className={`${clay} absolute right-0 z-40 mt-3 w-72 p-4`}
                  >
                    <p className="mb-2 text-base font-bold">
                      Stock alerts
                    </p>

                    {low.length === 0 ? (
                      <p className="text-sm text-[var(--muted)]">
                        Everything is well stocked.
                      </p>
                    ) : (
                      low.map(
                        (item) => (
                          <p
                            key={item.id}
                            className="flex justify-between border-t border-[var(--line)] py-2 text-sm"
                          >
                            <span>
                              {
                                item.product_name
                              }
                            </span>

                            <b
                              className={
                                Number(
                                  item.quantity
                                )
                                  ? 'text-amber-600'
                                  : 'text-rose-500'
                              }
                            >
                              {Number(
                                item.quantity
                              )
                                ? `${item.quantity} left`
                                : 'Out'}
                            </b>
                          </p>
                        )
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="relative">
              <button
                onClick={() =>
                  setMenu(
                    menu === 'profile'
                      ? null
                      : 'profile'
                  )
                }
                aria-label="Profile menu"
                className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#ffb4a2] to-[#a48cff] font-bold text-white shadow-[var(--clay)]"
              >
                {name
                  .charAt(0)
                  .toUpperCase()}
              </button>

              {menu === 'profile' && (
                <div
                  className={`${clay} absolute right-0 z-40 mt-3 w-60 p-3`}
                >
                  <p className="px-3 py-2 text-base font-bold">
                    {name}

                    <span className="block text-sm font-normal capitalize text-[var(--muted)]">
                      {user?.role ||
                        'user'}
                    </span>
                  </p>

                  <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-base text-[var(--muted)]">
                    {isAdmin ? (
                      <ShieldCheck size={16} />
                    ) : (
                      <User size={16} />
                    )}

                    {isAdmin
                      ? 'Administrator'
                      : 'User'}
                  </div>

                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-base text-rose-500 hover:bg-[var(--bg)]"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </header>

          {error && (
            <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl bg-rose-100 px-4 py-3 text-base text-rose-600 shadow-[var(--clay)]">
              <span>
                {error}
              </span>

              <button
                onClick={() =>
                  setError('')
                }
                className="grid h-7 w-7 place-items-center rounded-full"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {loading ? (
            <div
              className={`${clay} grid min-h-[400px] place-items-center`}
            >
              <div className="text-center">
                <RefreshCw
                  size={30}
                  className="mx-auto animate-spin text-[var(--accent)]"
                />

                <p className="mt-4 text-base text-[var(--muted)]">
                  Loading products...
                </p>
              </div>
            </div>
          ) : (
            <>
              {isAdmin &&
                tab === 'overview' && (
                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                      {stats.map(
                        ([
                          label,
                          value,
                          theme,
                          Icon
                        ]) => (
                          <div
                            key={label}
                            className="rounded-[28px] p-5 shadow-[var(--clay)]"
                            style={{
                              background:
                                `var(--${theme})`
                            }}
                          >
                            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--card)] text-[var(--accent)] shadow-[var(--clay)]">
                              <Icon size={22} />
                            </div>

                            <p className="text-sm font-medium text-[var(--muted)]">
                              {label}
                            </p>

                            <p className="mt-1 text-3xl font-bold">
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                      <div
                        className={`${clay} p-6`}
                      >
                        <p className="mb-3 text-base font-bold">
                          Inventory overview
                        </p>

                        <LineChart
                          data={items
                            .slice(0, 7)
                            .map(
                              (item) =>
                                Number(
                                  item.quantity ||
                                    0
                                )
                            )}
                        />

                        <div className="mt-1 flex justify-between text-xs text-[var(--muted)]">
                          {items
                            .slice(0, 7)
                            .map(
                              (item) => (
                                <span
                                  key={
                                    item.id
                                  }
                                  className="max-w-16 truncate"
                                >
                                  {
                                    item.brand
                                  }
                                </span>
                              )
                            )}
                        </div>
                      </div>

                      <div
                        className={`${clay} p-6`}
                      >
                        <p className="mb-5 text-base font-bold">
                          Stock by brand
                        </p>

                        <Donut
                          parts={parts}
                        />
                      </div>
                    </div>
                  </div>
                )}

              {isAdmin &&
                tab === 'inventory' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {SearchBox}

                      <div className="mr-auto">
                        {Filters}
                      </div>

                      <button
                        onClick={() =>
                          setModal('new')
                        }
                        className={btn}
                      >
                        <Plus size={18} />
                        Add laptop
                      </button>
                    </div>

                    <div
                      className={`${clay} divide-y divide-[var(--line)] p-3`}
                    >
                      {shown.length ===
                        0 && (
                        <p className="p-8 text-center text-base text-[var(--muted)]">
                          No laptops match your search.
                        </p>
                      )}

                      {shown.map(
                        (item) => {
                          const s =
                            stockInfo(
                              item.quantity
                            )

                          return (
                            <div
                              key={
                                item.id
                              }
                              className="flex flex-wrap items-center gap-4 p-3"
                            >
                              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-[var(--t1)] p-2 shadow-[var(--pressed)]">
                                <LaptopArt
                                  item={
                                    item
                                  }
                                />
                              </div>

                              <div className="min-w-[180px] flex-1">
                                <p className="text-sm text-[var(--accent)]">
                                  {
                                    item.brand
                                  }
                                </p>

                                <p className="text-base font-bold">
                                  {
                                    item.product_name
                                  }
                                </p>

                                <p className="line-clamp-2 text-sm text-[var(--muted)]">
                                  {item.description ||
                                    'No description'}
                                </p>
                              </div>

                              <p className="w-28 text-base font-bold">
                                {peso(
                                  item.price
                                )}
                              </p>

                              <span
                                className={`rounded-full px-3 py-1 text-sm font-semibold ${s.cls}`}
                              >
                                {s.label}
                              </span>

                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    setModal(
                                      item
                                    )
                                  }
                                  aria-label="Edit"
                                  className="grid h-10 w-10 place-items-center rounded-full bg-[var(--t1)] shadow-[var(--clay)]"
                                >
                                  <Pencil
                                    size={16}
                                  />
                                </button>

                                <button
                                  onClick={() =>
                                    setConfirmItem(
                                      item
                                    )
                                  }
                                  aria-label="Delete"
                                  className="grid h-10 w-10 place-items-center rounded-full bg-[var(--t2)] text-rose-500 shadow-[var(--clay)]"
                                >
                                  <Trash2
                                    size={16}
                                  />
                                </button>
                              </div>
                            </div>
                          )
                        }
                      )}
                    </div>
                  </div>
                )}

              {!isAdmin && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    {SearchBox}

                    <div className="mr-auto">
                      {Filters}
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {shown.map(
                      (item) => {
                        const s =
                          stockInfo(
                            item.quantity
                          )

                        return (
                          <article
                            key={
                              item.id
                            }
                            onClick={() =>
                              setDetail(
                                item
                              )
                            }
                            className={`${clay} group cursor-pointer overflow-hidden transition hover:-translate-y-1`}
                          >
                            <div className="relative h-56 overflow-hidden bg-[var(--t1)] p-6">
                              <div className="relative flex h-full w-full items-center justify-center transition group-hover:scale-105">
                                <LaptopArt
                                  item={
                                    item
                                  }
                                  big
                                />
                              </div>
                            </div>

                            <div className="p-6">
                              <p className="text-sm font-medium text-[var(--accent)]">
                                {
                                  item.brand
                                }
                              </p>

                              <h3 className="text-lg font-bold">
                                {
                                  item.product_name
                                }
                              </h3>

                              <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                                {item.description ||
                                  'No description available.'}
                              </p>

                              <div className="mt-4 flex items-center justify-between gap-3">
                                <p className="text-2xl font-bold">
                                  {peso(
                                    item.price
                                  )}
                                </p>

                                <span
                                  className={`rounded-full px-3 py-1 text-sm font-semibold ${s.cls}`}
                                >
                                  {s.label}
                                </span>
                              </div>
                            </div>
                          </article>
                        )
                      }
                    )}
                  </div>

                  {shown.length ===
                    0 && (
                    <p className="p-10 text-center text-base text-[var(--muted)]">
                      No laptops match your search.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {modal && (
        <LaptopModal
          item={
            modal === 'new'
              ? null
              : modal
          }
          onClose={() =>
            setModal(null)
          }
          onSave={save}
          saving={saving}
        />
      )}

      {confirmItem && (
        <ConfirmModal
          item={confirmItem}
          loading={deleting}
          onCancel={() =>
            setConfirmItem(null)
          }
          onConfirm={confirmDelete}
        />
      )}

      {detail && (
        <Detail
          item={detail}
          onClose={() =>
            setDetail(null)
          }
        />
      )}
    </div>
  )
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [user, setUser] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            'user'
          )
        )
      } catch {
        return null
      }
    })

  const logout = () => {
    localStorage.removeItem(
      'access_token'
    )

    localStorage.removeItem(
      'refresh_token'
    )

    localStorage.removeItem(
      'user'
    )

    setUser(null)
  }

  if (
    !user ||
    !getToken()
  ) {
    return (
      <Login
        onLogin={(loggedUser) =>
          setUser(loggedUser)
        }
      />
    )
  }

  return (
    <Dashboard
      user={user}
      onLogout={logout}
    />
  )
}
