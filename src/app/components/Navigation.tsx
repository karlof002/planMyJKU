"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    studentId?: string;
    isVerified: boolean;
}

export function Navigation() {
    const [user, setUser] = useState<User | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const logout = () => {
        localStorage.removeItem('user');
        router.push('/auth/login');
        setIsUserMenuOpen(false);
    };

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { name: 'Courses', href: '/courses', icon: '📚' },
        { name: 'Semesters', href: '/semesters', icon: '📅' },
        { name: 'Progress', href: '/progress', icon: '📊' },
        { name: 'Calendar', href: '/calendar', icon: '🗓️' },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors duration-200"
                        >
                            <span className="text-2xl">🎓</span>
                            <span>planMyJKU</span>
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <button
                                key={`desktop-${item.href}`}
                                onClick={() => router.push(item.href)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    isActive(item.href)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
                                }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        
                        {/* User Menu */}
                        {user && (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 text-sm text-foreground/80 hover:text-foreground transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                                        {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="hidden sm:block">{user.firstName}</span>
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                                        <div className="px-4 py-2 text-sm text-foreground/60 border-b border-border">
                                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                                            <div className="text-xs">{user.email}</div>
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-200"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-foreground hover:bg-secondary transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-border animate-in slide-in-from-top-1 duration-200">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={`mobile-${item.href}`}
                                    onClick={() => {
                                        router.push(item.href);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                        isActive(item.href)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
                                    }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
