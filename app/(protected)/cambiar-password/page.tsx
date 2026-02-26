'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    KeyRound,
    ShieldCheck,
    AlertCircle,
    Eye,
    EyeOff,
    CheckCircle2,
    Lock
} from 'lucide-react';

export default function CambiarPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Simulación de cambio de contraseña
        setTimeout(() => {
            if (formData.newPassword !== formData.confirmPassword) {
                setStatus('error');
                return;
            }
            setStatus('success');
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-display font-bold text-foreground">Seguridad de la Cuenta</h1>
                <p className="text-muted-foreground">Gestiona y actualiza tus credenciales de acceso para mantener tu información protegida.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Columna Principal: Formulario */}
                <div className="lg:col-span-8">
                    <Card className="p-6 md:p-8 border-border/50 shadow-xl bg-card/50 backdrop-blur-sm relative overflow-hidden h-full">
                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-300 h-full text-center">
                                <div className="size-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h2 className="text-2xl font-bold mb-3 text-foreground">¡Contraseña actualizada con éxito!</h2>
                                <p className="text-muted-foreground max-w-md mb-8">
                                    Tu contraseña ha sido cambiada correctamente. Tu sesión actual permanece activa, pero deberás usar la nueva contraseña la próxima vez que ingreses.
                                </p>
                                <Button
                                    className="px-8 h-11"
                                    onClick={() => setStatus('idle')}
                                >
                                    Entendido
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Contraseña Actual */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Contraseña Actual</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="currentPassword"
                                                    type={showPassword ? "text" : "password"}
                                                    className="pl-10 h-12 bg-background/50"
                                                    placeholder="Ingresa tu contraseña actual"
                                                    required
                                                    value={formData.currentPassword}
                                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                                />
                                            </div>
                                            <p className="text-[11px] text-muted-foreground">Necesitamos validar tu identidad antes del cambio.</p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                            <div className="flex gap-3">
                                                <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                <p className="text-xs text-primary/80 leading-relaxed">
                                                    Si has olvidado tu contraseña actual, por favor contacta con el administrador del sistema para un reseteo manual.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nuevas Contraseñas */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">Nueva Contraseña</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="newPassword"
                                                    type={showPassword ? "text" : "password"}
                                                    className="pl-10 pr-10 h-12 bg-background/50"
                                                    placeholder="Nueva contraseña"
                                                    required
                                                    value={formData.newPassword}
                                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1 pt-1">
                                                <div className={cn("h-1.5 rounded-full transition-all duration-500", formData.newPassword.length > 0 ? "bg-emerald-500" : "bg-muted")} />
                                                <div className={cn("h-1.5 rounded-full transition-all duration-500", formData.newPassword.length > 7 ? "bg-emerald-500" : "bg-muted")} />
                                                <div className={cn("h-1.5 rounded-full transition-all duration-500", formData.newPassword.length > 11 ? "bg-emerald-500" : "bg-muted")} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="confirmPassword"
                                                    type={showPassword ? "text" : "password"}
                                                    className="pl-10 h-12 bg-background/50"
                                                    placeholder="Repite la nueva contraseña"
                                                    required
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-3 border border-destructive/20 animate-in shake duration-300">
                                        <AlertCircle className="w-5 h-5" />
                                        Las contraseñas no coinciden. Por favor, verifica que ambas entradas sean idénticas.
                                    </div>
                                )}

                                <div className="flex justify-end pt-4 border-t border-border/50">
                                    <Button
                                        type="submit"
                                        className="h-12 px-10 font-bold shadow-lg shadow-primary/20 min-w-[200px]"
                                        disabled={status === 'loading'}
                                    >
                                        {status === 'loading' ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Procesando...
                                            </span>
                                        ) : 'Guardar Nueva Contraseña'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Card>
                </div>

                {/* Columna Lateral: Información y Consejos */}
                <div className="lg:col-span-4 space-y-6">
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            Seguridad Robusta
                        </h3>
                        <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50 space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Una contraseña segura protege tus documentos y la integridad de tus trámites en el sistema.
                            </p>

                            <div className="space-y-3">
                                <RequirementItem
                                    met={formData.newPassword.length >= 8}
                                    label="Mínimo 8 caracteres"
                                />
                                <RequirementItem
                                    met={/\d/.test(formData.newPassword)}
                                    label="Al menos un número (0-9)"
                                />
                                <RequirementItem
                                    met={/[^A-Za-z0-9]/.test(formData.newPassword)}
                                    label="Un carácter especial (@, #, $, etc.)"
                                />
                                <RequirementItem
                                    met={formData.newPassword.length > 0 && formData.newPassword === formData.confirmPassword}
                                    label="Coincidencia de contraseñas"
                                />
                            </div>
                        </Card>
                    </section>

                    <Card className="p-5 bg-primary/5 border-primary/10 overflow-hidden relative group">
                        <KeyRound className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 -rotate-12 transition-transform group-hover:scale-110" />
                        <h4 className="font-bold text-sm mb-2">Consejo experto</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed relative z-10">
                            Evita usar fechas de nacimiento o nombres de familiares. Las mejores contraseñas son frases cortas con caracteres intercalados.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
    return (
        <div className={cn(
            "flex items-center gap-3 text-xs transition-colors duration-300",
            met ? "text-emerald-500 font-medium" : "text-muted-foreground"
        )}>
            <div className={cn(
                "size-5 rounded-full flex items-center justify-center border transition-all duration-300",
                met ? "bg-emerald-500/10 border-emerald-500/20" : "bg-muted/50 border-border"
            )}>
                <CheckCircle2 className={cn("w-3.5 h-3.5", met ? "scale-100" : "scale-0 opacity-0")} />
            </div>
            {label}
        </div>
    );
}
