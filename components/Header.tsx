'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { COMPANY, NAVIGATION } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setAuthReady(false)
      return
    }
    setAuthReady(true)

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-secondary">🚚</div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">{COMPANY.name}</h1>
              <p className="text-xs text-gray-300">{COMPANY.nameKana}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-secondary transition-colors duration-300 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            {authReady &&
              (email ? (
                <div className="flex items-center gap-3 pl-3 border-l border-white/20">
                  <span className="text-xs text-gray-300 max-w-[160px] truncate">
                    {email}
                  </span>
                  <form action="/auth/signout" method="post">
                    <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors">
                      ログアウト
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-bold bg-secondary hover:bg-orange-600 px-4 py-1.5 rounded-md transition-colors"
                >
                  ログイン
                </Link>
              ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-2xl"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-600 pt-4">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 hover:text-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {authReady &&
              (email ? (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-300 mb-2 truncate">{email}</p>
                  <form action="/auth/signout" method="post">
                    <button className="w-full text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md transition-colors">
                      ログアウト
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block mt-3 text-center text-sm font-bold bg-secondary hover:bg-orange-600 px-4 py-2 rounded-md transition-colors"
                >
                  ログイン
                </Link>
              ))}
          </nav>
        )}
      </div>
    </header>
  )
}
