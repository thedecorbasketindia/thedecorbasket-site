import { login } from "@/app/admin/auth-actions";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;
  const next = params?.next || "/admin";

  return (
    <div className="min-h-screen flex items-center justify-center admin-shell">
      <form action={login} className="bg-white p-8 rounded-md shadow-md w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-1">The Decor Basket</h1>
        <p className="text-sm text-gray-500 mb-6">Admin sign in</p>

        <input type="hidden" name="next" value={next} />

        {error && (
          <p className="bg-red-50 text-red-700 text-sm rounded p-2 mb-4">{error}</p>
        )}

        <label className="block text-sm mb-1" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border rounded px-3 py-2 mb-4 text-sm"
        />

        <label className="block text-sm mb-1" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full border rounded px-3 py-2 mb-6 text-sm"
        />

        <button type="submit" className="w-full bg-[#7C0E2A] text-white rounded py-2 text-sm">
          Sign In
        </button>
      </form>
    </div>
  );
}
