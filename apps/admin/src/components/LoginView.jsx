// Authentication screen for admin access.
// Captures email/password and forwards submit/change events.
// Displays Supabase login errors returned by the auth hook.
function LoginView({ loginForm, onChange, onSubmit, loginError }) {
  return (
    <div className="grid min-h-screen place-items-center p-[18px]">
      <form className="m-0 w-full max-w-[440px] rounded-[18px] border border-admin-line bg-white p-6" onSubmit={onSubmit}>
        <h1 className="mb-2 mt-0">B-Side Admin</h1>
        <p className="mb-[14px] mt-0 text-[#625d68]">Connexion directe Supabase (React only)</p>
        <label className="mb-3 grid gap-1.5 text-sm">
          Email
          <input className="h-10 rounded-[10px] border border-admin-line px-3" type="email" value={loginForm.email} onChange={(event) => onChange('email', event.target.value)} required />
        </label>
        <label className="mb-3 grid gap-1.5 text-sm">
          Password
          <input className="h-10 rounded-[10px] border border-admin-line px-3" type="password" value={loginForm.password} onChange={(event) => onChange('password', event.target.value)} required />
        </label>
        {loginError && <p className="mb-[14px] mt-0 text-[#d4262b]">{loginError}</p>}
        <button className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[#ddd5de] bg-white px-5 py-[11px] font-['Space_Grotesk'] text-[15px] font-bold leading-none text-[#433d4a]" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginView;
