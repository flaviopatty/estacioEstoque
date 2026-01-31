import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Mail, Lock, Loader2, Sparkles, Building2 } from 'lucide-react';
import { cn } from '../utils/cn';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: name,
                        },
                    },
                });
                if (error) throw error;
                setSuccess(true);
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro inesperado.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-dark p-6">
                <div className="w-full max-w-md p-8 rounded-3xl bg-secondary-dark/50 border border-white/10 backdrop-blur-xl text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                        <Mail className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">Verifique seu e-mail</h2>
                    <p className="text-gray-400">
                        Enviamos um link de confirmação para <span className="text-white font-medium">{email}</span>.
                        Por favor, verifique sua caixa de entrada para ativar sua conta.
                    </p>
                    <button
                        onClick={() => {
                            setSuccess(false);
                            setIsLogin(true);
                        }}
                        className="w-full py-4 bg-primary hover:bg-primary-light text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-primary/25"
                    >
                        Voltar para o Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-dark relative overflow-hidden font-display p-6">
            {/* Background Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="text-center mb-10 space-y-4">
                    <div className="flex justify-center flex-col items-center gap-3">
                        <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 backdrop-blur-sm">
                            <Building2 className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                                SmartStock
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                            </h1>
                            <p className="text-gray-500 text-sm">Gestão de Estoque Escolar Inteligente</p>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary-dark/40 border border-white/5 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl space-y-8">
                    <div className="flex p-1 bg-black/30 rounded-2xl">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={cn(
                                "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-500 flex items-center justify-center gap-2",
                                isLogin ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <LogIn className="w-4 h-4" />
                            Entrar
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={cn(
                                "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-500 flex items-center justify-center gap-2",
                                !isLogin ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <UserPlus className="w-4 h-4" />
                            Cadastrar
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl animate-in shake duration-300">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Nome Completo</label>
                                    <div className="relative group">
                                        <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Seu nome"
                                            className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">E-mail</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Senha</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    isLogin ? 'Acessar Plataforma' : 'Criar minha Conta'
                                )}
                            </span>
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm">
                        {isLogin ? (
                            <>Não tem uma conta? <button onClick={() => setIsLogin(false)} className="text-primary font-bold hover:text-primary-light transition-colors">Cadastre-se</button></>
                        ) : (
                            <>Já possui uma conta? <button onClick={() => setIsLogin(true)} className="text-primary font-bold hover:text-primary-light transition-colors">Entre aqui</button></>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
