// Authentication screen for admin access.
// Captures email/password and forwards submit/change events.
// Displays Supabase login errors returned by the auth hook.
function LoginView({ loginForm, onChange, onSubmit, loginError }) {
  return (
    <div className="app-bg login-bg">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>B-Side Admin</h1>
        <p>Connexion directe Supabase (React only)</p>
        <label>
          Email
          <input type="email" value={loginForm.email} onChange={(event) => onChange('email', event.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={loginForm.password} onChange={(event) => onChange('password', event.target.value)} required />
        </label>
        {loginError && <p className="form-error">{loginError}</p>}
        <button className="publish-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginView;
