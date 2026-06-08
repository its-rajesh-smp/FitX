\---

name: react-frontend
description: Use this skill when building or modifying React frontend applications following established project conventions. Triggers include: creating new pages, components, hooks, or features; making API calls; structuring folders; or writing any React/TypeScript code in this project. Covers folder structure, component design, API patterns, styling rules, and reusable hook patterns. Do NOT use for backend code, plain HTML/CSS projects, or non-React frameworks.
---

This skill defines the conventions and patterns for building React frontend applications in this project. Always follow these rules when creating or modifying any frontend code.

## Folder Structure Demo

```
root/
├── public/
└── src/
    ├── assets/
    ├── components/
    │   ├── ui/               # Stateless UI-only components (e.g. Input.tsx, Button.tsx)
    │   ├── layouts/
    │   └── forms/
    ├── hooks/                # Shared hooks (useDebounce.ts, useScreenSize.ts)
    ├── features/
    │   └── auth/
    │       ├── components/
    │       │   ├── ui/       # AuthTextField.tsx, AuthCard.tsx
    │       │   ├── forms/    # RegistrationForm.tsx, LoginForm.tsx
    │       │   └── layouts/  # AuthPageFrame.tsx
    │       ├── hooks/        # useUser.ts, useAuth.ts, useLogin.ts, useRegister.ts
    │       ├── types/        # user.ts
    │       ├── services/     # loginUser.ts, registerUser.ts, getCurrentUser.ts
    │       ├── stores/       # useAuthStore.ts
    │       ├── contexts/     # AuthFormContext.tsx
    │       └── helpers/
    ├── pages/
    │   └── auth/             # LoginPage.tsx, RegistrationPage.tsx, OTPVerificationPage.tsx
    ├── routes/
    │   ├── guards/           # AuthGuard.tsx, GuestGuard.tsx, PublicGuard.tsx
    │   ├── admin-routes.tsx
    │   ├── auth-routes.tsx
    │   ├── public-routes.tsx
    │   ├── guest-routes.tsx
    │   └── index.tsx
    ├── libs/
    │   └── api.ts
    └── utils/
        └── date.ts
```

\---

## API Calls

1. Always use **axios**.
2. Always create **hooks for GET requests** (e.g. `useUser`, `useAppointments`).
3. Always use **try/catch** and handle both `loading` and `error` states.
4. If the project uses **TanStack Query**, always use it for API calls — do not use raw `useEffect` fetching.
5. Never use fetch and .then and .catch for api calls. Since they make the codebase hard to read because of promise hell.

\---

## Component Design

1. **Never put everything in a single component** — split into smaller, focused pieces.
2. **Separate UI from logic**: UI components (in `components/ui/`) must be stateless — they only render, never manage state.
3. Break components into small, maintainable units. One component should do one thing.
4. **Prefer array methods** over for loops (`map`, `filter`, `reduce`, etc.) to keep code concise.

\---

## Styling

1. Always follow the existing design system — never invent new tokens.
2. **Never use inline style objects** — always use Tailwind CSS utility classes.
3. Always use the **variable-based classNames** defined in `tailwind.config` or `index.css`.
4. First preference is to use shadCN with it's new design system.

\---

## State Management

1. **Local state first** — use `useState` for component-level state. Only lift state up when two or more components need it.
2. **Global state via stores** — use Zustand stores (in `features/<name>/stores/`) for shared feature-level state. Never use a store for data that belongs to a single component.
3. **No redundant state** — never duplicate state that can be derived. Compute derived values inline or with `useMemo`.
4. **Context for DI, not state** — React Context (in `contexts/`) is for dependency injection (e.g. passing a form instance down) not for frequently changing state. Use a store for that.
5. Keep store slices small and focused — one store per feature, not one global mega-store.

```ts
// Example Zustand store
import { create } from "zustand"

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void
  clear: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}))
```

\---

## Forms \& Validation

