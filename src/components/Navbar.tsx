import { FolderKanbanIcon, MenuIcon, SparklesIcon, UsersIcon, WalletCardsIcon, XIcon } from 'lucide-react';
import { PrimaryButton } from './Buttons';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Create', href: '/generate' },
        { name: 'Community', href: '/community' },
        { name: 'Plans', href: '/plans' },
    ];

    return (
        <motion.nav className='fixed top-5 left-0 right-0 z-50 px-4'
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
        >
            <div className='max-w-6xl mx-auto flex items-center justify-between bg-black/50 backdrop-blur-md border border-white/4 rounded-2xl p-3'>
                <Link  to='/' onClick={()=>scroll(0,0)}>
                    <img src={assets.logo} alt="logo" className="h-8" />
                </Link>

                <div className='hidden md:flex items-center gap-8 text-sm font-medium text-gray-200'>
                    
                    {navLinks.map((link) => (
                        <Link  onClick={()=>scroll(0,0)} to={link.href} key={link.name} className="hover:text-indigo-200 transition">
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className='hidden md:flex items-center gap-3'>
                    <Show when="signed-out">
                        <SignInButton mode="modal">
                            <button className='inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold border border-indigo-300/70 bg-indigo-500/35 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:bg-indigo-500/50 active:scale-95 transition-all'>
                                Sign in
                            </button>
                        </SignInButton>

                        <SignUpButton mode="modal">
                            <PrimaryButton className='max-sm:text-xs hidden sm:inline-block'>
                                Get Started
                            </PrimaryButton>
                        </SignUpButton>
                    </Show>

                    <Show when="signed-in">
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label="Generate"
                                    href="/generate"
                                    labelIcon={<SparklesIcon size={14} />}
                                />
                                <UserButton.Link
                                    label="My Generations"
                                    href="/my-generations"
                                    labelIcon={<FolderKanbanIcon size={14} />}
                                />
                                <UserButton.Link
                                    label="Community"
                                    href="/community"
                                    labelIcon={<UsersIcon size={14} />}
                                />
                                <UserButton.Link
                                    label="Plans"
                                    href="/plans"
                                    labelIcon={<WalletCardsIcon size={14} />}
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    </Show>
                </div>

                <div className='md:hidden flex items-center'>
                    <Show when="signed-out">
                        <button onClick={() => setIsOpen(!isOpen)} aria-label="Open menu" className='inline-flex items-center justify-center rounded-full p-2 border border-white/20 bg-white/10 text-white hover:bg-white/15 transition'>
                            <MenuIcon className='size-5' />
                        </button>
                    </Show>

                    <Show when="signed-in">
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label="Generate"
                                    href="/generate"
                                    labelIcon={<SparklesIcon size={14} />}
                                />
                                <UserButton.Link
                                    label="My Generations"
                                    href="/my-generations"
                                    labelIcon={<FolderKanbanIcon size={14} />}
                                />
                                <UserButton.Link
                                    label="Community"
                                    href="/community"
                                    labelIcon={<UsersIcon size={14} />}
                                />
                                <UserButton.Link
                                    label="Plans"
                                    href="/plans"
                                    labelIcon={<WalletCardsIcon size={14} />}
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    </Show>
                </div>
            </div>

            <Show when="signed-out">
                <div className={`md:hidden flex flex-col items-center justify-center gap-6 text-lg font-medium text-white fixed inset-0 bg-black/65 backdrop-blur-md z-50 transition-all duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="hover:text-indigo-200 transition">
                            {link.name}
                        </a>
                    ))}

                    <SignInButton mode="modal">
                        <button onClick={() => setIsOpen(false)} className='inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold border border-indigo-300/70 bg-indigo-500/35 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:bg-indigo-500/50 active:scale-95 transition-all'>
                            Sign in
                        </button>
                    </SignInButton>

                    <SignUpButton mode="modal">
                        <PrimaryButton onClick={() => setIsOpen(false)}>Get Started</PrimaryButton>
                    </SignUpButton>

                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                        className="rounded-md bg-white p-2 text-gray-800 ring-white active:ring-2"
                    >
                        <XIcon />
                    </button>
                </div>
            </Show>
        </motion.nav>
    );
};