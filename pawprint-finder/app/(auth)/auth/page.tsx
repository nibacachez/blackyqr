'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Loader2, ArrowLeft, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { validatePassword, type PasswordValidationResult } from '@/lib/passwordValidator';

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, user, loading: authLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [useGoogleAuth, setUseGoogleAuth] = useState(true); // Default to Google OAuth
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult>({
    isValid: true,
    errors: [],
    suggestions: [],
  });
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  const handlePasswordChange = (value: string) => {
    setForm((f) => ({ ...f, password: value }));
    
    if (isSignUp) {
      const validation = validatePassword(value);
      setPasswordValidation(validation);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      toast.error(err.message || 'Error al iniciar sesión con Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        // Validaciones
        if (useGoogleAuth) {
          toast.error('Para usar Google, haz clic en el botón "Continuar con Google"');
          setLoading(false);
          return;
        }

        if (!form.firstName.trim() || !form.lastName.trim()) {
          toast.error('Por favor ingresa tu nombre y apellido');
          setLoading(false);
          return;
        }

        // Validar contraseña
        const validation = validatePassword(form.password);
        if (!validation.isValid) {
          toast.error(validation.errors[0] || 'Contraseña débil');
          setLoading(false);
          return;
        }

        const fullName = `${form.firstName} ${form.lastName}`;
        await signUp(form.email, form.password, fullName);
        toast.success('Cuenta creada. Revisa tu correo para confirmar.');
        setForm({ email: '', password: '', firstName: '', lastName: '' });
        setIsSignUp(false);
      } else {
        await signIn(form.email, form.password);
        toast.success('¡Bienvenido!');
        router.replace('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="absolute top-0 left-0 right-0 h-64 gradient-glow pointer-events-none" />
      
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <QrCode className="w-8 h-8 text-primary" />
          <span className="font-display text-2xl font-bold text-foreground">
            Blacky<span className="text-primary">QR</span>
          </span>
        </div>

        <div className="gradient-card rounded-xl border border-border p-6 shadow-card">
          <h1 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
            {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
          </h1>

          {isSignUp && (
            <div className="mb-6 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={useGoogleAuth}
                  onChange={() => setUseGoogleAuth(true)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">Registrarse con Gmail</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={!useGoogleAuth}
                  onChange={() => setUseGoogleAuth(false)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">Registrarse con email y contraseña</span>
              </label>
            </div>
          )}

          {isSignUp && useGoogleAuth ? (
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full bg-white text-black hover:bg-gray-50 rounded-lg shadow-glow border border-gray-200 mb-4"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              Continuar con Google
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isSignUp && (
                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full bg-white text-black hover:bg-gray-50 rounded-lg shadow-glow border border-gray-200 mb-4"
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  Continuar con Google
                </Button>
              )}

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-background text-muted-foreground">O</span>
                </div>
              </div>

              {isSignUp && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-foreground">Nombre</Label>
                    <Input
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      placeholder="Juan"
                      className="bg-muted border-border"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Apellido</Label>
                    <Input
                      value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                      placeholder="García"
                      className="bg-muted border-border"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-foreground">Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="tu@email.com"
                  className="bg-muted border-border"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Contraseña</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="••••••••"
                  className="bg-muted border-border"
                  disabled={loading}
                  required
                />

                {isSignUp && form.password && (
                  <div className="mt-3 space-y-2">
                    {passwordValidation.errors.length > 0 && (
                      <div className="space-y-1">
                        {passwordValidation.errors.map((error, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-red-500">{error}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {passwordValidation.suggestions.length > 0 && passwordValidation.errors.length > 0 && (
                      <div className="space-y-1 bg-blue-50 dark:bg-blue-950 p-2 rounded">
                        <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">Sugerencias para mejorar la seguridad:</p>
                        {passwordValidation.suggestions.map((suggestion, idx) => (
                          <div key={idx} className="text-xs text-blue-800 dark:text-blue-200">
                            • {suggestion}
                          </div>
                        ))}
                      </div>
                    )}

                    {passwordValidation.isValid && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600 dark:text-green-400">Contraseña fuerte</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground rounded-lg shadow-glow hover:opacity-90 transition-opacity"
                disabled={loading || (isSignUp && !passwordValidation.isValid)}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
              </Button>
            </form>
          )}

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setUseGoogleAuth(true);
                  setForm({ email: '', password: '', firstName: '', lastName: '' });
                  setPasswordValidation({ isValid: true, errors: [], suggestions: [] });
                }}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {isSignUp ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Al continuar, aceptas nuestros términos de servicio y política de privacidad.
        </p>
      </div>
    </div>
  );
}