1. **Always use React Hook Form** for form state — never manage form fields with raw `useState`.
2. **Always use Zod** for validation schemas — define schemas alongside the form, not inline.
3. Keep form logic in dedicated form components (in `components/forms/` or `features/<name>/components/forms/`).
4. **Never put form submission logic in a UI component** — handle it in the form component or a custom hook.
5. Show field-level errors directly under each input, not in a global alert.

```ts
// Schema
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
```

```tsx
// Form component
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginFormValues) => {
    // call service / mutation here
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email \&\& <p className="text-error text-sm">{errors.email.message}</p>}

      <input type="password" {...register("password")} />
      {errors.password \&\& <p className="text-error text-sm">{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>Login</button>
    </form>
  )
}
```

\---

## Error Boundaries

1. **Use React Router's built-in error boundary** — define an `errorElement` on routes instead of wrapping components in a custom class boundary.
2. **Never swallow errors silently** — always render a visible fallback UI with a recovery action (retry or navigate home).
3. Use `useRouteError` to access the thrown error inside the error element.
4. For async errors (API failures), handle them in the hook with the `error` state pattern — route error boundaries are for unexpected render/runtime crashes only.

```tsx
// pages/ErrorPage.tsx
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router"

export function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
    ? error.message
    : "An unexpected error occurred."

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <p className="text-error">{message}</p>
      <button className="btn-primary" onClick={() => navigate(-1)}>
        Go back
      </button>
    </div>
  )
}
```

```tsx
// routes/index.tsx — attach errorElement at the route level
import { createBrowserRouter } from "react-router-dom"
import { ErrorPage } from "@/pages/ErrorPage"

export const router = createBrowserRouter(\[
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,   // catches crashes in this route and all children
    children: \[
      {
        path: "appointments",
        element: <AppointmentsPage />,
        errorElement: <ErrorPage />, // optional: scoped fallback per route
      },
    ],
  },
])
```

## Error Handling Utilities

If the project has existing error helpers, use them. Otherwise, create these as utility functions:

Keep these in src/utils/error.ts

```ts
const getAPIError = (err: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(err)) return err.message
  if (err instanceof Error) return err.message
  return defaultMessage
}

const isAxiosCanceledError = (err: unknown): boolean => {
  return axios.isCancel(err)
}
```

\---

## Data-Fetching Hook Pattern

Hooks should compose `usePagination` and `useDebounce` internally and return `{ data, loading, error, pagination }`.

### Service function

Keep these in src/features/appointment/services/getAppointments.ts

```ts
interface GetAppointmentsParams {
  endpoint: string
  queryParams: Record<string, string | number | boolean>
  controller: AbortController
}

const getAppointments = async ({ endpoint, queryParams, controller }: GetAppointmentsParams) => {
  return await axios.get<AppointmentsResponse>(endpoint, {
    params: queryParams,
    signal: controller.signal,
  })
}
```

### Example hook — `useAppointments`

```ts
export function useAppointments({ search }: UseAppointmentsOption) {
  const \[appointments, setAppointments] = useState<Appointment\[]>(\[])
  const \[loading, setLoading] = useState(true)
  const \[error, setError] = useState<string | null>(null)

  const pagination = usePagination({ pageSize: 20 })
  const { page, pageSize, setTotalItems } = pagination
  const debouncedSearch = useDebounce(search.trim())

  useEffect(() => {
    const controller = new AbortController()

    async function fetchAppointments() {
      setLoading(true)
      setError(null)

      try {
        const data = await getAppointments({
          endpoint: "/appointments",
          queryParams: {
            ...(debouncedSearch \&\& { search: debouncedSearch }),
            limit: pageSize,
            skip: (page - 1) \* pageSize,
          },
          controller,
        })

        setAppointments(data.appointments)
        setTotalItems(data.total)
      } catch (err: unknown) {
        if (isAxiosCanceledError(err)) return

        setAppointments(\[])
        setTotalItems(0)
        setError(getAPIError(err, "Failed to get Appointments"))
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
    return () => controller.abort()
  }, \[debouncedSearch, page, pageSize, setTotalItems])

  return {
    appointments,
    loading,
    error,
    pagination,
    totalItems: pagination.totalItems,
  }
}
```

