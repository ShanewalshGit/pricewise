import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NavIcons = [
    { src: '/assets/icons/search.svg', alt: 'Search' },
    { src: '/assets/icons/black-heart.svg', alt: 'heart' },
    { src: '/assets/icons/user.svg', alt: 'User' },
]

const Navbar = () => {
  return (
    <header className="w-full">
        <nav className='nav'>
            <Link href='/' className="flex items-center gap-1">
                <Image
                    src="/assets/icons/logo.svg"
                    alt="Logo"
                    width={30}
                    height={30}
                />
                <p className="Nav-logo">
                    Price<span className='text-primary'>wise</span>
                </p>
            </Link>

            <div className="flex items-center gap-5">
                {NavIcons.map((icon) => (
                    <Image
                        key={icon.alt}
                        src={icon.src}
                        alt={icon.alt}
                        width={30}
                        height={30}
                        className='object-contain'
                    />
                ))}
            </div>
        </nav>
    </header>
  )
}

export default Navbar